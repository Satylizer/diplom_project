import ApiError from "../error/ApiError.js"
import models from "../models/models.js"
import yandexService from "../services/yandexService.js"

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
            
            const artistName = song.artists?.[0]?.name
            if (!artistName) {
                return next(ApiError.notFound('Исполнитель не найден'))
            }
            
            const streamUrl = await yandexService.getStreamUrlByQuery(song.name, artistName)
            
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