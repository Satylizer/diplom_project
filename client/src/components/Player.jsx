import { observer } from 'mobx-react-lite'
import { useContext, useState, useEffect, useRef } from 'react'
import { PlayerContext, HistoryContext, SongContext } from '../main'
import { BsPlayFill, BsPauseFill, BsSkipForwardFill, BsSkipBackwardFill } from 'react-icons/bs'
import { HiVolumeUp, HiVolumeOff } from 'react-icons/hi'
import { FaPlus, FaCheck } from 'react-icons/fa'

const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const Player = observer(() => {
  const playerStore = useContext(PlayerContext)
  const historyStore = useContext(HistoryContext)
  const songStore = useContext(SongContext)
  const [isDragging, setIsDragging] = useState(false)
  const [dragProgress, setDragProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const animationRef = useRef(null)
  const pendingSeekRef = useRef(null)
  const lastPlayedSongId = useRef(null)

  useEffect(() => {
    if (!playerStore?.audio) return
    
    const updateTime = () => {
      if (!isDragging && playerStore.audio) {
        if (!pendingSeekRef.current) {
          setCurrentTime(playerStore.audio.currentTime)
          setDuration(playerStore.audio.duration || 0)
        }
      }
      animationRef.current = requestAnimationFrame(updateTime)
    }
    
    animationRef.current = requestAnimationFrame(updateTime)
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [playerStore?.audio, isDragging])
  
  useEffect(() => {
    const currentSongId = playerStore?.currentSong?.id
    if (currentSongId && currentSongId !== lastPlayedSongId.current) {
      lastPlayedSongId.current = currentSongId
      historyStore.addToHistory(currentSongId)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerStore?.currentSong?.id])
  
  if (!playerStore?.currentSong) return null
  
  const song = playerStore.currentSong
  const progress = isDragging ? dragProgress : (currentTime / duration) * 100 || 0
  
  let artistNames = 'Unknown'
  if (song.artists && song.artists.length > 0) {
    artistNames = song.artists.map(a => a.name).join(', ')
  } else if (song.artist) {
    artistNames = song.artist
  }

  const isLiked = songStore.songs.find(s => s.id === song.id)?.isLiked || false

  const handleLike = () => {
    songStore.toggleLike(song.id)
  }
  
  const handleSeekStart = () => {
    setIsDragging(true)
  }
  
  const handleSeekChange = (e) => {
    const newProgress = parseFloat(e.target.value)
    setDragProgress(newProgress)
  }
  
  const handleSeekEnd = async (e) => {
    const percent = parseFloat(e.target.value)
    
    pendingSeekRef.current = true
    playerStore.seek(percent)
    
    setTimeout(() => {
      if (playerStore.audio) {
        setCurrentTime(playerStore.audio.currentTime)
      }
      pendingSeekRef.current = null
      setIsDragging(false)
    }, 50)
  }
  
  const displayCurrentTime = isDragging 
    ? (dragProgress / 100) * duration 
    : currentTime
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#0a0a0a] border-t border-[#27272A] z-50">
      <div className="flex items-center justify-between px-6 py-3 max-w-350 mx-auto">

        <div className="flex items-center gap-3 min-w-45">
          <div className="w-12 h-12 rounded-md overflow-hidden bg-[#181818] shadow-lg shrink-0">
            {song.imgUrl ? (
              <img 
                src={song.imgUrl} 
                alt={song.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-linear-to-br from-[#2B7FFF] to-[#1447E6] flex items-center justify-center">
                <svg className="w-5 h-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
                </svg>
              </div>
            )}
          </div>
          
          <div className="hidden lg:block">
            <div className="flex items-center gap-2">
              <h4 className="text-white text-sm font-medium hover:underline cursor-pointer truncate max-w-35">
                {song.name}
              </h4>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-[#9F9FA9] text-xs truncate max-w-35">
                {artistNames}
              </p>
            </div>
          </div>

          <button 
            onClick={handleLike}
            className={`w-4.5 h-4.5 rounded-full flex items-center justify-center transition cursor-pointer shrink-0 ${
              isLiked 
                ? 'bg-[#2B7FFF] border-none' 
                : 'border border-white/80 bg-transparent hover:border-white hover:bg-white/5'
            }`}
          >
            {isLiked ? (
              <FaCheck className="w-2.5 h-2.5 text-[#0a0a0a]" />
            ) : (
              <FaPlus className="w-2.5 h-2.5 text-white/80 hover:text-white" />
            )}
          </button>
        </div>

        <div className="flex flex-col items-center gap-1 flex-1 max-w-150">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => playerStore.playPrev()}
              className="text-[#9F9FA9] hover:text-white transition"
            >
              <BsSkipBackwardFill className="w-5 h-5" />
            </button>
            
            <button 
              onClick={() => playerStore.toggle()}
              className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:scale-105 transition shadow-lg"
            >
              {playerStore.isPlaying ? (
                <BsPauseFill className="w-4 h-4 text-black" />
              ) : (
                <BsPlayFill className="w-4 h-4 text-black ml-0.5" />
              )}
            </button>
            
            <button 
              onClick={() => playerStore.playNext()}
              className="text-[#9F9FA9] hover:text-white transition"
            >
              <BsSkipForwardFill className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex items-center gap-2 w-full">
            <span className="text-xs text-[#9F9FA9] min-w-10 text-right">
              {formatTime(displayCurrentTime)}
            </span>
            
            <input
              type="range"
              min="0"
              max="100"
              step="0.1"
              value={progress}
              onMouseDown={handleSeekStart}
              onTouchStart={handleSeekStart}
              onChange={handleSeekChange}
              onMouseUp={handleSeekEnd}
              onTouchEnd={handleSeekEnd}
              className="flex-1 h-1 bg-[#2a2a2a] rounded-full cursor-pointer"
              style={{
                background: `linear-gradient(to right, #2B7FFF 0%, #2B7FFF ${progress}%, #2a2a2a ${progress}%, #2a2a2a 100%)`
              }}
            />
            
            <span className="text-xs text-[#9F9FA9] min-w-10">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 min-w-45 justify-end">
          <button 
            onClick={() => playerStore.toggleMute()}
            className="text-[#9F9FA9] hover:text-white transition"
          >
            {playerStore.isMuted ? <HiVolumeOff className="w-5 h-5" /> : <HiVolumeUp className="w-5 h-5" />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={playerStore.isMuted ? 0 : playerStore.volume}
            onChange={(e) => playerStore.setVolume(parseFloat(e.target.value))}
            className="volume w-24 h-1 bg-[#2a2a2a] rounded-full cursor-pointer"
            style={{
              background: `linear-gradient(to right, #2B7FFF 0%, #2B7FFF ${playerStore.volume * 100}%, #2a2a2a ${playerStore.volume * 100}%, #2a2a2a 100%)`
            }}
          />
        </div>
      </div>
    </div>
  )
})

export default Player