import { getSavedPost } from "../controllers/savedPost.controller";
import { Router } from "express";

const router=Router()
router.route("/get").get(getSavedPost)

export default router