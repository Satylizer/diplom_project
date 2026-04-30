import { Router } from "express"
const router = new Router()
import authController from "../controllers/authController.js"
import authMiddleware from "../middleware/authMiddleware.js"


router.post('/registration', authController.registration)
router.post('/login', authController.login)
router.get('/check', authMiddleware, authController.check)

export default router