import { makeAutoObservable, runInAction } from 'mobx'
import { getArtists, getArtist } from '../http/artistApi'

export default class ArtistStore {
    constructor() {
        this._artists = []
        this._currentArtist = null
        this._isLoading = false
        this._error = null
        makeAutoObservable(this)
    }

    get artists() {
        return this._artists
    }

    get currentArtist() {
        return this._currentArtist
    }

    get isLoading() {
        return this._isLoading
    }

    get error() {
        return this._error
    }

    getArtistById(id) {
        return this._artists.find(artist => artist.id === id)
    }

    getPopularArtists(limit = 10) {
        const artistsWithAlbums = this._artists.filter(artist => artist.albums?.length > 0)
        
        if (artistsWithAlbums.length === 0) return []
        
        return [...artistsWithAlbums]
            .sort((a, b) => b.albums.length - a.albums.length)
            .slice(0, limit)
    }

    fetchArtists = async () => {
        runInAction(() => {
            this._isLoading = true
            this._error = null
        })
        try {
            const data = await getArtists()
            runInAction(() => {
                this._artists = data
            })
        } catch (e) {
            runInAction(() => {
                this._error = e.message
            })
            console.error('Ошибка загрузки артистов:', e)
        } finally {
            runInAction(() => {
                this._isLoading = false
            })
        }
    }

    fetchArtist = async (id) => {
        runInAction(() => {
            this._isLoading = true
            this._error = null
        })
        try {
            const data = await getArtist(id)
            runInAction(() => {
                this._currentArtist = data
            })
        } catch (e) {
            runInAction(() => {
                this._error = e.message
            })
            console.error('Ошибка загрузки артиста:', e)
        } finally {
            runInAction(() => {
                this._isLoading = false
            })
        }
    }
}