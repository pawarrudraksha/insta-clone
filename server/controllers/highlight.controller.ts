import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { Request,Response } from "express";
import { IUser } from "../models/user.model";
import { uploadOnCloudinary } from "../utils/cloudinary";
import { Highlight } from "../models/highlight.model";
import { ApiResponse } from "../utils/ApiResponse";

interface AuthenticatedRequest extends Request{
    user:IUser
}

const createHighlight=asyncHandler(async(req:AuthenticatedRequest,res:Response)=>{
    const {stories,caption}=req.body
    if(stories.length<1 || !caption){
        throw new ApiError(400,"All fields are neccessary")
    }
    const user=req.user
    if(!user){
        throw new ApiError(401,"User needs to be logged in")
    }
    const localFilePath=req.file.path
    if(!localFilePath){
        throw new ApiError(400,"Coverpic file path not found")
    }
    const response=await uploadOnCloudinary(localFilePath)
    if(!response){
        throw new ApiError(500,"Cover pic upload failed")
    }
    const highlight=await Highlight.create({
        stories,
        caption,
        coverPic:response.url,
        userId:user._id
    })
    const isHighlightCreated=await Highlight.findById(highlight._id)
    if(!isHighlightCreated){
        throw new ApiError(500,"Failed to create highlight")
    }
    res.status(201).json(
        new ApiResponse(201,highlight,"Highlight created successfully")
    )
})

const addStoryToHighlight=asyncHandler(async(req:AuthenticatedRequest,res:Response)=>{
    const {storyId,highlightId}=req.body
    if(!storyId || !highlightId){
        throw new ApiError(400,"All fields are required")
    }
    const user=req.user
    if(!user){
        throw new ApiError(401,"User needs to be logged in")
    }
    const highlight=await Highlight.findById(highlightId)
    if(!highlight){
        throw new ApiError(404,"Highlight does not exist")
    }
    if(highlight.userId!==user._id){
        throw new ApiError(401,"Unauthorized request")
    }
    const updatedHighlight=await Highlight.findByIdAndUpdate(
        highlightId,
        {
            $push:{
                stories:storyId
            }
        },
        {
            new:true
        }
    )
    if(!updatedHighlight.stories.includes(storyId)){
        throw new ApiError(500,"Failed to add story to highlight")
    }
    res.status(200).json(
        new ApiResponse(200,updatedHighlight,"Story added to highlight successfully")
    )
})


const removeStoryFromHighlight=asyncHandler(async(req:AuthenticatedRequest,res)=>{
    const {highlightId,storyId}=req.body
    if(!highlightId || !storyId){
        throw new ApiError(400,"All fields are required")
    }
    const user=req.user
    if(!user){
        throw new ApiError(401,"User needs to be logged in")
    }
    const highlight=await Highlight.findById(highlightId)
    if(!highlight){
        throw new ApiError(404,"Highlight not found")
    }
    if(highlight.userId!==user._id){
        throw new ApiError(400,"Unauthorized request")
    }
    if(!highlight.stories.includes(storyId)){
        throw new ApiError(404,"Story not found")
    }
    const updatedHighlight=await Highlight.findByIdAndUpdate(
        highlightId,
        {
            $pull:{
                stories:storyId
            }
        },
        {
            new:true
        }
    )
    if(updatedHighlight.stories.includes(storyId)){
        throw new ApiError(500,"Failed to remove story")
    }
    res.status(200).json(
        new ApiResponse(200,{},"Story removed successfully")
    )
})  

const deleteHighlight=asyncHandler(async(req:AuthenticatedRequest,res:Response)=>{
    const {highlightId}=req.params
    if(!highlightId){
        throw new ApiError(400,"Highlight id is required")
    }
    const user=req.user
    if(!user){
        throw new ApiError(401,"User needs to be logged in")
    }
    const highlight=await Highlight.findById(highlightId)
    if(!highlight){
        throw new ApiError(404,"Highlight not found")
    }
    if(highlight.userId!==user._id){
        throw new ApiError(401,"Unauthorized request")
    }
    await Highlight.findByIdAndDelete(highlightId)
    const isHighlight=await Highlight.findById(highlightId)
    if(isHighlight){
        throw new ApiError(500,"Failed to delete Highlight")
    }
    res.status(200).json(
        new ApiResponse(200,{},"Highlight removed successfully")
    )
})

export {createHighlight,deleteHighlight,addStoryToHighlight,removeStoryFromHighlight}