import { asyncHandler } from "../utils/asyncHandler";
import { Request,Response } from "express";

const getComment=asyncHandler((req:Request,res:Response)=>{
    console.log("hello world");
    
})

export  {getComment}