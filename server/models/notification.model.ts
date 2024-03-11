import mongoose, { Schema,Document } from "mongoose"

interface INotification extends Document{
    type:"follow" | "like" | "comment";
    senderId:Schema.Types.ObjectId;
    receiverId:Schema.Types.ObjectId;
    postId:Schema.Types.ObjectId
}

const notifcationSchema=new Schema<INotification>({
    type:{
        type:String,
        enum:["follow","like","comment"],
        required:true,
        lowercase:true
    },
    senderId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    receiverId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    postId:{
        type:Schema.Types.ObjectId,
        ref:"Post",
        required:true
    },
},{timestamps:true})

export const Notification=mongoose.model<INotification>("Notification",notifcationSchema)