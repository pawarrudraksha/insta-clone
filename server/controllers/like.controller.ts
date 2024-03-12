import { IUser } from "../models/user.model";
import { asyncHandler } from "../utils/asyncHandler";
import { Request,Response } from "express";
import { ApiError } from "../utils/ApiError";
import { Post } from "../models/post.model";
import { Like } from "../models/like.model";
import { ApiResponse } from "../utils/ApiResponse";
import { Comment } from "../models/comment.model";
import { Story } from "../models/story.model";

interface AuthenticatedRequest extends Request{
    user:IUser
}

const likePost=asyncHandler(async (req:AuthenticatedRequest,res:Response)=>{
    const {postId}=req.params
    if(!postId){
        throw new ApiError(400,"Post id is required")
    }
    const user=req.user 
    if(!user){
        throw new ApiError(401,"User is not logged in")
    }
    const post=await Post.findById(postId)
    if(!post){
        throw new ApiError(401,"Invalid post id")
    }
    const createLike=await Like.create({
        postId:post._id,
        userId:user.id
    })
    const liked=await Like.findById(createLike._id)
    if(!liked){
        throw new ApiError(500,"Like request unsuccessful")
    }
    res.status(200).json(
        new ApiResponse( 201,{}, "Post liked Successfully")
    )
})

const unlikePost=asyncHandler(async (req:AuthenticatedRequest,res:Response)=>{
    const {postId}=req.params
    if(!postId){
        throw new ApiError(400,"Post id is required")
    }
    const user=req.user 
    if(!user){
        throw new ApiError(401,"User is not logged in")
    }
    const post=await Post.findById(postId)
    if(!post){
        throw new ApiError(401,"Invalid post id")
    }
    const like=await Like.findOne({
        $and:[{postId:post._id},{userId:user._id}]
    })
    if(!like){
        throw new ApiError(401,"Nothing to unlike")
    }
    await Like.findByIdAndDelete(like._id)
    const liked=await Like.findById(like._id)
    if(!liked){
        throw new ApiError(500,"Like request unsuccessful")
    }
    res.status(200).json(
        new ApiResponse( 201,{}, "Post unliked Successfully")
    )
})

const likeComment=asyncHandler(async (req:AuthenticatedRequest,res:Response)=>{
    const {commentId}=req.params
    if(!commentId){
        throw new ApiError(400,"comment id is required")
    }
    const user=req.user 
    if(!user){
        throw new ApiError(401,"User is not logged in")
    }
    const comment=await Comment.findById(commentId)
    if(!comment){
        throw new ApiError(401,"Invalid comment id")
    }
    const createLike=await Like.create({
        commentId:comment._id,
        userId:user.id
    })
    const liked=await Like.findById(createLike._id)
    if(!liked){
        throw new ApiError(500,"Like request unsuccessful")
    }
    res.status(200).json(
        new ApiResponse( 201,{}, "comment liked Successfully")
    )
})

const unlikeComment=asyncHandler(async (req:AuthenticatedRequest,res:Response)=>{
    const {commentId}=req.params
    if(!commentId){
        throw new ApiError(400,"comment id is required")
    }
    const user=req.user 
    if(!user){
        throw new ApiError(401,"User is not logged in")
    }
    const comment=await Comment.findById(commentId)
    if(!comment){
        throw new ApiError(401,"Invalid comment id")
    }
    const like=await Like.findOne({
        $and:[{commentId:comment._id},{userId:user._id}]
    })
    if(!like){
        throw new ApiError(401,"Nothing to unlike")
    }
    await Like.findByIdAndDelete(like._id)
    const liked=await Like.findById(like._id)
    if(!liked){
        throw new ApiError(500,"Like request unsuccessful")
    }
    res.status(200).json(
        new ApiResponse( 201,{}, "comment unliked Successfully")
    )
})

const likeStory=asyncHandler(async (req:AuthenticatedRequest,res:Response)=>{
    const {storyId}=req.params
    if(!storyId){
        throw new ApiError(400,"like id is required")
    }
    const user=req.user 
    if(!user){
        throw new ApiError(401,"User is not logged in")
    }
    const story=await Story.findById(storyId)
    if(!story){
        throw new ApiError(401,"Invalid story id")
    }
    const createLike=await Like.create({
        storyId:story._id,
        userId:user.id
    })
    const liked=await Like.findById(createLike._id)
    if(!liked){
        throw new ApiError(500,"Like request unsuccessful")
    }
    res.status(200).json(
        new ApiResponse( 201,{}, "story liked Successfully")
    )
})

const unlikeStory=asyncHandler(async (req:AuthenticatedRequest,res:Response)=>{
    const {storyId}=req.params
    if(!storyId){
        throw new ApiError(400,"story id is required")
    }
    const user=req.user 
    if(!user){
        throw new ApiError(401,"User is not logged in")
    }
    const story=await Story.findById(storyId)
    if(!story){
        throw new ApiError(401,"Invalid story id")
    }
    const like=await Like.findOne({
        $and:[{storyId:story._id},{userId:user._id}]
    })
    if(!like){
        throw new ApiError(401,"Nothing to unlike")
    }
    await Like.findByIdAndDelete(like._id)
    const liked=await Like.findById(like._id)
    if(!liked){
        throw new ApiError(500,"Like request unsuccessful")
    }
    res.status(200).json(
        new ApiResponse( 201,{}, "story unliked Successfully")
    )
})


export {likePost,unlikePost,likeComment,unlikeComment,likeStory,unlikeStory}