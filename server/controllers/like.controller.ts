import { asyncHandler } from "../utils/asyncHandler";
import { Request,Response } from "express";


const getLike=(asyncHandler((req:Request,res:Response)=>{
    console.log("Hello  world");
}))

export {getLike}