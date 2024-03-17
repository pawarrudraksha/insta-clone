import mongoose, { Schema, Document } from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export interface IUser extends Document {
    username: string;
    email?: string;
    profilePic: string;
    password: string;
    dob:string;
    isPrivate?: boolean;
    bio?: string;
    gender?: "male" | "female" | "prefer not to say" | "custom";
    website?: string;
    name: string;
    otp:string;
    refreshToken:string;
    generateAccessToken: () => Promise<string>;
    generateRefreshToken: () => Promise<string>;
    isPasswordCorrect: (password: string) => Promise<boolean>;
}

const userSchema = new Schema<IUser>({
    username: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    name: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
    },
    profilePic: {
        type: String,
    },
    password: {
        type: String,
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
    dob:{
        type:String,
    },
    website: {
        type: String
    },
    otp:{
        type:String
    },
    refreshToken:{
        type:String
    }
}, { timestamps: true });

userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next()
    this.password=await bcrypt.hash(this.password,10)
    next()
})

userSchema.methods.isPasswordCorrect=async function(password:string){
    console.log("password",password);
    
    return await bcrypt.compare(password,this.password)
}
userSchema.methods.generateAccessToken=async function () {
    return jwt.sign(
        {
            _id:this.id
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken=async function () {
    return jwt.sign(
        {
            _id:this.id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}
export const User = mongoose.model<IUser>("User", userSchema);
