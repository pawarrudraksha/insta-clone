import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { Request,Response } from "express";
import { IUser, User } from "../models/user.model";
import { Post } from "../models/post.model";
import { Comment } from "../models/comment.model";
import { ApiResponse } from "../utils/ApiResponse";
import mongoose from "mongoose";
import { Follow } from "../models/follow.model";

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
    if(post.isCommentsOff){
        throw new ApiError(401,"User has turned his comments off")
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
        new ApiResponse(201,{isComment},"Comment on post successful")
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
    res.status(200).json(
        new ApiResponse(200,updatedComment,"Comment updated successfully")
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

const getPostComments=asyncHandler(async(req:Request | AuthenticatedRequest,res:Response)=>{
    const {postId}=req.params
    if(!postId){
        throw new ApiError(400,"Post Id is required")
    }
    const page=Number(req.query.page || 1)
    const limit=Number(req.query.limit || 9)
    const skip=(page-1)*limit
    const post=await Post.findById(postId)
    if(!post){
        throw new ApiError(404,"Post not found")
    }
    if(post.isCommentsOff){
        throw new ApiError(401,"comments of user are turned off")
    }
    const postOwner=await User.findById(post.userId)
    const user=(req as AuthenticatedRequest).user
    let isFollow
    if(user){
        isFollow=await Follow.findOne({follower:user._id,userId:postOwner._id,isRequestAccepted:true})
    }
    if(postOwner.isPrivate && !isFollow && postOwner._id.toString()!==user._id.toString()){
        throw new ApiError(401,"Unauthorized request to fetch comments")
    }
    const comments = await Comment.aggregate([
        {
            $match: {
                postId:new mongoose.Types.ObjectId(postId),
                toReplyCommentId: { $exists: false }
            }
        },
        {
            $sort:{
                updatedAt:1
            }
        },
        {
            $skip:skip
        },
        {
            $limit:limit
        },
        {
            $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "userInfo",
                pipeline: [
                    { 
                        $project: {
                            profilePic: 1,
                            username: 1
                        }
                    }
                ]
            }
        },
        {
            $lookup: {
                from: "comments",
                localField: "_id",
                foreignField: "toReplyCommentId",
                as: "replies"
            }
        },
        {
            $addFields: {
                noOfReplies: { $size: "$replies" } 
            }
        },
        {
            $lookup:{
                from:"likes",
                localField:"_id",
                foreignField:"commentId",
                as:"likes"
            }
        },
        {
            $addFields:{
                noOfLikes:{
                    $size:"$likes"
                }
            }
        },
        {
            $project: {
                _id: 1,
                text: 1,
                "userInfo": {$arrayElemAt:["$userInfo",0]},
                noOfReplies: 1,
                noOfLikes: 1,
                updatedAt: 1,
            }
        }
    ]);        
    if(comments.length<1){
        return res.status(204).json(
            new ApiResponse(204,{},"No comments on post")
        )
    }
    res.status(200).json(
        new ApiResponse(200,comments,"Comments fetched successfully")
    )
})

const getRepliesToComment=asyncHandler(async(req:AuthenticatedRequest,res:Response)=>{
    const {commentId}=req.params
    const limit=Number(req.query.limit )|| 4
    const page=Number(req.query.page) || 1
    const skip=(page-1)*limit
    if(!commentId){
        throw new ApiError(400,"Comment id required")
    }
    const user=req.user
    if(!user){
        throw new ApiError(401,"user is not logged in")
    }
    const isComment=await Comment.findById(commentId)
    if(!isComment){
        throw new ApiError(404,"Comment not found")
    }
    const commentedPost=await Post.findById(isComment.postId)
    const postOwner=await User.findById(commentedPost.userId)
    if(postOwner.isPrivate){
        const isFollow=await Follow.findOne({follower:user._id,userId:postOwner._id,isRequestAccepted:true})
        if(!isFollow && postOwner._id.toString()!==user._id.toString()){
            throw new ApiError(401,"access denied")
        }
    }
    const replies=await Comment.aggregate([
        {
            $match:{
                toReplyCommentId:new mongoose.Types.ObjectId(commentId)
            }
        },
        {
            $sort:{
                updatedAt:-1
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
                as:"userInfo",
                pipeline:[
                    {
                        $project:{
                            username:1,
                            profilePic:1
                        }
                    }
                ]
            }
        },
        {
            $lookup: {
                from: "comments",
                localField: "_id",
                foreignField: "toReplyCommentId",
                as: "replies"
            }
        },
        {
            $addFields: {
                noOfReplies: { $size: "$replies" } 
            }
        },
        {
            $lookup:{
                from:"likes",
                localField:"_id",
                foreignField:"commentId",
                as:"likes"
            }
        },
        {
            $addFields:{
                noOfLikes:{
                    $size:"$likes"
                }
            }
        },
        {
            $project:{
                text:1,
                "userInfo":{$arrayElemAt:["$userInfo",0]},
                updatedAt:1,
                noOfReplies:1,
                noOfLikes:1
            }
        },
    ])
    if(replies.length<1){
        throw new ApiError(400,"Comment does not have any replies")
    }
    res.status(200).json(
        new ApiResponse(200,replies,"Replies to the comment fetched successfully")
    )
})

export {commentOnPost,updateComment,deleteComment,getPostComments,getRepliesToComment}