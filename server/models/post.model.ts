import mongoose, { Schema, Document } from "mongoose";

interface IPostItem extends Document {
    content:{
        type:string,
        url:string
    };
    audioTrack?: {
        track: string,
        coverPic?: string,
        author?:String
    },
}


interface IPost extends Document {
    postedTogetherAt: Date;
    isStandAlone?: boolean;
    posts: IPostItem[];
    userId: Schema.Types.ObjectId; 
    isHideLikesAndViews?: boolean; 
    isCommentsOff?: boolean; 
    taggedUsers:[Schema.Types.ObjectId];
    caption:string;
    aspectRatio:string
}

const postItemSchema = new Schema<IPostItem>({
    content:{
        type:{
            type:String,
            required:true,
            enum:["post","reel"]
        },
        url:{
            type:String,
            required:true
        },
    },    
    audioTrack: {
        track: String,
        coverPic: String,
        author:String
    },
},{timestamps:true});

const postSchema = new Schema<IPost>({
    postedTogetherAt: {
        type: Date,
        default: Date.now
    },
    isStandAlone: {
        type: Boolean,
        default: true
    },
    posts: [postItemSchema],
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required:true
    },
    isHideLikesAndViews:{
        type:Boolean,
        default:false,
    },
    isCommentsOff:{
        type:Boolean,
        default:false,
    },
    taggedUsers:{
        type:[Schema.Types.ObjectId],
    },
    caption:{
        type:String
    },
    aspectRatio:{
        type:String
    }
}, { timestamps: true });

export const Post = mongoose.model<IPost>("Post", postSchema);
