import { asyncHandler } from "../utils/asyncHandler";
import { Request,Response } from "express";
import { ApiError } from "../utils/ApiError";
import { IUser } from "../models/user.model";
import { Post } from "../models/post.model";
import { SavedPost } from "../models/savedPost.model";
import { ApiResponse } from "../utils/ApiResponse";

interface AuthenticatedRequest extends Request{
    user:IUser
}
const savePost=asyncHandler(async(req:AuthenticatedRequest,res:Response)=>{
    const {postId}=req.params 
    if(!postId){
        throw new ApiError(400,"Post id is required")
    }
    const user=req.user
    if(!user){
        throw new ApiError(401,"unauthorized request")
    }
    const post=await Post.findById(postId)
    if(!post){
        throw new ApiError(400,"post does not exist")
    }
    const savedPost=await SavedPost.create({
        savedPostId:postId,
        userId:user._id
    })
    const isPostSaved=await SavedPost.findById(savedPost._id)
    if(!isPostSaved){
        throw new ApiError(500,"Failed to save post")
    }
    res.status(201).json(
        new ApiResponse(201,{},"Saved post")
    )
})

const unsavePost=asyncHandler(async(req:AuthenticatedRequest,res:Response)=>{
    const {postId}=req.params 
    if(!postId){
        throw new ApiError(400,"Post id is required")
    }
    const user=req.user
    if(!user){
        throw new ApiError(401,"unauthorized request")
    }
    const post=await Post.findById(postId)
    if(!post){
        throw new ApiError(400,"post does not exist")
    }
    const isPostSaved=await SavedPost.findOne(
        {
            $and:[{postId:post._id},{userId:user._id}]
        }
    )
    if(isPostSaved){
        throw new ApiError(400,"post is not saved")
    }
    await SavedPost.findByIdAndDelete(isPostSaved._id)
    const isPostUnsaved=await SavedPost.findById(isPostSaved._id)
    if(isPostUnsaved){
        throw new ApiError(500,"Failed to unsave post")
    }
    res.status(201).json(
        new ApiResponse(201,{},"Unsaved post")
    )
})

export {savePost,unsavePost}