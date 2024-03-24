import { commentOnPost, deleteComment, getPostComments, getRepliesToComment, updateComment } from "../controllers/comment.controller";
import { Router } from "express";
import { verifyJWT } from "../middlewares/verifyJWT";

const router=Router()
router.route("/post-comment/:postId").post(verifyJWT,commentOnPost)
router.route("/:commentId").delete(verifyJWT,deleteComment).put(verifyJWT,updateComment)
router.route("/get-public-post-comments/:postId").get(getPostComments)
router.route("/get-private-post-comments/:postId").get(verifyJWT,getPostComments)
router.route("/get-replies/:commentId").get(verifyJWT,getRepliesToComment)

export default router