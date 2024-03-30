import mongoose from "mongoose";
import { IUser, User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { uploadOnCloudinary } from "../utils/cloudinary";
import { Request,Response } from "express";
import { Follow } from "../models/follow.model";

interface AuthenticatedRequest extends Request{
    user:IUser
}
const addProfilePic=asyncHandler(async(req:AuthenticatedRequest,res:Response)=>{
    const {email}=req.body    
    if(!email){
        throw new ApiError(400,"All fields are mandatory")
    }
    const user=req.user
    if(!user){
        throw new ApiError(404,"User not found")
    }    
    const localFilePath = req.file.path
    if(!localFilePath){
        throw new ApiError(400,"Profile pic file path is required")
    }
    const response=await uploadOnCloudinary(localFilePath)
    console.log("response",response);
    
    if(!response){
        throw new ApiError(400,"Profile pic file is required")
    }
    const updatedUser=await User.findOneAndUpdate(
        {email},
        {
            $set:{
                profilePic:response.url
            }
        },
        {
            new :true
        }
    ).select("-password  -refreshToken")
    if(updatedUser.profilePic!==response.url){
        throw new ApiError(500,"Profile pic not updated")
    }
    res.status(200).json(
        new ApiResponse(200,updatedUser,"User updated s")
    )
})

const deleteUser=asyncHandler(async (req:AuthenticatedRequest,res:Response)=>{
    const user=req.user
    if(!user){
        throw new ApiError(401,"User not logged in")
    }
    await User.findByIdAndDelete(user._id)
    const isUser=await User.findById(user._id)
    if(isUser){
        throw new ApiError(500,"User delete request failed")
    }
    res.status(200).json(
        new ApiResponse(200,{},"User deleted successfully")
    )
})

const updateProfile=asyncHandler(async (req:AuthenticatedRequest,res:Response)=>{
    const {name,isPrivate,bio,gender,website}=req.body
    const isAnyField= Object.keys(req.body).some(key => {
        return req.body[key] !== undefined && req.body[key] !== null;
    });
    if(!isAnyField){
        throw new ApiError(400,"No field given to update")
    }
    const user=req.user
    if(!user){
        throw new ApiError(401,"User not logged in")
    }
    const updatedUser=await User.findByIdAndUpdate(
        user._id,
        {
            name,
            isPrivate,
            bio,
            gender,
            website
        },
        {
            new:true
        }
    ).select("-password -otp -refreshToken")
    const isUpdated = (
        updatedUser.name !== user.name ||
        updatedUser.isPrivate !== user.isPrivate ||
        updatedUser.bio !== user.bio ||
        updatedUser.gender !== user.gender ||
        updatedUser.website !== user.website
    );
    if(!isUpdated){
        throw new ApiError(500,"Failed to update user")
    }
    res.status(200).json(
        new ApiResponse(200,{updatedUser},"User updated successfully")
    )
})

const getUserInfoByUsername=asyncHandler(async(req:Request,res:Response)=>{
    const {username}=req.params
    if(!username){
        throw new ApiError(400,"User id required")
    }    
    const user=await User.aggregate([
        {
          $match:{
            username
          }  
        },
        {
            $lookup:{
                from:"posts",
                localField:"_id",
                foreignField:"userId",
                as:"posts"
            }
        },
        {
            $addFields:{
                noOfPosts:{
                    $size:"$posts"
                }
            }
        },
        {
            $lookup:{
                from:"follows",
                localField:"_id",
                foreignField:"userId",
                as:"followers",
                pipeline:[
                    {
                        $match:{
                            isRequestAccepted:true
                        }
                    }
                ]
            }
        },
        {
            $addFields:{
                noOfFollowers:{
                    $size:"$followers"
                }
            }
        },
        {
            $lookup:{
                from:"follows",
                localField:"_id",
                foreignField:"follower",
                as:"following",
                pipeline:[
                    {
                        $match:{
                            isRequestAccepted:true
                        }
                    }
                ]
            }
        },
        {
            $addFields:{
                noOfFollowing:{
                    $size:"$following"
                }
            }
        },
        {
            $project:{
                _id:1,
                username:1,
                name:1,
                bio:1,
                isPrivate:1,
                website:1,
                profilePic:1,
                noOfFollowing:1,
                noOfFollowers:1,
                noOfPosts:1,
            }
        }
    ])
    if(!user){
        throw new ApiError(404,"User not found")
    }    
    res.status(200).json(
        new ApiResponse(200,user[0],"User fetched successfully")
    )
})

const changePassword=asyncHandler(async(req:AuthenticatedRequest,res:Response)=>{
    const {oldPassword,newPassword}=req.body
    if(!oldPassword || !newPassword){
        throw new ApiError(400,"All fields are required")
    }
    if(oldPassword.length!==8 || newPassword.length!==8){
        throw new ApiError(400,"All fields are required")
    }
    const user=await User.findById(req.user._id)
    if(!user){
        throw new ApiError(401,"User not logged in")
    }    
    const isPasswordCorrect=await user.isPasswordCorrect(oldPassword)
    if(!isPasswordCorrect){
        throw new ApiError(401,"Incorrect password")
    }
    user.password=newPassword
    await user.save({validateBeforeSave:false})
    res.status(200).json(
        new ApiResponse(200,{},"Password updated successfully")
    )
})

const searchUsers=asyncHandler(async(req:AuthenticatedRequest,res:Response)=>{
    const searchTerm=req.query.searchTerm
    const page=Number(req.query.page || 1)
    const limit=Number(req.query.limit || 9)
    const skip=(page-1)*limit
    const user=req.user
    if(!user){
        throw new ApiError(401,"User not logged in")
    }
    const results=await User.aggregate([
        {
            $match: {
              $or: [
                { username: { $regex: searchTerm, $options: 'i' } }, 
                { name: { $regex: searchTerm, $options: 'i' } }      
              ]
            }
        },
        {
            $lookup:{
                from:"follows",
                localField:"_id",
                foreignField:"userId",
                as:"followers"
            }
        },
        {
            $addFields:{
                noOfFollowers:{$size:"$followers"}
            }
        },
        {
            $sort:{
                noOfFollowers:-1
            }
        },
        {
            $skip:skip
        },
        {
            $limit:limit
        },
        {
            $project:{
                name:1,
                username:1,
                profilePic:1,
                noOfFollowers:1,
            }
        }
    ])
    if(results.length<1){
        return res.status(204).json(
            new ApiResponse(204,{},"No results for search")
        )
    }
    res.status(200).json(
        new ApiResponse(200,results,"Results fetched successfully")
    )
})

const getSuggestedUsers=asyncHandler(async(req:AuthenticatedRequest,res:Response)=>{
    const page=Number(req.query.page || 1)
    const limit=Number(req.query.limit || 4)
    const skip=(page-1)*limit
    const user=req.user
    if(!user){
        throw new ApiError(401,'User not logged in')
    }
    const suggestions=await User.aggregate([
        {
            $match:{
                _id:{$ne:user._id}
            }
        },
        {
            $skip:skip
        },
        {
            $limit:limit
        },
        {
            $lookup:{
                from:"follows",
                localField:"_id",
                foreignField:"userId",
                as:"followers"
            }
        },
        {
            $match:{
                "followers.follower": { $nin: [user._id] }
            }
        },
        {
            $project:{
                username:1,
                name:1,
                profilePic:1,
                createdAt:1
            }
        }
    ])
    if(suggestions.length<1){
        return res.status(204).json(
            new ApiResponse(204,{},"No suggestions for search")
        )
    }
    res.status(200).json(
        new ApiResponse(200,suggestions,"Suggestions fetched successfully")
    )  
})

export {addProfilePic,deleteUser,updateProfile,getUserInfoByUsername,changePassword,searchUsers,getSuggestedUsers}