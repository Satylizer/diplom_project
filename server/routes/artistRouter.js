import { Router } from "express"
const router = new Router()
import artistController from "../controllers/artistController.js"
import authMiddleware from "../middleware/authMiddleware.js"

router.get('/', authMiddleware, artistController.getAll)
router.get('/:id', authMiddleware, artistController.getOne)

export default router