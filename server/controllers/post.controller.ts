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

const createPost=asyncHandler(async(req:AuthenticatedRequest,res:Response)=>{
    const {posts,aspectRatio,caption,isCommentsOff,isHideLikesAndViews,isStandAlone,taggedUsers}=req.body    
    if(posts.length<1 || !aspectRatio){
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

const editPostCaption=asyncHandler(async(req:AuthenticatedRequest,res:Response)=>{
    const {caption,postId}=req.body
    if(!caption || !postId){
        throw new ApiError(400,"All fields required")
    }
    const isPost=await Post.findById(postId)
    if(!isPost){
        throw new ApiError(404,"Post not found")
    }
    const currentUser=req.user
    if(isPost.userId.toString()!==currentUser._id.toString()){
        throw new ApiError(400,"Only post owner can change caption")
    }
    const updatedPost=await Post.findByIdAndUpdate(
        postId,
        {
            $set:{
                caption
            }
        },
        {
            new:true
        }
    )
    if(updatedPost.caption!==caption){
        throw new ApiError(500,"Failed to update caption")
    }
    res.status(200).json(
        new ApiResponse(200,{},"Caption updated successfully")
    )
})

const getPostById=asyncHandler(async(req:AuthenticatedRequest | Request,res:Response)=>{
    const {postId}=req.params
    if(!postId){
        throw new ApiError(400,"Post id is required")
    }
    const isPost=await Post.findById(postId)
    if(!isPost){
        throw new ApiError(404,"post not found")
    }
    const postUser=await User.findById(isPost.userId)
    const user = (req as AuthenticatedRequest).user;
    let isFollow
    if(user){
        isFollow=await Follow.findOne({follower:user._id,userId:postUser._id,isRequestAccepted:true})
    }    
    if(postUser.isPrivate && !user && !isFollow){
        throw new ApiError(401,"This is not the post you are looking for")
    }
    const post=await Post.aggregate([
        {
            $match:{
                _id:new mongoose.Types.ObjectId(postId)
            }
        },
        {
            $project:{
                "posts.content":1,
                "posts.audioTrack":1,
                "posts._id":1,
                userId:1,
                updatedAt:1,
                isStandAlone:1,
                caption:1
            }
        },{
            $lookup:{
                from:"posts",
                localField:"userId",
                foreignField:"userId",
                as:"userPosts",
                pipeline:[
                    {
                        $project:{
                            _id:1
                        }
                    }
                ]
            }
        },
        {
            $addFields:{
                noOfPostsOfUser:{$size:"$userPosts"}
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
                            username:1,
                            profilePic:1,
                            isPrivate:1
                        }
                    }
                ]
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
            $addFields: {
              "userInfo": {
                $mergeObjects: [
                  { $arrayElemAt: ["$userInfo", 0] },
                  { "noOfPostsOfUser": 1 }
                ]
              }
            }
        },
        {
            $project:{
                isStandAlone:1,
                posts:1,
                isHideLikesAndViews:1,
                caption:1,
                isCommentsOff:1,
                taggedUsers:1,
                updatedAt:1,
                noOfLikes:1,
                userInfo:1
            }
        }
    ])
    res.status(200).json(
        new ApiResponse(200,post[0],"Post fetched successfully")
    )
})

const getPostsByUsername=asyncHandler(async(req:AuthenticatedRequest | Request,res:Response)=>{
    const page=Number(req.query.page || 1)
    const limit=Number(req.query.limit || 9)
    const skip=(page -1 )* limit
    let filterPost;
    if(req.query.filterPost){
        filterPost=String(req.query.filterPost)
    }
    const {username}=req.params
    if(!username){
        throw new ApiError(400,"user id is required")
    }
    const user=await User.findOne({username})
    if(!user){
        throw new ApiError(404,"user not found")
    }
    const currentUser=(req as AuthenticatedRequest).user
    let isFollow
    if(currentUser){
        isFollow=await Follow.findOne({follower:currentUser._id,userId:user._id,isRequestAccepted:true})
    }
    if(user.isPrivate && !currentUser && !isFollow){
        throw new ApiError(401,"user account is private")
    }        
    const posts=await Post.aggregate([
        {
            $match:{
                userId:user._id,
                _id:{$ne:new mongoose.Types.ObjectId(filterPost)}
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
            $project:{
                _id:1,
                noOfLikes:1,
                noOfComments:1,
                isStandAlone:1,
                createdAt:1,
                updatedAt:1,
                isCommentsOff:1,
                post:{$arrayElemAt:["$posts.content",0]},            
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

const removePostItemFromPosts=asyncHandler(async (req:AuthenticatedRequest,res:Response)=>{
    const {postId,postItemId}=req.query
    if(!postId || !postItemId){
        throw new ApiError(400,"Field info missing")
    }
    const user=req.user
    if(!user){
        throw new ApiError(401,"User not logged in")
    }
    const isPost=await Post.findById(postId)
    if(!isPost){
        throw new ApiError(404,"Post not found")
    }
    if(isPost.userId.toString()!==user._id.toString()){
        throw new ApiError(401,"Invalid request : only user can modify his posts")
    }
    const postItemExists = isPost.posts.some(item => item._id.toString() === postItemId);
    if(!postItemExists){
        throw new ApiError(400,"Post item does not exist in given post")
    }
    const updatedPost=await Post.findByIdAndUpdate(
        postId,
        {
            $pull: {
                posts: { _id: postItemId }
            }
        },
        {
            new:true
        }
    )
    if(updatedPost.posts.some((item)=>item._id.toString()===postItemId)){
        throw new ApiError(500,"Failed to remove post item")
    }
    res.status(200).json(
        new ApiResponse(200,{},"post item removed from post successfully")
    )
})

const addPostItemToPosts=asyncHandler(async (req:AuthenticatedRequest,res:Response)=>{
    const {content,audioTrack,postId}=req.body
    if(!content.type || !content.url ||!postId){
        throw new ApiError(400,"Fields missing")
    }
    const user=req.user
    if(!user){
        throw new ApiError(401,"User not logged in")
    }
    const isPost=await Post.findOne({_id:postId})
    if(!isPost){
        throw new ApiError(404,"Post not found to add post item")
    }
    if(isPost.userId.toString()!==user._id.toString()){
        throw new ApiError(401,"Only user can modify his own post")
    }
    const updatedPost = await Post.findByIdAndUpdate(
        postId,
        {
            $push: {
                posts: {
                    content: {
                        type: content.type, 
                        url: content.url
                    },
                }
            }
        },
        {
            new: true
        }
    );
    if(!updatedPost.posts.some((item)=>item.content.url===content.url)){
        throw new ApiError(500,"Failed to add postItem to post")
    }
    res.status(200).json(
        new ApiResponse(200,{},"Post item added successfully to posts")
    )
})

const tagUser=asyncHandler(async(req:AuthenticatedRequest,res:Response)=>{
    const {postId,toTagUserId}=req.body
    if(!postId || !toTagUserId){
        throw new ApiError(400,"Fields missing")
    }
    const user=req.user
    if(!user){
        throw new ApiError(401,"User not logged in")
    }
    const isPost=await Post.findById(postId)
    if(!isPost){
        throw new ApiError(404,"Post not found")
    }
    const isTaggedUser=await User.findById(toTagUserId)
    if(!isTaggedUser){
        throw new ApiError(404,"User to tag not found")
    }
    if(isPost.taggedUsers.includes(isTaggedUser._id)){
        throw new ApiError(400,"User is already tagged")
    }
    if(isPost.userId.toString()!==user._id.toString()){
        throw new ApiError(401,"User can modify only his post")
    }
    const isFollow=await Follow.findOne({follower:user._id,userId:toTagUserId,isRequestAccepted:true})
    if(!isFollow){
        throw new ApiError(401,"You dont follow the user to be tagged")
    }
    const updatedPost=await Post.findByIdAndUpdate(
        postId,
        {
            $push:{
                taggedUsers:toTagUserId
            }
        },
        {
            new:true
        }
    )
    if(!updatedPost.taggedUsers.includes(toTagUserId)){
        throw new ApiError(500,"Failed to tag user")
    }
    res.status(200).json(
        new ApiResponse(200,{},"user tagged successfully")
    )
})

const untagUser=asyncHandler(async(req:AuthenticatedRequest,res:Response)=>{
    const {postId,toUntagUserId}=req.body
    if(!postId || !toUntagUserId){
        throw new ApiError(400,"Fields missing")
    }
    const user=req.user
    if(!user){
        throw new ApiError(401,"User not logged in")
    }
    const isPost=await Post.findById(postId)
    if(!isPost){
        throw new ApiError(404,"Post not found")
    }
    const isTaggedUser=await User.findById(toUntagUserId)
    if(!isTaggedUser){
        throw new ApiError(404,"User to tag not found")
    }
    if(!isPost.taggedUsers.includes(isTaggedUser._id)){
        throw new ApiError(400,"User not present to untag")
    }
    if(isPost.userId.toString()!==user._id.toString()){
        throw new ApiError(401,"User can modify only his post")
    }
    const isFollow=await Follow.findOne({follower:user._id,userId:toUntagUserId,isRequestAccepted:true})
    if(!isFollow){
        throw new ApiError(401,"You dont follow the user to be tagged")
    }
    const updatedPost=await Post.findByIdAndUpdate(
        postId,
        {
            $pull:{
                taggedUsers:toUntagUserId
            }
        },
        {
            new:true
        }
    )
    if(updatedPost.taggedUsers.includes(toUntagUserId)){
        throw new ApiError(500,"Failed to untag user")
    }
    res.status(200).json(
        new ApiResponse(200,{},"user untagged successfully")
    )
})

const getAllPublicPosts=asyncHandler(async(req:AuthenticatedRequest,res:Response)=>{
    const page=Number(req.query.page || 1)
    const limit=Number(req.query.limit || 15)
    const skip=(page-1)*limit
    const posts=await Post.aggregate([
        {
            $sort:{
                updatedAt:-1
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
                            isPrivate:1
                        }
                    }
                ]
            }
        },
        {
            $project:{
                isStandAlone:1,
                userId:1,
                posts:{$arrayElemAt: ["$posts.content", 0] },
                _id:1,
                aspectRatio:1,
                userInfo:{$arrayElemAt:["$userInfo",0]},
                isCommentsOff:1,
                isHideLikesAndViews:1
            }
        },
        {
            $match:{
                "userInfo.isPrivate": false                   
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
        {
            $project:{
                noOfComments:1,
                noOfLikes:1,
                post:"$posts",
                isStandAlone:1,
                isCommentsOff:1,
                isHideLikesAndViews:1
            }
        },
        {
            $skip:skip
        },
        {
            $limit:limit
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
    const skip=(page-1)*limit
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
    if(requestedUser.isPrivate && !isFollow && requestedUser._id.toString()!==user._id.toString()){
        throw new ApiError(401,"Access denied")
    }
    const posts = await Post.aggregate([
        {
            $match: {
                taggedUsers:{
                    $in:[requestedUser._id]
                }
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
            $project: {
                isStandAlone: 1,
                "posts.content": 1,
                _id: 1,
                isCommentsOff:1,
                isHideLikesAndViews:1,
                updatedAt:1,
                aspectRatio:1
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
        {
            $project:{
                isStandAlone:1,
                post:{$arrayElemAt:["$posts.content",0]},
                noOfLikes:1,
                noOfComments:1,
                isHideLikesAndViews:1,
                isCommentsOff:1,
                updatedAt:1
            }
        }
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
    const posts=await Follow.aggregate([
        {
            $match:{
                follower:user._id,
                isRequestAccepted:true,
            }
        },
        {
            $project:{
                userId:1,
                _id:0
            }
        },
        {
            $lookup:{
                from:"posts",
                localField:"userId",
                foreignField:"userId",
                as:"posts",
                pipeline:[
                    {
                        $project:{
                            posts: 1,
                            updatedAt: 1,
                            createdAt: 1,
                            isHideLikesAndViews: 1,
                            isCommentsOff: 1,
                            taggedUsers: 1,
                            aspectRatio:1,
                            caption:1
                        }
                    }
                    
                ]
            }
        },
        {
            $unwind:"$posts"
        },
        {
            $sort:{
                "posts.updatedAt":-1
            }
        },
        {
            $limit:limit
        },
        {
            $skip:skip
        },
        {
            $lookup:{
                from:"likes",
                localField:"posts._id",
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
            $addFields: {
                isPostLiked: {
                    $cond: {
                        if: { $in: [user?._id, "$likes.userId"] },
                        then: true,
                        else: false
                    }
                }
            }
        },        
        {
            $lookup:{
                from:"comments",
                localField:"posts._id",
                foreignField:"postId",
                as:"comments"
            }
        },
        {
            $addFields:{
                "noOfComments":{$size:"$comments"}
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
                            username:1,
                            profilePic:1,
                            _id:0
                        }
                    }
                ]
            }
        },
        {
            $project:{
                posts:"$posts.posts.content",
                updatedAt: "$posts.updatedAt",
                createdAt: "$posts.createdAt",
                isHideLikesAndViews: "$posts.isHideLikesAndViews",
                isCommentsOff: "$posts.isCommentsOff",
                taggedUsers: "$posts.taggedUsers",
                caption: "$posts.caption",
                noOfComments: "$noOfComments",
                noOfLikes: "$noOfLikes",
                userInfo:{$arrayElemAt:["$userInfo",0]},
                _id:"$posts._id",
                isPostLiked:1,
            }
        }
    ])
    if(posts.length<1){
        throw new ApiError(204,"No posts available")
    }
    res.status(200).json(
        new ApiResponse(200,posts,"posts fetched successfully")
    )
})

const getUserReels=asyncHandler(async(req:Request | AuthenticatedRequest ,res:Response)=>{
    const limit=Number(req.query.limit || 4)
    const page=Number(req.query.page || 1)
    const skip=(page-1)*limit
    const {username}=req.params
    const currentUser=(req as AuthenticatedRequest).user
    if(!username){
        throw new ApiError(400,"username required")
    }
    const requestedUser=await User.findOne({username})
    if(!requestedUser){
        throw new ApiError(404,"Requested user does not exist")
    }
    let isFollow
    if(currentUser){
        isFollow=await Follow.findOne({follower:currentUser._id,userId:requestedUser._id,isRequestAccepted:true})
    }
    if(requestedUser.isPrivate && !currentUser && !isFollow &&requestedUser._id.toString()!==currentUser._id.toString()){
        throw new ApiError(401,"User account is private")
    }
    const reels = await Post.aggregate([
        {
            $match:{
                userId:requestedUser._id,
            }
        },
        {
            $unwind:"$posts"
        },
        {
            $match:{
                "posts.content.type":"reel",
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
            $addFields:{
                "noOfComments":{$size:"$comments"}
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
            $project:{
                url:"$posts.content.url",
                noOfComments:1,
                noOfLikes:1,
                isHideLikesAndViews:1,
                updatedAt:1,
                aspectRatio:1
            }
        }
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
                pipeline:[
                    {
                        $project:{
                            isPrivate:1,
                            username:1,
                            profilePic:1
                        }
                    }
                ]
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
            $lookup: {
                from: "likes",
                localField: "_id",
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
                localField: "_id",
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
            $project:{
                _id:1,
                isHideLikesAndViews:1,
                isCommentsOff:1,
                taggedUsers:1,
                noOfLikes:1,
                noOfComments:1,
                userInfo:{$arrayElemAt:["$userInfo",0]},
                aspectRatio:1, 
                posts:1,
                caption:1
            }
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


export {createPost,getPostsByUsername,getAllPublicPosts,getTaggedPosts,getUserFeed,getUserReels,getAllPublicReels,editPostCaption,getPostById,removePostItemFromPosts,addPostItemToPosts,tagUser,untagUser}