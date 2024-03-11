import mongoose, { Schema, Document } from "mongoose";

interface IHighlight extends Document {
    stories: Schema.Types.ObjectId[];
    caption: string;
}

const HighlightSchema = new Schema<IHighlight>({
    stories: {
        type: [Schema.Types.ObjectId],
        required: true
    },
    caption: {
        type: String,
        required: true
    }
}, { timestamps: true });

export const Highlight = mongoose.model<IHighlight>("Highlight", HighlightSchema);
