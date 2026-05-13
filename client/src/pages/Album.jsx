import { useParams } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import Sidebar from '../components/Sidebar/Sidebar'
import ProfileMenu from '../components/ProfileMenu'
import SongGrid from '../components/Song/SongGrid'
import { AlbumContext, PlayerContext } from '../main'
import { FaPlay, FaPlus, FaCheck } from 'react-icons/fa'
import { BsPauseFill } from 'react-icons/bs'

const AlbumPage = observer(() => {
  const { id } = useParams()
  const albumStore = useContext(AlbumContext)
  const playerStore = useContext(PlayerContext)
  const [isLiked, setIsLiked] = useState(false)

  useEffect(() => {
    albumStore.fetchAlbum(id)
  }, [id, albumStore])

  useEffect(() => {
    if (albumStore.currentAlbum) {
      setIsLiked(albumStore.currentAlbum.isLiked || false)
    }
  }, [albumStore.currentAlbum])

  const handleToggleLike = async () => {
    const result = await albumStore.toggleLike(id)
    setIsLiked(result.isLiked)
  }

  const album = albumStore.currentAlbum
  const loading = albumStore.isLoading
  const albumSongs = album?.songs || album?.tracks || []

  const isPlayingThisPlaylist = () => {
    if (!playerStore.isPlaying) return false
    
    const currentPlaylist = playerStore.currentPlaylist
    if (currentPlaylist.length === 0 || albumSongs.length === 0) return false
    if (currentPlaylist.length !== albumSongs.length) return false
    
    const currentIds = new Set(currentPlaylist.map(s => s?.id))
    const albumIds = new Set(albumSongs.map(s => s?.id))
    playerStore.setCurrentPlaylistContext({ type: 'album', id: album.id })
    
    if (currentIds.size !== albumIds.size) return false
    
    for (const id of currentIds) {
      if (!albumIds.has(id)) return false
    }
    
    return true
  }

  const handlePlayAll = () => {
    if (albumSongs.length === 0) return
    
    if (isPlayingThisPlaylist()) {
      playerStore.toggle()
      return
    }
    
    playerStore.setSelectedPlaylist(albumSongs)
    playerStore.playSelectedPlaylist()
  }

  if (loading) {
    return (
      <div className="flex bg-[#09090b] min-h-screen">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-[#27272A] border-t-[#2B7FFF] rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  if (!album) {
    return (
      <div className="flex bg-[#09090b] min-h-screen">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-white">Album not found</p>
        </div>
      </div>
    )
  }

  const artistName = album.artist?.name || album.artists?.[0]?.name || 'Unknown artist'

  return (
    <div className="flex bg-[#09090b] min-h-screen text-white">
      <Sidebar />
      
      <div className="flex-1 relative flex flex-col h-screen overflow-y-auto">
        <div 
          className="absolute top-0 left-0 right-0 h-98 pointer-events-none z-0"
          style={{
            background: `linear-gradient(to bottom, 
              #00D2FF 0%, 
              #00A3FF 40%, 
              #09090b 100%)`
          }} 
        />
        
        <div className="relative z-20">
          <ProfileMenu />
        </div>

        <div className="relative z-10 px-12 pt-40">
          <div className="flex items-end gap-8 pb-5">
            <div className="size-56 shrink-0 rounded-lg overflow-hidden shadow-2xl">
              {album.imgUrl ? (
                <img 
                  src={album.imgUrl} 
                  alt={album.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-linear-to-br from-[#2B7FFF] to-[#1447E6] flex items-center justify-center">
                  <svg className="w-24 h-24 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>
              )}
            </div>

            <div className="flex-1">
              <p className="text-white/70 text-sm font-medium mb-2">Album</p>
              <h1 className="text-white font-bold text-6xl tracking-tight leading-none mb-6">
                {album.title}
              </h1>
              <div className="flex items-center gap-2 text-white/70 text-sm font-medium">
                <span className="font-semibold text-white">{artistName}</span>
                <span className="opacity-50">•</span>
                <span>{albumSongs.length} songs</span>
                <span className="opacity-50">•</span>
                <span>{albumStore.totalDuration}</span>
                <span className="opacity-50">•</span>
                <span>{album.releaseDate ? new Date(album.releaseDate).getFullYear() : 'Unknown'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 pl-4">
            <button 
              onClick={handlePlayAll}
              className="size-14 rounded-full bg-[#2B7FFF] flex items-center justify-center hover:scale-105 transition-all cursor-pointer shadow-lg"
            >
              {isPlayingThisPlaylist() ? (
                <BsPauseFill className="text-black text-2xl" />
              ) : (
                <FaPlay className="text-black text-lg ml-1" />
              )}
            </button>
            <button 
              onClick={handleToggleLike}
              className={`size-9 rounded-full flex items-center justify-center transition-all ${
                isLiked 
                  ? 'bg-[#2B7FFF] text-white hover:bg-[#3B8FFF]' 
                  : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm'
              }`}
            >
              {isLiked ? <FaCheck className="text-black text-sm" /> : <FaPlus className="text-white text-sm" />}
            </button>
          </div>
        </div>

        <div className="relative z-10 mt-5 px-2 py-2 rounded-lg mx-auto w-300">
          <div className="pb-24">
            <SongGrid 
              songs={albumSongs}
              playlist = {albumSongs}
              showAlbum={false}
              playlistType="album"
              contentId = {album.id}
            />
          </div>
        </div>
      </div>
    </div>
  )
})

export default AlbumPage