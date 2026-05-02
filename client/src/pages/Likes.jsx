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
    <div className="flex bg-[#121212] min-h-screen text-white overflow-hidden antialiased">
      <Sidebar />
      
      <div className="flex-1 relative flex flex-col h-screen overflow-y-auto">
        <div 
          className="absolute top-0 left-0 right-0 h-96 pointer-events-none z-0"
          style={{
            background: `linear-gradient(to bottom, 
              #2B7FFF 0%, 
              #1A5BE7 40%, 
              #121212 100%)`
          }} 
        />
        
        <div className="relative z-20">
          <ProfileMenu />
        </div>

        <div className="relative z-10 px-12 pt-20">
          <div className="flex items-end gap-8 pb-6">
            <div className="size-48 shrink-0 bg-gradient-to-br from-[#2B7FFF] to-[#1A5BE7] rounded-lg flex items-center justify-center shadow-2xl">
              <HiHeart className="size-24 text-white fill-white" />
            </div>

            <div className="flex-1 pb-2">
              <h1 className="text-white font-bold text-[72px] tracking-[-2px] leading-none mb-6">
                Liked Songs
              </h1>
              <div className="flex items-center gap-2 text-[#9F9FA9] text-sm font-medium">
                <span>{likedSongsCount} {likedSongsCount === 1 ? 'song' : 'songs'}</span>
                <span className="opacity-50">•</span>
                <span>{totalDuration}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-9">
            <button className="size-14 rounded-full bg-[#2B7FFF] flex items-center justify-center hover:bg-[#2B7FFF]/90 hover:scale-105 transition-all shadow-lg shadow-[#2B7FFF]/30">
              <FaPlay className="text-white text-lg ml-0.5" />
            </button>
            <button className="text-[#2B7FFF] hover:text-[#2B7FFF]/80 hover:scale-110 transition-transform">
              <HiHeart className="size-9 fill-current" />
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