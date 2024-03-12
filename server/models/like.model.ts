import mongoose, { Schema,Document } from "mongoose"

interface ILike extends Document{
    postId?:Schema.Types.ObjectId,
    commentId?:Schema.Types.ObjectId,
    userId:Schema.Types.ObjectId
}

const likeSchema=new Schema<ILike>({
    postId: {
        type: Schema.Types.ObjectId,
        ref: "Post"
    },
    commentId: {
        type: Schema.Types.ObjectId,
        ref: "Comment"
    },

    userId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
},{timestamps:true})

export const Like=mongoose.model<ILike>("Like",likeSchema)