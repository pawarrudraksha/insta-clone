import { IUser, User } from "../models/user.model";
import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { Story } from "../models/story.model";
import { ApiResponse } from "../utils/ApiResponse";
import { Follow } from "../models/follow.model";
import mongoose from "mongoose";

interface AuthenticatedRequest extends Request {
  user: IUser;
}

const createStory = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { content, caption } = req.body;
    if (!content) {
      throw new ApiError(400, "Story is required to post");
    }
    const user = req.user;
    if (!user) {
      throw new ApiError(401, "Login required to post");
    }
    const story = await Story.create({
      content,
      caption,
      userId: user._id,
    });
    const isStoryPosted = await Story.findById(story._id);
    if (!isStoryPosted) {
      throw new ApiError(500, "Failed to post story");
    }
    res
      .status(200)
      .json(new ApiResponse(201, story, "Story posted successfully"));
  }
);

const deleteStory = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { storyId } = req.params;
    if (!storyId) {
      throw new ApiError(400, "story id is required");
    }
    const user = req.user;
    if (!user) {
      throw new ApiError(401, "Login required to delete story");
    }
    const story = await Story.findById(storyId);
    if (!story) {
      throw new ApiError(400, "story does not exist");
    }
    if (story.userId.toString() !== user._id.toString()) {
      throw new ApiError(401, "unauthorized delete story request");
    }
    await Story.findByIdAndDelete(storyId);
    const isStoryDeleted = await Story.findById(storyId);
    if (isStoryDeleted) {
      throw new ApiError(500, "failed to delete story");
    }
    res
      .status(200)
      .json(new ApiResponse(200, {}, "Story deleted successfully"));
  }
);

const getUserActiveStories = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { requestedUserId } = req.params;
    if (!requestedUserId) {
      throw new ApiError(401, "Request user id needed");
    }
    const user = req.user;
    if (!user) {
      throw new ApiError(401, "User not logged in");
    }
    const requestedUser = await User.findById(requestedUserId).select({
      isPrivate: 1,
      profilePic: 1,
      username: 1,
    });
    if (!requestedUser) {
      throw new ApiError(404, "Requested user not found");
    }
    const isUserFollowRequestedUser = await Follow.findOne({
      userId: requestedUserId,
      follower: user._id,
      isRequestAccepted: true,
    });
    if (requestedUser.isPrivate && !isUserFollowRequestedUser) {
      throw new ApiError(
        404,
        "User does  not have access to private account content"
      );
    }
    const activeStories = await Story.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(requestedUserId),
          createdAt: {
            $gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
          },
        },
      },
      {
        $sort: {
          updatedAt: 1,
        },
      },
      {
        $project: {
          _id: 1,
          content: 1,
          caption: 1,
          updatedAt: 1,
        },
      },
    ]);
    if (!activeStories || activeStories.length < 1) {
      return res
        .status(204)
        .json(new ApiResponse(204, {}, "No available data"));
    }
    const mergedResult = {
      activeStories,
      userInfo: requestedUser,
    };
    res
      .status(200)
      .json(new ApiResponse(200, mergedResult, "Stories fetched successfully"));
  }
);

