import { IUser } from "../models/user.model";
import { asyncHandler } from "../utils/asyncHandler";
import { Request,Response } from "express";
import { ApiError } from "../utils/ApiError";
import { Chat } from "../models/chat.model";
import { ApiResponse } from "../utils/ApiResponse";
import { uploadOnCloudinary } from "../utils/cloudinary";
import mongoose from "mongoose";

interface AuthenticatedRequest extends Request{
    user:IUser
}

const createChat=asyncHandler(async(req:AuthenticatedRequest,res:Response)=>{
    const {chatName,isGroupChat,users}=req.body
    if (users.length < 1 || (isGroupChat && !chatName)) {
        throw new ApiError(400, "Required fields are missing");
    }
    const user=req.user
    if(!user){
        throw new ApiError(401,"User must be logged in")
    }
    if(users.length===1){
        const isChat = await Chat.findOne({
            users: { 
              $all: [user?._id, users[0]],
              $size: 2,
            },
            isGroupChat:false
        }).select("_id");
        
        if(isChat?._id){
            throw new ApiError(400,"chat already existts")
        }
    }
    const data:any={
        users:[...users,user._id],
        isGroupChat,
        admin:[],
        chatName:"Users"
    }
    if(isGroupChat){
        data.admin.push(user._id),
        data.chatName=chatName
    }
    const chat=await Chat.create(data)
    res.status(201).json(
        new ApiResponse(201,chat,"Chat created successfully")
    )
})

const addUserToChat=asyncHandler(async(req:AuthenticatedRequest,res:Response)=>{
    const {addUserId,chatId}=req.body
    if(!addUserId || !chatId){
        throw new ApiError(400, "Required fields are missing");
    }
    const user=req.user
    if(!user){
        throw new ApiError(401,"User must be logged in")
    }
    const chat=await Chat.findById(chatId)
    if(!chat){
        throw new ApiError(404,"Chat not found")
    }
    if(!chat.isGroupChat){
        throw new ApiError(400,"Add functionality is only available for groups")
    }
    if(!chat.admin.includes(user._id)){
        throw new ApiError(401,"Only admin has access")
    }
    
    if(chat.users.includes(addUserId)){
        throw new ApiError(400,"User already present")
    }
    const updatedChat=await Chat.findByIdAndUpdate(
        chat._id,
        {
            $push:{
                users:addUserId
            }
        },
        {
            new:true
        }
    )
    if(!updatedChat.users.includes(addUserId)){
        throw new ApiError(500,"failed to add user")
    }
    res.status(200).json(
        new ApiResponse(200,{},"user added to group")
    )
})

const removeUserFromChat=asyncHandler(async(req:AuthenticatedRequest,res:Response)=>{
    const {removedUserId,chatId}=req.body
    if(!removedUserId || !chatId){
        throw new ApiError(400,"All field are mandatory")
    }
    const user=req.user
    if(!user){
        throw new ApiError(401,"User must be logged in")
    }
    const chat=await Chat.findById(chatId)
    if(!chat){
        throw new ApiError(404,"Chat not found")
    }
    if(!chat.isGroupChat){
        throw new ApiError(400,"Remove user feature is only for groups")
    }
    if(!chat.admin.includes(user._id)){
        throw new ApiError(401,"Admin restricted access")
    }
    if(!chat.users.includes(removedUserId)){
        throw new ApiError(404,"User to be removed not found")
    }

    const updatedChat=await Chat.findByIdAndUpdate(
        chatId,
        {
            $pull:{
                users:removedUserId
            }
        },
        {
            new:true
        }
    )

    if(updatedChat.users.includes(removedUserId)){
        throw new ApiError(500,"Failed to remove user")
    }
    res.status(200).json(
        new ApiResponse(200,{},"User removed successfully")
    )
})

const exitGroup=asyncHandler(async (req:AuthenticatedRequest,res:Response)=>{
    const {chatId}=req.params
    if( !chatId){
        throw new ApiError(400,"All field are mandatory")
    }
    const user=req.user
    if(!user){
        throw new ApiError(401,"User must be logged in")
    }
    const chat=await Chat.findById(chatId)
    if(!chat){
        throw new ApiError(404,"Chat not found")
    }
    if(!chat.isGroupChat){
        throw new ApiError(400,"Feature available only for groups")
    }
    if(!chat.users.includes(user._id)){
        throw new ApiError(400,"User not part of the group")
    }
    const updatedChat=await Chat.findByIdAndUpdate(
        chatId,
        {
            $pull:{
                users:user._id
            }
        },
        {
            new:true
        }
    )
    if(updatedChat.users.includes(user._id)){
        throw new ApiError(500,"Unable to process request")
    }
    res.status(200).json(
        new ApiResponse(200,{},"User exited group successfully")
    )
})

