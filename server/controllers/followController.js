import ApiError from "../error/ApiError.js"
import models from "../models/models.js"

const { User, Artist } = models

class FollowController {    
    async toggleUserFollow(req, res, next) {
        try {
            const followerId = req.user.id
            const { followingId } = req.params

            if (followerId === parseInt(followingId)) {
                return next(ApiError.badRequest('Нельзя подписаться на себя'))
            }

            const user = await User.findByPk(followerId)
            const followingUser = await User.findByPk(followingId)

            if (!followingUser) {
                return next(ApiError.notFound('Пользователь не найден'))
            }

            const isFollowing = await user.hasFollowing(followingUser)

            if (isFollowing) {
                await user.removeFollowing(followingUser)
                return res.json({ isFollowing: false })
            } else {
                await user.addFollowing(followingUser)
                return res.json({ isFollowing: true })
            }
        } catch (e) {
            next(ApiError.internal(`Ошибка: ${e.message}`))
        }
    }

    async getUserFollowing(req, res, next) {
        try {
            const userId = req.user.id

            const user = await User.findByPk(userId, {
                include: [{
                    model: User,
                    as: 'following',
                    through: { attributes: [] },
                    attributes: ['id', 'username', 'img']
                }]
            })

            return res.json(user?.following || [])
        } catch (e) {
            next(ApiError.internal(`Ошибка: ${e.message}`))
        }
    }

    async toggleArtistFollow(req, res, next) {
        try {
            const userId = req.user.id
            const { artistId } = req.params

            const user = await User.findByPk(userId)
            const artist = await Artist.findByPk(artistId)

            if (!artist) {
                return next(ApiError.notFound('Артист не найден'))
            }

            const isFollowing = await user.hasFollowingArtists(artist)

            if (isFollowing) {
                await user.removeFollowingArtists(artist)
                await artist.decrement('followersCount')
                return res.json({ isFollowing: false })
            } else {
                await user.addFollowingArtists(artist)
                await artist.increment('followersCount')
                return res.json({ isFollowing: true })
            }
        } catch (e) {
            next(ApiError.internal(`Ошибка: ${e.message}`))
        }
    }

    async getFollowingArtists(req, res, next) {
        try {
            const userId = req.user.id

            const user = await User.findByPk(userId, {
                include: [{
                    model: Artist,
                    as: 'followingArtists',
                    through: { attributes: [] },
                    attributes: ['id', 'name', 'imgUrl', 'followersCount']
                }]
            })

            return res.json(user?.followingArtists || [])
        } catch (e) {
            next(ApiError.internal(`Ошибка: ${e.message}`))
        }
    }
}

export default new FollowController()