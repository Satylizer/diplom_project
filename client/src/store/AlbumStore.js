import { makeAutoObservable, runInAction } from 'mobx'
import { getAlbums, getAlbum } from '../http/albumApi'

export default class AlbumStore {
    constructor() {
        this._albums = []
        this._currentAlbum = null
        this._isLoading = false
        this._error = null
        makeAutoObservable(this)
    }

    get albums() {
        return this._albums
    }

    get currentAlbum() {
        return this._currentAlbum
    }

    get totalDuration() {
    if (!this._currentAlbum) return '0 min'
    
    const songs = this._currentAlbum.songs || this._currentAlbum.tracks || []
    const totalMs = songs.reduce((acc, song) => acc + (song.durationMs || 0), 0)
    const totalMinutes = Math.floor(totalMs / 60000)
    const totalHours = Math.floor(totalMinutes / 60)
    const remainingMinutes = totalMinutes % 60
    
    return totalHours > 0 
        ? `${totalHours} hr ${remainingMinutes} min` 
        : `${totalMinutes} min`
    }

    get isLoading() {
        return this._isLoading
    }

    get error() {
        return this._error
    }

    getPopularAlbums(limit = 10) {
        return [...this._albums]
            .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
            .slice(0, limit)
    }

    fetchAlbums = async () => {
        runInAction(() => {
            this._isLoading = true
            this._error = null
        })
        try {
            const data = await getAlbums()
            runInAction(() => {
                this._albums = data
            })
        } catch (e) {
            runInAction(() => {
                this._error = e.message
            })
            console.error('Не удалось получить альбомы:', e)
        } finally {
            runInAction(() => {
                this._isLoading = false
            })
        }
    }

    fetchAlbum = async (id) => {
        runInAction(() => {
            this._isLoading = true
            this._error = null
        })
        try {
            const data = await getAlbum(id)
            runInAction(() => {
                this._currentAlbum = data
                this._isLoading = false
            })
        } catch (e) {
            console.error('Не удалось получить альбом:', e)
            runInAction(() => {
                this._error = e.message
                this._isLoading = false
            })
        }
    }
}