const deleteChat=asyncHandler(async (req:AuthenticatedRequest,res:Response)=>{
    const {chatId}=req.params
    if(!chatId){
        throw new ApiError(400,"Chat Id is required")
    }
    const user=req.user
    if(!user){
        throw new ApiError(401,"User must be logged in")
    }
    const chat=await Chat.findById(chatId)
    if(!chat){
        throw new ApiError(404,"Chat not found")
    }
    if(chat.isGroupChat && !chat.admin.includes(user._id)){
        throw new ApiError(401,"unauthorized delete request")   
    }
    await Chat.findByIdAndDelete(chatId)
    const isChat=await Chat.findById(chatId)
    if(isChat){
        throw new ApiError(500,"Chat deletion unsuccessful")
    }
})

const getChatInfo=asyncHandler(async (req:AuthenticatedRequest,res:Response)=>{
    const {chatId}=req.params
    if(!chatId){
        throw new ApiError(400,"Chat id is required")
    }
    const user=req.user
    if(!user){
        throw new ApiError(401,"Unauthorized request ,user not logged in")
    }
    const isChat=await Chat.findById(chatId)
    if(!isChat){
        throw new ApiError(404,"Chat not found")
    }
    if(!isChat.users.includes(user._id)){
        throw new ApiError(401,"Unauthorized request")
    }
    const chatInfo=await Chat.aggregate([
        {
            $match:{
                _id:new mongoose.Types.ObjectId(chatId)
            }
        },
        {
            $unwind:"$users"
        },
        {
            $lookup:{
                from:"users",
                localField:"users",
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
                "userInfo":{$arrayElemAt:["$userInfo",0]},
                "updatedAt":1,
                "isGroupChat":1,
                "admin":1,
                "chatName":1,
                "latestMessage":1
            }
        },
        {
            $lookup:{
                from:"messages",
                localField:"latestMessage",
                foreignField:"_id",
                as:"latestMessage",
                pipeline:[
                    {
                        $project:{
                            message:1
                        }
                    }
                ]
            }
        },
        {
            $group:{
                _id:"$_id",
                users:{$push:"$userInfo"},
                updatedAt: { $first: "$updatedAt" },
                isGroupChat: { $first: "$isGroupChat" },
                chatName: { $first: "$chatName" },
                admin: { $first: "$admin" },
                latestMessage: { $first: {$arrayElemAt:["$latestMessage",0] }} 
            }
        }
      
    ])
    if(!chatInfo){
        throw new ApiError(500,"Failed to fetch chat info")
    }
    res.status(200).json(
        new ApiResponse(200,chatInfo[0],"Chat info fetched successfully")
    )
})

const getUserChats=asyncHandler(async (req:AuthenticatedRequest,res:Response)=>{
    const user=req.user
    if(!user){
        throw new ApiError(401,"User not logged in")
    }
    const chats=await Chat.aggregate([
        {
            $unwind:"$users"
        },
        {
            $match:{
                users:user._id
            }
        },
        {
            $group:{
                _id:"$_id"
            }
        },
        {
            $lookup:{
                from:"chats",
                localField:"_id",
                foreignField:"_id",
                as:"chatInfo",
                pipeline:[
                    {
                        $lookup:{
                            from:"users",
                            localField:"users",
                            foreignField:"_id",
                            as:"userInfo",
                            pipeline:[
                                {
                                    $project:{
                                        _id:1,
                                        profilePic:1,
                                        username:1,
                                    }
                                },
                                {
                                    $limit:2
                                },
                            ]
                        }
                    },
                    
                ]
            }
        },
        {
            $project:{
                chatInfo:{$arrayElemAt:["$chatInfo",0]},
                _id:0
            }
        },
        {
            $project:{
                userInfo:{
                    $filter: { input: "$chatInfo.userInfo", cond: { $ne: ["$$this._id", user?._id] } }  
                },
                updatedAt:"$chatInfo.updatedAt",
                latestMessage:"$chatInfo.latestMessage",
                isGroupChat:"$chatInfo.isGroupChat",
                chatName:"$chatInfo.chatName",
                _id:"$chatInfo._id"
            }
        },
        {
            $lookup:{
                from:"messages",
                localField:"latestMessage",
                foreignField:"_id",
                as:"latestMessage",
                pipeline:[
                    {
                        $project:{
                            message:1
                        }
                    }
                ]
            }
        },
        {
            $project:{
                userInfo:1,
                updatedAt:1,
                latestMessage:{$arrayElemAt:["$latestMessage",0]},
                isGroupChat:1,
                chatName:1,
            }
        }
    ])
    res.status(200).json(
        new ApiResponse(200,chats,"Chats fetched successfully")
    )
})

const findChat=asyncHandler(async(req:AuthenticatedRequest,res:Response)=>{
    const requestedUserId=req.params.requestedUserId
    if(!requestedUserId){
        throw new ApiError(400,"Other user id needed")
    }
    const user=req.user
    if(!user){
        throw new ApiError(401,"user not logged in")
    }
    const chat = await Chat.findOne({
        users: { 
          $all: [user?._id, requestedUserId],
          $size: 2,
        },
        isGroupChat:false
    }).select("_id");
    if(!chat){
        return res.status(204).json(
            new ApiResponse(204,{},"No chat found")
        )
    }
    res.status(200).json(
        new ApiResponse(200,chat,"Chat fetched successfully")
    )
})
    

export {createChat,addUserToChat,removeUserFromChat,exitGroup,deleteChat,getChatInfo,getUserChats,findChat}