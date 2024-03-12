import mongoose, { Schema,Document } from "mongoose"

interface IFollow extends Document{
    userId:Schema.Types.ObjectId,
    follower:Schema.Types.ObjectId
}

const followSchema=new Schema<IFollow>({
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    follower:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true,
    }
},{timestamps:true})

export const Follow=mongoose.model<IFollow>("Follow",followSchema)