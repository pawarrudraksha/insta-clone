import { Router } from "express";
import { verifyJWT } from "middlewares/verifyJWT";

const router=Router()
router.use(verifyJWT)
export default router