import { makeAutoObservable, runInAction } from 'mobx'
import { getSongs, getSong } from '../http/songApi'
import { getLikedSongs, toggleLike } from '../http/likesApi'

export default class SongStore {
    constructor() {
        this._songs = []
        this._currentSong = null
        this._likedIds = new Set()
        this._isLoading = false
        this._error = null
        makeAutoObservable(this)
    }

    get songs() {
        return this._songs.map(song => ({
            ...song,
            isLiked: this._likedIds.has(song.id)
        }))
    }

    get currentSong() {
        if (!this._currentSong) return null
        return {
            ...this._currentSong,
            isLiked: this._likedIds.has(this._currentSong.id)
        }
    }

    get likedSongs() {
        return this._songs
            .filter(song => this._likedIds.has(song.id))
            .map(song => ({
                ...song,
                isLiked: true
            }))
    }

    get totalDuration() {
        const totalMs = this.likedSongs.reduce((acc, song) => acc + (song.durationMs || 0), 0)
        const totalMinutes = Math.floor(totalMs / 60000)
        const totalHours = Math.floor(totalMinutes / 60)
        const remainingMinutes = totalMinutes % 60
        
        if (totalHours > 0) {
            return `${totalHours} hr ${remainingMinutes} min`
        }
        return `${totalMinutes} min`
    }

    get isLoading() {
        return this._isLoading
    }

    get error() {
        return this._error
    }

    fetchSongs = async () => {
        runInAction(() => {
            this._isLoading = true
            this._error = null
        })
        try {
            const [songsData, likedData] = await Promise.all([
                getSongs(),
                getLikedSongs()
            ])
            runInAction(() => {
                this._songs = songsData
                this._likedIds = new Set(likedData.map(like => like.songId))
            })
        } catch (e) {
            runInAction(() => {
                this._error = e.message
            })
            console.error('Не удалось получить треки:', e)
        } finally {
            runInAction(() => {
                this._isLoading = false
            })
        }
    }

    fetchSong = async (id) => {
        runInAction(() => {
            this._isLoading = true
            this._error = null
        })
        try {
            const songData = await getSong(id)
            runInAction(() => {
                this._currentSong = {
                    ...songData,
                    isLiked: this._likedIds.has(id)
                }
            })
        } catch (e) {
            runInAction(() => {
                this._error = e.message
            })
            console.error('Не удалось получить трек:', e)
        } finally {
            runInAction(() => {
                this._isLoading = false
            })
        }
    }

    toggleLike = async (songId) => {
        try {
            await toggleLike(songId)
            runInAction(() => {
                if (this._likedIds.has(songId)) {
                    this._likedIds.delete(songId)
                } else {
                    this._likedIds.add(songId)
                }

                if (this._currentSong && this._currentSong.id === songId) {
                    this._currentSong.isLiked = !this._currentSong.isLiked
                }
            })
        } catch (e) {
            console.error('Ошибка переключения лайка:', e)
            throw e
        }
    }

    isLiked = (songId) => {
        return this._likedIds.has(songId)
    }
}