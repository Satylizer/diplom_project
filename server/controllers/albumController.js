import ApiError from "../error/ApiError.js"
import models from "../models/models.js"

const { Album, Artist, Song, AlbumLikes, User } = models

class AlbumController {
    async getAll(req, res, next) {
        try {
            console.log('getAll called') // 👈 ДОБАВЬ
            const albums = await Album.findAll({
                include: [{
                    model: Artist,
                    attributes: ['id', 'name']
                }],
                order: [['releaseDate', 'DESC']]
            })
            console.log('albums loaded:', albums.length) // 👈 ДОБАВЬ
            return res.json(albums)
        } catch (e) {
            console.error('ERROR in getAll:', e) // 👈 ЭТО ВАЖНО
            next(ApiError.internal(`Ошибка: ${e.message}`))
        }
    }

    async getOne(req, res, next) {
        try {
            const { id } = req.params
            const userId = req.user.id
            
            const album = await Album.findOne({
                where: { id },
                include: [
                    {
                        model: Artist,
                        attributes: ['id', 'name']
                    },
                    {
                        model: Song,
                        order: [['trackNumber', 'ASC']]
                    }
                ]
            })
            
            if (!album) {
                return next(ApiError.notFound('Альбом не найден'))
            }
            
            const isLiked = await AlbumLikes.findOne({
                where: { userId, albumId: id }
            })
            
            album.dataValues.isLiked = !!isLiked
            
            return res.json(album)
        } catch (e) {
            next(ApiError.internal(`Ошибка получения альбома: ${e.message}`))
        }
    }

    async toggleLike(req, res, next) {
        try {
            const userId = req.user.id
            const { id: albumId } = req.params
            
            const album = await Album.findByPk(albumId)
            if (!album) {
                return next(ApiError.notFound('Альбом не найден'))
            }
            
            const existingLike = await AlbumLikes.findOne({
                where: { userId, albumId }
            })
            
            if (existingLike) {
                await AlbumLikes.destroy({ where: { userId, albumId } })
                return res.json({ isLiked: false })
            } else {
                await AlbumLikes.create({ userId, albumId })
                return res.json({ isLiked: true })
            }
        } catch (e) {
            next(ApiError.internal(`Ошибка: ${e.message}`))
        }
    }

    async getLiked(req, res, next) {
        try {
            const userId = req.user.id
            
            const likedAlbums = await Album.findAll({
                include: [
                    {
                        model: User,
                        as: 'likedBy',
                        where: { id: userId },
                        through: { attributes: [] },
                        attributes: []
                    },
                    {
                        model: Artist,
                        attributes: ['id', 'name']
                    }
                ],
                order: [['createdAt', 'DESC']]
            })
            
            return res.json(likedAlbums)
        } catch (e) {
            next(ApiError.internal(`Ошибка получения лайкнутых альбомов: ${e.message}`))
        }
    }
}

export default new AlbumController()