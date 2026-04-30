import { Router } from "express"
const router = new Router()
import historyController from "../controllers/historyController.js"
import authMiddleware from "../middleware/authMiddleware.js"


router.post('/', authMiddleware, historyController.create)
router.get('/', authMiddleware, historyController.getAll)

export default router