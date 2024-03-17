import { getStoryViews, viewStory } from '../controllers/view.controller'
import {Router} from 'express'
import { verifyJWT } from '../middlewares/verifyJWT'

const router=Router()
router.use(verifyJWT)
router.route("/view-story/:storyId").post(viewStory)
router.route("/get-views/:storyId").get(getStoryViews)

export default router