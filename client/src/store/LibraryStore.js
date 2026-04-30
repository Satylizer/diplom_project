import { makeAutoObservable } from 'mobx'

export default class LibraryStore {
    constructor() {
        this._sortBy = 'recent'
        this._activeFilter = 'All'
        this._filters = ['All', 'Playlists', 'Albums', 'Followed']
        this._sortOptions = [
            { value: 'recent', label: 'Recently Added' },
            { value: 'name', label: 'Name' }
        ]
        makeAutoObservable(this)
    }

    get sortBy() {
        return this._sortBy
    }

    get activeFilter() {
        return this._activeFilter
    }

    get filters() {
        return this._filters
    }

    get sortOptions() {
        return this._sortOptions
    }

    setSortBy(value) {
        this._sortBy = value
    }

    setActiveFilter(value) {
        this._activeFilter = value
    }
}