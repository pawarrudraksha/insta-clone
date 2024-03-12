import { IUser, User } from "../models/user.model";
import { asyncHandler } from "../utils/asyncHandler";
import { Request,Response } from "express";
import { ApiError } from "../utils/ApiError";
import { Story } from "../models/story.model";
import { ApiResponse } from "../utils/ApiResponse";

interface AuthenticatedRequest extends Request{
    user:IUser
}

const createStory=asyncHandler(async(req:AuthenticatedRequest,res:Response)=>{
    const {url,caption}=req.body
    if(!url){
        throw new ApiError(400,"Story is required to post")
    }
    const user=req.user
    if(!user){
        throw new ApiError(401,"Login required to post")
    }
    const story=await Story.create({
        url,
        caption,
        userId:user._id 
    })
    const isStoryPosted=await Story.findById(story._id)
    if(!isStoryPosted){
        throw new ApiError(500,"Failed to post story")
    }
    res.status(200).json(
        new ApiResponse(201,story,"Story posted successfully")
    )
})

const deleteStory=asyncHandler(async(req:AuthenticatedRequest,res:Response)=>{
    const {storyId}=req.params
    if(!storyId){
        throw new ApiError(400,"story id is required")
    }
    const user=req.user
    if(!user){
        throw new ApiError(401,"Login required to delete story")
    }
    const story=await Story.findById(storyId)
    if(!story){
        throw new ApiError(400,"story does not exist")
    }
    if(story.userId!==user._id){
        throw new ApiError(401,"unauthorized delete story request")
    }
    await Story.findByIdAndDelete(storyId)
    const isStoryDeleted=await Story.findById(storyId)
    if(isStoryDeleted){
        throw new ApiError(500,"failed to delete story")
    }
    res.status(200).json(
        new ApiResponse(200,{},"Story deleted successfully")
    )
})
export {createStory,deleteStory}