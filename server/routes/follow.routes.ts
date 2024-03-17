import { acceptFollowRequest, deleteFollowRequest, followUser, getFollowRequests, getFollowers, getFollowing, removeFollower, unFollow } from "../controllers/follow.controller"
import {Router} from "express"
import { verifyJWT } from "../middlewares/verifyJWT"

const router=Router()
router.use(verifyJWT)

router.route("/:requestedUserId")
    .post(followUser)
    .delete(unFollow);
router.route("/get-followers/:requestedUserId").get(getFollowers)
router.route("/get-following/:requestedUserId").get(getFollowing)
router.route("/remove-follower/:requestedUserId").delete(removeFollower)
router.route("/get-follow-requests").get(getFollowRequests)
router.route("/accept-follow-request/:followDocId").post(acceptFollowRequest)
router.route("/delete-follow-request/:followDocId").delete(deleteFollowRequest)


export default router