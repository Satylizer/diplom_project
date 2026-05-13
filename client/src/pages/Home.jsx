import Sidebar from '../components/Sidebar/Sidebar'
import ProfileMenu from '../components/ProfileMenu'
import RecsCard from '../components/RecsCard'
import AlbumCard from '../components/AlbumCard'
import { useContext, useEffect, useRef } from 'react'
import { AlbumContext, ArtistContext, SongContext, UserContext, PlaylistContext } from '../main'
import { observer } from 'mobx-react-lite';
import { HiOutlineSparkles } from 'react-icons/hi';

// const getTimeOfDay = () => {
//     const hour = new Date().getHours()
//     if (hour >= 6 && hour < 12) return 'morning'
//     if (hour >= 12 && hour < 18) return 'day'
//     if (hour >= 18 && hour < 23) return 'evening'
//     return 'night'
// }

const Home = observer(() => {
  const albumStore = useContext(AlbumContext)
  const artistStore = useContext(ArtistContext)
  const songStore = useContext(SongContext)
  const userStore = useContext(UserContext)
  const playlistStore = useContext(PlaylistContext)
  const albumsList = albumStore.albums || []

  const hasUpdated = useRef(false)

  useEffect(() => {
    if (!hasUpdated.current) {
      hasUpdated.current = true
      playlistStore.fetchRecsPlaylists()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userStore.user?.id])

  useEffect(() => {
    const loadInitialData = async () => {
          if (albumsList.length === 0 && !albumStore.isLoading) {
            await albumStore.fetchAlbums()
          }
          if (artistStore.artists.length === 0 && !artistStore.isLoading) {
            await artistStore.fetchArtists()
          }
          if (songStore.songs.length === 0 && !songStore.isLoading) {
            await songStore.fetchSongs()
          }
        }
    
    loadInitialData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userStore.user?.id])

  const sequencePlaylists = playlistStore.sequencePlaylists || []
  const sameEnergyPlaylists = playlistStore.sameEnergyPlaylists || []

  if (albumStore.isLoading || artistStore.isLoading || playlistStore.isLoading) {
    return (
      <div className="flex bg-linear-to-b from-[#1A1A1A] to-[#121212] min-h-screen">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-[#27272A] border-t-[#2B7FFF] rounded-full animate-spin"></div>
            <p className="text-[#9F9FA9] text-sm animate-pulse">Loading recommendations...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex bg-linear-to-b from-[#1A1A1A] to-[#121212] min-h-screen relative">
      <Sidebar />
      <div className="flex-1 overflow-y-auto relative z-10">
        <ProfileMenu />
        
        <div className="max-w-7xl mx-auto px-8 sm:px-10 lg:px-12 pt-24 pb-8">
          
          <div className="bg-linear-to-r from-[#2B7FFF]/20 via-[#1447E6]/10 to-transparent rounded-2xl w-full mb-8 p-6 border border-white/5">
            <div className="flex items-center gap-2 mb-2">
              <HiOutlineSparkles className="w-5 h-5 text-[#2B7FFF]" />
              <span className="text-[#2B7FFF] text-sm font-medium">Good evening</span>
            </div>
            <h1 className="text-white text-2xl font-bold tracking-tight">
              Welcome back
            </h1>
            <p className="text-[#9F9FA9] text-sm mt-1">
              Discover new music and enjoy your favorite albums
            </p>
          </div>

          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-white text-lg font-bold tracking-tight">AI picks</h2>
              <span className="text-xs text-[#9F9FA9] bg-white/5 px-2 py-0.5 rounded-full">For you</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {sequencePlaylists.map(playlist => (
                <RecsCard 
                  key={playlist.id} 
                  playlist={playlist}
                  cardSize="w-full"
                  titleSize="text-sm font-semibold mt-2"
                  subtitleSize="text-xs text-[#9F9FA9] mt-0.5"
                  hasTransition={true}
                />
              ))}
            </div>
          </div>

          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-white text-lg font-bold tracking-tight">Similar vibe</h2>
              <span className="text-xs text-[#9F9FA9] bg-white/5 px-2 py-0.5 rounded-full">Same energy</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {sameEnergyPlaylists.map(playlist => (
                <RecsCard 
                  key={playlist.id} 
                  playlist={playlist}
                  cardSize="w-full"
                  titleSize="text-sm font-semibold mt-2"
                  subtitleSize="text-xs text-[#9F9FA9] mt-0.5"
                  hasTransition={true}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

export default Home