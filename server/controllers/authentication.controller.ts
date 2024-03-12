import { ApiResponse } from '../utils/ApiResponse';
import { User } from '../models/user.model';
import { ApiError } from '../utils/ApiError';
import {asyncHandler} from '../utils/asyncHandler'
import { Request,Response } from 'express';
import { Schema } from 'mongoose';
import { sendMail } from '../utils/sendMail';

const registerUser=asyncHandler(async(req:Request,res:Response)=>{    
    try {
        
        const {_id,username,phoneNo,name,password,dob}=req.body
        if(!username || !_id || !name || !password ||!dob ){
            throw new ApiError(400,"All fields are mandatory")
        }
        const existedUser=await User.findOne({
            $or:[{username}]
        })
        if(existedUser){
            throw new ApiError(400,"User with email or username or phoneNo already exists")
        }
        const user=await User.findByIdAndUpdate(
            _id,
            {
                $set:{
                    username,
                    name,
                    password,
                    phoneNo,
                    dob
                }
            }
        )

        const createdUser=await User.findById(user._id).select("-password -refreshToken")
        if(!createdUser.username){
            throw new ApiError(500,"Something went wrong while registering user")
        }
        return res.status(201).json(
            new ApiResponse(200,createdUser,"User registered successfully")
            )
    } catch (error) {
        throw new ApiError(401,error?.message || "Error occurred")
    }
})

const generateAccessAndRefreshTokens = async (userId: Schema.Types.ObjectId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError(404, "User not found");
        }
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token");
    }
}

const login=asyncHandler(async(req:Request,res:Response)=>{
    const {username,email,phoneNo,password}=req.body
    if(!(username || email || phoneNo) || !password){
        throw new ApiError(400,"All fields are required")
    }
    const isUser=await User.findOne({
        $or:[{username},{email},{phoneNo}]
    })
    if(!isUser){
        throw new ApiError(404,"User not found")
    }
    const {refreshToken,accessToken}=await generateAccessAndRefreshTokens(isUser._id)
    const loggedInUser=await User.findById(isUser._id).select("-password -refreshToken")
    const options={ //access only to server to modify cookie
        httpOnly:true,
        secure:true
    }
    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(200,{user:loggedInUser,accessToken,refreshToken},"User logged in successfully")
    )
})

const sendOtp = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;
    if (!email) {
        throw new ApiError(400, "Email is required");
    }
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
    try {
        const isMailSent = await sendMail(otp, email);
        if (isMailSent) {
            await User.create({ email, otp });
            res.status(201).json(new ApiResponse(201, otp,"Mail sent successfully"));
        } else {
            throw new ApiError(500, "Unable to send email");
        }
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json(new ApiResponse(error.status || 500, error.message));
    }
});
const verifyOtp = asyncHandler(async (req: Request, res: Response) => {
    const {email,receivedOtp}=req.body;
    if (!email) {
        throw new ApiError(400, "Email is required");
    }
    const user=await User.findOne({email})
    if(!user){
        throw new ApiError(404,"User does not exist")
    }
    const otp=user.otp;    
    if(!otp){
        throw new ApiError(400,"OTP not available to verify")
    }
    if(receivedOtp!==otp){
        throw new ApiError(401,"OTP mismatch")
    }
    await User.findByIdAndUpdate(
        user?._id,
        {
            $set:{
                otp:""
            }
        }
    )
    res.status(201).json(new ApiResponse(201, user,"OTP verified successfully"));

})



export {registerUser,login,sendOtp,verifyOtp}