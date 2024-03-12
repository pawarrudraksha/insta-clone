import { IUser } from "models/user.model";
import { asyncHandler } from "../../utils/asyncHandler";
import { Request,Response } from "express";
import { ApiError } from "utils/ApiError";
import { Chat } from "models/chat.model";
import { ApiResponse } from "utils/ApiResponse";
import { uploadOnCloudinary } from "utils/cloudinary";

interface AuthenticatedRequest extends Request{
    user:IUser
}

const createChat=asyncHandler(async(req:AuthenticatedRequest,res:Response)=>{
    const {chatName,isGroupChat,users}=req.body
    if (!users || (isGroupChat && !chatName)) {
        throw new ApiError(400, "Required fields are missing");
    }
    const user=req.user
    if(!user){
        throw new ApiError(401,"User must be logged in")
    }
    const groupPicPath=req.file.path
    if(!groupPicPath){
        throw new ApiError(400,"Cover pic path required")
    }
    const response=await uploadOnCloudinary(groupPicPath)
    if(!response){
        throw new ApiError(500,"group pic upload failed")
    }
    const data:any={
        users,
        isGroupChat,
        groupPic:response.url
    }
    if(isGroupChat){
        data.admin.push(user._id)
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
        new ApiResponse(200,updatedChat,"user added to group")
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
    const {chatId}=req.body
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
        new ApiResponse(200,updatedChat,"User exited group successfully")
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

// const editGroupInfo=asyncHandler(async (req:AuthenticatedRequest,res:Response)=>{
//     const {chatId}=req.params
//     const {chatName,admin}=req.body

// })

export {createChat,addUserToChat,removeUserFromChat,exitGroup,deleteChat}