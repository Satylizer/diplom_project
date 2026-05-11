import { makeAutoObservable, runInAction } from 'mobx'
import { getPlaylists, getPlaylist, createPlaylist, deletePlaylist, addSongToPlaylist, removeSongFromPlaylist, getUserPlaylists } from '../http/playlistApi'
import { getRecsPlaylists, updateRecsPlaylists } from '../http/recsApi'

export default class PlaylistStore {
    constructor() {
        this._playlists = []
        this._userPlaylists = []
        this._recsPlaylists = { sequence: [], sameEnergy: [] }
        this._currentPlaylist = null
        this._isLoading = false
        this._error = null
        
        makeAutoObservable(this)
    }

    get playlists() {
        return this._playlists
    }

    get userPlaylists() {
        return this._userPlaylists
    }

    get recsPlaylists() {
        return this._recsPlaylists
    }

    get sequencePlaylists() {
        return this._recsPlaylists.sequence || []
    }

    get sameEnergyPlaylists() {
        return this._recsPlaylists.sameEnergy || []
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

    fetchUserPlaylists = async (userId) => {
        this._isLoading = true
        this._error = null
        try {
            const data = await getUserPlaylists(userId)
            runInAction(() => {
                this._userPlaylists = data
            })
            return data
        } catch (e) {
            runInAction(() => {
                this._error = e.message
            })
            console.error('Ошибка загрузки плейлистов пользователя:', e)
            return []
        } finally {
            runInAction(() => {
                this._isLoading = false
            })
        }
    }

    fetchPlaylist = async (id) => {
    this._isLoading = true
    try {
        const data = await getPlaylist(id)
        runInAction(() => {
            this._currentPlaylist = data
        })
    } catch (e) {
        console.error('ERROR', e)
        runInAction(() => {
            this._error = e.message
        })
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

    fetchRecsPlaylists = async () => {
        this._isLoading = true
        this._error = null
        try {
            const { sequence, sameEnergy } = await getRecsPlaylists()
            
            runInAction(() => {
                this._recsPlaylists = {
                    sequence: sequence || [],
                    sameEnergy: sameEnergy || []
                }
            })
            
            return { sequence, sameEnergy }
        } catch (e) {
            runInAction(() => {
                this._error = e.message
            })
            console.error('Ошибка загрузки AI плейлистов:', e)
            return { sequence: [], sameEnergy: [] }
        } finally {
            runInAction(() => {
                this._isLoading = false
            })
        }
    }

    updateRecsPlaylists = async (top_k = 100) => {
        this._isLoading = true
        this._error = null
        try {
            const result = await updateRecsPlaylists(top_k)
            
            if (result.success) {
                await this.fetchRecsPlaylists()
            }
            
            return result
        } catch (e) {
            runInAction(() => {
                this._error = e.message
            })
            console.error('Ошибка обновления AI плейлистов:', e)
            return { success: false, error: e.message }
        } finally {
            runInAction(() => {
                this._isLoading = false
            })
        }
    }
}