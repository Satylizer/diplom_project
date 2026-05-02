import { Router } from "express"
const router = new Router()
import albumController from "../controllers/albumController.js"
import authMiddleware from "../middleware/authMiddleware.js"

router.get('/', albumController.getAll)
router.get('/liked', authMiddleware, albumController.getLiked)
router.get('/:id', authMiddleware, albumController.getOne)
router.post('/:id/like', authMiddleware, albumController.toggleLike)

export default router