import ApiError from "../error/ApiError.js"
import models from "../models/models.js"

const { Artist, Album, Song, SongArtists } = models

class ArtistController {
    async getAll(req, res, next) {
        try {
            const artists = await Artist.findAll({
                attributes: ['id', 'name', 'imgUrl', 'genres', 'popularity', 'followersCount'],
                order: [['name', 'ASC']]
            })
            
            return res.json(artists)
        } catch (e) {
            next(ApiError.internal(`Ошибка получения артистов: ${e.message}`))
        }
    }

    async getOne(req, res, next) {
        try {
            const { id } = req.params
            
            const artist = await Artist.findOne({
                where: { id },
                attributes: ['id', 'name', 'imgUrl', 'genres', 'popularity', 'followersCount'],
                include: [
                    {
                        model: Album,
                        attributes: ['id', 'title', 'imgUrl', 'releaseDate', 'totalTracks', 'popularity'],
                        order: [['releaseDate', 'DESC']]
                    }
                ]
            })
            
            if (!artist) {
                return next(ApiError.notFound('Артист не найден'))
            }
            
            return res.json(artist)
        } catch (e) {
            next(ApiError.internal(`Ошибка получения артиста: ${e.message}`))
        }
    }
}

export default new ArtistController()