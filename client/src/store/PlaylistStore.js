import { makeAutoObservable, runInAction } from 'mobx'
import { getPlaylists, getPlaylist, createPlaylist, deletePlaylist, addSongToPlaylist, removeSongFromPlaylist } from '../http/playlistApi'

export default class PlaylistStore {
    constructor() {
        this._playlists = []
        this._currentPlaylist = null
        this._isLoading = false
        this._error = null
        
        makeAutoObservable(this)
    }

    get playlists() {
        return this._playlists
    }

    get currentPlaylist() {
        return this._currentPlaylist
    }

    get isLoading() {
        return this._isLoading
    }

    get error() {
        return this._error
    }

    get totalDuration() {
        if (!this._currentPlaylist) return '0 min'
        
        const songs = this._currentPlaylist.songs || []
        const totalMs = songs.reduce((acc, song) => acc + (song.durationMs || 0), 0)
        const totalMinutes = Math.floor(totalMs / 60000)
        const totalHours = Math.floor(totalMinutes / 60)
        const remainingMinutes = totalMinutes % 60
        
        return totalHours > 0 
            ? `${totalHours} hr ${remainingMinutes} min` 
            : `${totalMinutes} min`
    }

    get songCount() {
        if (!this._currentPlaylist) return 0
        return this._currentPlaylist.songs?.length || 0
    }

    fetchPlaylists = async () => {
        this._isLoading = true
        this._error = null
        try {
            const data = await getPlaylists()
            runInAction(() => {
                this._playlists = data
            })
        } catch (e) {
            runInAction(() => {
                this._error = e.message
            })
            console.error('Ошибка загрузки плейлистов:', e)
        } finally {
            runInAction(() => {
                this._isLoading = false
            })
        }
    }

    fetchPlaylist = async (id) => {
        this._isLoading = true
        this._error = null
        try {
            const data = await getPlaylist(id)
            runInAction(() => {
                this._currentPlaylist = data
            })
        } catch (e) {
            runInAction(() => {
                this._error = e.message
            })
            console.error('Ошибка загрузки плейлиста:', e)
        } finally {
            runInAction(() => {
                this._isLoading = false
            })
        }
    }

    createPlaylist = async (playlistData) => {
        if (!playlistData.title) {
            console.error('Название плейлиста обязательно')
            return { success: false, error: 'Название плейлиста обязательно' }
        }
        
        if (!playlistData.img) {
            console.error('Изображение плейлиста обязательно')
            return { success: false, error: 'Изображение плейлиста обязательно' }
        }

        this._isLoading = true
        this._error = null
        try {
            const data = await createPlaylist(playlistData)
            runInAction(() => {
                this._playlists.unshift(data)
            })
            return { success: true, playlist: data }
        } catch (e) {
            runInAction(() => {
                this._error = e.message
            })
            console.error('Ошибка создания плейлиста:', e)
            return { success: false, error: e.message }
        } finally {
            runInAction(() => {
                this._isLoading = false
            })
        }
    }

    deletePlaylist = async (id) => {
        this._isLoading = true
        this._error = null
        try {
            await deletePlaylist(id)
            runInAction(() => {
                this._playlists = this._playlists.filter(playlist => playlist.id !== id)
                if (this._currentPlaylist?.id === id) {
                    this._currentPlaylist = null
                }
            })
            return { success: true }
        } catch (e) {
            runInAction(() => {
                this._error = e.message
            })
            console.error('Ошибка удаления плейлиста:', e)
            return { success: false, error: e.message }
        } finally {
            runInAction(() => {
                this._isLoading = false
            })
        }
    }

    addSongToPlaylist = async (playlistId, songId) => {
        this._isLoading = true
        this._error = null
        try {
            await addSongToPlaylist(playlistId, songId)
            await this.fetchPlaylist(playlistId)
            return { success: true }
        } catch (e) {
            runInAction(() => {
                this._error = e.message
            })
            console.error('Ошибка добавления песни в плейлист:', e)
            return { success: false, error: e.message }
        } finally {
            runInAction(() => {
                this._isLoading = false
            })
        }
    }

    removeSongFromPlaylist = async (playlistId, songId) => {
        this._isLoading = true
        this._error = null
        try {
            await removeSongFromPlaylist(playlistId, songId)
            await this.fetchPlaylist(playlistId)
            return { success: true }
        } catch (e) {
            runInAction(() => {
                this._error = e.message
            })
            console.error('Ошибка удаления песни из плейлиста:', e)
            return { success: false, error: e.message }
        } finally {
            runInAction(() => {
                this._isLoading = false
            })
        }
    }
}