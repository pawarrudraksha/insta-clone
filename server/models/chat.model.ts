import mongoose, { Schema , Document} from "mongoose";

interface IChat extends Document{
    chatName:string;
    isGroupChat:boolean;
    admin:[Schema.Types.ObjectId];
    users:[Schema.Types.ObjectId];
    latestMessage:string;
    groupPic:string
}

const chatSchema=new Schema<IChat>({
    chatName:{
        type:String,
        default:"Users"
    },
    isGroupChat:{
        type:Boolean,
        default:false
    },
    users:{
        type:[Schema.Types.ObjectId],
        ref:"User",
        required:true
    },
    admin:{
        type:[Schema.Types.ObjectId],
        ref:"User"
    },
    groupPic:{
        type:String
    },
    latestMessage:String
},{timestamps:true})

export const Chat=mongoose.model<IChat>("Chat",chatSchema)