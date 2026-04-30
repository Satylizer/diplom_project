import { Router } from "express"
const router = new Router()
import songController from "../controllers/songController.js"

router.get('/', songController.getAll)
router.get('/:id', songController.getOne)

export default router