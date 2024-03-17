import { IUser } from "../models/user.model";
import { asyncHandler } from "../utils/asyncHandler";
import { Request,Response } from "express";
import { ApiError } from "../utils/ApiError";
import { Chat } from "../models/chat.model";
import { Message } from "../models/message.model";
import { ApiResponse } from "../utils/ApiResponse";
import { uploadOnCloudinary } from "../utils/cloudinary";

interface AuthenticatedRequest extends Request{
    user:IUser
}
const sendMessage=asyncHandler(async(req:AuthenticatedRequest,res:Response)=>{
    const {message,toReplyMessage,chatId}=req.body
    if(!message.type || !message.content || !chatId){
        throw new ApiError(400,"All fields are required")
    }
    const user=req.user
    if(!user){
        throw new ApiError(401,"user must be logged in")
    }
    const chat=await Chat.findById(chatId)
    if(!chat){
        throw new ApiError(404,"Chat not found")
    }
    if(!chat.users.includes(user._id)){
        throw new ApiError(401,"User not part of given chat")
    }
    let data;
    if(message.type!=='text'){
        const messagePath=req.file.path;
        if(!messagePath){
            throw  new ApiError(400,"message path is required")
        }
        const response=await uploadOnCloudinary(messagePath)
        if(!response){
            throw new ApiError(500,"Upload message failed")
        }
        data={
            message:{
                type:message.type,
                content:response.url
            },
            chatId,
            senderId:user._id,
            toReplyMessage
        }
    }else{
        data={
            message,
            chatId,
            senderId:user._id,
            toReplyMessage
        }

    }
    const msg=await Message.create(data)
    if(!msg){
       throw new ApiError(500,"failed to send message")
    }
    const updatedChat=await Chat.findByIdAndUpdate(
        chatId,
        {
            $set:{
                latestMessage:msg._id
            }
        },
        {
            new:true
        }
    )
    if(updatedChat.latestMessage!==msg._id){
        throw new ApiError(500,"failed to update latest chat message")
    }
    res.status(201).json(
        new ApiResponse(201,msg,"Msg sent successfully")
    )
})

const editMessage=asyncHandler(async(req:AuthenticatedRequest,res:Response)=>{
    const {text,chatId,messageId}=req.body
    if(!messageId || !chatId || !text){
        throw  new ApiError(400,"All fields are required")
    }
    const user=req.user
    if(!user){
        throw  new ApiError(401,"User must be logged in")
    }
    const chat=await Chat.findById(chatId)
    if(!chat){
        throw new ApiError(404,"Chat not found")
    }
    if(!chat.users.includes(user._id)){
        throw new ApiError(401,"User not part of given chat")
    }
    const message=await Message.findById(messageId)
    if(!message){
        throw new ApiError(404,"Message not found")
    }
    if(message.senderId!==user._id){
        throw new ApiError(401,"User can only delete his own message")
    }
    const updatedMsg=await Message.findByIdAndUpdate(
        message._id,
        {
            $set:{
                "message.content":text
            }
        },
        {
            new:true
        }
    )
    if(updatedMsg.message.content!==text){
        throw new ApiError(500,"Failed to edit message")
    }
    res.status(200).json(
        new ApiResponse(200,updatedMsg,"Message edited successfully")
    )
})

const deleteMessage=asyncHandler(async(req:AuthenticatedRequest,res:Response)=>{
    const {messageId,chatId}=req.body
    if(!messageId || !chatId){
        throw  new ApiError(400,"All fields are required")
    }
    const user=req.user
    if(!user){
        throw  new ApiError(401,"User must be logged in")
    }
    const chat=await Chat.findById(chatId)
    if(!chat){
        throw new ApiError(404,"Chat not found")
    }
    if(!chat.users.includes(user._id)){
        throw new ApiError(401,"User not part of given chat")
    }
    const message=await Message.findById(messageId)
    if(!message){
        throw new ApiError(404,"Message not found")
    }
    if(message.senderId!==user._id){
        throw new ApiError(401,"User can only delete his own message")
    }
    await Message.findByIdAndDelete(messageId)
    const isMsg=await Message.findById(messageId)
    if(isMsg){
        throw new ApiError(500,"failed to delete message")
    }
    res.status(200).json(
        new ApiResponse(200,{},"Message delete successfully")
    )        
})

const getChatMessages=asyncHandler(async(req:AuthenticatedRequest,res:Response)=>{
    const {chatId}=req.params
    const page=Number(req.query.page || 1)
    const limit=Number(req.query.limit || 15)
    const skip=(page-1)*limit
    if(!chatId){
        throw new ApiResponse(400,"ChatId is required")
    }
    const user=req.user
    if(!user){
        throw new ApiResponse(400,"User needs to be logged in")
    }
    const chat=await Chat.findById(chatId)
    if(!chat){
        throw new ApiError(404,"Chat not found")
    }
    if(!chat.users.includes(user._id)){
        throw new ApiError(401,"User not part of chat")
    }
    const messages = await Message.find({ chatId }).sort({ updatedAt: -1 }).skip(skip).limit(limit);
    if(messages.length<1){
        throw new ApiResponse(404,"Chat does not have any messages")
    }
    res.status(200).json(
        new ApiResponse(200,messages,"Messages fetched successfully")
    )
})

const getMessageById=asyncHandler(async(req:AuthenticatedRequest,res:Response)=>{
    const {chatId,messageId}=req.body
    if(!chatId || !messageId){
        throw new ApiError(400,"All fields are required")
    }
    const user=req.user
    if(!user){
        throw new ApiError(401,"User needs to be logged in")
    }
    const chat=await Chat.findById(chatId)
    if(!chat){
        throw new ApiError(404,"Chat not found")
    }
    if(!chat.users.includes(user._id)){
        throw new ApiError(401,"User not part of chat")
    }
    const message=await Message.findById(messageId)
    if(!message){
        throw new ApiError(404,"Message not found")
    }
    res.status(200).json(
        new ApiResponse(200,message,"Message fetched successfully")
    )
})
export {sendMessage,editMessage,deleteMessage,getChatMessages,getMessageById}