import searchService from './searchService.js'
import getService from './getService.js'

class SpotifyService {
    async getArtist(id) {
        return getService.getArtist(id)
    }

    async getAlbum(id) {
        return getService.getAlbum(id)
    }

    async getAlbumTracks(id) {
        return getService.getAlbumTracks(id)
    }

    async getArtistByName(name) {
        const id = await searchService.searchArtistId(name)
        return getService.getArtist(id)
    }

    async getAlbumByName(artistName, albumName) {
        const id = await searchService.searchAlbumId(artistName, albumName)
        return getService.getAlbum(id)
    }

    async getAlbumTracksByName(artistName, albumName) {
        const id = await searchService.searchAlbumId(artistName, albumName)
        return getService.getAlbumTracks(id)
    }
}

export default new SpotifyService()