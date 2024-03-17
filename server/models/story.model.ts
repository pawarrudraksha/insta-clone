import mongoose, { Schema, Document } from "mongoose";

interface IStory extends Document {
    content: {
        type:string,
        url:string
    };
    type: "reel" | "post";
    userId: Schema.Types.ObjectId;
    caption: {
        text: string;
        position: {
            top: string;
            left: string;
        };
        color?:string
    };
}

const storySchema = new Schema<IStory>({
    content: {
        type:{
            type:String,
            enum:["reel","post"]
        },
        url:{
            type: String,
            required: true
        }
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    caption: {
        text: {
            type: String,
            required: true
        },
        position: {
            top: {
                type: String,
                required: true
            },
            left: {
                type: String,
                required: true
            }
        },
        color:{
            type:String,
            default:"#fff"
        }
    }
}, { timestamps: true });

export const Story=mongoose.model<IStory>("Story",storySchema)