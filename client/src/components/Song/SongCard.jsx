import { useContext, useEffect } from 'react'
import { SongContext } from '../../main'
import { BsPlayFill, BsPauseFill, BsThreeDots } from 'react-icons/bs'
import { HiOutlineHeart, HiHeart } from 'react-icons/hi'
import { observer } from 'mobx-react-lite'

const formatDuration = (ms) => {
  if (!ms) return '0:00'
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

const SongCard = observer(({
  songId,
  index,
  showAlbum = true,
  hasTransition = true,
  onPlay,
  inlineView = false
}) => {
  const songStore = useContext(SongContext)

  useEffect(() => {
    if (songStore.songs.length === 0 && !songStore.isLoading) {
      songStore.fetchSongs()
    }
  }, [songStore])

  const song = songStore.songs.find(s => s.id === songId)
  const isPlaying = songStore.currentSong?.id === songId
  
  if (!song) return null

  const animationClass = hasTransition && !inlineView ? 'transition-all duration-200' : ''

  const handleLike = (e) => {
    e.stopPropagation()
    songStore.toggleLike(song.id)
  }

  if (inlineView) {
    return (
      <div className="group flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/5 transition cursor-pointer">
        <div className="relative w-10 h-10 rounded-md overflow-hidden shrink-0">
          <img 
            src={song.imgUrl || song.album?.imgUrl} 
            alt={song.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition flex items-center justify-center">
            <button 
              onClick={onPlay}
              className="opacity-0 group-hover:opacity-100 transition text-white"
            >
              {isPlaying ? (
                <BsPauseFill className="w-6 h-6" />
              ) : (
                <BsPlayFill className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className={`font-normal truncate text-base ${isPlaying ? 'text-[#2B7FFF]' : 'text-white'}`}>
            {song.name}
          </h4>
          <p className="text-[#a1a1aa] text-sm truncate">
            {song.artists?.map(a => a.name).join(', ') || 'Unknown artist'}
          </p>
        </div>
        
        <div className="flex items-center gap-2 shrink-0">
          <button 
            onClick={handleLike}
            className="p-1"
          >
            {song.isLiked ? (
              <HiHeart className="w-5 h-5 text-[#2B7FFF]" />
            ) : (
              <HiOutlineHeart className="w-5 h-5 text-[#a1a1aa] opacity-0 group-hover:opacity-100 transition" />
            )}
          </button>
          
          <span className="text-[#a1a1aa] text-sm min-w-11.25 text-right">
            {formatDuration(song.durationMs)}
          </span>
          
          <button className="p-1 opacity-0 group-hover:opacity-100 transition">
            <BsThreeDots className="w-5 h-5 text-[#a1a1aa] hover:text-white" />
          </button>
          
          <span className="text-[#a1a1aa] text-xs px-2 py-0.5 bg-white/5 rounded">Track</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`group grid grid-cols-12 gap-4 px-4 py-1.5 rounded-md hover:bg-white/10 cursor-pointer ${animationClass}`}>
      
      <div className="col-span-1 flex items-center justify-start relative">
        <span className={`text-[#a1a1aa] text-base pl-2 font-normal w-8 text-left transition-opacity ${!isPlaying ? 'group-hover:opacity-0' : 'opacity-0'}`}>
          {index}
        </span>
        <button 
          onClick={onPlay} 
          className={`absolute left-0 text-white items-center justify-center transition-all ${isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
        >
          {isPlaying ? (
            <BsPauseFill className="w-7 h-7 text-[#2B7FFF]" />
          ) : (
            <BsPlayFill className="w-7 h-7" />
          )}
        </button>
      </div>

      <div className="col-span-6 flex items-center gap-3">
        {showAlbum && (
          <img 
            src={song.imgUrl || song.album?.imgUrl} 
            alt={song.name}
            className="w-10 h-10 rounded object-cover"
          />
        )}
        <div className="flex flex-col justify-center min-w-0 flex-1">
          <h4 className={`font-normal truncate text-base ${isPlaying ? 'text-[#2B7FFF]' : 'text-white'}`}>
            {song.name}
          </h4>
          <div className="flex items-center gap-1 flex-wrap">
            {song.artists?.map((artist, idx) => (
              <span key={artist.id} className="text-[#a1a1aa] text-sm hover:text-white hover:underline transition">
                {artist.name}{idx < song.artists.length - 1 ? ', ' : ''}
              </span>
            ))}
            {(!song.artists || song.artists.length === 0) && (
              <span className="text-[#a1a1aa] text-sm">Unknown artist</span>
            )}
          </div>
        </div>
      </div>

      {showAlbum && (
        <div className="col-span-3 flex items-center">
          <p className="text-[#a1a1aa] text-sm truncate hover:text-white transition">
            {song.album?.title || '—'}
          </p>
        </div>
      )}

      <div className={`${showAlbum ? 'col-span-2' : 'col-span-5'} flex items-center justify-end gap-3`}>
        <button 
          onClick={handleLike}
          className="transition-transform active:scale-90"
        >
          {song.isLiked ? (
            <HiHeart className="w-6 h-6 text-[#2B7FFF]" />
          ) : (
            <HiOutlineHeart className="w-6 h-6 text-[#a1a1aa] opacity-0 group-hover:opacity-100 hover:text-white transition" />
          )}
        </button>
        
        <span className="text-[#a1a1aa] text-sm text-right">
          {formatDuration(song.durationMs)}
        </span>

        <button className="shrink-0 opacity-0 group-hover:opacity-100 transition">
          <BsThreeDots className="w-4 h-4 text-[#a1a1aa] hover:text-white" />
        </button>
      </div>
    </div>
  )
})

export default SongCard