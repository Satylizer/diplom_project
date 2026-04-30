import React, { useRef } from 'react'
import { observer } from 'mobx-react-lite'
import AlbumCard from '../AlbumCard'
import ArtistCard from '../ArtistCard'
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2'

const SearchMain = observer(({ albumStore, artistStore }) => {
  const artistsScrollRef = useRef(null)
  const albumsScrollRef = useRef(null)
  
  const displayedArtists = artistStore?.getPopularArtists(20) || []
  const displayedAlbums = albumStore?.getPopularAlbums(20) || []

  const scroll = (ref, direction) => {
    if (ref.current && ref.current.children.length > 0) {
      const firstItem = ref.current.children[0]
      const itemWidth = firstItem.offsetWidth
      const scrollAmount = (itemWidth) * 2
      ref.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' })
    }
  }

  const SliderButtons = ({ scrollRef }) => (
    <>
      <button 
        onClick={() => scroll(scrollRef, 'left')}
        className="absolute -left-2 top-[40%] -translate-y-1/2 z-20 p-2 rounded-full bg-zinc-800/90 backdrop-blur-xl border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-xl active:bg-zinc-700"
      >
        <HiChevronLeft className="size-5" />
      </button>
      <button 
        onClick={() => scroll(scrollRef, 'right')}
        className="absolute -right-2 top-[40%] -translate-y-1/2 z-20 p-2 rounded-full bg-zinc-800/90 backdrop-blur-xl border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-xl active:bg-zinc-700"
      >
        <HiChevronRight className="size-5" />
      </button>
    </>
  )

  return (
    <div className="space-y-8">

      <section>
        <h2 className="text-white text-xl font-bold tracking-tight mb-3 px-4">Popular Albums</h2>
        <div className="relative group">
          <SliderButtons scrollRef={albumsScrollRef} />
          
          <div 
            ref={albumsScrollRef}
            className="flex gap-0 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {displayedAlbums.map((albumItem) => (
              <div key={albumItem.id} className="min-w-44 sm:min-w-48 lg:min-w-52 snap-start">
                <div className="bg-transparent hover:bg-[#282828] rounded-xl p-2 transition-all duration-300 cursor-pointer group/card">
                  <AlbumCard 
                    album={albumItem}
                    cardSize="w-full"
                    titleSize="text-sm font-semibold text-white mt-1.5 group-hover/card:text-white transition-colors"
                    artistNamesSize="text-xs text-[#9F9FA9] mt-0.5"
                    hasTransition={false}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-white text-xl font-bold tracking-tight mb-3 px-4">Trending Artists</h2>
        <div className="relative group">
          <SliderButtons scrollRef={artistsScrollRef} />
          
          <div 
            ref={artistsScrollRef}
            className="flex gap-0 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {displayedArtists.map(artist => (
              <div key={artist.id} className="min-w-44 sm:min-w-48 lg:min-w-52 snap-start">
                <div className="bg-transparent hover:bg-[#282828] rounded-xl p-2 transition-all duration-300 cursor-pointer group/card">
                  <ArtistCard 
                    artist={artist}
                    cardSize="w-full"
                    nameSize="text-sm font-semibold text-white mt-1.5 block text-center group-hover/card:text-white transition-colors"
                    hasTransition={false}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
    </div>
  )
})

export default SearchMain