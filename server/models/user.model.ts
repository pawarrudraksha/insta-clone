import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
    username: string;
    email?: string;
    phoneNo?: string;
    profilePic: string;
    password: string;
    isPrivate?: boolean;
    bio?: string;
    gender?: "male" | "female" | "prefer not to say" | "custom";
    website?: string;
}

const userSchema = new Schema<IUser>({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
    },
    phoneNo: {
        type: String,
        unique: true,
        trim: true,
    },
    profilePic: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isPrivate: {
        type: Boolean,
        default: true
    },
    bio: {
        type: String,
    },
    gender: {
        type: String,
        enum: ["male", "female", "prefer not to say", "custom"],
        lowercase:true
    },
    website: {
        type: String
    }
}, { timestamps: true });

export const User = mongoose.model<IUser>("User", userSchema);
