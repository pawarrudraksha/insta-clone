import mongoose, { Schema , Document} from "mongoose";

interface IChat extends Document{
    chatName:string;
    isGroupChat:boolean;
    admin:[Schema.Types.ObjectId];
    users:[Schema.Types.ObjectId];
    latestMessage:Schema.Types.ObjectId;
    groupIcon:string
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
    groupIcon:{
        type:String
    },
    latestMessage:{
        type:Schema.Types.ObjectId,
        ref:"Message"
    }
},{timestamps:true})

export const Chat=mongoose.model<IChat>("Chat",chatSchema)