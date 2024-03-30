import { verifyJWT } from "../middlewares/verifyJWT";
import { addPostItemToPosts, createPost, editPostCaption, getAllPublicPosts, getAllPublicReels, getPostById, getPostsByUsername, getTaggedPosts, getUserFeed, getUserReels, removePostItemFromPosts, tagUser, untagUser } from "../controllers/post.controller";
import { Router } from "express";

const router=Router()
router.route("/create").post(verifyJWT,createPost)
router.route("/edit-post-caption").post(verifyJWT,editPostCaption)
router.route("/get-post/:postId").get(getPostById)
router.route("/add-postItem-to-post").put(verifyJWT,addPostItemToPosts)
router.route("/tag-user").put(verifyJWT,tagUser)
router.route("/remove-postItem-from-post").delete(verifyJWT,removePostItemFromPosts)
router.route("/untag-user").delete(verifyJWT,untagUser)
router.route("/get-private-post/:postId").get(verifyJWT,getPostById)
router.route("/get-all-reels").get(getAllPublicReels)
router.route("/get-user-feed").get(verifyJWT,getUserFeed)
router.route("/get-posts/:username").get(getPostsByUsername)
router.route("/get-posts-private-user/:username").get(verifyJWT,getPostsByUsername)
router.route("/get-all-public-posts").get(getAllPublicPosts)
router.route("/get-tagged-posts/:username").get(verifyJWT,getTaggedPosts)
router.route("/get-private-user-reels/:username").get(verifyJWT,getUserReels)
router.route("/get-public-user-reels/:username").get(getUserReels)

export default router