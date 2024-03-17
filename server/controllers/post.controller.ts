import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { Request,Response } from "express";
import { IUser, User } from "../models/user.model";
import { Post } from "../models/post.model";
import { ApiResponse } from "../utils/ApiResponse";
import { Follow } from "../models/follow.model";
import mongoose from "mongoose";

interface AuthenticatedRequest extends Request {
    user:IUser; 
}

const getPostsByPublicUsername=asyncHandler(async(req:AuthenticatedRequest,res:Response)=>{
    const page=Number(req.query.page || 1)
    const limit=Number(req.query.limit || 9)
    const skip=(page -1 )* limit
    const {username}=req.params
    if(!username){
        throw new ApiError(400,"user id is required")
    }
    const user=await User.findOne({username})
    if(!user){
        throw new ApiError(404,"user not found")
    }
    if(user.isPrivate){
        throw new ApiError(401,"user account is private")
    }        
    const posts=await Post.aggregate([
        {
            $match:{
                userId:user._id
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
                from:"likes",
                localField:"_id", 
                foreignField:"postId",
                as:"likes"
            }
        },
        {
            $addFields: {
                "noOfLikes": { $size: "$likes" }
            }
        },
        {
            $lookup:{
                from:"comments",
                localField:"_id", 
                foreignField:"postId",
                as:"comments"
            }
        },
        {
            $addFields: {
                "noOfComments": { $size: "$comments" }
            }
        },
        {
            $lookup:{
                from:"users",
                localField:"userId",
                foreignField:"_id",
                as:"userInfo",
                pipeline: [
                    {
                        $project: {
                            _id: 1,
                            username: 1,
                            name: 1,
                            profilePic:1
                        }
                    }
                ],
            }
        },
        {
            $addFields: {
                userInfo: { $arrayElemAt: ["$userInfo", 0] }
            }
        },
        {
            $project:{
                _id:1,
                userInfo:1,
                noOfLikes:1,
                noOfComments:1,
                isStandAlone:1,
                createdAt:1,
                updatedAt:1,
                isCommentsOff:1,
                posts:1,            
                isHideLikesAndViews: 1,

            }
        }
        
    ])
    if(posts.length < 1){
        res.status(204).json(
            new ApiResponse(204,{},"No posts")
        )    
    }
    res.status(200).json(
        new ApiResponse(200,posts,"Posts fetched successfully")
    )
})

const getPostsByPrivateUsername=asyncHandler(async(req:AuthenticatedRequest,res:Response)=>{
    const page=Number(req.query.page || 1)
    const limit=Number(req.query.limit || 9)
    const skip=(page -1 )* limit
    const {username}=req.params
    if(!username){
        throw new ApiError(400,"user id is required")
    }
    const currentUser=req.user
    if(!currentUser){
        throw new ApiError(401,"Use is not logged in")
    }
    const user=await User.findOne({username})
    if(!user){
        throw new ApiError(404,"user not found")
    }
    const isFollow=await Follow.findOne({userId:user._id,follower:currentUser._id,isRequestAccepted:true})
    if(user.isPrivate && !isFollow){
        throw new ApiError(401,"user account is private")
    }
   
    const posts=await Post.aggregate([
        {
            $match:{
                userId:mongoose.Types.ObjectId.createFromTime(user._id)
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
                from:"likes",
                localField:"_id", 
                foreignField:"postId",
                as:"likes"
            }
        },
        {
            $lookup:{
                from:"comments",
                localField:"_id", 
                foreignField:"postId",
                as:"comments"
            }
        },
        {
            $lookup:{
                from:"users",
                localField:"userId",
                foreignField:"_id",
                as:"userInfo",
                pipeline: [
                    {
                        $project: {
                            _id: 1,
                            username: 1,
                            name: 1,
                            profilePic:1
                        }
                    }
                ],
            }
        },
        {
            $addFields: {
                userInfo: { $arrayElemAt: ["$userInfo", 0] }
            }
        },
        
    ])
    if(posts.length < 1){
        return res.status(204).json(
            new ApiResponse(204,{},"User has no posts")
        )   
    }
    res.status(200).json(
        new ApiResponse(200,posts,"Posts fetched successfully")
    )
})

const createPost=asyncHandler(async(req:AuthenticatedRequest,res:Response)=>{
    const {posts,aspectRatio,caption,isCommentsOff,isHideLikesAndViews,isStandAlone,taggedUsers}=req.body
    if(posts.length<1 || !aspectRatio || !caption  ){
        throw new ApiError(400,"All fields are mandatory")
    }
    const user=req.user 
    if(!user){
        throw new ApiError(401,"Unauthorized request")
    }
    const post=await Post.create({
        aspectRatio,
        caption,
        posts,
        userId:user._id,
        isCommentsOff,
        isHideLikesAndViews,
        isStandAlone,
        taggedUsers
    })

    if(!post){
        throw new ApiError(500,"Error creating post please try later")
    }
    res.status(200).json(
        new ApiResponse(201,post,"Post created successfully")
    )
})

