import axios from 'axios'
import spotifyApi from '../../clients/spotifyApi.js'
import ApiError from '../../error/ApiError.js'

class SearchService {
    async searchArtistId(name) {
        const token = await spotifyApi.getToken()
        const response = await axios.get('https://api.spotify.com/v1/search', {
            headers: { 'Authorization': `Bearer ${token}` },
            params: { q: name, type: 'artist', limit: 1}
        })
        
        if (!response.data.artists || !response.data.artists.items.length) {
            throw ApiError.notFound(`Исполнитель "${name}" не найден`)
        }
        
        return response.data.artists.items[0].id
    }

    async searchAlbumId(artistName, albumName) {
        const token = await spotifyApi.getToken()
        const query = `${artistName} ${albumName}`
        const response = await axios.get('https://api.spotify.com/v1/search', {
            headers: { 'Authorization': `Bearer ${token}` },
            params: { q: query, type: 'album', limit: 3, market: 'US'}
        })
        
        if (!response.data.albums || !response.data.albums.items.length) {
            throw ApiError.notFound(`Альбом "${albumName}" не найден`)
        }
        
        const album = response.data.albums.items.find(album => 
            album.name.toLowerCase().includes(albumName.toLowerCase()) &&
            album.artists[0]?.name.toLowerCase() === artistName.toLowerCase()
        )
        
        if (!album) {
            throw ApiError.notFound(`Альбом "${albumName}" не найден`)
        }
        
        return album.id
    }
}

export default new SearchService()