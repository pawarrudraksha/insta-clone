import { commentOnPost, deleteComment, updateComment } from "../controllers/comment.controller";
import { Router } from "express";
import { verifyJWT } from "../middlewares/verifyJWT";

const router=Router()
router.route("/:postId").post(verifyJWT,commentOnPost)
router.route("/:commentId").delete(verifyJWT,deleteComment)
router.route("/:commentId").put(verifyJWT,updateComment)

export default router