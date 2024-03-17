import mongoose, { Schema } from "mongoose";

interface IView{
    userId:Schema.Types.ObjectId,
    storyId:Schema.Types.ObjectId
}

const viewSchema=new Schema<IView>({
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    storyId:{
        type:Schema.Types.ObjectId,
        ref:"Story"
    }
},{timestamps:true})

export const View=mongoose.model("View",viewSchema)