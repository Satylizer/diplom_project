import ApiError from '../error/ApiError.js'
import { ML_PLAYLIST_CONFIG } from '../services/recommendations/config/mlPlaylistConfig.js'
import mlPlaylistService from "../services/recommendations/mlPlaylistService.js"
import models from '../models/models.js'
import sequelize from '../db.js'

const { Playlist, PlaylistTracks } = models

class MlRecommendationsController {
    constructor(service) {
        this.service = service
    }

    async updatePlaylists(req, res, next) {
        const transaction = await sequelize.transaction()

        try {
            const { userId } = req.params
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
                    img: ML_PLAYLIST_CONFIG.images.sequence[i],
                    songs
                })
            })

            energySections.forEach((songs, i) => {
                if (!songs.length) return

                playlistsToSave.push({
                    userId,
                    type: 'same_energy_recs',
                    title: ML_PLAYLIST_CONFIG.titles.same_energy[i] || 'Same vibe',
                    img: ML_PLAYLIST_CONFIG.images.same_energy[i],
                    songs
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
                        img: p.img
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
            const { userId } = req.params

            const playlists = await Playlist.findAll({
                where: {
                    userId,
                    type: ['sequence_recs', 'same_energy_recs']
                },
                include: [
                    {
                        model: PlaylistTracks,
                        include: ['Song']
                    }
                ]
            })

            const sequence = []
            const sameEnergy = []

            for (const p of playlists) {
                const songs = p.PlaylistTracks
                    .map(pt => pt.Song)
                    .filter(Boolean)

                const formatted = {
                    id: p.id,
                    title: p.title,
                    img: p.img,
                    type: p.type,
                    songs
                }

                if (p.type === 'sequence_recs') {
                    sequence.push(formatted)
                }

                if (p.type === 'same_energy_recs') {
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
}

export default new MlRecommendationsController(mlPlaylistService)