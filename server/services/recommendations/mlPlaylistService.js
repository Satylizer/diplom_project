import axios from 'axios'
import models from '../../models/models.js'
import sequelize from '../../db.js'

const { Song, Artist, Album, Playlist, PlaylistTracks } = models
const ML_API_URL = process.env.ML_API_URL || 'http://localhost:8000'

class MlPlaylistService {
    
    async _fetchRecommendations(userId, top_k) {
        const [sequenceRes, energyRes] = await Promise.all([
            axios.get(`${ML_API_URL}/recommendations/sequence/${userId}`, {
                params: { top_k }
            }),
            axios.get(`${ML_API_URL}/recommendations/same-energy/${userId}`, {
                params: { top_k }
            })
        ])

        return {
            sequence: sequenceRes.data || [],
            sameEnergy: energyRes.data || []
        }
    }

    async _buildRecs(userId, top_k) {
        const recs = await this._fetchRecommendations(userId, top_k)

        const allSongIds = [
            ...recs.sequence.map(r => r.songId),
            ...recs.sameEnergy.map(r => r.songId)
        ]

        if (allSongIds.length === 0) {
            return {
                sequence: [],
                sameEnergy: []
            }
        }

        const songs = await Song.findAll({
            where: { id: allSongIds },
            include: [
                {
                    model: Artist,
                    as: 'artists',
                    through: { attributes: [] }
                },
                {
                    model: Album
                }
            ]
        })

        const songMap = new Map(songs.map(s => [s.id, s]))

        const mapSongs = (arr) =>
            arr
                .filter(r => songMap.has(r.songId))
                .map(r => songMap.get(r.songId))

        const sequenceSongs = mapSongs(recs.sequence)
        const sameEnergySongs = mapSongs(recs.sameEnergy)

        return {
            sequence: sequenceSongs,
            sameEnergy: sameEnergySongs
        }
    }

    _splitIntoSections(songsArray, sectionsCount) {
        const sections = []
        const songsPerSection = Math.floor(songsArray.length / sectionsCount)
        
        if (songsPerSection === 0) return sections
        
        for (let i = 0; i < sectionsCount; i++) {
            const start = i * songsPerSection
            const end = i === sectionsCount - 1 ? songsArray.length : start + songsPerSection
            const sectionSongs = songsArray.slice(start, end)
            
            if (sectionSongs.length > 0) {
                sections.push(sectionSongs)
            }
        }
        
        return sections
    }
}

export default new MlPlaylistService()