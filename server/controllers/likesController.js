import ApiError from "../error/ApiError.js"
import models from "../models/models.js"
const { Song, Likes } = models

class LikesController {
    async toggle(req, res, next) {
        try {
            const userId = req.user.id
            const { songId } = req.params
            
            if (!songId) {
                return next(ApiError.badRequest('songId обязателен'))
            }
            
            const song = await Song.findByPk(songId)
            if (!song) {
                return next(ApiError.notFound('Песня не найдена'))
            }
            
            const existingLike = await Likes.findOne({
                where: { userId, songId }
            })
            
            if (existingLike) {
                await existingLike.destroy()
                await song.decrement('totalLikes')
                return res.json({ liked: false, message: 'Лайк удален' })
            } else {
                await Likes.create({ userId, songId })
                await song.increment('totalLikes')
                return res.json({ liked: true, message: 'Лайк добавлен' })
            }
        } catch (e) {
            next(ApiError.internal(`Ошибка с лайком: ${e.message}`))
        }
    }

    async getAll(req, res) {
        const userId = req.user.id

        const likes = await Likes.findAll({where:{userId}})
        return res.json(likes)
    }
}

export default new LikesController()