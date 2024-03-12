import { verifyJWT } from "../middlewares/verifyJWT";
import { createPost } from "../controllers/post.controller";
import { Router } from "express";

const router=Router()
router.route("/create").post(verifyJWT,createPost)

export default router