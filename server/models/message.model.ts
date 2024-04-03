import mongoose, { Schema,Document } from "mongoose"

interface IMessage extends Document{
    message:{
        type:"text"|"reel"|"post",
        content:string;
        _id?:Schema.Types.ObjectId
    };
    chatId:Schema.Types.ObjectId;
    senderId:Schema.Types.ObjectId;
    toReplyMessage:Schema.Types.ObjectId
}

const messageSchema=new Schema<IMessage>({
    message:{
        type:{
            type:String,
            enum:["text","reel","post"],
            lowercase:true,
            required:true
        },
        content:{
            type:String,
            required:true
        },
        _id:{
            type:Schema.Types.ObjectId,
            ref:"Post"
        }
    },
    chatId:{
        type:Schema.Types.ObjectId,
        ref:"Chat",
        required:true
    },
    senderId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    toReplyMessage:{
        type:Schema.Types.ObjectId,
        ref:"Message",
    }
},{timestamps:true})

export const Message=mongoose.model("Message",messageSchema)