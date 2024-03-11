import dotenv from 'dotenv'
import connectDB from './db/index'
import {app} from './app'
dotenv.config()

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 4000,()=>{
        console.log(`Server is running on PORT ${process.env.PORT}`);
        
    })
})
.catch((err)=>{
    console.log(err);
})