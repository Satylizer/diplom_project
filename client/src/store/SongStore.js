import { makeAutoObservable, runInAction } from 'mobx'
import { getSongs, getSong } from '../http/songApi'
import { getLikedSongs, toggleLike } from '../http/likesApi'

export default class SongStore {
    constructor() {
        this._songs = []
        this._likedSongsOrder = []
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

    get likedSongs() {
        return this._likedSongsOrder
            .map(id => {
                const song = this._songs.find(s => s.id === id)
                if (!song) return null
                return {
                    ...song,
                    isLiked: true
                }
            })
            .filter(song => song !== null)
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
                this._likedSongsOrder = likedData.map(like => like.songId)
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
                const index = this._songs.findIndex(s => s.id === parseInt(id))
                if (index !== -1) {
                    this._songs[index] = {
                        ...this._songs[index],
                        streamUrl: songData.streamUrl
                    }
                }
            })
            return songData
        } catch (e) {
            runInAction(() => {
                this._error = e.message
            })
            console.error('Не удалось получить трек:', e)
            return null
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
                const wasLiked = this._likedIds.has(songId)
                
                if (wasLiked) {
                    this._likedIds.delete(songId)
                    this._likedSongsOrder = this._likedSongsOrder.filter(id => id !== songId)
                } else {
                    this._likedIds.add(songId)
                    this._likedSongsOrder = [songId, ...this._likedSongsOrder]
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