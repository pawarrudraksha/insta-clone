import mongoose, { Schema,Document } from "mongoose"

interface INotification extends Document{
    type:"follow" | "like" | "comment";
    senderId:Schema.Types.ObjectId;
    receiverId:Schema.Types.ObjectId;
    postId?:Schema.Types.ObjectId;
    comment?:string
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
    },
    comment:{
        type:String
    },
},{timestamps:true})

export const Notification=mongoose.model<INotification>("Notification",notifcationSchema)