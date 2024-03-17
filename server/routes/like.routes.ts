import { getAllLikes, likeAction} from "../controllers/like.controller";
import { Router } from "express";
import { verifyJWT } from "../middlewares/verifyJWT";

const router=Router()
router.route("/item").post(verifyJWT,likeAction)
router.route("/get-all-likes").post(verifyJWT,getAllLikes)

export default router