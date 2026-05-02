import { useContext, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { HiOutlineSearch, HiOutlineX } from 'react-icons/hi'
import SearchFilters from './SearchFilters'
import SearchMain from './SearchMain'
import SearchResults from './SearchResults'
import { AlbumContext, ArtistContext, SearchContext, SongContext, UserContext } from '../../main'

const SearchQuery = observer(() => {
  const albumStore = useContext(AlbumContext)
  const artistStore = useContext(ArtistContext)
  const songStore = useContext(SongContext)
  const userStore = useContext(UserContext)
  const searchStore = useContext(SearchContext)

  useEffect(() => {
    const loadData = async () => {
      if (albumStore.albums.length === 0 && !albumStore.isLoading) {
        await albumStore.fetchAlbums()
      }
      if (artistStore.artists.length === 0 && !artistStore.isLoading) {
        await artistStore.fetchArtists()
      }
      if (songStore.songs.length === 0 && !songStore.isLoading) {
        await songStore.fetchSongs()
      }
      if (userStore.users.length === 0 && !userStore.isLoading) {
        await userStore.fetchUsers()
      }
      searchStore.setAllData(
        albumStore.albums, 
        artistStore.artists, 
        songStore.songs,
        userStore.users
      )
    }
    loadData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (searchStore.isLocked && searchStore.query.trim()) {
      searchStore.filterResults()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchStore.activeFilter])

  const isLoading = albumStore.isLoading || artistStore.isLoading || songStore.isLoading || userStore.isLoading

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#27272A] border-t-[#2B7FFF] rounded-full animate-spin"></div>
          <p className="text-[#9F9FA9] text-sm animate-pulse">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="relative mb-12">
        <div className="relative w-full">
          <input
            type="text"
            value={searchStore.query}
            onChange={(e) => searchStore.handleInputChange(e.target.value)}
            onKeyDown={(e) => searchStore.handleKeyDown(e)}
            placeholder="What do you want to listen to?"
            className={`w-full py-4 pl-6 pr-24 text-white text-base placeholder:text-[#9F9FA9] outline-none transition-all duration-300 rounded-full ${
              searchStore.isLocked 
                ? 'bg-[rgba(255,255,255,0.1)] border border-transparent shadow-inner shadow-white/5' 
                : 'bg-[rgba(255,255,255,0.1)] border border-[#27272A] hover:bg-[rgba(255,255,255,0.15)] focus:border-[#2B7FFF]'
            }`}
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3">
            {searchStore.query && (
              <button 
                onClick={() => searchStore.clearSearch()} 
                className="text-[#9F9FA9] hover:text-white transition-colors p-1 cursor-pointer"
              >
                <HiOutlineX className="size-5" />
              </button>
            )}
            <button 
              onClick={() => searchStore.handleSearchTrigger()}
              className={`p-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                searchStore.isLocked 
                  ? 'text-white bg-[#2B7FFF] scale-105' 
                  : 'text-[#9F9FA9] hover:text-white hover:bg-[rgba(255,255,255,0.15)]'
              }`}
            >
              <HiOutlineSearch className="size-5" />
            </button>
          </div>
        </div>
      </div>

      {!searchStore.isLocked ? (
        <SearchMain 
          albumStore={albumStore}
          artistStore={artistStore}
        />
      ) : (
        <div className="animate-in fade-in duration-300">
          <SearchFilters searchStore={searchStore} />
          <SearchResults searchStore={searchStore} />
        </div>
      )}
    </div>
  )
})

export default SearchQuery