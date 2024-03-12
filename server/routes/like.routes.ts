import { likePost, unlikePost ,likeComment, unlikeComment, likeStory, unlikeStory} from "../controllers/like.controller";
import { Router } from "express";
import { verifyJWT } from "../middlewares/verifyJWT";

const router=Router()
router.route("/likePost:postId").post(verifyJWT,likePost)
router.route("/unlikePost:postId").post(verifyJWT,unlikePost)
router.route("/likeComment:commentId").post(verifyJWT,likeComment)
router.route("/unlikeComment:commentId").post(verifyJWT,unlikeComment)
router.route("/likeStory:storyId").post(verifyJWT,likeStory)
router.route("/unlikeStory:storyId").post(verifyJWT,unlikeStory)

export default router