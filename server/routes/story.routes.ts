import { verifyJWT } from "../middlewares/verifyJWT";
import {
  createStory,
  deleteStory,
  getAllFollowingStories,
  getSelfStories,
  getStoryById,
  getUserActiveStories,
} from "../controllers/story.controller";
import { Router } from "express";

const router = Router();

router.use(verifyJWT);
router.route("/create").post(createStory);
router.route("/delete/:storyId").delete(deleteStory);
router.route("/get-all-following-stories").get(getAllFollowingStories);
router
  .route("/get-user-active-stories/:requestedUserId")
  .get(getUserActiveStories);
router.route("/get-self-stories").get(getSelfStories);
router.route("/get-story/:storyId").get(getStoryById);

export default router;
