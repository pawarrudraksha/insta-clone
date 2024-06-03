import {
  createNotification,
  deleteNotificationById,
  deleteNotificationByPostId,
  getReceivedNotifications,
} from "../controllers/notification.controller";
import { Router } from "express";
import { verifyJWT } from "../middlewares/verifyJWT";

const router = Router();
router.use(verifyJWT);
router.route("/create").post(createNotification);
router.route("/get-all").get(getReceivedNotifications);
router.route("/delete/:notificationId").delete(deleteNotificationById);
router.route("/delete-by-postId/:postId").delete(deleteNotificationByPostId);

export default router;
