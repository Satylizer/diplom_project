import { Router } from "express"
const router = new Router()
import followController from "../controllers/followController.js"
import authMiddleware from "../middleware/authMiddleware.js"

router.post('/user/:followingId/toggle', authMiddleware, followController.toggleUserFollow)
router.get('/user/:followingId/check', authMiddleware, followController.checkUserFollow)
router.get('/user/:id/followers', followController.getUserFollowers)
router.get('/user/:id/following', followController.getUserFollowing)
router.post('/artist/:artistId/toggle', authMiddleware, followController.toggleArtistFollow)
router.get('/artist/:artistId/check', authMiddleware, followController.checkArtistFollow)
router.get('/artist/my', authMiddleware, followController.getUserFollowedArtists)

export default router