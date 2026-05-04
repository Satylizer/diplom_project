import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';
import ProfileMenu from '../components/ProfileMenu';
import AlbumCard from '../components/AlbumCard';
import PlaylistCard from '../components/Playlist/PlaylistCard';
import ArtistCard from '../components/ArtistCard';
import UserCard from '../components/UserCard';
import LibrarySort from '../components/Library/LibrarySort';
import { useContext, useEffect, useState } from 'react'
import { AlbumContext, SongContext, PlaylistContext, LibraryContext, FollowContext, UserContext } from '../main'
import { HiHeart } from 'react-icons/hi2';
import { FaPlay } from 'react-icons/fa'
import { observer } from 'mobx-react-lite';

const Library = observer(() => {
  const navigate = useNavigate();
  const albumStore = useContext(AlbumContext)
  const songStore = useContext(SongContext)
  const playlistStore = useContext(PlaylistContext)
  const libraryStore = useContext(LibraryContext)
  const followStore = useContext(FollowContext)
  const userStore = useContext(UserContext)
  const [dataLoaded, setDataLoaded] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      // Загружаем всё параллельно
      await Promise.all([
        albumStore.fetchLikedAlbums(),
        songStore.fetchSongs(),
        playlistStore.fetchPlaylists(),
        followStore.fetchFollowingArtists(),
        followStore.fetchUserFollowing()
      ])
      
      libraryStore.setAllData(
        albumStore.likedAlbums,
        playlistStore.playlists,
        followStore.followedArtists,
        followStore.followedUsers
      )
      setDataLoaded(true)
    }
    
    loadData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userStore.user.id])

  const likedSongsCount = songStore.likedSongs?.length || 0
  const displayedItems = libraryStore.filteredItems
  const isLoading = !dataLoaded

  if (isLoading) {
    return (
      <div className="flex bg-[#121212] min-h-screen">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-[#27272A] border-t-[#2B7FFF] rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  const renderCard = (item) => {
    if (item.type === 'album') {
      return (
        <div 
          key={`album-${item.id}`}
          className="bg-[rgba(255,255,255,0.05)] border border-[#27272A] hover:bg-[rgba(255,255,255,0.1)] rounded-lg p-4 transition-all cursor-pointer group"
        >
          <AlbumCard 
            album={item}
            cardSize="w-full"
            titleSize="text-sm font-semibold"
            artistNamesSize="text-xs text-[#9F9FA9]"
            hasTransition={true}
          />
        </div>
      )
    } else if (item.type === 'playlist') {
      return (
        <div 
          key={`playlist-${item.id}`}
          className="bg-[rgba(255,255,255,0.05)] border border-[#27272A] hover:bg-[rgba(255,255,255,0.1)] rounded-lg p-4 transition-all cursor-pointer group"
        >
          <PlaylistCard 
            playlist={item}
            cardSize="w-full"
            titleSize="text-sm font-semibold"
            subtitleSize="text-xs text-[#9F9FA9]"
            hasTransition={true}
          />
        </div>
      )
    } else if (item.type === 'artist') {
      return (
        <div 
          key={`artist-${item.id}`}
          className="bg-[rgba(255,255,255,0.05)] border border-[#27272A] hover:bg-[rgba(255,255,255,0.1)] rounded-lg p-4 transition-all cursor-pointer group"
        >
          <ArtistCard 
            artist={item}
            cardSize="w-full"
            nameSize="text-sm font-semibold mt-2 text-center"
            hasTransition={true}
          />
        </div>
      )
    } else if (item.type === 'user') {
      return (
        <div 
          key={`user-${item.id}`}
          className="bg-[rgba(255,255,255,0.05)] border border-[#27272A] hover:bg-[rgba(255,255,255,0.1)] rounded-lg p-4 transition-all cursor-pointer group"
        >
          <UserCard 
            user={item}
            cardSize="w-full"
            titleSize="text-sm font-semibold"
            subtitleSize="text-xs text-[#9F9FA9]"
            hasOverlay={false}
          />
        </div>
      )
    }
    return null
  }

  return (
    <div className="flex bg-[#121212] min-h-screen">
      <Sidebar />
      <div className="flex-1 overflow-y-auto relative">
        <ProfileMenu />
        <div className="absolute top-0 left-0 right-0 h-75 bg-linear-to-b from-[#18181B] to-transparent pointer-events-none z-0" />
        <div className="relative z-10 pt-24 pb-6 px-12">
          
          <div className="mb-8">
            <h1 className="text-white text-[48px] font-bold tracking-[-1.2px] leading-none mb-2">Your Library</h1>
          </div>
          
          <div 
            onClick={() => navigate('/likes')}
            className="mb-8 cursor-pointer group"
          >
            <div className="bg-linear-to-br from-[#2B7FFF] to-[#1447E6] rounded-lg p-6 flex items-center gap-6 hover:brightness-105 transition-all">
              <div className="size-20 bg-linear-to-br from-white/20 to-white/5 rounded-md flex items-center justify-center">
                <HiHeart className="size-10 text-white fill-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-white text-[28px] font-medium tracking-[-0.7px] mb-1">Liked Songs</h2>
                <p className="text-white/80 text-sm">{likedSongsCount} tracks you've saved</p>
              </div>
                <button className="bg-white/20 backdrop-blur-sm rounded-full size-14 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer">
                  <FaPlay className="size-5 text-white ml-0.5" />
                </button>
            </div>
          </div>
          
          <LibrarySort />
          
          {displayedItems.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[#9F9FA9] text-lg">Nothing found</p>
              <p className="text-[#71717B] text-sm mt-2">Try changing the filter</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {displayedItems.map(renderCard)}
            </div>
          )}
          
        </div>
      </div>
    </div>
  )
})

export default Library