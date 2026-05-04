import ApiError from "../error/ApiError.js"
import models from "../models/models.js"
const { Song, History } = models

class HistoryController {
    async create(req, res, next) {
        try {
            const userId = req.user.id
            const { songId } = req.body
            
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
            })
            
            return res.json(history)
        } catch (e) {
            next(ApiError.internal(`Ошибка с созданием истории: ${e.message}`))
        }
    }

    async getAll(req, res, next) {
        const userId = req.user.id

        const allHistory = await History.findAll({
            where: { userId },
            order: [['playedAt', 'DESC']],
            limit: 400,
            include: [{ model: Song }]
        })

        const uniqueHistory = []
        const seenSongIds = new Set()
        
        for (const item of allHistory) {
            const songId = item.song?.id || item.songId
            if (!seenSongIds.has(songId)) {
                seenSongIds.add(songId)
                uniqueHistory.push(item)
            }
            if (uniqueHistory.length >= 50) break
        }

        return res.json(uniqueHistory)
    }
}

export default new HistoryController()