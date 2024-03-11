import { getPost } from "../controllers/post.controller";
import { Router } from "express";

const router=Router()
router.route("/get").get(getPost)

export default router