const getSelfStories = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const user = req.user;
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 8);
    const skip = (page - 1) * limit;
    if (!user) {
      throw new ApiError(401, "User not logged in");
    }
    const stories = await Story.aggregate([
      {
        $match: {
          userId: user._id,
        },
      },
      {
        $sort: {
          updatedAt: -1,
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
      {
        $project: {
          content: 1,
          updatedAt: 1,
        },
      },
    ]);
    if (!stories || stories?.length === 0) {
      return res.status(204);
    }
    res
      .status(200)
      .json(new ApiResponse(200, stories, "Stories fetched successfully"));
  }
);
const getAllFollowingStories = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const user = req.user;
    if (!user) {
      throw new ApiError(400, "User needs to be logged in");
    }
    const page = req.query.page || 1;
    const limit = req.query.limit || 9;
    const skip = (Number(page) - 1) * Number(limit);
    const stories = await Follow.aggregate([
      {
        $match: {
          follower: user._id,
          isRequestAccepted: true,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $project: {
          userId: 1,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userInfo",
          pipeline: [
            {
              $project: {
                profilePic: 1,
                username: 1,
                _id: 1,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "stories",
          localField: "userId",
          foreignField: "userId",
          as: "stories",
          pipeline: [
            {
              $match: {
                createdAt: {
                  $gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
                },
              },
            },
            {
              $sort: {
                updatedAt: -1,
              },
            },
            {
              $skip: skip,
            },
            {
              $limit: Number(limit),
            },
            {
              $project: {
                updatedAt: 1,
                caption: 1,
                content: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: "$stories",
      },
      {
        $lookup: {
          from: "views",
          localField: "stories._id",
          foreignField: "storyId",
          as: "storyView",
          pipeline: [
            {
              $match: {
                userId: user._id,
              },
            },
          ],
        },
      },
      {
        $project: {
          userInfo: { $arrayElemAt: ["$userInfo", 0] },
          stories: 1,
          isStoryViewed: {
            $cond: {
              if: { $eq: [{ $size: "$storyView" }, 0] },
              then: false,
              else: true,
            },
          },
        },
      },
      {
        $group: {
          _id: "$userInfo._id",
          username: { $first: "$userInfo.username" },
          stories: {
            $push: {
              story: "$stories",
              isStoryViewed: "$isStoryViewed",
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          username: 1,
          firstStory: {
            $arrayElemAt: ["$stories.story", 0],
          },
          areAllStoriesViewed: {
            $cond: {
              if: {
                $gt: [
                  {
                    $size: {
                      $filter: {
                        input: "$stories",
                        cond: { $eq: ["$$this.isStoryViewed", false] },
                      },
                    },
                  },
                  0,
                ],
              },
              then: false,
              else: true,
            },
          },
        },
      },
    ]);

    const selfStory = await Story.aggregate([
      {
        $match: {
          userId: user._id,
          createdAt: {
            $gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
          },
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $limit: 1,
      },
      {
        $project: {
          _id: 1,
          content: 1,
          caption: 1,
          updatedAt: 1,
        },
      },
    ]);

    let updatedSelfStory;
    if (selfStory) {
      updatedSelfStory = {
        _id: user?._id,
        firstStory: selfStory[0],
        username: user?.username,
        areAllStoriesViewed: false,
        profilePic: user?.profilePic,
      };
    }
    if (stories.length < 1) {
      return res
        .status(204)
        .json(new ApiResponse(204, {}, "No available data"));
    }
    if (selfStory?.length > 0) {
      res
        .status(200)
        .json(
          new ApiResponse(
            200,
            [updatedSelfStory, ...stories],
            "Stories fetched successfully"
          )
        );
    } else {
      res
        .status(200)
        .json(new ApiResponse(200, stories, "Stories fetched successfully"));
    }
  }
);

const getStoryById = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { storyId } = req.params;
    if (!storyId) {
      throw new ApiError(400, "Story id required");
    }
    const user = req.user;
    if (!user) {
      throw new ApiError(401, "User not logged in");
    }
    const isStory = await Story.findById(storyId);
    if (!isStory) {
      throw new ApiError(404, "Story not found");
    }
    const isFollow = await Follow.findOne({
      userId: isStory.userId,
      follower: user._id,
      isRequestAccepted: true,
    });

    if (isStory.userId.toString() !== user._id.toString() && !isFollow) {
      throw new ApiError(401, "Access denied");
    }
    const story = await Story.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(storyId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userInfo",
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
        $addFields: {
          userInfo: { $arrayElemAt: ["$userInfo", 0] },
        },
      },
      {
        $project: {
          _id: 1,
          content: 1,
          caption: 1,
          userInfo: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);
    if (!story) {
      throw new ApiError(500, "Unable to process request");
    }
    res
      .status(200)
      .json(new ApiResponse(200, story, "Story fetched successfully"));
  }
);

export {
  createStory,
  deleteStory,
  getUserActiveStories,
  getAllFollowingStories,
  getStoryById,
  getSelfStories,
};
