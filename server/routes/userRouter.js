import { Router } from "express"
const router = new Router()
import userController from "../controllers/userController.js"
import authMiddleware from "../middleware/authMiddleware.js"

router.put('/avatar', authMiddleware, userController.updateImg)
router.put('/username', authMiddleware, userController.updateUsername)
router.put('/email', authMiddleware, userController.updateEmail)
router.put('/password', authMiddleware, userController.updatePassword)

router.get('/me', authMiddleware, userController.getMe)
router.get('/', authMiddleware, userController.getAll)
router.get('/:id', authMiddleware, userController.getOne)

export default router