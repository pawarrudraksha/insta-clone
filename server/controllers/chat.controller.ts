import { asyncHandler } from "../utils/asyncHandler";
import { Request,Response } from "express";

const getChat=asyncHandler((req:Request,res:Response)=>{
    console.log("hello world");
})

export {getChat}