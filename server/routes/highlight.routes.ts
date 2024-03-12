import { addStoryToHighlight, createHighlight, deleteHighlight, removeStoryFromHighlight } from "../controllers/highlight.controller";
import { Router } from "express";
import { verifyJWT } from "../middlewares/verifyJWT";

const router=Router()
router.use(verifyJWT)
router.route("/create").post(createHighlight)
router.route("/:highlightId").delete(deleteHighlight)
router.route("/add-story").post(addStoryToHighlight)
router.route("/remove-story").delete(removeStoryFromHighlight)

export default router