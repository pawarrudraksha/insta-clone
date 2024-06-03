import { Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { IUser, User } from "../models/user.model";
import { Follow } from "../models/follow.model";
import { ApiResponse } from "../utils/ApiResponse";
import mongoose from "mongoose";

interface AuthenticatedRequest extends Request {
  user: IUser;
}

const followUser = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { requestedUserId } = req.params;
    if (!requestedUserId) {
      throw new ApiError(400, "To follow user his id is required");
    }
    const currentUser = req.user;
    if (!currentUser) {
      throw new ApiResponse(401, "User not logged in");
    }
    const isUser = await User.findById(requestedUserId);
    if (!isUser) {
      throw new ApiError(404, "Follow User Id not found");
    }
    const isFollowAlreadyExist = await Follow.findOne({
      userId: requestedUserId,
      follower: currentUser._id,
    });
    if (isFollowAlreadyExist) {
      throw new ApiError(400, "You already follow requested user");
    }
    let data: any = {
      userId: requestedUserId,
      follower: currentUser._id,
    };
    if (!isUser.isPrivate) {
      data.isRequestAccepted = true;
    }
    const follow = await Follow.create(data);
    const isFollow = await Follow.findById(follow._id);
    if (!isFollow) {
      throw new ApiError(500, "follow request failed");
    }
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          {},
          `${currentUser.username} has sent follow request to ${isUser.username}`
        )
      );
  }
);

const getFollowRequests = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 8;
    const skip = (page - 1) * limit;
    const user = req.user;
    if (!user) {
      throw new ApiResponse(401, "User not logged in");
    }
    const followRequests = await Follow.aggregate([
      {
        $match: {
          userId: user._id,
          isRequestAccepted: false,
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
        $lookup: {
          from: "users",
          localField: "follower",
          foreignField: "_id",
          as: "follower",
          pipeline: [
            {
              $project: {
                _id: 1,
                name: 1,
                username: 1,
                profilePic: 1,
              },
            },
          ],
        },
      },
      {
        $project: {
          follower: { $arrayElemAt: ["$follower", 0] },
          _id: 1,
          updatedAt: 1,
        },
      },
    ]);
    if (followRequests.length < 1) {
      return res
        .status(204)
        .json(new ApiResponse(204, {}, "No follow requests for user"));
    }
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          followRequests,
          "Follow requests fetched successfully"
        )
      );
  }
);

const getFollowers = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 8;
    const skip = (page - 1) * limit;
    const { requestedUserId } = req.params;
    if (!requestedUserId) {
      throw new ApiError(400, "User id required to get followers");
    }
    const currentUser = req.user;
    if (!currentUser) {
      throw new ApiError(401, "You need to be logged in to access followers");
    }
    const requestedUser = await User.findById(requestedUserId);
    if (!requestedUser) {
      throw new ApiError(404, "Requested user not found");
    }
    if (
      requestedUser.isPrivate &&
      requestedUser._id.toString() !== currentUser._id.toString()
    ) {
      throw new ApiError(401, "Cannot access followers of private account");
    }
    const followers = await Follow.aggregate([
      {
        $match: {
          userId: requestedUser._id,
          isRequestAccepted: true,
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
        $project: {
          follower: 1,
          _id: 1,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "follower",
          foreignField: "_id",
          as: "followerDetails",
        },
      },
      {
        $unwind: "$followerDetails",
      },
      {
        $lookup: {
          from: "stories",
          localField: "followerDetails._id",
          foreignField: "userId",
          as: "hasStory",
          pipeline: [
            {
              $match: {
                createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
              },
            },
          ],
        },
      },
      {
        $addFields: {
          "followerDetails.hasStory": {
            $cond: {
              if: { $gt: [{ $size: "$hasStory" }, 0] },
              then: true,
              else: false,
            },
          },
        },
      },
      {
        $project: {
          "followerDetails.profilePic": 1,
          "followerDetails.name": 1,
          "followerDetails.username": 1,
          "followerDetails.isPrivate": 1,
          "followerDetails.hasStory": 1,
          "followerDetails._id": 1,
        },
      },
    ]);
    if (followers.length < 1) {
      res.status(204).json(new ApiResponse(204, {}, "No followers for user"));
    }
    res
      .status(200)
      .json(new ApiResponse(200, followers, "Followers fetched successfully"));
  }
);

const getFollowing = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { requestedUserId } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 8;
    const skip = (page - 1) * limit;
    if (!requestedUserId) {
      throw new ApiError(400, "User id required to get following");
    }
    const currentUser = req.user;
    if (!currentUser) {
      throw new ApiError(401, "You need to be logged in to access following");
    }
    const requestedUser = await User.findById(requestedUserId);
    if (!requestedUser) {
      throw new ApiError(404, "Requested user not found");
    }
    if (
      requestedUser.isPrivate &&
      requestedUser._id.toString() !== currentUser._id.toString()
    ) {
      throw new ApiError(401, "Cannot access following of private account");
    }
    const following = await Follow.aggregate([
      {
        $match: {
          follower: requestedUser._id,
          isRequestAccepted: true,
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
        $project: {
          userId: 1,
          _id: 1,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "followingDetails",
        },
      },
      {
        $unwind: "$followingDetails",
      },
      {
        $lookup: {
          from: "stories",
          localField: "followingDetails._id",
          foreignField: "userId",
          as: "hasStory",
          pipeline: [
            {
              $match: {
                createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
              },
            },
          ],
        },
      },
      {
        $addFields: {
          "followingDetails.hasStory": {
            $cond: {
              if: { $gt: [{ $size: "$hasStory" }, 0] },
              then: true,
              else: false,
            },
          },
        },
      },
      {
        $project: {
          "followingDetails.profilePic": 1,
          "followingDetails.name": 1,
          "followingDetails.username": 1,
          "followingDetails.isPrivate": 1,
          "followingDetails._id": 1,
          "followingDetails.hasStory": 1,
        },
      },
    ]);
    if (following.length < 1) {
      res.status(204).json(new ApiResponse(204, {}, "No following for user"));
    }
    res
      .status(200)
      .json(new ApiResponse(200, following, "Followers fetched successfully"));
  }
);

