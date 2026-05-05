import ApiError from "../error/ApiError.js"
import models from "../models/models.js"
import yandexService from "../services/yandexService.js"
import youTubeService from "../services/youtubeService.js"

const { Song, Artist, Album } = models

class SongController {
    async getAll(req, res, next) {
        try {
            const songs = await Song.findAll({
                include: [
                    {
                        model: Artist,
                        as: 'artists',
                        through: { attributes: [] },
                        attributes: ['id', 'name']
                    },
                    {
                        model: Album,
                        attributes: ['id', 'title']
                    }
                ],
                order: [['createdAt', 'DESC']]
            })
            
            return res.json(songs)
        } catch (e) {
            next(ApiError.internal(`Ошибка получения песен: ${e.message}`))
        }
    }

    async getOne(req, res, next) {
        try {
            const { id } = req.params
            
            const song = await Song.findOne({
                where: { id },
                include: [
                    {
                        model: Artist,
                        as: 'artists',
                        through: { attributes: [] },
                        attributes: ['id', 'name', 'imgUrl']
                    },
                    {
                        model: Album,
                        attributes: ['id', 'title', 'imgUrl']
                    }
                ]
            })
            
            if (!song) {
                return next(ApiError.notFound('Песня не найдена'))
            }
            
            const artistNames = song.artists?.map(a => a.name) || []
            if (!artistNames.length) {
                return next(ApiError.notFound('Исполнитель не найден'))
            }
            
            let streamUrl
            
            try {
                streamUrl = await yandexService.getStreamUrlByQuery(song.name, artistNames)
            } catch (e) {
                streamUrl = await youTubeService.getStreamUrlByQuery(song.name, artistNames[0])
            }
            
            const songWithStream = {
                ...song.toJSON(),
                streamUrl
            }
            
            return res.json(songWithStream)
        } catch (e) {
            next(ApiError.internal(`Ошибка получения песни: ${e.message}`))
        }
    }
}

export default new SongController()