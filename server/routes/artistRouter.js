import { Router } from "express"
const router = new Router()
import artistController from "../controllers/artistController.js"

router.get('/', artistController.getAll)
router.get('/:id', artistController.getOne)

export default router