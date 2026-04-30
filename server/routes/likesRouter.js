import { Router } from "express"
const router = new Router()
import likesController from "../controllers/likesController.js"
import authMiddleware from "../middleware/authMiddleware.js"


router.post('/:songId', authMiddleware, likesController.toggle)
router.get('/', authMiddleware, likesController.getAll)

export default router