import { IUser, User } from "../models/user.model";
import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { Post } from "../models/post.model";
import { Like } from "../models/like.model";
import { ApiResponse } from "../utils/ApiResponse";
import { Comment } from "../models/comment.model";
import { Story } from "../models/story.model";
import mongoose from "mongoose";
import { Follow } from "../models/follow.model";

interface AuthenticatedRequest extends Request {
    user: IUser;
}

interface LikeActionRequest extends AuthenticatedRequest {
    targetId: string;
    targetType: 'post' | 'comment' | 'story';
    action: 'like' | 'unlike';
}

const likeAction = asyncHandler(async (req: LikeActionRequest, res: Response) => {
    const { targetId, targetType, action } = req.body;
    const user = req.user;
    if (!user) {
        throw new ApiError(401, "User is not logged in");
    }

    let target;
    let owner;
    let alreadyLiked
    if (targetType === 'post') {
        target = await Post.findById(targetId);
        owner=await User.findById(target.userId)
        alreadyLiked=await Like.findOne({postId:targetId,userId:user._id})
    } else if (targetType === 'comment') {
        target = await Comment.findById(targetId);
        const post=await Post.findById(target.postId)
        owner=await User.findById(post.userId)
        alreadyLiked=await Like.findOne({commentId:targetId,userId:user._id})
    } else if (targetType === 'story') {
        target = await Story.findById(targetId);
        owner=await User.findById(target.userId)
        alreadyLiked=await Like.findOne({storyId:targetId,userId:user._id})
    }
    if (!target) {
        throw new ApiError(404, "Invalid target id");
    }
    if(alreadyLiked && action==='like'){
        throw new ApiError(400,"You can like item only once")
    }
    const isFollow=await Follow.findOne({userId:owner._id,follower:user._id,isRequestAccepted:true})
    if(owner.isPrivate && !isFollow && owner._id.toString()!==user._id.toString()){
        throw new ApiError(401,"access denied")
    }
    let like;
    if (action === 'like') {
        like = await Like.create({
            [`${targetType}Id`]: target._id,
            userId: user.id
        });
    } else if (action === 'unlike') {
        like = await Like.findOneAndDelete({
            $and: [{ [`${targetType}Id`]: target._id }, { userId: user._id }]
        });
        if (!like) {
            throw new ApiError(401, "Nothing to unlike");
        }
    }

    res.status(200).json(
        new ApiResponse(201, {}, action === 'like' ? `${targetType} liked successfully` : `${targetType} unliked successfully`)
    );
});

const getAllLikes=asyncHandler(async(req:AuthenticatedRequest,res:Response)=>{
    const {targetId,targetType}=req.body
    if(!targetId || !targetType){
        throw new ApiError(400,"All fields are required")
    }
    
    const limit=Number(req.query.limit || 9)
    const page=Number(req.query.page || 1)
    const skip=(page-1)*limit
    const user=req.user
    if(!user){
        throw new ApiError(401,"User is not logged in")
    }
    let target
    if(targetType==='post'){
        target=await Post.findById(targetId)
    }else if(targetType==='comment'){
        target=await Comment.findById(targetId)
    }else if(targetType==='story'){
        target=await Story.findById(targetId)
    }
    if(!target){
        throw new ApiError(404,"Target not found")
    }
    if(targetType==='story' && target.userId.toString()!==user._id.toString()){
        throw new ApiError(401,"Only story owner can see the story likes")
    }
    const likes=await Like.aggregate([
        {
            $match:{
                userId:user._id,
                [`${targetType}Id`]:target._id
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
                            "name":1,
                            "username":1,
                            "profilePic":1
                        }
                    }
                ]
            }
        },
        {
            $project:{
                "userInfo.name":1,
                "userInfo.username":1,
                "userInfo.profile":1,
                updatedAt:1
            }
        }
    ])
    if(likes.length<1){
        return res.status(204).json(
            new ApiResponse(204,{},"no likes to fetch")
        )
    }
    res.status(200).json(
        new ApiResponse(200,likes,"Likes fetched successfully")
    )
})
export { likeAction,getAllLikes };
