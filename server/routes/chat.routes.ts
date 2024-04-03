import { addUserToChat, createChat, deleteChat, exitGroup, findChat, getChatInfo, getUserChats, removeUserFromChat } from "../controllers/chat.controller";
import { Router } from "express";
import { upload } from "../middlewares/multer.middleware";
import { verifyJWT } from "../middlewares/verifyJWT";

const router=Router()
router.use(verifyJWT)

router.route("/create").post(createChat)
router.route("/add-user").put(addUserToChat)
router.route("/remove-user").delete(removeUserFromChat)
router.route("/get-chat-info/:chatId").get(getChatInfo)
router.route("/get-user-chats").get(getUserChats)
router.route("/exit-group/:chatId").delete(exitGroup)
router.route("/delete-chat/:chatId").delete(deleteChat)
router.route("/find-chat/:requestedUserId").get(findChat)
export default router