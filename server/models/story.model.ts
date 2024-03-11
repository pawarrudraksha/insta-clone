import mongoose, { Schema, Document } from "mongoose";

interface IStory extends Document {
    story: string;
    type: "reel" | "post";
    userId: Schema.Types.ObjectId;
    caption: {
        text: string;
        position: {
            top: string;
            left: string;
        };
    };
}

const storySchema = new Schema<IStory>({
    story: {
        type: String,
        required: true
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
        }
    }
}, { timestamps: true });

export const Story=mongoose.model<IStory>("Story",storySchema)