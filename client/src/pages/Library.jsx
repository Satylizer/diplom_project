import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';
import ProfileMenu from '../components/ProfileMenu';
import AlbumCard from '../components/AlbumCard';
import LibrarySort from '../components/Library/LibrarySort';
import { useContext } from 'react'
import { AlbumContext, SongContext } from '../main'
import { HiHeart } from 'react-icons/hi2';

const Library = () => {
  const navigate = useNavigate();

  const albumStore = useContext(AlbumContext)
  const songStore = useContext(SongContext)
  let albumsList = [...albumStore.albums]
  const likedSongsCount = songStore.likedSongs?.length || 0

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
            <div className="bg-linear-to-br from-[#2B7FFF] to-[#1447E6] rounded-lg p-6 flex items-center gap-6 hover:brightness-110 transition-all">
              <div className="size-20 bg-linear-to-br from-white/20 to-white/5 rounded-md flex items-center justify-center">
                <HiHeart className="size-10 text-white fill-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-white text-[28px] font-medium tracking-[-0.7px] mb-1">Liked Songs</h2>
                <p className="text-white/80 text-sm">{likedSongsCount} tracks you've saved</p>
              </div>
              <button className="bg-white rounded-full size-14 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <svg className="size-6 ml-1 fill-black text-black" viewBox="0 0 24 24">
                  <polygon points="6 3 20 12 6 21 6 3" />
                </svg>
              </button>
            </div>
          </div>
          
          <LibrarySort />
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {albumsList.map((album) => (
              <div 
                key={album.id}

                className="bg-[rgba(255,255,255,0.05)] border border-[#27272A] hover:bg-[rgba(255,255,255,0.1)] rounded-lg p-4 transition-all cursor-pointer group"
              >
                <AlbumCard 
                  album={album}
                  cardSize="w-full"
                  titleSize="text-sm font-semibold"
                  artistNamesSize="text-xs text-[#9F9FA9]"
                  hasTransition={true}
                />
              </div>
            ))}
          </div>
          
        </div>
      </div>
    </div>
  )
}

export default Library
