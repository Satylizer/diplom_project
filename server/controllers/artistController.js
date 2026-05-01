import ApiError from "../error/ApiError.js"
import models from "../models/models.js"

const { Artist, Album, ArtistFollowers } = models

class ArtistController {
    async getAll(req, res, next) {
        try {
            const artists = await Artist.findAll({
                attributes: ['id', 'name', 'imgUrl', 'followersCount'],
                order: [['name', 'ASC']],
                include: [
                    {
                        model: Album,
                        attributes: ['id', 'title', 'imgUrl', 'releaseDate', 'totalTracks'],
                        order: [['releaseDate', 'DESC']]
                    }
                ]
            })
            
            return res.json(artists)
        } catch (e) {
            next(ApiError.internal(`Ошибка получения артистов: ${e.message}`))
        }
    }

    async getOne(req, res, next) {
        const { id } = req.params
        const currentUserId = req.user?.id
        
        try {
            const artist = await Artist.findByPk(id, {
                include: [{ model: Album, as: 'albums' }]
            })
            
            if (!artist) return next(ApiError.notFound('Артист не найден'))
            
            let followersCount = 0
            let isFollowing = false
            
            if (ArtistFollowers) {
                followersCount = await ArtistFollowers.count({ where: { artistId: id } })
                
                if (currentUserId) {
                    const follow = await ArtistFollowers.findOne({
                        where: { userId: currentUserId, artistId: id }
                    })
                    isFollowing = !!follow
                }
            }
            
            return res.json({
                ...artist.dataValues,
                followersCount,
                isFollowing
            })
        } catch (e) {
            next(ApiError.internal(e.message))
        }
    }
}

export default new ArtistController()