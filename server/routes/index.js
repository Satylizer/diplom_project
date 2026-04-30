import { Router } from "express"
const router = new Router()
import authRouter from './authRouter.js'
import likesRouter from './likesRouter.js'
import historyRouter from './historyRouter.js'
import playlistRouter from './playlistRouter.js'
import userRouter from './userRouter.js'
import songRouter from './songRouter.js'
import albumRouter from "./albumRouter.js"
import artistRouter from "./artistRouter.js"
import followRouter from "./followRouter.js" 

router.use('/auth', authRouter)
router.use('/history', historyRouter)
router.use('/likes', likesRouter)
router.use('/playlist', playlistRouter)
router.use('/user', userRouter)
router.use('/song', songRouter)
router.use('/album', albumRouter)
router.use('/artist', artistRouter)
router.use('/follow', followRouter)



export default router