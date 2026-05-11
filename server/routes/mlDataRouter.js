import { Router } from "express"
import mlDataController from "../controllers/mlDataController.js"

const router = Router()

router.get('/users', mlDataController.getAllUsers)

router.get('/songs', mlDataController.getAllSongs)

router.get('/sequence/:id', mlDataController.getUserSequence)

export default router