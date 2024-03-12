import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { uploadOnCloudinary } from "../utils/cloudinary";

const addProfilePic=asyncHandler(async(req,res)=>{
    const {email}=req.body    
    if(!email){
        throw new ApiError(400,"All fields are mandatory")
    }
    const user=await User.findOne({email})
    if(!user){
        throw new ApiError(404,"User not found")
    }    
    const localFilePath = req.file.path
    if(!localFilePath){
        throw new ApiError(400,"Profile pic file path is required")
    }
    const response=await uploadOnCloudinary(localFilePath)
    console.log("response",response);
    
    if(!response){
        throw new ApiError(400,"Profile pic file is required")
    }
    const updatedUser=await User.findOneAndUpdate(
        {email},
        {
            $set:{
                profilePic:response.url
            }
        },
        {
            new :true
        }
    )
    if(updatedUser.profilePic!==response.url){
        throw new ApiError(500,"Profile pic not updated")
    }
    res.status(200).json(
        new ApiResponse(200,updatedUser,"User updated s")
    )
})

export {addProfilePic}