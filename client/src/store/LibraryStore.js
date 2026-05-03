import { makeAutoObservable, runInAction } from 'mobx'

export default class LibraryStore {
    constructor() {
        this._sortBy = 'recent'
        this._activeFilter = 'All'
        this._isLoading = false
        this._filteredItems = []
        
        this._filters = ['All', 'Playlists', 'Albums', 'Followed']
        this._sortOptions = [
            { value: 'recent', label: 'Recently Added' },
            { value: 'name', label: 'Name' }
        ]

        this._likedAlbums = []
        this._allPlaylists = []
        this._followedArtists = []
        this._followedUsers = []
          
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

    get filteredItems() {
        return this._filteredItems
    }

    get isLoading() {
        return this._isLoading
    }

    setSortBy(value) {
        this._sortBy = value
        this.filterAndSort()
    }

    setActiveFilter(value) {
        this._activeFilter = value
        this.filterAndSort()
    }

    setAllData = (likedAlbums, playlists, followedArtists, followedUsers) => {
        this._likedAlbums = likedAlbums
        this._allPlaylists = playlists
        this._followedArtists = followedArtists
        this._followedUsers = followedUsers
        this.filterAndSort()
    }

    filterAndSort = () => {
        this._isLoading = true
        
        let items = []
        const { activeFilter, sortBy } = this

        switch (activeFilter) {
            case 'Albums': {
                items = [...this._likedAlbums].map(item => ({ ...item, type: 'album' }))
                break
            }
            case 'Playlists': {
                items = [...this._allPlaylists].map(item => ({ ...item, type: 'playlist' }))
                break
            }
            case 'Followed': {
                const artists = [...this._followedArtists].map(item => ({ 
                    ...item, 
                    type: 'artist',
                    name: item.name
                }))
                const users = [...this._followedUsers].map(item => ({ 
                    ...item, 
                    type: 'user',
                    name: item.username
                }))
                items = [...artists, ...users]
                break
            }
            default: {
                const allAlbums = [...this._likedAlbums].map(item => ({ ...item, type: 'album' }))
                const allPlaylists = [...this._allPlaylists].map(item => ({ ...item, type: 'playlist' }))
                const allArtists = [...this._followedArtists].map(item => ({ ...item, type: 'artist' }))
                const allUsers = [...this._followedUsers].map(item => ({ 
                    ...item, 
                    type: 'user',
                    name: item.username
                }))
                items = [...allAlbums, ...allPlaylists, ...allArtists, ...allUsers]
                break
            }
        }

        if (sortBy === 'name') {
            items.sort((a, b) => {
                const nameA = (a.title || a.name || a.username || '').toLowerCase()
                const nameB = (b.title || b.name || b.username || '').toLowerCase()
                return nameA.localeCompare(nameB)
            })
        } else if (sortBy === 'recent') {
            items.sort((a, b) => {
                const dateA = a.createdAt || a.releaseDate || 0
                const dateB = b.createdAt || b.releaseDate || 0
                return new Date(dateB) - new Date(dateA)
            })
        }

        runInAction(() => {
            this._filteredItems = items
            this._isLoading = false
        })
        
        return items
    }
}