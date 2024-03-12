import { upload } from "../middlewares/multer.middleware";
import { addProfilePic } from "../controllers/user.controller";
import { Router } from "express";

const router=Router()
router.route('/add-profile-pic').post(upload.single("profilePic"),addProfilePic)

export default router