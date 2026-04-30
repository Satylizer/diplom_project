import ApiError from "../error/ApiError.js"
import { v4 as uuidv4 } from 'uuid'
import path from "path"
import fs from 'fs'
import {fileURLToPath} from 'url'
import models from "../models/models.js"
const { Song, Playlist, PlaylistTracks } = models

class PlaylistController {
    async create(req, res, next) {
        try {
            const userId = req.user.id
            const { title, description } = req.body
            const { img } = req.files || {}

            let filename = null
            
            if (img) {
                filename = uuidv4() + ".jpg"
                const __dirname = path.dirname(fileURLToPath(import.meta.url))
                const uploadPath = path.resolve(__dirname, '..', 'static', filename)
                await img.mv(uploadPath)
            }

            const playlist = await Playlist.create({ 
                title, 
                description: description || null,
                type: "custom", 
                userId, 
                img: filename 
            })
            
            return res.json(playlist)
        } catch (e) {
            next(ApiError.internal(`Ошибка при создании плейлиста: ${e.message}`)) 
        }
    }

    async getAll(req, res, next) {
        const userId = req.user.id
        
        const playlists = await Playlist.findAll({ 
            where: { userId },
            order: [['createdAt', 'DESC']]
        })
        return res.json(playlists)
    }

    async getOne(req, res, next) {
        const { id } = req.params
        const userId = req.user.id   
        
        const playlist = await Playlist.findOne({
            where: { id, userId },
            include: [{
                model: Song,
                as: 'songs',
                through: { attributes: ['position'] }
            }]
        })

        if (!playlist) {
            return next(ApiError.notFound('Плейлист не найден'))
        }

        if (playlist.songs && playlist.songs.length > 0) {
            playlist.songs.sort((a, b) => 
                a.playlist_tracks.position - b.playlist_tracks.position
            )
        }

        return res.json(playlist)
    }

    async delete(req, res, next) {
        const { id } = req.params
        const userId = req.user.id
        
        const playlist = await Playlist.findOne({
            where: { id, userId }
        })
        
        if (!playlist) {
            return next(ApiError.notFound('Плейлист не найден'))
        }

        const __dirname = path.dirname(fileURLToPath(import.meta.url))
        
        if (playlist.img) {
            const imagePath = path.resolve(__dirname, '..', 'static', playlist.img)
            try {
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath)
                }
            } catch (err) {
                console.warn(`Файл не найден или не может быть удален: ${imagePath}`)
            }
        }
        
        await PlaylistTracks.destroy({
            where: { playlistId: id }
        })

        await playlist.destroy()
        
        return res.json({ message: 'Плейлист удален' })
    }

    async addSong(req, res, next) {
        try {
            const { id: playlistId } = req.params
            const { songId } = req.body
            const userId = req.user.id

            if (!playlistId || !songId) {
                return next(ApiError.badRequest('ID плейлиста и ID песни обязательны'))
            }
            
            const playlist = await Playlist.findOne({
                where: { id: playlistId, userId }
            })
            
            if (!playlist) {
                return next(ApiError.notFound('Плейлист не найден'))
            }
            
            const song = await Song.findByPk(songId)
            if (!song) {
                return next(ApiError.notFound('Песня не найдена'))
            }
            
            const [track, created] = await PlaylistTracks.findOrCreate({
                where: { playlistId, songId },
                defaults: { position: 0 }
            })
            
            if (!created) {
                return res.json({ message: 'Трек уже в плейлисте' })
            }
            
            const lastTrack = await PlaylistTracks.findOne({
                where: { playlistId },
                attributes: ['position'],
                order: [['position', 'DESC']]
            })
            
            const position = lastTrack ? lastTrack.position + 1 : 0
            await track.update({ position })
            
            return res.json({ message: 'Трек добавлен в плейлист' })
            
        } catch (e) {
            next(ApiError.internal(`Ошибка добавления трека: ${e.message}`))
        }
    }

    async removeSong(req, res, next) {
        try {
            const { id: playlistId, songId } = req.params
            const userId = req.user.id

            if (!playlistId || !songId) {
                return next(ApiError.badRequest('ID плейлиста и ID песни обязательны'))
            }

            const playlist = await Playlist.findOne({
                where: { id: playlistId, userId }
            })

            if (!playlist) {
                return next(ApiError.notFound('Плейлист не найден'))
            }

            await PlaylistTracks.destroy({
                where: { playlistId, songId }
            })

            const remainingTracks = await PlaylistTracks.findAll({
                where: { playlistId },
                order: [['position', 'ASC']]
            })

            for (let i = 0; i < remainingTracks.length; i++) {
                await remainingTracks[i].update({ position: i })
            }
            
            return res.json({ message: 'Трек удален из плейлиста' })
        } catch (e) {
            next(ApiError.internal(`Ошибка удаления трека: ${e.message}`))
        }
    }
}

export default new PlaylistController()