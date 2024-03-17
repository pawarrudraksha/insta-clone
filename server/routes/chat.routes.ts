import { addUserToChat, createChat, deleteChat, editGroupIcon, exitGroup, removeUserFromChat } from "../controllers/chat.controller";
import { Router } from "express";
import { upload } from "../middlewares/multer.middleware";
import { verifyJWT } from "../middlewares/verifyJWT";

const router=Router()
router.use(verifyJWT)

router.route("/create").post(upload.single("groupIcon"),createChat)
router.route("/add-user").post(addUserToChat)
router.route("/remove-user").post(removeUserFromChat)
router.route("/exit-group/:chatId").delete(exitGroup)
router.route("/delete-chat/:chatId").delete(deleteChat)
router.route("/edit-group-icon/:chatId").put(upload.single("groupIcon"),editGroupIcon)
export default router