import { makeAutoObservable, runInAction } from 'mobx'
import { getAlbums, getAlbum, toggleAlbumLike, getLikedAlbums } from '../http/albumApi'

export default class AlbumStore {
    constructor() {
        this._albums = []
        this._likedAlbums = []
        this._currentAlbum = null
        this._isLoading = false
        this._error = null
        makeAutoObservable(this)
    }

    get albums() {
        return this._albums
    }

    get likedAlbums() {
        return this._likedAlbums
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
            .sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate))
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

    toggleLike = async (albumId) => {
        try {
            const data = await toggleAlbumLike(albumId)
            
            runInAction(() => {
                if (this._currentAlbum && this._currentAlbum.id === albumId) {
                    this._currentAlbum.isLiked = data.isLiked
                }
                
                const album = this._albums.find(a => a.id === albumId)
                if (album) {
                    album.isLiked = data.isLiked
                }
                
                if (data.isLiked) {
                    const likedAlbum = this._albums.find(a => a.id === albumId)
                    if (likedAlbum && !this._likedAlbums.find(a => a.id === albumId)) {
                        this._likedAlbums.push({ ...likedAlbum, isLiked: true })
                    }
                } else {
                    this._likedAlbums = this._likedAlbums.filter(a => a.id !== albumId)
                }
            })
            
            return data
        } catch (e) {
            console.error('Ошибка лайка альбома:', e)
            return { isLiked: false }
        }
    }

    fetchLikedAlbums = async () => {
        runInAction(() => {
            this._isLoading = true
            this._error = null
        })
        try {
            const data = await getLikedAlbums()
            runInAction(() => {
                this._likedAlbums = data
            })
            return data
        } catch (e) {
            runInAction(() => {
                this._error = e.message
            })
            console.error('Не удалось получить лайкнутые альбомы:', e)
            return []
        } finally {
            runInAction(() => {
                this._isLoading = false
            })
        }
    }
}