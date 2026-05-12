import { Router } from "express"
import mlRecommendationsController from "../controllers/mlRecomendationsController.js"
import authMiddleware from "../middleware/authMiddleware.js"

const router = Router()

router.get('/', authMiddleware, mlRecommendationsController.getPlaylists.bind(mlRecommendationsController))

router.get('/:id', authMiddleware, mlRecommendationsController.getPlaylistById.bind(mlRecommendationsController))

router.post('/update', authMiddleware, mlRecommendationsController.updatePlaylists.bind(mlRecommendationsController))

export default router