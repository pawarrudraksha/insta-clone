import mongoose, { Schema ,Document} from "mongoose";

interface IComment extends Document{
    text:string;
    postId:Schema.Types.ObjectId;
    userId:Schema.Types.ObjectId;
    toReplyCommentId?: Schema.Types.ObjectId 
}

const commentSchema=new Schema<IComment>({
    text:{
        type:String,
        required:true
    },
    postId:{
        type:Schema.Types.ObjectId,
        ref:"Post",
        required:true
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    toReplyCommentId:{
        type:Schema.Types.ObjectId,
        ref:"Comment",
    }
},{timestamps:true})

export const Comment=mongoose.model<IComment>('Comment',commentSchema)