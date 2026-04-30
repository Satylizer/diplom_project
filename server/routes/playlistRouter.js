import { Router } from "express"
const router = new Router()
import playlistController from "../controllers/playlistController.js"
import authMiddleware from "../middleware/authMiddleware.js"


router.post('/', authMiddleware, playlistController.create)
router.get('/', authMiddleware, playlistController.getAll)
router.get('/:id', authMiddleware, playlistController.getOne)
router.delete('/:id', authMiddleware, playlistController.delete)

router.post('/:id/songs', authMiddleware, playlistController.addSong)
router.delete('/:id/songs/:songId', authMiddleware, playlistController.removeSong)

export default router