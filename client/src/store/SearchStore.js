import { makeAutoObservable, runInAction } from 'mobx'

export default class SearchStore {
  constructor() {
    this.query = ""
    this.activeFilter = "All"
    this.isLocked = false
    this.searchResults = []
    this.filters = ['All', 'Tracks', 'Albums', 'Artists']
    
    this.allAlbums = []
    this.allArtists = []
    this.allSongs = []
    
    makeAutoObservable(this)
  }

  get results() {
    return this.searchResults
  }

  get isSearching() {
    return this.query.length > 0
  }

  normalizeString = (str) => {
    if (!str) return ''
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
  }

  matchesSearch = (text, searchTerm) => {
    if (!text) return false
    const normalized = this.normalizeString(text)
    return normalized.startsWith(searchTerm) || normalized.includes(` ${searchTerm}`)
  }

  setAllData = (albums, artists, songs) => {
    this.allAlbums = albums
    this.allArtists = artists
    this.allSongs = songs
  }

  setQuery = (query) => {
    this.query = query
    if (this.isLocked) {
      this.isLocked = false
      this.searchResults = []
    }
  }

  setIsLocked = (bool) => {
    this.isLocked = bool
  }

  handleSearchTrigger = () => {
    if (this.query.trim()) {
      this.filterResults()
      this.isLocked = true
    }
  }

  handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (this.query.trim()) {
        this.filterResults()
        this.isLocked = true
      }
    }
  }

  handleInputChange = (newValue) => {
    this.setQuery(newValue)
  }
  
  setActiveFilter = (filter) => {
    this.activeFilter = filter
    if (this.query.trim() && this.isLocked) {
      this.filterResults()
    }
  }

  filterResults = () => {
    const searchTerm = this.normalizeString(this.query)
    if (!searchTerm) {
      this.searchResults = []
      return
    }

    let results = []

    switch (this.activeFilter) {
      case 'Albums': {
        results = this.allAlbums.filter(album => 
          this.matchesSearch(album.title, searchTerm)
        ).map(item => ({ ...item, type: 'album', uniqueKey: `album-${item.id}` }))
        break
      }
      case 'Artists': {
        results = this.allArtists.filter(artist => 
          this.matchesSearch(artist.name, searchTerm)
        ).map(item => ({ ...item, type: 'artist', uniqueKey: `artist-${item.id}` }))
        break
      }
      case 'Tracks': {
        results = this.allSongs.filter(song => 
          this.matchesSearch(song.name, searchTerm)
        ).map(item => ({ ...item, type: 'track', uniqueKey: `track-${item.id}` }))
        break
      }
      default: {
        const allResults = [
          ...this.allAlbums.filter(album => 
            this.matchesSearch(album.title, searchTerm)
          ).map(item => ({ ...item, type: 'album', uniqueKey: `album-${item.id}` })),
          ...this.allArtists.filter(artist => 
            this.matchesSearch(artist.name, searchTerm)
          ).map(item => ({ ...item, type: 'artist', uniqueKey: `artist-${item.id}` })),
          ...this.allSongs.filter(song => 
            this.matchesSearch(song.name, searchTerm)
          ).map(item => ({ ...item, type: 'track', uniqueKey: `track-${item.id}` }))
        ]
        
        const uniqueMap = new Map()
        allResults.forEach(item => {
          if (!uniqueMap.has(item.uniqueKey)) {
            uniqueMap.set(item.uniqueKey, item)
          }
        })
        results = Array.from(uniqueMap.values())
        break
      }
    }

    runInAction(() => {
      this.searchResults = results
    })
  }

  clearSearch = () => {
    this.query = ""
    this.isLocked = false
    this.searchResults = []
  }
}