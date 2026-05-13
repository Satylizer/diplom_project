import { makeAutoObservable, runInAction } from 'mobx'

export default class PlayerStore {
    constructor(songStore) {
        this.songStore = songStore
        this._currentSong = null
        this._currentPlaylist = []
        this._selectedPlaylist = []
        this._currentPlaylistContext = null
        this._currentIndex = 0
        this._isPlaying = false
        this._volume = 1
        this._isMuted = false
        this.audio = null
        
        makeAutoObservable(this)
        
        if (typeof window !== 'undefined') {
            this.audio = new Audio()
            this.audio.volume = this._volume
            this.setupListeners()
        }
    }
    
    get currentSong() { return this._currentSong }
    get currentPlaylist() { return this._currentPlaylist }
    get selectedPlaylist() { return this._selectedPlaylist }
    get isPlaying() { return this._isPlaying }
    get volume() { return this._volume }
    get isMuted() { return this._isMuted }
    get progress() { 
        if (!this.audio || !this.audio.duration) return 0
        return (this.audio.currentTime / this.audio.duration) * 100
    }
    get currentPlaylistContext() { 
        return this._currentPlaylistContext 
    }
    
    setupListeners = () => {
        if (!this.audio) return
        
        this.audio.addEventListener('play', () => {
            runInAction(() => { this._isPlaying = true })
        })
        
        this.audio.addEventListener('pause', () => {
            runInAction(() => { this._isPlaying = false })
        })
        
        this.audio.addEventListener('ended', () => {
            this.playNext()
        })
    }
    
    setSelectedPlaylist = (playlist) => {
        this._selectedPlaylist = playlist
    }
    
    setCurrentPlaylist = (playlist) => {
        this._currentPlaylist = playlist
    }

    setCurrentPlaylistContext = (context) => {
        this._currentPlaylistContext = context
    }
    
    setCurrentIndex = (index) => {
        this._currentIndex = index
        this.playCurrent()
    }

    playSelectedPlaylist = async () => {
        if (this._selectedPlaylist.length === 0) return
        
        this._currentPlaylist = this._selectedPlaylist
        this._currentIndex = 0
        await this.playCurrent()
    }
    
    playCurrent = async () => {
        const song = this._currentPlaylist[this._currentIndex]
        if (!song) return

        const fullSong = await this.songStore.fetchSong(song.id)
        if (!fullSong?.streamUrl) {
            console.error('Не удалось получить streamUrl для песни:', song.id)
            return
        }
        
        runInAction(() => {
            this._currentSong = fullSong
        })
        
        this.audio.src = fullSong.streamUrl
        this.audio.play()
    }
    
    playNext = () => {
        if (this._currentIndex + 1 < this._currentPlaylist.length) {
            this._currentIndex++
            this.playCurrent()
        }
    }
    
    playPrev = () => {
        if (this._currentIndex - 1 >= 0) {
            this._currentIndex--
            this.playCurrent()
        }
    }
    
    toggle = () => {
        if (this._isPlaying) {
            this.audio.pause()
        } else {
            this.audio.play()
        }
    }
    
    seek = (percent) => {
        if (!this.audio || !this.audio.duration) return
        const time = (percent / 100) * this.audio.duration
        this.audio.currentTime = time
    }
    
    setVolume = (volume) => {
        const newVolume = Math.min(Math.max(0, volume), 1)
        this._volume = newVolume
        if (this.audio) {
            this.audio.volume = newVolume
        }
        if (newVolume === 0) {
            this._isMuted = true
        } else if (this._isMuted) {
            this._isMuted = false
        }
    }
    
    toggleMute = () => {
        if (this._isMuted) {
            this.audio.volume = this._volume
            this._isMuted = false
        } else {
            this._isMuted = true
            this.audio.volume = 0
        }
    }

    clear = () => {
        if (this.audio) {
            this.audio.pause()
            this.audio.src = ''
        }
        this._currentSong = null
        this._currentPlaylist = []
        this._selectedPlaylist = []
        this._currentIndex = 0
        this._isPlaying = false
        this._currentPlaylistContext = null
    }

    clearCurrentPlaylistContext = () => {
        this._currentPlaylistContext = null
    }
}