const getAllPublicPosts=asyncHandler(async(req:AuthenticatedRequest,res:Response)=>{
    const page=Number(req.query.page || 1)
    const limit=Number(req.query.limit || 15)
    const skip=(page-1)*limit
    const posts=await Post.aggregate([
        {
            $sort:{
                createdAt:-1
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
                isStandAlone:1,
                userId:1,
                posts:{$arrayElemAt: ["$posts", 0] },
                _id:1,
            }
        },
        {
            $project: {
                isStandAlone: 1,
                userId: 1,
                "posts.content": 1,
                _id: 1
            }
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
                            "userInfo.isPrivate":1
                        }
                    }
                ]
            }
        },
        {
            $match:{
                "userInfo.isPrivate": { $ne: true }                     
            }
        },
        {
            $lookup:{
                from:"likes",
                localField:"_id",
                foreignField:"postId",
                as:"likes"
            }
        },
        {
            $addFields: {
                "noOfLikes": { $size: "$likes" }
            }
        },
        {
            $lookup:{
                from:"comments",
                localField:"_id",
                foreignField:"postId",
                as:"comments"
            }
        },
        {
            $addFields: {
                "noOfComments": { $size: "$comments" }
            }
        },
    ])
    if(!posts || posts.length < 1){
        return  res.status(204).json(
            new ApiResponse(204,posts,"No public data available")
        )
    }
    res.status(200).json(
        new ApiResponse(200,posts,"Posts data fetched successfully")
    )
})

const getTaggedPosts=asyncHandler(async(req:AuthenticatedRequest,res:Response)=>{
    const page=Number(req.query.page || 1)
    const limit=Number(req.query.limit || 9)
    const {username}=req.params
    if(!username){
        throw new ApiError(400,"username is required")
    }
    const user=req.user
    if(!user){
        throw new ApiError(401,"User is not logged in")
    }
    const requestedUser=await User.findOne({username})
    if(!requestedUser){
        throw new ApiError(404,"User does not exist")
    }
    const isFollow=await Follow.find({userId:requestedUser._id,follower:user._id,isRequestAccepted:true})
    if(requestedUser.isPrivate && !isFollow){
        throw new ApiError(401,"Access denied")
    }
    const skip=(page-1)*limit
    const posts = await Post.aggregate([
        {
            $match: {
                taggedUsers: mongoose.Types.ObjectId.createFromTime(requestedUser._id)
            }
        },
        {
            $skip:skip
        },
        {
            $limit:limit
        },
        {
            $project: {
                isStandAlone: 1,
                "posts.content": 1,
                _id: 1
            }
        },
        {
            $lookup:{
                from:"likes",
                localField:"_id",
                foreignField:"postId",
                as:"likes"
            }
        },
        {
            $addFields:{
                "noOfLikes":{$size:"$likes"}
            }
        },
        {
            $lookup:{
                from:"comments",
                localField:"_id",
                foreignField:"postId",
                as:"comments"
            }
        },
        {
            $addFields: {
                "noOfComments": { $size: "$comments" }
            }
        },
    ]);
    if(!posts || posts.length<1){
        return res.status(204).json(
            new ApiResponse(204,{},"No posts found")
        )
    }
    res.status(200).json(
        new ApiResponse(200,posts,"tagged posts fetched successfully")
    )
})

