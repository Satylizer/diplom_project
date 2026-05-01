import { Router } from "express"
const router = new Router()
import followController from "../controllers/followController.js"
import authMiddleware from "../middleware/authMiddleware.js"

router.post('/user/:followingId/toggle', authMiddleware, followController.toggleUserFollow)
router.get('/user/following', authMiddleware, followController.getUserFollowing)
router.post('/artist/:artistId/toggle', authMiddleware, followController.toggleArtistFollow)
router.get('/artist/my', authMiddleware, followController.getFollowingArtists)

export default router