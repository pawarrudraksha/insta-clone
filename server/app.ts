import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
dotenv.config()

const app=express()
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

import userRouter from './routes/user.routes'
import commentRouter from './routes/comment.routes'
import highlightRouter from './routes/highlight.routes'
import likeRouter from './routes/like.routes'
import messageRouter from './routes/message.routes'
import notificationRouter from './routes/notification.routes'
import postRouter from './routes/post.routes'
import savedPostRouter from './routes/savedPost.routes'
import chatRouter from './routes/chat.routes'
app.use('/api/v1/users',userRouter)
app.use('/api/v1/comments',commentRouter)
app.use('/api/v1/highlights',highlightRouter)
app.use('/api/v1/like',likeRouter)
app.use('/api/v1/messages',messageRouter)
app.use('/api/v1/post',postRouter)
app.use('/api/v1/savedPost',savedPostRouter)
app.use('/api/v1/notifications',notificationRouter)
app.use('/api/v1/chat',chatRouter)
export {app}