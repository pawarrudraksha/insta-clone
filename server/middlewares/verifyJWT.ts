import { Request, NextFunction } from 'express'; // Import types for Request, Response, and NextFunction

import {IUser, User} from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from 'jsonwebtoken'

interface CustomRequest extends Request {
    user?:  IUser;
}
export const verifyJWT = asyncHandler(async (req: CustomRequest, _, next: NextFunction) => { // Add types for req, res, and next
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET) as { _id: string }; 
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
        if (!user) {
            throw new ApiError(401, "Invalid access token")
        }
        req.user = user
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
})
