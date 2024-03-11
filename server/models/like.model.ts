import mongoose, { Schema,Document } from "mongoose"

interface ILike extends Document{
    itemId:string,
    userId:string
}

const likeSchema=new Schema<ILike>({
    itemId:{
        type:String,
        required:true
    },
    userId:{
        type:String,
        required:true
    }
},{timestamps:true})

export const Like=mongoose.model<ILike>("Like",likeSchema)