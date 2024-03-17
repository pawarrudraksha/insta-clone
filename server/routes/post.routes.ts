import { verifyJWT } from "../middlewares/verifyJWT";
import { createPost, getAllPublicPosts, getAllPublicReels, getPostsByPrivateUsername, getPostsByPublicUsername, getPrivateUserReels, getPublicUserReels, getTaggedPosts, getUserFeed } from "../controllers/post.controller";
import { Router } from "express";

const router=Router()
router.route("/create").post(verifyJWT,createPost)
router.route("/get-posts/:username").get(getPostsByPublicUsername)
router.route("/get-posts-private-user/:username").get(verifyJWT,getPostsByPrivateUsername)
router.route("/get-all-public-posts").get(getAllPublicPosts)
router.route("/get-tagged-posts/:username").get(verifyJWT,getTaggedPosts)
router.route("/get-user-feed").get(verifyJWT,getUserFeed)
router.route("get-reels-private-user").get(verifyJWT,getPrivateUserReels)
router.route("get-reels-public-user").get(getPublicUserReels)
router.route("get-all-reels").get(getAllPublicReels)

export default router