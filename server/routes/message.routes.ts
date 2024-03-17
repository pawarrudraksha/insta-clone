import { deleteMessage, editMessage, getChatMessages, getMessageById, sendMessage } from "../controllers/message.controller";
import { Router } from "express";
import { upload } from "../middlewares/multer.middleware";
import { verifyJWT } from "../middlewares/verifyJWT";

const router=Router()
router.use(verifyJWT)
router.route("/send").post(upload.single("message"),sendMessage)
router.route("/edit-message").put(editMessage)
router.route("/delete-message").delete(deleteMessage)
router.route("/get-chat-messages/:chatId").post(getChatMessages)
router.route("/get-message").post(getMessageById)

export default router