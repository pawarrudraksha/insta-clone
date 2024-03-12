import { login, registerUser, sendOtp, verifyOtp } from "../controllers/authentication.controller"
import { Router } from "express";

const router=Router()
router.route('/register').post(registerUser)
router.route('/login').post(login)
router.route('/send-otp').post(sendOtp)
router.route('/verify-otp').post(verifyOtp)

export default router