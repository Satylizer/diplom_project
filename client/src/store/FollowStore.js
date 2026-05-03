import { makeAutoObservable, runInAction } from 'mobx'
import { 
    toggleUserFollow, 
    getUserFollowing,
    toggleArtistFollow, 
    getUserFollowedArtists 
} from '../http/followApi'

export default class FollowStore {
    constructor() {
        this._followedUsers = []
        this._followedArtists = []
        this._isLoading = false
        this._error = null
        makeAutoObservable(this)
    }

    get followedUsers() {
        return this._followedUsers
    }

    get followedArtists() {
        return this._followedArtists
    }

    get isLoading() {
        return this._isLoading
    }

    get error() {
        return this._error
    }

    toggleUserFollow = async (userId) => {
        runInAction(() => {
            this._isLoading = true
            this._error = null
        })
        try {
            const data = await toggleUserFollow(userId)
            runInAction(() => {
                if (data.isFollowing) {
                    this._followedUsers.push({ id: userId })
                } else {
                    this._followedUsers = this._followedUsers.filter(u => u.id !== userId)
                }
            })
            return { success: true, isFollowing: data.isFollowing }
        } catch (e) {
            runInAction(() => {
                this._error = e.response?.data?.message || 'Ошибка подписки'
            })
            return { success: false, error: this._error }
        } finally {
            runInAction(() => {
                this._isLoading = false
            })
        }
    }

    fetchUserFollowing = async (userId) => {
        runInAction(() => {
            this._isLoading = true
            this._error = null
        })
        try {
            const data = await getUserFollowing(userId)
            runInAction(() => {
                this._followedUsers = data
            })
            return data
        } catch (e) {
            runInAction(() => {
                this._error = e.response?.data?.message || 'Ошибка загрузки'
            })
            return []
        } finally {
            runInAction(() => {
                this._isLoading = false
            })
        }
    }

    toggleArtistFollow = async (artistId) => {
        runInAction(() => {
            this._isLoading = true
            this._error = null
        })
        try {
            const data = await toggleArtistFollow(artistId)
            runInAction(() => {
                if (data.isFollowing) {
                    this._followedArtists.push({ id: artistId })
                } else {
                    this._followedArtists = this._followedArtists.filter(a => a.id !== artistId)
                }
            })
            return { success: true, isFollowing: data.isFollowing }
        } catch (e) {
            runInAction(() => {
                this._error = e.response?.data?.message || 'Ошибка подписки'
            })
            return { success: false, error: this._error }
        } finally {
            runInAction(() => {
                this._isLoading = false
            })
        }
    }

    fetchFollowingArtists = async () => {
        runInAction(() => {
            this._isLoading = true
            this._error = null
        })
        try {
            const data = await getUserFollowedArtists()
            runInAction(() => {
                this._followedArtists = data
            })
            return data
        } catch (e) {
            runInAction(() => {
                this._error = e.response?.data?.message || 'Ошибка загрузки'
            })
            return []
        } finally {
            runInAction(() => {
                this._isLoading = false
            })
        }
    }
}