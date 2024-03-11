import { getHighlight } from "../controllers/highlight.controller";
import { Router } from "express";

const router=Router()
router.route("/get").get(getHighlight)

export default router