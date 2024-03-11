import { asyncHandler } from "../utils/asyncHandler";
import { Request,Response } from "express";


const getHighlight=(asyncHandler((req:Request,res:Response)=>{
    console.log("Hello  world");
}))

export {getHighlight}