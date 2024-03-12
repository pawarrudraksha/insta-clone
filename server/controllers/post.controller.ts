import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { Request,Response } from "express";
import { IUser } from "../models/user.model";
import { Post } from "../models/post.model";
import { ApiResponse } from "../utils/ApiResponse";

interface AuthenticatedRequest extends Request {
    user:IUser; 
}

const getPost=asyncHandler((req:Request,res:Response)=>{
    
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

export {createPost}