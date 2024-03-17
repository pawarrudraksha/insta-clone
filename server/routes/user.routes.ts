import { upload } from "../middlewares/multer.middleware";
import { addProfilePic, changePassword, deleteUser, getUserInfoByUsername, searchUsers, updateProfile } from "../controllers/user.controller";
import { Router } from "express";
import { verifyJWT } from "../middlewares/verifyJWT";

const router=Router()
router.route('/add-profile-pic').post(verifyJWT,upload.single("profilePic"),addProfilePic)
router.route('/delete').delete(verifyJWT,deleteUser)
router.route('/update-profile').put(verifyJWT,updateProfile)
router.route('/get-user-info/:username').get(getUserInfoByUsername)
router.route('/change-password').post(verifyJWT,changePassword)
router.route('/search').get(verifyJWT,searchUsers)

export default router