import ApiError from "../error/ApiError.js"
import models from "../models/models.js"

const { Album, Artist, Song } = models

class AlbumController {
    async getAll(req, res, next) {
        const albums = await Album.findAll({
            include: [{
                model: Artist,
                attributes: ['id', 'name']
            }],
            order: [['releaseDate', 'DESC']]
        })
        
        return res.json(albums)
    }

    async getOne(req, res, next) {
        try {
            const { id } = req.params
            
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
            
            return res.json(album)
        } catch (e) {
            next(ApiError.internal(`Ошибка получения альбома: ${e.message}`))
        }
    }
}

export default new AlbumController()