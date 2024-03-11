import { asyncHandler } from "../utils/asyncHandler";
import { Request,Response } from "express";


const getNotification=(asyncHandler((req:Request,res:Response)=>{
    console.log("Hello  world");
}))

export {getNotification}