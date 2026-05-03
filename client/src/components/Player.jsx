import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { useAudioPlayer } from 'wavesurf'
import { BsPlayFill, BsPauseFill, BsSkipForwardFill, BsSkipBackwardFill } from 'react-icons/bs'
import { HiVolumeUp, HiVolumeOff } from 'react-icons/hi'

const Player = observer(() => {
  const player = useAudioPlayer()
  const [isDragging, setIsDragging] = useState(false)
  const [dragProgress, setDragProgress] = useState(0)
  
  if (!player?.currentSong) return null
  
  const song = player.currentSong
  const progress = isDragging ? dragProgress : (player.progress || 0)
  
  const handleProgressChange = (e) => {
    const newProgress = parseFloat(e.target.value)
    setDragProgress(newProgress)
    setIsDragging(true)
  }
    
  const handleProgressCommit = (e) => {
    player.seek(parseFloat(e.target.value))
    setIsDragging(false)
  }
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#1A1A1A] border-t border-[#27272A] z-50">
      <div className="flex flex-col px-4 py-2 max-w-7xl mx-auto">
        
        <input
          type="range"
          min="0"
          max="100"
          step="0.1"
          value={progress}
          onChange={handleProgressChange}
          onMouseUp={handleProgressCommit}
          onTouchEnd={handleProgressCommit}
          className="w-full mb-1"
          style={{
            background: `linear-gradient(to right, #2B7FFF 0%, #2B7FFF ${progress}%, #3f3f46 ${progress}%, #3f3f46 100%)`
          }}
        />
        
        <div className="flex justify-between text-[#9F9FA9] text-xs mb-2">
          <span>{player.formatTime?.(player.currentTime) || '0:00'}</span>
          <span>{player.formatTime?.(player.duration) || '0:00'}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-40">
            <img 
              src={song.imgUrl || song.album?.imgUrl} 
              alt={song.name}
              className="w-10 h-10 rounded object-cover"
            />
            <div className="hidden sm:block">
              <h4 className="text-white text-sm font-medium truncate max-w-32">
                {song.name}
              </h4>
              <p className="text-[#9F9FA9] text-xs truncate max-w-32">
                {song.artists?.map(a => a.name).join(', ') || 'Unknown'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => player.previous?.()}
              className="text-white hover:text-[#2B7FFF] transition cursor-pointer"
            >
              <BsSkipBackwardFill className="w-5 h-5" />
            </button>
            
            <button 
              onClick={() => player.toggle()}
              className="w-10 h-10 rounded-full bg-[#2B7FFF] flex items-center justify-center hover:scale-105 transition cursor-pointer"
            >
              {player.isPlaying ? (
                <BsPauseFill className="w-6 h-6 text-white" />
              ) : (
                <BsPlayFill className="w-6 h-6 text-white ml-0.5" />
              )}
            </button>
            
            <button 
              onClick={() => player.next?.()}
              className="text-white hover:text-[#2B7FFF] transition cursor-pointer"
            >
              <BsSkipForwardFill className="w-5 h-5" />
            </button>
          </div>
          
          <div className="hidden sm:flex items-center gap-2 min-w-32 justify-end">
            <button onClick={() => player.toggleMute?.()} className="text-white cursor-pointer">
              {player.isMuted ? (
                <HiVolumeOff className="w-5 h-5" />
              ) : (
                <HiVolumeUp className="w-5 h-5" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={player.isMuted ? 0 : player.volume}
              onChange={(e) => player.setVolume?.(parseFloat(e.target.value))}
              className="volume w-24"
            />
          </div>
        </div>
      </div>
    </div>
  )
})

export default Player