import { deleteMessage, editMessage, getChatMessages, getMessageById, sendPost, sendTextMessage, sharePostOrReel } from "../controllers/message.controller";
import { Router } from "express";
import { upload } from "../middlewares/multer.middleware";
import { verifyJWT } from "../middlewares/verifyJWT";

const router=Router()
router.use(verifyJWT)

router.route("/send-post").post(upload.single("messageContent"),sendPost)
router.route("/share-post").post(sharePostOrReel)
router.route("/send-text").post(sendTextMessage)
router.route("/edit-text").put(editMessage)
router.route("/delete-message").delete(deleteMessage)
router.route("/get-chat-messages/:chatId").get(getChatMessages)
router.route("/get-message").get(getMessageById)

export default router