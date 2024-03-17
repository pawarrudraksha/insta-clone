import { verifyJWT } from "../middlewares/verifyJWT";
import { getAllSavedPosts, savePost, unsavePost } from "../controllers/savedPost.controller";
import { Router } from "express";

const router=Router()
router.use(verifyJWT)
router.route("/:postId").post(savePost).delete(unsavePost)
router.route("/get-saved").get(getAllSavedPosts)

export default router