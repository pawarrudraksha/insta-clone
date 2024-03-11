import { getLike } from "../controllers/like.controller";
import { Router } from "express";

const router=Router()
router.route("/get").get(getLike)

export default router