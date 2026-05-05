import Sidebar from '../components/Sidebar/Sidebar'
import ProfileMenu from '../components/ProfileMenu'
import SongGrid from '../components/Song/SongGrid'
import { useContext, useEffect, useMemo } from 'react'
import { observer } from 'mobx-react-lite'
import { SongContext, UserContext, PlayerContext } from '../main'
import { HiHeart } from 'react-icons/hi'
import { FaPlay } from 'react-icons/fa'
import { BsPauseFill } from 'react-icons/bs'

const Likes = observer(() => {
  const songStore = useContext(SongContext)
  const userStore = useContext(UserContext)
  const playerStore = useContext(PlayerContext)
  const likedSongs = songStore.likedSongs
  const likedSongsCount = likedSongs.length
  const totalDuration = songStore.totalDuration

  useEffect(() => {
    if (likedSongs.length === 0 && !songStore.isLoading) {
      songStore.fetchSongs()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userStore.user?.id])

  useEffect(() => {
    if (likedSongs.length > 0) {
      playerStore.setSelectedPlaylist(likedSongs)
    }
  }, [likedSongs, playerStore])

  const isSamePlaylist = useMemo(() => {
    if (playerStore.currentPlaylist.length !== likedSongs.length) return false
    
    const currentIds = playerStore.currentPlaylist.map(s => s.id).sort()
    const likedIds = likedSongs.map(s => s.id).sort()
    
    return currentIds.every((id, index) => id === likedIds[index])
  }, [playerStore.currentPlaylist, likedSongs])

  const isPlayingThisPlaylist = isSamePlaylist && playerStore.isPlaying

  const handlePlayAll = () => {
    if (likedSongs.length === 0) return
    
    if (isSamePlaylist && playerStore.isPlaying) {
      playerStore.toggle()
      return
    }
    
    if (isSamePlaylist && !playerStore.isPlaying) {
      playerStore.toggle()
      return
    }
    
    playerStore.playSelectedPlaylist()
  }

  return (
    <div className="flex bg-[#09090B] min-h-screen text-white overflow-hidden antialiased">
      <Sidebar />
      
      <div className="flex-1 relative flex flex-col h-screen overflow-y-auto">
        <div 
          className="absolute top-0 left-0 right-0 h-80 bg-linear-to-b from-[#2B7FFF] to-[#09090B] pointer-events-none z-0"
        />
        
        <div className="relative z-20">
          <ProfileMenu />
        </div>

        <div className="relative z-10 px-8 pt-20">
          <div className="flex items-end gap-6">
            <div className="w-52 h-52 shrink-0 bg-linear-to-br from-white via-[#2B7FFF] to-[#1447E6] rounded-md shadow-2xl flex items-center justify-center">
              <HiHeart className="w-28 h-28 text-white fill-white drop-shadow-lg" />
            </div>
            
            <div className="flex-1 pb-2">
              <p className="text-white text-sm font-medium mb-2">Playlist</p>
              <h1 className="text-white font-bold text-7xl tracking-tight leading-none mb-6">
                Liked Songs
              </h1>
              <div className="flex items-center gap-2 text-white/70 text-sm font-medium">
                <span className="font-semibold text-white">{likedSongsCount} songs</span>
                <span className="opacity-50">•</span>
                <span>{totalDuration}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 mt-6">
            <button 
              onClick={handlePlayAll}
              className="size-14 rounded-full bg-[#2B7FFF] flex items-center justify-center hover:scale-105 transition-all cursor-pointer shadow-lg"
            >
              {isPlayingThisPlaylist ? (
                <BsPauseFill className="text-black text-2xl" />
              ) : (
                <FaPlay className="text-black text-lg ml-0.5" />
              )}
            </button>
            <button className="text-[#2B7FFF] transition-all cursor-pointer">
              <HiHeart className="size-8 fill-current" />
            </button>
          </div>
        </div>

        <div className="relative z-10 px-8 mt-6 pb-24">
          <SongGrid 
            songs={likedSongs}
            showAlbum={true}
          />
        </div>
      </div>
    </div>
  )
})

export default Likes