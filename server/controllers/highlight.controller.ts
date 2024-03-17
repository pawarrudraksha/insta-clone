import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { Request,Response } from "express";
import { IUser, User } from "../models/user.model";
import { uploadOnCloudinary } from "../utils/cloudinary";
import { Highlight } from "../models/highlight.model";
import { ApiResponse } from "../utils/ApiResponse";
import { Follow } from "../models/follow.model";
import mongoose from "mongoose";
import { Story } from "../models/story.model";

interface AuthenticatedRequest extends Request{
    user:IUser
}

const createHighlight=asyncHandler(async(req:AuthenticatedRequest,res:Response)=>{
    const {stories,caption,coverPic}=req.body
    if(stories.length<1 || !caption){
        throw new ApiError(400,"All fields are neccessary")
    }
    const user=req.user
    if(!user){
        throw new ApiError(401,"User needs to be logged in")
    }
    const isStoryValidPromises = stories.map(async(storyId: string) => {
        const story = await Story.findById(storyId);
        return story && story.userId.toString() === user._id.toString(); 
    });
    const isStoryValidResults = await Promise.all(isStoryValidPromises);
    if (isStoryValidResults.some(valid => !valid)) {
        throw new ApiError(401, "One or more story IDs are not valid or do not belong to the logged-in user");
    }
    const highlight=await Highlight.create({
        stories,
        caption,
        coverPic,
        userId:user._id
    })
    const isHighlightCreated=await Highlight.findById(highlight._id)
    if(!isHighlightCreated){
        throw new ApiError(500,"Failed to create highlight")
    }
    res.status(201).json(
        new ApiResponse(201,highlight,"Highlight created successfully")
    )
})

const addStoryToHighlight=asyncHandler(async(req:AuthenticatedRequest,res:Response)=>{
    const {storyId,highlightId}=req.body
    if(!storyId || !highlightId){
        throw new ApiError(400,"All fields are required")
    }
    const user=req.user
    if(!user){
        throw new ApiError(401,"User needs to be logged in")
    }
    const isStory=await Story.findById(storyId)
    if(!isStory){
        throw new ApiError(400,"Invalid story id")
    }
    if(isStory.userId.toString()!==user._id.toString()){
        throw new ApiError(401,"user not owner of given story")
    }
    const highlight=await Highlight.findById(highlightId)
    if(!highlight){
        throw new ApiError(404,"Highlight does not exist")
    }
    if(highlight.userId.toString()!==user._id.toString()){
        throw new ApiError(401,"Unauthorized request")
    }
    if(highlight.stories.includes(storyId)){
        throw new ApiError(400,"Story already present in highlight")
    }
    const updatedHighlight=await Highlight.findByIdAndUpdate(
        highlightId,
        {
            $push:{
                stories:storyId
            }
        },
        {
            new:true
        }
    )
    if(!updatedHighlight.stories.includes(storyId)){
        throw new ApiError(500,"Failed to add story to highlight")
    }
    res.status(200).json(
        new ApiResponse(200,updatedHighlight,"Story added to highlight successfully")
    )
})

const updateHighlight=asyncHandler(async(req:AuthenticatedRequest,res:Response)=>{
    const {caption,coverPic,highlightId}=req.body
    if(!(caption ||coverPic) || !highlightId){
        throw new ApiError(400,"Fields required to update")
    }
    const user=req.user
    if(!user){
        throw new ApiError(400,"User not logged in")
    }
    const highlight=await Highlight.findById(highlightId)
    if(!highlight){
        throw new ApiError(404,"Highlight not found")
    }
    if(highlight.userId.toString()!==user._id.toString()){
        throw new ApiError(401,"Unauthorized request")
    }
    const updatedHighlight=await Highlight.findByIdAndUpdate(
        highlightId,
        {
            caption,
            coverPic
        },
        {
            new:true
        }
    )
    if(updatedHighlight.caption!==caption && updatedHighlight.coverPic!==coverPic){
        throw new ApiError(500,"Failed to update highlight")
    }
    res.status(200).json(
        new ApiResponse(200,updatedHighlight,"Highlight updated successfully")
    )
})

const removeStoryFromHighlight=asyncHandler(async(req:AuthenticatedRequest,res)=>{
    const {highlightId,storyId}=req.body
    if(!highlightId || !storyId){
        throw new ApiError(400,"All fields are required")
    }
    const user=req.user
    if(!user){
        throw new ApiError(401,"User needs to be logged in")
    }
    const highlight=await Highlight.findById(highlightId)
    if(!highlight){
        throw new ApiError(404,"Highlight not found")
    }
    if(highlight.userId.toString()!==user._id.toString()){
        throw new ApiError(400,"Unauthorized request")
    }
    if(!highlight.stories.includes(storyId)){
        throw new ApiError(404,"Story not found")
    }
    if(highlight.stories.length===1){
        await Highlight.findByIdAndDelete(highlightId)
        const isHighlight=await Highlight.findById(highlightId)
        if(isHighlight){
            throw new ApiError(500,"Failed to delete story")
        }
        res.status(200).json(
            new ApiResponse(200,{},"highlight deleted successfully")
        )
    }else{
        const updatedHighlight=await Highlight.findByIdAndUpdate(
            highlightId,
            {
                $pull:{
                    stories:storyId
                }
            },
            {
                new:true
            }
            )
            if(updatedHighlight.stories.includes(storyId)){
                throw new ApiError(500,"Failed to remove story")
            }
            res.status(200).json(
                new ApiResponse(200,{},"Story removed successfully")
            )
    }
})  

