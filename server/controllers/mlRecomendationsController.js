import ApiError from '../error/ApiError.js'
import { ML_PLAYLIST_CONFIG } from '../services/recommendations/config/mlPlaylistConfig.js'
import mlPlaylistService from "../services/recommendations/mlPlaylistService.js"
import models from '../models/models.js'
import sequelize from '../db.js'
import { Op } from 'sequelize'

const { Playlist, PlaylistTracks, Song } = models

class MlRecommendationsController {
    constructor(service) {
        this.service = service
    }

    async updatePlaylists(req, res, next) {
        const transaction = await sequelize.transaction()

        try {
            const userId = req.user.id
            const { top_k = 100 } = req.query

            const { sequence, sameEnergy } = await this.service._buildRecs(
                userId,
                parseInt(top_k)
            )

            if (!sequence.length && !sameEnergy.length) {
                await transaction.commit()
                return res.json({ success: true })
            }

            const sequenceSections = this.service._splitIntoSections(sequence, 5)
            const energySections = this.service._splitIntoSections(sameEnergy, 5)

            const playlistsToSave = []

            sequenceSections.forEach((songs, i) => {
                if (!songs.length) return

                playlistsToSave.push({
                    userId,
                    type: 'sequence_recs',
                    title: ML_PLAYLIST_CONFIG.titles.sequence[i] || 'For you',
                    songs: songs.slice(0, 20)
                })
            })

            energySections.forEach((songs, i) => {
                if (!songs.length) return

                playlistsToSave.push({
                    userId,
                    type: 'same_energy_recs',
                    title: ML_PLAYLIST_CONFIG.titles.same_energy[i] || 'Same vibe',
                    songs: songs.slice(0, 20)
                })
            })

            await Playlist.destroy({
                where: {
                    userId,
                    type: ['sequence_recs', 'same_energy_recs']
                },
                transaction
            })

            for (const p of playlistsToSave) {
                const playlist = await Playlist.create(
                    {
                        userId: p.userId,
                        type: p.type,
                        title: p.title,
                    },
                    { transaction }
                )

                await PlaylistTracks.bulkCreate(
                    p.songs.map((s, idx) => ({
                        playlistId: playlist.id,
                        songId: s.id,
                        position: idx
                    })),
                    { transaction }
                )
            }

            await transaction.commit()
            return res.json({ success: true })

        } catch (e) {
            await transaction.rollback()
            next(ApiError.internal(e.message))
        }
    }

    async getPlaylists(req, res, next) {
        try {
            const userId = req.user.id

            const playlists = await Playlist.findAll({
                where: {
                    userId,
                    type: {
                        [Op.in]: ['sequence_recs', 'same_energy_recs']
                    }
                },
                attributes: ['id', 'title', 'img', 'type', 'createdAt'],
                include: [
                    {
                        model: Song,
                        as: 'songs',
                        through: {
                            attributes: ['position']
                        }
                    }
                ],
                order: [['createdAt', 'ASC']]
            })

            const sequence = []
            const sameEnergy = []

            for (const p of playlists) {

                const songsSorted = (p.songs || []).sort(
                    (a, b) =>
                        (a.playlist_tracks?.position ?? 0) -
                        (b.playlist_tracks?.position ?? 0)
                )

                const formatted = {
                    id: p.id,
                    title: p.title,
                    img: p.img,
                    type: p.type,
                    songs: songsSorted
                }

                if (p.type === 'sequence_recs') {
                    sequence.push(formatted)
                } else {
                    sameEnergy.push(formatted)
                }
            }

            return res.json({
                sequence,
                sameEnergy
            })

        } catch (e) {
            next(ApiError.internal(e.message))
        }
    }

    async getPlaylistById(req, res, next) {
        try {
            const { id } = req.params

            const playlist = await Playlist.findOne({
                where: { id },
                include: [
                    {
                        model: Song,
                        as: 'songs',
                        through: {
                            attributes: ['position']
                        }
                    }
                ]
            })

            if (!playlist) {
                return next(ApiError.notFound('Плейлист не найден'))
            }

            const songsSorted = (playlist.songs || []).sort(
                (a, b) =>
                    (a.playlist_tracks?.position ?? 0) -
                    (b.playlist_tracks?.position ?? 0)
            )

            return res.json({
                ...playlist.toJSON(),
                songs: songsSorted
            })

        } catch (e) {
            next(ApiError.internal(e.message))
        }
    }
}

export default new MlRecommendationsController(mlPlaylistService)