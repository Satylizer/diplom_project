import Sidebar from '../components/Sidebar/Sidebar'
import ProfileMenu from '../components/ProfileMenu'
import SongGrid from '../components/Song/SongGrid'
import { useContext, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { SongContext, UserContext } from '../main'
import { HiHeart } from 'react-icons/hi'
import { FaPlay } from 'react-icons/fa'

const Likes = observer(() => {
  const songStore = useContext(SongContext)
  const userStore = useContext(UserContext)
  const likedSongs = songStore.likedSongs
  const likedSongsCount = likedSongs.length
  const totalDuration = songStore.totalDuration

  useEffect(() => {
    if (likedSongs.length === 0 && !songStore.isLoading) {
      songStore.fetchSongs()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userStore.user?.id])

  if (songStore.isLoading) {
    return (
      <div className="flex bg-[#121212] min-h-screen">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-[#27272A] border-t-[#2B7FFF] rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex bg-[#121212] min-h-screen text-white overflow-hidden antialiased font-sans">
      <Sidebar />
      
      <div className="flex-1 relative flex flex-col h-screen overflow-y-auto bg-[#121212]">
        
        <div 
          className="absolute top-0 left-0 right-0 h-110 bg-linear-to-b from-[#2B7FFF]/40 to-[#121212] pointer-events-none z-0" 
        />
        
        <div className="relative z-20">
          <ProfileMenu />
        </div>

        <div className="relative z-10 px-12 pt-20">
          <div className="flex items-end gap-8 pb-6">
            
            <div className="size-48 shrink-0 bg-linear-to-br from-[#2B7FFF] to-[#1A4FAF] rounded-lg flex items-center justify-center shadow-2xl">
              <HiHeart className="size-24 text-white fill-white drop-shadow-lg" />
            </div>

            <div className="flex-1 pb-2">
              <h1 className="text-white font-bold text-[72px] tracking-[-2px] leading-none mb-6">
                Liked Songs
              </h1>
              <div className="flex items-center gap-2 text-white/60 text-sm font-medium">
                <span className="text-white font-semibold">{likedSongsCount} {likedSongsCount === 1 ? 'song' : 'songs'}</span>
                <span className="opacity-50">•</span>
                <span>{totalDuration}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-9">
            <button className="size-14 rounded-full bg-[#2B7FFF] flex items-center justify-center hover:scale-105 transition-all cursor-pointer shadow-lg active:scale-95">
              <FaPlay className="text-black text-lg ml-0.5" />
            </button>
            
            <button className="text-[#2B7FFF] hover:brightness-110 transition-all cursor-pointer">
              <HiHeart className="size-10 fill-current" />
            </button>
          </div>
        </div>

        <div className="relative z-10 px-12 mt-6 pb-24">
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
