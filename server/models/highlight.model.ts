import mongoose, { Schema, Document } from "mongoose";

interface IHighlight extends Document {
    stories: Schema.Types.ObjectId[]; 
    caption: string;
    coverPic: string;
    userId: Schema.Types.ObjectId
}

const HighlightSchema = new Schema<IHighlight>({
    stories: [{
        type: Schema.Types.ObjectId,
        ref: 'Story' 
    }],
    caption: {
        type: String,
        required: true
    },
    coverPic:{
        type:String,
        required:true
    },
    userId:{
        type: Schema.Types.ObjectId,
        ref:"User"
    }
}, { timestamps: true });


export const Highlight = mongoose.model<IHighlight>("Highlight", HighlightSchema);
