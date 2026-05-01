import axios from 'axios'
import spotifyApi from '../../clients/spotifyApi.js'

class GetService {
    async getArtist(id) {
        const token = await spotifyApi.getToken()
        const response = await axios.get(`https://api.spotify.com/v1/artists/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` },
            params: { market: 'US' }
        })

        console.log('Full Spotify API response:', JSON.stringify(response.data, null, 2))
        
        return {
            spotifyId: response.data.id,
            name: response.data.name,
            imgUrl: response.data.images[0]?.url || null,
        }
    }

    async getAlbum(id) {
        const token = await spotifyApi.getToken()
        const response = await axios.get(`https://api.spotify.com/v1/albums/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` },
            params: { market: 'US' }
        })
        
        return {
            spotifyId: response.data.id,
            title: response.data.name,
            imgUrl: response.data.images[0]?.url || null,
            releaseDate: response.data.release_date,
            totalTracks: response.data.total_tracks,
            artistId: response.data.artists[0]?.id,
            artistName: response.data.artists[0]?.name,
        }
    }

    async getAlbumTracks(id) {
        const token = await spotifyApi.getToken()
        const response = await axios.get(`https://api.spotify.com/v1/albums/${id}/tracks`, {
            headers: { 'Authorization': `Bearer ${token}` },
            params: { limit: 50 },
            market: 'US'
        })
        
        return response.data.items.map(track => ({
            spotifyId: track.id,
            name: track.name,
            durationMs: track.duration_ms,
            trackNumber: track.track_number,
            albumId: id,
            artists: track.artists.map(artist => ({
                spotifyId: artist.id,
                name: artist.name
            }))
        }))
    }
}

export default new GetService()