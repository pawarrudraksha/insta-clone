import { getMessage } from "../controllers/message.controller";
import { Router } from "express";

const router=Router()
router.route("/get").get(getMessage)

export default router