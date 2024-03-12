import { savePost, unsavePost } from "../controllers/savedPost.controller";
import { Router } from "express";

const router=Router()
router.route("/:postId").post(savePost)
router.route("/:postId").delete(unsavePost)

export default router