import { getChat } from "../controllers/chat.controller";
import { Router } from "express";

const router=Router()
router.route("/getChat").post(getChat)
export default router