const acceptFollowRequest = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { followDocId } = req.params;
    if (!followDocId) {
      throw new ApiError(400, "Id of follow document required");
    }
    const user = req.user;
    if (!user) {
      throw new ApiError(401, "user not logged  in");
    }
    const followDoc = await Follow.findById(followDocId);
    if (!followDoc) {
      throw new ApiError(404, "Follow doc not found");
    }
    if (followDoc.userId.toString() !== user._id.toString()) {
      throw new ApiError(401, "You dont have access to accept request");
    }
    if (followDoc.isRequestAccepted) {
      throw new ApiError(400, "Request is already accepted ");
    }
    const updatedFollowDoc = await Follow.findByIdAndUpdate(
      followDocId,
      {
        $set: {
          isRequestAccepted: true,
        },
      },
      {
        new: true,
      }
    );
    if (!updatedFollowDoc.isRequestAccepted) {
      throw new ApiError(500, "failed to accept follow request");
    }
    res.status(200).json(new ApiResponse(200, {}, "Follow request accepted"));
  }
);

const deleteFollowRequest = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { followDocId } = req.params;
    if (!followDocId) {
      throw new ApiError(400, "User not logged in");
    }
    const user = req.user;
    if (!user) {
      throw new ApiError(401, "User not logged in");
    }
    const followDoc = await Follow.findById(followDocId);
    if (!followDoc) {
      throw new ApiError(404, "Invalid request as no doc exist");
    }
    if (
      followDoc.userId.toString() !== user._id.toString() &&
      followDoc.follower.toString() !== user._id.toString()
    ) {
      throw new ApiError(401, "You dont have access delete follow request");
    }
    if (followDoc.isRequestAccepted) {
      throw new ApiError(400, "Request no longer exists ");
    }
    await Follow.findByIdAndDelete(followDocId);
    const isFollowDoc = await Follow.findById(followDocId);
    if (isFollowDoc) {
      throw new ApiError(500, "Failed to delete follow request");
    }
    res.status(200).json(new ApiResponse(200, {}, "Follow request deleted"));
  }
);

const unFollow = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { requestedUserId } = req.params;
    const user = req.user;
    if (!user) {
      throw new ApiError(401, "User not logged in");
    }
    const requestedUser = await User.findById(requestedUserId);
    if (!requestedUser) {
      throw new ApiError(404, "Requested user not found");
    }
    const followDoc = await Follow.findOne({
      follower: user._id,
      userId: requestedUserId,
      isRequestAccepted: true,
    });
    if (!followDoc) {
      throw new ApiError(404, "Invalid request as you dont follow user");
    }
    await Follow.findByIdAndDelete(followDoc._id);
    const isFollowDocExist = await Follow.findById(followDoc._id);
    if (isFollowDocExist) {
      throw new ApiError(500, "Failed to unfollow");
    }
    res.status(200).json(new ApiResponse(200, {}, "Unfollowed successfully"));
  }
);

const removeFollower = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { requestedUserId } = req.params;
    const user = req.user;
    if (!user) {
      throw new ApiError(401, "User not logged in");
    }
    const requestedUser = await User.findById(requestedUserId);
    if (!requestedUser) {
      throw new ApiError(404, "Requested user not found");
    }
    const followDoc = await Follow.findOne({
      follower: requestedUserId,
      userId: user._id,
    });
    if (!followDoc) {
      throw new ApiError(404, "Invalid request as you dont follow user");
    }
    await Follow.findByIdAndDelete(followDoc._id);
    const isFollowDocExist = await Follow.findById(followDoc._id);
    if (isFollowDocExist) {
      throw new ApiError(500, "Failed to remove follower");
    }
    res
      .status(200)
      .json(new ApiResponse(200, {}, "Removed follower successfully"));
  }
);

const checkIsFollowingDoc = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { requestedUserId } = req.params;
    if (!requestedUserId) {
      throw new ApiError(400, "Fields missing");
    }
    const user = req.user;
    if (!user) {
      throw new ApiError(401, "User not logged in");
    }
    const followDoc = await Follow.findOne({
      userId: requestedUserId,
      follower: user._id,
    });
    if (!followDoc) {
      return res
        .status(200)
        .json(new ApiResponse(204, {}, "follow doc not found "));
    }
    res
      .status(200)
      .json(new ApiResponse(200, followDoc, "follow doc fetched "));
  }
);

const checkIsFollowerDoc = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { requestedUserId } = req.params;
    if (!requestedUserId) {
      throw new ApiError(400, "Fields missing");
    }
    const user = req.user;
    if (!user) {
      throw new ApiError(401, "User not logged in");
    }
    const followDoc = await Follow.findOne({
      userId: user._id,
      follower: requestedUserId,
      isRequestAccepted: true,
    });
    if (!followDoc) {
      return res
        .status(200)
        .json(new ApiResponse(204, {}, "follow doc not found "));
    }
    res
      .status(200)
      .json(new ApiResponse(200, followDoc, "follow doc fetched "));
  }
);

export {
  followUser,
  unFollow,
  acceptFollowRequest,
  deleteFollowRequest,
  getFollowers,
  getFollowRequests,
  getFollowing,
  removeFollower,
  checkIsFollowerDoc,
  checkIsFollowingDoc,
};
