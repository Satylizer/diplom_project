import { Router } from "express"
import mlRecommendationsController from "../controllers/mlRecomendationsController.js"
import authMiddleware from "../middleware/authMiddleware.js"

const router = Router()

router.get('/', authMiddleware, mlRecommendationsController.getPlaylists)

router.post('/update', authMiddleware, mlRecommendationsController.updatePlaylists)

export default router