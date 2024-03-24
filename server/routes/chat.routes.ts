import { addUserToChat, createChat, deleteChat, updateGroupIcon, exitGroup, getChatInfo, removeUserFromChat } from "../controllers/chat.controller";
import { Router } from "express";
import { upload } from "../middlewares/multer.middleware";
import { verifyJWT } from "../middlewares/verifyJWT";

const router=Router()
router.use(verifyJWT)

router.route("/create").post(upload.single("groupIcon"),createChat)
router.route("/add-user").put(addUserToChat)
router.route("/remove-user").delete(removeUserFromChat)
router.route("/get-chat-info/:chatId").get(getChatInfo)
router.route("/exit-group/:chatId").delete(exitGroup)
router.route("/delete-chat/:chatId").delete(deleteChat)
router.route("/update-group-icon/:chatId").put(upload.single("groupIcon"),updateGroupIcon)
export default router