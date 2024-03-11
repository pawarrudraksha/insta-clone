import { getComment } from "../controllers/comment.controller";
import { Router } from "express";

const router=Router()
router.route("/get").get(getComment)

export default router