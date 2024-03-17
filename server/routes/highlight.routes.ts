import { addStoryToHighlight, createHighlight, deleteHighlight, getHighlightById, getPrivateUserHighlightsCoverPic, getPublicUserHighlightsCoverPics, removeStoryFromHighlight, updateHighlight } from "../controllers/highlight.controller";
import { Router } from "express";
import { verifyJWT } from "../middlewares/verifyJWT";

const router=Router()
router.route("/create").post(verifyJWT,createHighlight)
router.route("/add-story").post(verifyJWT,addStoryToHighlight)
router.route("/update-highlight").put(verifyJWT,updateHighlight)
router.route("/remove-story").delete(verifyJWT,removeStoryFromHighlight)
router.route("/get/:highlightId").get(verifyJWT,getHighlightById)
router.route("/delete/:highlightId").delete(verifyJWT,deleteHighlight)
router.route("/public/get-highlights/:username").get(getPublicUserHighlightsCoverPics)
router.route("/private/get-highlights/:username").get(verifyJWT,getPrivateUserHighlightsCoverPic)

export default router