import { IUser, User } from "../models/user.model";
import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { Chat } from "../models/chat.model";
import { Message } from "../models/message.model";
import { ApiResponse } from "../utils/ApiResponse";
import { uploadOnCloudinary } from "../utils/cloudinary";
import mongoose from "mongoose";
import { Post } from "../models/post.model";
import { Follow } from "../models/follow.model";

interface AuthenticatedRequest extends Request {
  user: IUser;
}
const sendTextMessage = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { message, toReplyMessage, chatId } = req.body;
    if (!message.type || !message.content || !chatId) {
      throw new ApiError(400, "All fields are required");
    }
    const user = req.user;
    if (!user) {
      throw new ApiError(401, "user must be logged in");
    }
    const chat = await Chat.findById(chatId);
    if (!chat) {
      throw new ApiError(404, "Chat not found");
    }
    if (!chat.users.includes(user._id)) {
      throw new ApiError(401, "User not part of given chat");
    }
    const msg = await Message.create({
      message,
      chatId,
      senderId: user._id,
      toReplyMessage,
    });
    if (!msg) {
      throw new ApiError(500, "failed to send message");
    }
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        $set: {
          latestMessage: msg._id,
        },
      },
      {
        new: true,
      }
    );
    if (updatedChat.latestMessage.toString() !== msg._id.toString()) {
      throw new ApiError(500, "failed to update latest chat message");
    }
    res
      .status(201)
      .json(
        new ApiResponse(201, { messageId: msg?._id }, "Msg sent successfully")
      );
  }
);

const sendPost = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { messageType, toReplyMessage, chatId } = req.body;
    if (!messageType || !chatId) {
      throw new ApiError(400, "All fields are required");
    }
    const user = req.user;
    if (!user) {
      throw new ApiError(401, "user must be logged in");
    }
    const chat = await Chat.findById(chatId);
    if (!chat) {
      throw new ApiError(404, "Chat not found");
    }
    if (!chat.users.includes(user._id)) {
      throw new ApiError(401, "User not part of given chat");
    }
    const messagePath = req.file.path;
    if (!messagePath) {
      throw new ApiError(400, "message path is required");
    }
    const response = await uploadOnCloudinary(messagePath);
    if (!response) {
      throw new ApiError(500, "Upload message failed");
    }

    const msg = await Message.create({
      message: {
        type: messageType,
        content: response.url,
      },
      chatId,
      senderId: user._id,
      toReplyMessage,
    });
    if (!msg) {
      throw new ApiError(500, "failed to send message");
    }
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        $set: {
          latestMessage: msg._id,
        },
      },
      {
        new: true,
      }
    );
    if (updatedChat.latestMessage.toString() !== msg._id.toString()) {
      throw new ApiError(500, "failed to update latest chat message");
    }
    res.status(201).json(new ApiResponse(201, {}, "Msg sent successfully"));
  }
);

const sharePostOrReel = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { postId, chatId } = req.body;
    if (!postId || !chatId) {
      throw new ApiError(400, "all fields required");
    }
    const user = req.user;
    if (!user) {
      throw new ApiError(401, "User not logged in");
    }

    const isPost = await Post.findById(postId);
    if (!isPost) {
      throw new ApiError(404, "post not found");
    }
    const postOwner = await User.findById(isPost?.userId);
    if (
      postOwner?.isPrivate &&
      user?._id.toString() !== postOwner._id.toString()
    ) {
      const isFollow = await Follow.findOne({
        userId: postOwner?._id,
        follower: user?._id,
      });
      if (!isFollow) {
        throw new ApiError(401, "Unauthorized request");
      }
    }
    const isChat = await Chat.findById(chatId);
    if (!isChat) {
      throw new ApiError(404, "Chat does not exist");
    }
    const message = await Message.create({
      message: {
        type: isPost?.posts[0]?.content?.type,
        content: isPost?.posts[0]?.content?.url,
        _id: isPost?._id,
      },
      chatId: chatId,
      senderId: user?._id,
    });
    if (!message) {
      throw new ApiError(500, "Failed to share post");
    }
    res.status(201).json(new ApiResponse(201, {}, "message sent successfully"));
  }
);

