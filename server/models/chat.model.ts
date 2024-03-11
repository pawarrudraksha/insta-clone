import mongoose, { Schema , Document} from "mongoose";

interface IChat extends Document{
    chatName:string;
    isGroupChat:boolean;
    users:[Schema.Types.ObjectId];
    latestMessage:string
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
    latestMessage:String
},{timestamps:true})

export const Chat=mongoose.model<IChat>("Chat",chatSchema)