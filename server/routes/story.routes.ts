import { createStory, deleteStory } from '../controllers/story.controller'
import {Router} from 'express'

const router=Router()

router.route("/create").post(createStory)
router.route("/:storyId").delete(deleteStory)

export default router   