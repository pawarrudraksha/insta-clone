import mongoose, { Schema, Document } from "mongoose";

interface IPostItem extends Document {
    postId: mongoose.Schema.Types.ObjectId;
    content: string;
    author: string;
    aspectRatio: string;
}

interface IReel extends Document {
    reelId: mongoose.Schema.Types.ObjectId;
    audioTrack: {
        track: string;
        coverPic: string;
    };
    aspectRatio: string;
    content:string
}

interface IPost extends Document {
    postedTogetherAt: Date;
    isStandAlone: boolean;
    posts: IPostItem[];
    reel: IReel[];
    userId: Schema.Types.ObjectId; 
}

const postItemSchema = new Schema<IPostItem>({
    postId: mongoose.Schema.Types.ObjectId,
    content:{
        type:String,
        required:true
    },    
    author: String,
    aspectRatio: String,
},{timestamps:true});

const reelSchema = new Schema<IReel>({
    reelId: mongoose.Schema.Types.ObjectId,
    audioTrack: {
        track: String,
        coverPic: String
    },
    content:{
        type:String,
        required:true
    },
    aspectRatio: String,
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
    reel: [reelSchema],
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required:true
    }
}, { timestamps: true });

export const Post = mongoose.model<IPost>("Post", postSchema);
