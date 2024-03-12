import { getNotification } from "../../controllers/notused/notification.controller";
import { Router } from "express";

const router=Router()
router.route("/get").get(getNotification)

export default router