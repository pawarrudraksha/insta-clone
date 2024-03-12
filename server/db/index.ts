import dotenv from  'dotenv'
dotenv.config()
import mongoose from "mongoose";
import { DB_NAME } from "../constants";

const connectDB=async()=>{    
    try {
        const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`Mongoose connected, DB host: ${connectionInstance.connection.host}`);
    } catch (error) {   
        console.error(error);
        process.exit(1)
    }
}

export default connectDB;