const getUserFeed=asyncHandler(async(req:AuthenticatedRequest,res:Response)=>{
    const limit=Number(req.query.limit || 4)
    const page=Number(req.query.page || 1)
    const skip=(page-1)*limit
    const user=req.user 
    if(!user){
        throw new ApiError(401,"User not logged in")
    } 
    const followedUsers=await Follow.find({follower:user._id,isRequestAccepted:true})
    const posts = await Post.aggregate([
        { $match: { userId: { $in: followedUsers } } },
        {
            $skip:skip
        },
        {
            $limit:limit
        },
        {
            $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'userInfo'
            }
        },
        {
            $lookup: {
                from: 'likes',
                localField: '_id',
                foreignField: 'postId',
                as: 'likes'
            }
        },
        {
            $lookup: {
                from: 'comments',
                let: { postId: '$_id' },
                pipeline: [
                    { $match: { $expr: { $eq: ['$postId', '$$postId'] } } },
                    { $group: { _id: null, count: { $sum: 1 } } }
                ],
                as: 'commentStats'
            }
        },
        {
            $addFields: {
                firstComment: { $arrayElemAt: ['$comments', 0] },
                commentsCount: { $arrayElemAt: ['$commentStats.count', 0] }
            }
        },
        {
            $project: {
                _id: 1,
            postedTogetherAt: 1,
            isStandAlone: 1,
            posts: 1,
            userId: 1,
            isHideLikesAndViews: 1,
            isCommentsOff: 1,
            taggedUsers: 1,
            likesCount: { $size: '$likes' },
            firstComment: 1,
            commentsCount: 1,
            'userInfo.username': 1,
            'userInfo.profilePic': 1
            }
        }
    ]);
    if(posts.length<1){
        throw new ApiError(204,"No posts available")
    }
    res.status(200).json(
        new ApiResponse(200,posts,"posts fetched successfully")
    )
})

const getPublicUserReels=asyncHandler(async(req:Request ,res:Response)=>{
    const limit=Number(req.query.limit || 4)
    const page=Number(req.query.page || 1)
    const skip=(page-1)*limit
    const {username}=req.params
    if(!username){
        throw new ApiError(400,"username required")
    }
    const requestedUser=await User.findOne({username})
    if(!requestedUser){
        throw new ApiError(404,"Requested user does not exist")
    }
    if(requestedUser.isPrivate){
        throw new ApiError(401,"User account is private")
    }
    const reels=await Post.aggregate([
            { $unwind: "$posts" },
            { $match: { "posts.content.type": "reel" } },
            { $group: { _id: "$_id", reels: { $push: "$posts" } } },
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit }
    ])
    if(reels.length<1){
        return res.status(204).json(
            new ApiResponse(204,{},"No data available")
        )
    }
    res.status(200).json(
        new ApiResponse(200,reels,"Reels fetched successfully")
    )
})

const getPrivateUserReels=asyncHandler(async(req:AuthenticatedRequest ,res:Response)=>{
    const limit=Number(req.query.limit || 4)
    const page=Number(req.query.page || 1)
    const skip=(page-1)*limit
    const {username}=req.params
    if(!username){
        throw new ApiError(400,"username required")
    }
    const user=req.user
    if(!user){
        throw new ApiError(401,"Login required")
    }
    const requestedUser=await User.findOne({username})
    if(!requestedUser){
        throw new ApiError(404,"Requested user does not exist")
    }
    const isFollow=await Follow.findOne({userId:requestedUser._id,follower:user._id,isRequestAccepted:true})
    if(requestedUser.isPrivate && !isFollow){
        throw new ApiError(401,"User account is private")
    }
    const reels = await Post.aggregate([
        { $unwind: "$posts" },
        { $match: { "posts.content.type": "reel" } },
        { $group: { _id: "$_id", reels: { $push: "$posts" } } },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit }
    ])
    if(reels.length<1){
        return res.status(204).json(
            new ApiResponse(204,{},"No data available")
        )
    }
    res.status(200).json(
        new ApiResponse(200,reels,"Reels fetched successfully")
    )
})

const getAllPublicReels = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 4);
    const skip = (page - 1) * limit;
    const posts = await Post.aggregate([
        {
            $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "userInfo",
            },
        },
        {
            $unwind: "$posts",
        },
        {
            $match: {
                "userInfo.isPrivate": false,
                "posts.content.type": "reel",
            },
        },
        {
            $group: {
                _id: "$userInfo._id",
                reels: { $push: "$posts" },
            },
        },
        {
            $lookup: {
                from: "likes",
                localField: "reels._id",
                foreignField: "postId",
                as: "likes",
            },
        },
        {
            $addFields: {
                noOfLikes: { $size: "$likes" },
            },
        },
        {
            $lookup: {
                from: "comments",
                localField: "reels._id",
                foreignField: "postId",
                as: "comments",
            },
        },
        {
            $addFields: {
                noOfComments: { $size: "$comments" },
            },
        },
        {
            $sort: {
                createdAt: -1,
            },
        },
        {
            $skip: skip,
        },
        {
            $limit: limit,
        },
    ]);
    if (posts.length < 1) {
        return res.status(204).json(new ApiResponse(204, {}, "No data available"));
    }
    res.status(200).json(new ApiResponse(200, posts, "Reels fetched successfully"));
});


export {createPost,getPostsByPublicUsername,getAllPublicPosts,getPostsByPrivateUsername,getTaggedPosts,getUserFeed,getPrivateUserReels,getPublicUserReels,getAllPublicReels}