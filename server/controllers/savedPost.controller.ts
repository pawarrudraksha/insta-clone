import { asyncHandler } from "../utils/asyncHandler";
import { Request,Response } from "express";


const getSavedPost=(asyncHandler((req:Request,res:Response)=>{
    console.log("Hello  world");
}))

export {getSavedPost}