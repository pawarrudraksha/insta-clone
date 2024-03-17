import { commentOnPost, deleteComment, getPostComments, updateComment } from "../controllers/comment.controller";
import { Router } from "express";
import { verifyJWT } from "../middlewares/verifyJWT";

const router=Router()
router.route("/post-comment/:postId").post(verifyJWT,commentOnPost)
router.route("/:commentId").delete(verifyJWT,deleteComment).put(verifyJWT,updateComment)
router.route("/get-post-comments/:postId").get(getPostComments)

export default router