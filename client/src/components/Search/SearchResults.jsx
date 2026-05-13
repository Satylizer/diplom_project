import React from 'react'
import { observer } from 'mobx-react-lite'
import AlbumCard from '../AlbumCard'
import ArtistCard from '../ArtistCard'
import SongCard from '../Song/SongCard'
import UserCard from '../UserCard'

const SearchResults = observer(({ searchStore }) => {
  const results = searchStore.results
  const activeFilter = searchStore.activeFilter

  if (!results || results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-4">
          <svg className="w-10 h-10 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="text-white text-xl font-semibold mb-2">No results found</h3>
        <p className="text-[#9F9FA9] text-sm">Try searching for something else</p>
      </div>
    )
  }

  if (activeFilter === 'Albums') {
    return (
      <div className="mt-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {results.map(album => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </div>
      </div>
    )
  }

  if (activeFilter === 'Artists') {
    return (
      <div className="mt-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {results.map(artist => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
      </div>
    )
  }

  if (activeFilter === 'Tracks') {
    return (
      <div className="mt-6">
        <div className="divide-y divide-white/5">
          {results.map(track => (
            <SongCard key={track.id} songId={track.id} playlist={[track]} inlineView={true} onPlay={() => {}} />
          ))}
        </div>
      </div>
    )
  }

  if (activeFilter === 'Users') {
    return (
      <div className="mt-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {results.map(user => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mt-6">
      <div className="divide-y divide-white/5">
        {results.map(result => {
          const uniqueKey = `${result.type}-${result.id}`
          if (result.type === 'album') {
            return <AlbumCard key={uniqueKey} album={result} inlineView={true} />
          }
          if (result.type === 'artist') {
            return <ArtistCard key={uniqueKey} artist={result} inlineView={true} />
          }
          if (result.type === 'user') {
            return <UserCard key={uniqueKey} user={result} inlineView={true} />
          }
          return <SongCard key={uniqueKey} songId={result.id} playlist={[result]} inlineView={true} />
        })}
      </div>
    </div>
  )
})

export default SearchResults