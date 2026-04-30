import ApiError from "../error/ApiError.js"
import models from "../models/models.js"

const { User, UserFollowers, Artist, ArtistFollowers } = models

class FollowController {    
    async toggleUserFollow(req, res, next) {
        try {
            const followerId = req.user.id
            const { followingId } = req.params

            if (followerId === parseInt(followingId)) {
                return next(ApiError.badRequest('Нельзя подписаться на самого себя'))
            }

            const followingUser = await User.findByPk(followingId)
            if (!followingUser) {
                return next(ApiError.notFound('Пользователь не найден'))
            }

            const existingFollow = await UserFollowers.findOne({
                where: { followerId, followingId }
            })

            if (existingFollow) {
                await UserFollowers.destroy({ where: { followerId, followingId } })
                return res.json({ isFollowing: false, message: 'Вы отписались от пользователя' })
            } else {
                await UserFollowers.create({ followerId, followingId })
                return res.json({ isFollowing: true, message: 'Вы подписались на пользователя' })
            }
        } catch (e) {
            next(ApiError.internal(`Ошибка: ${e.message}`))
        }
    }

    async getUserFollowers(req, res, next) {
        try {
            const { id } = req.params
            const { limit = 20, offset = 0 } = req.query

            const user = await User.findByPk(id)
            if (!user) {
                return next(ApiError.notFound('Пользователь не найден'))
            }

            const followers = await User.findAndCountAll({
                attributes: ['id', 'username', 'email', 'imgUrl'],
                include: [{
                    model: User,
                    as: 'followers',
                    through: { attributes: [] },
                    where: { followingId: id },
                    attributes: []
                }],
                limit: parseInt(limit),
                offset: parseInt(offset)
            })

            return res.json({ count: followers.count, followers: followers.rows })
        } catch (e) {
            next(ApiError.internal(`Ошибка получения подписчиков: ${e.message}`))
        }
    }

    async getUserFollowing(req, res, next) {
        try {
            const { id } = req.params
            const { limit = 20, offset = 0 } = req.query

            const user = await User.findByPk(id)
            if (!user) {
                return next(ApiError.notFound('Пользователь не найден'))
            }

            const following = await User.findAndCountAll({
                attributes: ['id', 'username', 'email', 'imgUrl'],
                include: [{
                    model: User,
                    as: 'following',
                    through: { attributes: [] },
                    where: { followerId: id },
                    attributes: []
                }],
                limit: parseInt(limit),
                offset: parseInt(offset)
            })

            return res.json({ count: following.count, following: following.rows })
        } catch (e) {
            next(ApiError.internal(`Ошибка получения подписок: ${e.message}`))
        }
    }

    async checkUserFollow(req, res, next) {
        try {
            const followerId = req.user.id
            const { followingId } = req.params

            const follow = await UserFollowers.findOne({
                where: { followerId, followingId }
            })

            return res.json({ isFollowing: !!follow })
        } catch (e) {
            next(ApiError.internal(`Ошибка проверки подписки: ${e.message}`))
        }
    }

    async toggleArtistFollow(req, res, next) {
        try {
            const userId = req.user.id
            const { artistId } = req.params

            const artist = await Artist.findByPk(artistId)
            if (!artist) {
                return next(ApiError.notFound('Артист не найден'))
            }

            const existingFollow = await ArtistFollowers.findOne({
                where: { userId, artistId }
            })

            if (existingFollow) {
                await ArtistFollowers.destroy({ where: { userId, artistId } })
                
                await artist.decrement('followersCount')
                
                return res.json({ isFollowing: false, message: 'Вы отписались от артиста' })
            } else {
                await ArtistFollowers.create({ userId, artistId })
                
                await artist.increment('followersCount')
                
                return res.json({ isFollowing: true, message: 'Вы подписались на артиста' })
            }
        } catch (e) {
            next(ApiError.internal(`Ошибка: ${e.message}`))
        }
    }

    async getUserFollowedArtists(req, res, next) {
        try {
            const userId = req.user.id
            const { limit = 20, offset = 0 } = req.query

            const followedArtists = await Artist.findAndCountAll({
                attributes: ['id', 'name', 'imgUrl', 'genres', 'popularity', 'followersCount'],
                include: [{
                    model: User,
                    as: 'followers',
                    through: { attributes: [] },
                    where: { id: userId },
                    attributes: []
                }],
                limit: parseInt(limit),
                offset: parseInt(offset)
            })

            return res.json({ 
                count: followedArtists.count, 
                artists: followedArtists.rows 
            })
        } catch (e) {
            next(ApiError.internal(`Ошибка получения подписок на артистов: ${e.message}`))
        }
    }

    async checkArtistFollow(req, res, next) {
        try {
            const userId = req.user.id
            const { artistId } = req.params

            const follow = await ArtistFollowers.findOne({
                where: { userId, artistId }
            })

            return res.json({ isFollowing: !!follow })
        } catch (e) {
            next(ApiError.internal(`Ошибка проверки подписки на артиста: ${e.message}`))
        }
    }
}

export default new FollowController()