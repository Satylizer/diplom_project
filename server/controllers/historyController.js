import ApiError from "../error/ApiError.js"
import models from "../models/models.js"
const { Song, History } = models

class HistoryController {
    async create(req, res, next) {
        try {
            const userId = req.user.id
            const {songId} = req.body
            if (!songId) {
                    return next(ApiError.badRequest('songId обязателен'))
            }
            const song = await Song.findByPk(songId)
            if (!song) {
                    return next(ApiError.notFound('Песня не найдена'))
            }

            const history = await History.create({
                    userId,
                    songId,
                    playedAt: new Date()
            });

            return res.json(history)
        } catch (e) {
            next(ApiError.internal(`Ошибка с созданием истории: ${e.message}`))
        }
    }

    async getAll(req, res, next){
        const userId = req.user.id

        const history = await History.findAll({
            where: {userId},
            order: [['playedAt', 'DESC']],
            limit: 50,
            include: [{model: Song}]
        })

        return res.json(history)
    }
}

export default new HistoryController()