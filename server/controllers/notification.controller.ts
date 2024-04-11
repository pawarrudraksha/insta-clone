import { IUser, User } from "../models/user.model";
import { asyncHandler } from "../utils/asyncHandler";
import { Request,Response } from "express";
import { ApiError } from "../utils/ApiError";
import { Post } from "../models/post.model";
import { Notification } from "../models/notification.model";
import { ApiResponse } from "../utils/ApiResponse";

interface AuthenticatedRequest extends Request{
    user:IUser
}

const createNotification=asyncHandler(async(req:AuthenticatedRequest,res:Response)=>{ 
    const {type,receiverId,postId,comment}=req.body
    if(!type || !receiverId){
        throw new ApiError(400,"All fields are required")
    }
    const user=req.user
    if(!user){
        throw new ApiError(401,"User must be logged in")
    }
    if(receiverId===user._id.toString()){
        throw new ApiError(400,"Receiver id and logged in user id cannot be same")
    }
    if(postId){
        const post=await Post.findById(postId)
        if(!post){
            throw new ApiError(404,"Post not found")
        }
    }
    const receiver=await User.findById(receiverId)
    if(!receiver){
        throw new ApiError(404,"Notification receiver not found")
    }
    const notification=await Notification.create({
        type,
        senderId:user._id,
        receiverId,
        postId,
        comment
    })
    const isNotification=await Notification.findById(notification._id)
    if(!isNotification){
        throw new ApiError(500,"Failed to create notification")
    }
    res.status(201).json(
        new ApiResponse(201,notification,"Notification sent")
    )
})

const getReceivedNotifications=asyncHandler(async(req:AuthenticatedRequest,res:Response)=>{
    const limit=Number(req.query.limit || 9)
    const page=Number(req.query.page || 1)
    const skip=(page-1)*limit
    const user=req.user
    if(!user){
        throw new ApiError(401,"User needs to be logged in")
    }
    const notifications=await Notification.aggregate([
        {
            $match:{
                receiverId:user._id
            }
        },
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
            $lookup:{
                from:"users",
                localField:"senderId",
                foreignField:"_id",
                as:"senderInfo",
                pipeline:[
                    {
                        $project:{
                            "profilePic":1,
                            "username":1
                        }
                    }
                ] 
            }
        },
        {
            $addFields:{
                senderInfo:{$arrayElemAt:["$senderInfo",0]},
            }
        },
        {
            $project:{
                senderInfo:1,
                type:1,
                updatedAt:1,
                _id:1,
                comment:1,
            }
        }

    ])
    if(notifications.length <1){
        res.status(200).json(
            new ApiResponse(200,{},"User has no received notifications")
        )
    }
    res.status(200).json(
        new ApiResponse(200,notifications,"Received notifications fetched successfully")
    )
})

const deleteNotificationById=asyncHandler(async (req:AuthenticatedRequest,res:Response)=>{
    const {notificationId}=req.params
    if(!notificationId){
        throw new ApiError(400,"Notification id required")
    }
    const user=req.user
    if(!user){
        throw new ApiError(401,"User not logged in")
    }
    const notification=await Notification.findById(notificationId)
    if(!notification){
        throw new ApiError(404,"Notification not found")
    }
    if(!(notification.senderId.toString()===user._id.toString() ||  notification.receiverId.toString()===user._id.toString())){
        throw new ApiError(401,"You dont have access to delete notification")
    }
    await Notification.findByIdAndDelete(notificationId)
    const isNotification=await Notification.findById(notificationId)
    if(isNotification){
        throw new ApiError(500,"Failed to delete notification")
    }
    res.status(200).json(
        new ApiResponse(200,{},"Notification deleted successfully")
    )
})

export {createNotification,getReceivedNotifications,deleteNotificationById}