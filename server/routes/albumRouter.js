import { Router } from "express"
const router = new Router()
import albumController from "../controllers/albumController.js"

router.get('/', albumController.getAll)
router.get('/:id', albumController.getOne)

export default router