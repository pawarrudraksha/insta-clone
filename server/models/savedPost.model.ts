import mongoose, { Schema , Document} from "mongoose";

interface ISavedPost extends Document{
    userId:Schema.Types.ObjectId,
    savedPostId:Schema.Types.ObjectId
}

const savedPostSchema=new Schema<ISavedPost>({
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    savedPostId:{
        type:Schema.Types.ObjectId,
        ref:"Post"
    },
},{timestamps:true})

export const SavedPost=mongoose.model<ISavedPost>("SavedPost",savedPostSchema)