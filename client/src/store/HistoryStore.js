import { makeAutoObservable, runInAction } from 'mobx'
import { getHistory, addToHistory } from '../http/historyApi'

export default class HistoryStore {
    constructor() {
        this._history = []
        this._isLoading = false
        this._error = null
        makeAutoObservable(this)
    }

    get history() {
        return this._history
    }

    get isLoading() {
        return this._isLoading
    }

    get error() {
        return this._error
    }

    get historyCount() {
        return this._history.length
    }

    fetchHistory = async () => {
        this._isLoading = true
        this._error = null
        try {
            const data = await getHistory()
            runInAction(() => {
                this._history = data
            })
        } catch (e) {
            runInAction(() => {
                this._error = e.message
            })
            console.error('Не удалось получить историю:', e)
        } finally {
            runInAction(() => {
                this._isLoading = false
            })
        }
    }

    addToHistory = async (songId) => {
        try {
            await addToHistory(songId)
            runInAction(() => {
                this._history = this._history.filter(id => id !== songId)
                this._history.unshift(songId)
            })
        } catch (e) {
            console.error('Не удалось добавить в историю:', e)
            throw e
        }
    }

    getHistorySongs = (songStore) => {
        return this._history
            .map(id => songStore.songs.find(s => s.id === id))
            .filter(song => song)
    }
}