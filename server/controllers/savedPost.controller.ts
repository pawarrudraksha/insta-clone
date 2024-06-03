import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { IUser, User } from "../models/user.model";
import { Post } from "../models/post.model";
import { SavedPost } from "../models/savedPost.model";
import { ApiResponse } from "../utils/ApiResponse";
import mongoose from "mongoose";
import { Follow } from "../models/follow.model";

interface AuthenticatedRequest extends Request {
  user: IUser;
}

const savePost = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { postId } = req.params;
    if (!postId) {
      throw new ApiError(400, "Post id is required");
    }
    const user = req.user;
    if (!user) {
      throw new ApiError(401, "unauthorized request");
    }
    const post = await Post.findById(postId);
    if (!post) {
      throw new ApiError(400, "post does not exist");
    }
    const postOwner = await User.findById(post.userId);
    if (!postOwner) {
      throw new ApiError(400, "Post owner does not exist");
    }
    const isFollow = await Follow.findOne({
      userId: postOwner._id,
      follower: user._id,
      isRequestAccepted: true,
    });
    if (postOwner.isPrivate && !isFollow) {
      throw new ApiError(401, "access denied");
    }
    const isPostAlreadySaved = await SavedPost.findOne({
      savedPostId: postId,
      userId: user._id,
    });
    if (isPostAlreadySaved) {
      throw new ApiError(400, "Post is already saved");
    }
    const savedPost = await SavedPost.create({
      savedPostId: postId,
      userId: user._id,
    });
    const isPostSaved = await SavedPost.findById(savedPost._id);
    if (!isPostSaved) {
      throw new ApiError(500, "Failed to save post");
    }
    res.status(201).json(new ApiResponse(201, isPostSaved, "Saved post"));
  }
);

const unsavePost = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { postId } = req.params;
    if (!postId) {
      throw new ApiError(400, "Post id is required");
    }
    const user = req.user;
    if (!user) {
      throw new ApiError(401, "unauthorized request");
    }
    const post = await Post.findById(postId);
    if (!post) {
      throw new ApiError(400, "post does not exist");
    }
    const isPostSaved = await SavedPost.findOne({
      savedPostId: postId,
      userId: user._id,
    });
    if (!isPostSaved) {
      throw new ApiError(400, "post is not saved");
    }
    await SavedPost.findByIdAndDelete(isPostSaved._id);
    const isPostUnsaved = await SavedPost.findById(isPostSaved._id);
    if (isPostUnsaved) {
      throw new ApiError(500, "Failed to unsave post");
    }
    res.status(201).json(new ApiResponse(201, {}, "Unsaved post"));
  }
);

const getAllSavedPosts = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const user = req.user;
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 6);
    const skip = (page - 1) * limit;

    if (!user) {
      throw new ApiError(401, "User is not logged in");
    }

    const savedPosts = await SavedPost.aggregate([
      {
        $match: {
          userId: user._id,
        },
      },
      {
        $sort: {
          createdAt: -1,
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
          from: "posts",
          localField: "savedPostId",
          foreignField: "_id",
          as: "postDetails",
          pipeline: [
            {
              $project: {
                isStandAlone: 1,
                posts: { $arrayElemAt: ["$posts.content", 0] },
                isHideLikesAndViews: 1,
                _id: 1,
                isCommentsOff: 1,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "likes",
          localField: "postDetails._id",
          foreignField: "postId",
          as: "likes",
        },
      },

      {
        $addFields: {
          noOfLikes: { $size: "$likes" },
        },
      },
      {
        $lookup: {
          from: "comments",
          localField: "postDetails._id",
          foreignField: "postId",
          as: "comments",
        },
      },
      {
        $addFields: {
          noOfComments: { $size: "$comments" },
        },
      },
      {
        $project: {
          _id: "$postDetails._id",
          updatedAt: 1,
          post: { $arrayElemAt: ["$postDetails.posts", 0] },
          noOfLikes: 1,
          noOfComments: 1,
          isCommentsOff: { $arrayElemAt: ["$postDetails.isCommentsOff", 0] },
          isHideLikesAndViews: {
            $arrayElemAt: ["$postDetails.isHideLikesAndViews", 0],
          },
          isStandAlone: { $arrayElemAt: ["$postDetails.isStandAlone", 0] },
        },
      },
    ]);

    if (savedPosts.length < 1) {
      return res
        .status(204)
        .json(new ApiResponse(204, {}, "User does not have any saved posts"));
    }

    res
      .status(200)
      .json(
        new ApiResponse(200, savedPosts, "Saved posts fetched successfully")
      );
  }
);

export { savePost, unsavePost, getAllSavedPosts };
