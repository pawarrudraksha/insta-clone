import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response} from "express";
import { IUser } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { Story } from "../models/story.model";
import { View } from "../models/view.model";
import { ApiResponse } from "../utils/ApiResponse";
import mongoose from "mongoose";

interface AuthenticatedRequest extends Request{
    user:IUser
}

const viewStory=asyncHandler(async(req:AuthenticatedRequest,res:Response)=>{
    const {storyId}=req.params
    if(!storyId){
        throw new ApiError(400,"Story id not provided")
    }
    const user=req.user
    if(!user){
        throw new ApiError(401,"User not logged in")
    }
    const story=await Story.findById(storyId)
    if(!story){
        throw new ApiError(404,"Story not found")
    }
    const isStoryViewed=await View.findOne({userId:user._id,storyId:storyId})
    if(isStoryViewed){
        throw new ApiError(400,"Story already viewed by user")
    }
    const createView=await View.create({storyId,userId:user._id})
    const isViewCreated=await  View.findById(createView._id)
    if(!isViewCreated){
        throw new ApiError(500,"unable to add view")
    }
    res.status(201).json(
        new ApiResponse(201,{},"Story viewed successfully")
    )
})

const getStoryViews=asyncHandler(async(req:AuthenticatedRequest,res:Response)=>{
    const {storyId}=req.params
    if(!storyId){
        throw new ApiError(400,"Story id is required")
    }
    const user=req.user
    if(!user){
        throw new ApiError(401,"User is not logged in")
    }
    const page=Number(req.query.page || 1)
    const limit=Number(req.query.limit || 9)
    const skip=(page-1)*limit
    const story=await Story.findById(storyId)
    if(!story){
        throw new ApiError(404,"Story not found")
    }
    if(story.userId.toString()!==user._id.toString()){
        throw new ApiError(401,"User can only view his story views")
    }
    const views=await View.aggregate([
        {
            $match:{
                $expr:{
                    $and:[
                        {userId:user._id},
                        {storyId:new mongoose.Types.ObjectId(storyId)}
                    ]
                }
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
                from:"users",
                localField:"userId",
                foreignField:"_id",
                as:"userInfo"
            }
        },
        {
            $addFields: {
                "userInfo": { $arrayElemAt: ["$userInfo", 0] },
                "noOfViews": { $cond: { if: { $isArray: "$userInfo" }, then: 1, else: 0 } }
            }
        },
        {
            $project:{
                "userInfo.profilePic":1,
                "userInfo.name":1,
                "userInfo.username":1,
                noOfViews:1
            }
        },
    ])
    if(views.length<1){
        return res.status(204).json(
            new ApiResponse(204,{},"No available views")
        )
    }
    res.status(200).json(
        new ApiResponse(200,views,"Views fetched successfully")
    )
})

export {viewStory,getStoryViews}