const deleteHighlight=asyncHandler(async(req:AuthenticatedRequest,res:Response)=>{
    const {highlightId}=req.params
    if(!highlightId){
        throw new ApiError(400,"Highlight id is required")
    }
    const user=req.user
    if(!user){
        throw new ApiError(401,"User needs to be logged in")
    }
    const highlight=await Highlight.findById(highlightId)
    if(!highlight){
        throw new ApiError(404,"Highlight not found")
    }
    if(highlight.userId.toString()!==user._id.toString()){
        throw new ApiError(401,"Unauthorized request")
    }
    await Highlight.findByIdAndDelete(highlightId)
    const isHighlight=await Highlight.findById(highlightId)
    if(isHighlight){
        throw new ApiError(500,"Failed to delete Highlight")
    }
    res.status(200).json(
        new ApiResponse(200,{},"Highlight removed successfully")
    )
})

const getHighlightById=asyncHandler(async(req:AuthenticatedRequest,res:Response)=>{
    const {highlightId}=req.params
    if(!highlightId){
        throw new ApiError(400,"HighlightId is required") 
    }
    const user=req.user
    if(!user){
        throw new ApiError(401,"User needs to be logged in")
    }
    const highlight=await Highlight.findById(highlightId)
    if(!highlight){
        throw new ApiError(404,"Highlight not found")
    }
    const highlightUser=await User.findById(highlight.userId).select({profilePic:1,_id:1,username:1})
    const isUserFollowRequestUser=await Follow.findOne({userId:highlightUser._id,follower:user._id,isRequestAccepted:true})
    if(highlightUser.isPrivate && !isUserFollowRequestUser){
        throw new ApiError(401,"Access to highlight denied")
    }    
    const highlightData=await Highlight.aggregate([
        {
            $match:{
                _id:new mongoose.Types.ObjectId(highlightId)
            }
        },
        {
            $unwind:"$stories"
        },
        {
            $lookup:{
                from:"stories",
                localField:"stories",
                foreignField:"_id",
                as:"story",
                pipeline:[
                    {
                        $project:{
                            content:1,
                            caption:1,
                        }
                    }
                ]
            }
        },
        {
            $addFields:{
                "story":{$arrayElemAt:["$story",0]}
            }
        },
        {
            $group:{
                _id:"$_id",
                stories:{$push:"$story"}
            }
        }
    ])
    const mergedData={
        highlightData:highlightData[0],
        highlightUser
    }
    res.status(200).json(
        new ApiResponse(200,mergedData,"Highlight fetch request successful")
    )
})

const getPublicUserHighlightsCoverPics=asyncHandler(async(req:Request,res:Response)=>{
    const {username}=req.params
    if(!username){
        throw new ApiError(400,"Username is required")
    }
    const page=Number(req.query.page || 1)
    const limit=Number(req.query.limit || 9)
    const skip=(page-1)*limit
    const requestedUser=await User.findOne({username})
    if(!requestedUser){
        throw new ApiError(404,"User not found")
    }
    if(requestedUser.isPrivate){
        throw new ApiError(401,"User account is private")
    }
    const highlights=await Highlight.aggregate([
        {
            $match:{
                userId:requestedUser._id
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
                coverPic:1,
                caption:1,
                _id:1
            }
        }
    ])
    if(highlights.length < 1){
        return res.status(204).json(
            new ApiResponse(204,{},"No highlights for user")
        )
    }
    res.status(200).json(
        new ApiResponse(200,highlights,"Highlights fetched successfully")
    )
})  

const getPrivateUserHighlightsCoverPic=asyncHandler(async(req:AuthenticatedRequest,res:Response)=>{
    const {username}=req.params
    if(!username){
        throw new ApiError(400,"Username is required")
    }
    const user=req.user
    if(!user){
        throw new ApiError(401,"User not logged in")
    }
    const page=Number(req.query.page || 1)
    const limit=Number(req.query.limit || 9)
    const skip=(page-1)*limit
    const requestedUser=await User.findOne({username})
    if(!requestedUser){
        throw new ApiError(404,"User not found")
    }
    const isFollow=await Follow.find({userId:requestedUser._id,follower:user._id,isRequestAccepted:true})
    if(requestedUser.isPrivate && !isFollow){
        throw new ApiError(401,"User account is private")
    }
    const highlights=await Highlight.aggregate([
        {
            $match:{
                userId:requestedUser._id
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
                coverPic:1,
                caption:1,
                _id:1
            }
        }
    ])
    if(highlights.length < 1){
        return res.status(204).json(
            new ApiResponse(204,{},"No highlights for user")
        )
    }
    res.status(200).json(
        new ApiResponse(200,highlights,"Highlights fetched successfully")
    )
})  

export {createHighlight,deleteHighlight,addStoryToHighlight,removeStoryFromHighlight,getHighlightById,getPrivateUserHighlightsCoverPic,getPublicUserHighlightsCoverPics,updateHighlight}