const editMessage = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { text, chatId, messageId } = req.body;
    if (!messageId || !chatId || !text) {
      throw new ApiError(400, "All fields are required");
    }
    const user = req.user;
    if (!user) {
      throw new ApiError(401, "User must be logged in");
    }
    const chat = await Chat.findById(chatId);
    if (!chat) {
      throw new ApiError(404, "Chat not found");
    }
    if (!chat.users.includes(user._id)) {
      throw new ApiError(401, "User not part of given chat");
    }
    const message = await Message.findById(messageId);
    if (!message) {
      throw new ApiError(404, "Message not found");
    }
    if (message.message.type !== "text") {
      throw new ApiError(400, "Only text messages can be updated");
    }
    if (message.senderId.toString() !== user._id.toString()) {
      throw new ApiError(401, "User can only delete his own message");
    }
    const updatedMsg = await Message.findByIdAndUpdate(
      message._id,
      {
        $set: {
          "message.content": text,
        },
      },
      {
        new: true,
      }
    );
    if (updatedMsg.message.content !== text) {
      throw new ApiError(500, "Failed to edit message");
    }
    res
      .status(200)
      .json(new ApiResponse(200, updatedMsg, "Message edited successfully"));
  }
);

const deleteMessage = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { messageId, chatId } = req.query;
    if (!messageId || !chatId) {
      throw new ApiError(400, "All fields are required");
    }
    const user = req.user;
    if (!user) {
      throw new ApiError(401, "User must be logged in");
    }
    const chat = await Chat.findById(chatId);
    if (!chat) {
      throw new ApiError(404, "Chat not found");
    }
    if (!chat.users.includes(user._id)) {
      throw new ApiError(401, "User not part of given chat");
    }
    const message = await Message.findById(messageId);
    if (!message) {
      throw new ApiError(404, "Message not found");
    }
    if (message.senderId.toString() !== user._id.toString()) {
      throw new ApiError(401, "User can only delete his own message");
    }
    await Message.findByIdAndDelete(messageId);
    const isMsg = await Message.findById(messageId);
    if (isMsg) {
      throw new ApiError(500, "failed to delete message");
    }
    res
      .status(200)
      .json(new ApiResponse(200, {}, "Message delete successfully"));
  }
);

const getChatMessages = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { chatId } = req.params;
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 15);
    const skip = (page - 1) * limit;
    if (!chatId) {
      throw new ApiResponse(400, "ChatId is required");
    }
    const user = req.user;
    if (!user) {
      throw new ApiResponse(400, "User needs to be logged in");
    }
    const chat = await Chat.findById(chatId);
    if (!chat) {
      throw new ApiError(404, "Chat not found");
    }
    if (!chat.users.includes(user._id)) {
      throw new ApiError(401, "User not part of chat");
    }
    // const messages = await Message.find({ chatId }).sort({ updatedAt: -1 }).skip(skip).limit(limit);
    const messages = await Message.aggregate([
      {
        $match: {
          chatId: new mongoose.Types.ObjectId(chatId),
        },
      },
      {
        $sort: {
          updatedAt: 1,
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
      {
        $lookup: {
          from: "users",
          localField: "senderId",
          foreignField: "_id",
          as: "senderInfo",
          pipeline: [
            {
              $project: {
                username: 1,
                profilePic: 1,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "messages",
          localField: "toReplyMessage",
          foreignField: "_id",
          as: "toReplyMessage",
          pipeline: [
            {
              $project: {
                message: 1,
              },
            },
          ],
        },
      },
      {
        $project: {
          message: 1,
          senderInfo: { $arrayElemAt: ["$senderInfo", 0] },
          updatedAt: 1,
          toReplyMessage: { $arrayElemAt: ["$toReplyMessage", 0] },
        },
      },
    ]);
    if (messages.length < 1) {
      return res
        .status(204)
        .json(new ApiResponse(204, {}, "No messages for chat"));
    }
    res
      .status(200)
      .json(new ApiResponse(200, messages, "Messages fetched successfully"));
  }
);

const getMessageById = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { chatId, messageId } = req.query;
    if (!chatId || !messageId) {
      throw new ApiError(400, "All fields are required");
    }
    const user = req.user;
    if (!user) {
      throw new ApiError(401, "User needs to be logged in");
    }
    const chat = await Chat.findById(chatId);
    if (!chat) {
      throw new ApiError(404, "Chat not found");
    }
    if (!chat.users.includes(user._id)) {
      throw new ApiError(401, "User not part of chat");
    }
    const message = await Message.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(messageId.toString()),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "senderId",
          foreignField: "_id",
          as: "senderInfo",
          pipeline: [
            {
              $project: {
                _id: 1,
                username: 1,
              },
            },
          ],
        },
      },
      {
        $project: {
          senderInfo: { $arrayElemAt: ["$senderInfo", 0] },
        },
      },
    ]);

    if (!message) {
      throw new ApiError(404, "Message not found");
    }
    res
      .status(200)
      .json(new ApiResponse(200, message[0], "Message fetched successfully"));
  }
);

// const getRequestedChats=asyncHandler(async(req:AuthenticatedRequest,res:Response)=>{
//     const user=req.user
// })
export {
  sendTextMessage,
  sendPost,
  editMessage,
  deleteMessage,
  getChatMessages,
  getMessageById,
  sharePostOrReel,
};
