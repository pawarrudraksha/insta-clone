import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { Request,Response } from "express";
import { IUser } from "../models/user.model";
import { Post } from "../models/post.model";
import { Comment } from "../models/comment.model";
import { ApiResponse } from "../utils/ApiResponse";

interface AuthenticatedRequest extends Request{
    user:IUser
}

const commentOnPost=asyncHandler(async(req:AuthenticatedRequest,res:Response)=>{
    const {postId}=req.params
    const {text,toReplyCommentId}=req.body
    if(!text){
        throw new ApiError(400,"comment is required")
    }
    if(!postId){
        throw new ApiError(400,"Post id is required")
    }
    const user=req.user
    if(!user){
        throw new ApiError(401,"Unauthorized request")
    }
    const post=await Post.findById(postId)
    if(!post){
        throw new ApiError(400,"Post does not exist")
    }
    const comment=await Comment.create({
        userId:user._id,
        text,
        toReplyCommentId,
        postId:post._id
    })
    const isComment=await Comment.findById(comment._id)
    if(!isComment){
        throw new ApiError(500,"Unable to comment")
    }
    res.status(201).json(
        new ApiResponse(201,{},"Comment on post successful")
    )
})
const updateComment=asyncHandler(async(req:AuthenticatedRequest,res:Response)=>{
    const {commentId}=req.params
    const {text}=req.body
    if(!text){
        throw new ApiError(400,"comment is required")
    }
    const user=req.user
    if(!user){
        throw new ApiError(401,"Unauthorized request")
    }
    const comment=await Comment.findById(commentId)
    if(!comment){
        throw new ApiError(401,"No comment to update")
    }
    const updatedComment=await Comment.findByIdAndUpdate(
        commentId,
        {
            $set:{
                text
            }
        },
        {
            new:true
        }
    )
    if(updatedComment.text!==text){
        throw new ApiError(500,"Unable to update comment")
    }
    res.status(201).json(
        new ApiResponse(201,{},"Comment updated successfully")
    )
})


const deleteComment=asyncHandler(async(req:AuthenticatedRequest,res:Response)=>{
    const {commentId}=req.params
    const user=req.user
    if(!user){
        throw new ApiError(401,"Unauthorized request")
    }
    const comment=await Comment.findById(commentId)
    if(!comment){
        throw new ApiError(400,"comment does not exist")
    }
    await Comment.findByIdAndDelete(commentId)
    const isComment=await Comment.findById(commentId)
    if(isComment){
        throw new ApiError(500,"unable to delete comment")
    }
    res.status(201).json(
        new ApiResponse(201,{},"comment deleted successfully")
    )
})

export {commentOnPost,updateComment,deleteComment}