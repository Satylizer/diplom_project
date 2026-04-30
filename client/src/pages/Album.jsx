import { useParams } from 'react-router-dom'
import { useContext, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import Sidebar from '../components/Sidebar/Sidebar'
import ProfileMenu from '../components/ProfileMenu'
import SongGrid from '../components/Song/SongGrid'
import { AlbumContext } from '../main'
import { FaPlay } from 'react-icons/fa'

const AlbumPage = observer(() => {
  const { id } = useParams()
  const albumStore = useContext(AlbumContext)

  useEffect(() => {
    if (id && albumStore.currentAlbum?.id !== parseInt(id)) {
      albumStore.fetchAlbum(id)
    }
  }, [id, albumStore])

  const album = albumStore.currentAlbum
  const loading = albumStore.isLoading
  const albumSongs = album?.songs || album?.tracks || []

  if (loading) {
    return (
      <div className="flex bg-[#09090B] min-h-screen">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-[#27272A] border-t-[#2B7FFF] rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  if (!album) {
    return (
      <div className="flex bg-[#09090B] min-h-screen">
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
          className="absolute top-0 left-0 right-0 h-96 pointer-events-none z-0"
          style={{
            background: `linear-gradient(to bottom, 
              #2B7FFF 0%, 
              #2B77ED 20%, 
              #121212 100%)`,
            opacity: 0.8
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
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
            <button className="size-15 rounded-full bg-[#2B7FFF] flex items-center justify-center hover:scale-105 transition-all shadow-lg shadow-[#2B7FFF]/20">
              <FaPlay className="text-white text-base ml-0.5" />
            </button>
          </div>
        </div>

        <div className="relative z-10 mt-5 px-2 py-2 rounded-lg mx-auto w-300">
          <div className="pb-24">
            <SongGrid 
              songs={albumSongs}
              showAlbum={false}
            />
          </div>
        </div>
      </div>
    </div>
  )
})

export default AlbumPage