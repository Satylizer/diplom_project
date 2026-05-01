import { useParams } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import Sidebar from '../components/Sidebar/Sidebar'
import ProfileMenu from '../components/ProfileMenu'
import AlbumCard from '../components/AlbumCard'
import { ArtistContext, AlbumContext, FollowContext } from '../main'

const ArtistPage = observer(() => {
  const { id } = useParams()
  const artistStore = useContext(ArtistContext)
  const albumStore = useContext(AlbumContext)
  const followStore = useContext(FollowContext)
  const [artistAlbums, setArtistAlbums] = useState([])
  const [isFollowing, setIsFollowing] = useState(false)
  const [followersCount, setFollowersCount] = useState(0)

  useEffect(() => {
    if (id && artistStore.currentArtist?.id !== parseInt(id)) {
      artistStore.fetchArtist(id)
    }
  }, [id, artistStore])

  useEffect(() => {
    if (artistStore.currentArtist) {
      setFollowersCount(artistStore.currentArtist.followersCount || 0)
      setIsFollowing(artistStore.currentArtist.isFollowing || false)
      
      const albums = albumStore.albums.filter(
        album => album.artistId === artistStore.currentArtist.id
      )
      albums.sort((a, b) => a.title.localeCompare(b.title))
      setArtistAlbums(albums)
    }
  }, [artistStore.currentArtist, albumStore.albums])

  const artist = artistStore.currentArtist
  const loading = artistStore.isLoading

  const handleToggleFollow = async () => {
    const result = await followStore.toggleArtistFollow(id)
    if (result.success) {
      setIsFollowing(result.isFollowing)
      setFollowersCount(prev => result.isFollowing ? prev + 1 : prev - 1)
    }
  }

  const formatFollowers = (count) => {
    if (!count) return '0 followers'
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M followers`
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K followers`
    }
    return `${count} followers`
  }

  if (loading) {
    return (
      <div className="flex bg-[#121212] min-h-screen">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-[#27272A] border-t-[#2B7FFF] rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  if (!artist) {
    return (
      <div className="flex bg-[#121212] min-h-screen">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-white">Artist not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex bg-[#121212] min-h-screen text-white font-sans">
      <Sidebar />
      
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <div className="relative">
          <div 
            className="absolute top-0 left-0 right-0 h-105 bg-cover bg-center bg-no-repeat z-0"
            style={{
              backgroundImage: artist.imgUrl ? `url(${artist.imgUrl})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center 30%'
            }}
          />
          <div className="absolute top-0 left-0 right-0 h-105 bg-linear-to-b from-black/60 via-black/40 to-[#121212] z-0" />
          
          <div className="relative z-10">
            <div className="px-8 pt-8">
              <ProfileMenu />
            </div>
            
            <div className="px-8 pt-32 pb-8">
              <div className="flex flex-col">
                <h1 className="text-white font-black text-9xl tracking-tight leading-none mb-6">
                  {artist.name}
                </h1>
                
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleToggleFollow}
                    className={`px-6 py-2 rounded-full font-semibold text-sm transition ${
                      isFollowing 
                        ? 'bg-white/10 text-white hover:bg-white/20 border border-white/20' 
                        : 'bg-white text-black hover:bg-white/90'
                    }`}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                  
                  <span className="text-white/70 text-sm">
                    {formatFollowers(followersCount)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#121212] px-8 pt-8 pb-24 flex-1">
          {artistAlbums.length > 0 && (
            <div>
              <h2 className="text-white text-2xl font-bold tracking-tight mb-4">Albums</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {artistAlbums.map(album => (
                  <AlbumCard
                    key={album.id}
                    album={album}
                    cardSize="w-full"
                    titleSize="text-sm"
                    artistNamesSize="text-xs"
                    hasTransition={true}
                    hasOverlay={false}
                  />
                ))}
              </div>
            </div>
          )}
          
          {artistAlbums.length === 0 && (
            <div className="text-center text-white/60 py-20">
              <p>No albums available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
})

export default ArtistPage