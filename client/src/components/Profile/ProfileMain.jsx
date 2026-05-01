import { useState, useContext, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { ProfileContext, PlaylistContext, FollowContext } from '../../main'
import PlaylistCard from '../Playlist/PlaylistCard'
import PlaylistCreate from '../Playlist/PlaylistCreate'
import ArtistCard from '../ArtistCard'
import UserCard from '../UserCard'

const ProfileMain = observer(() => {
  const navigate = useNavigate()
  const location = useLocation()
  const playlistStore = useContext(PlaylistContext)
  const followStore = useContext(FollowContext)
  const [activeTab, setActiveTab] = useState('playlists')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const tab = params.get('tab')
    if (tab === 'playlists' || tab === 'following') {
      setActiveTab(tab)
    }
  }, [location.search])

  useEffect(() => {
    if (activeTab === 'playlists') {
      playlistStore.fetchPlaylists()
    } else if (activeTab === 'following') {
      loadFollowedData()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab])

  const loadFollowedData = async () => {
    setIsLoading(true)
    try {
      await followStore.fetchFollowingArtists()
      await followStore.fetchUserFollowing()
    } catch (error) {
      console.error('Ошибка загрузки подписок:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreatePlaylist = async (formData) => {
    const result = await playlistStore.createPlaylist(formData)
    if (!result.success) {
      throw new Error(result.error)
    }
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    navigate(`/profile?tab=${tab}`)
  }

  const followedArtists = followStore.followedArtists || []
  const followedUsers = followStore.followedUsers || []

  if (isLoading && activeTab === 'following') {
    return (
      <div className="flex-1 bg-[#121212] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#27272A] border-t-[#2B7FFF] rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex-1 bg-[#121212]">
      <div className="px-8 pt-6 border-b border-white/10">
        <div className="flex justify-between items-center">
          <div className="flex gap-8">
            <button
              onClick={() => handleTabChange('playlists')}
              className={`pb-3 text-sm font-medium transition ${
                activeTab === 'playlists'
                  ? 'text-white border-b-2 border-[#2B7FFF]'
                  : 'text-[#a1a1aa] hover:text-white'
              }`}
            >
              Playlists
            </button>
            <button
              onClick={() => handleTabChange('following')}
              className={`pb-3 text-sm font-medium transition ${
                activeTab === 'following'
                  ? 'text-white border-b-2 border-[#2B7FFF]'
                  : 'text-[#a1a1aa] hover:text-white'
              }`}
            >
              Following
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'playlists' && (
        <div className="px-8 pt-4 flex justify-end">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3 py-1.5 bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.15)] rounded-lg text-[#9F9FA9] hover:text-white text-sm font-medium transition flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Playlist
          </button>
        </div>
      )}

      <div className="px-8 pt-6 pb-12">
        {activeTab === 'playlists' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {playlistStore.playlists.map(playlist => (
              <PlaylistCard 
                key={playlist.id}
                playlist={playlist}
                cardSize="w-full"
                titleSize="text-sm font-semibold mt-2"
                subtitleSize="text-xs text-[#9F9FA9] mt-0.5"
                hasTransition={true}
              />
            ))}
            {playlistStore.playlists.length === 0 && (
              <div className="text-[#a1a1aa] text-center py-20 col-span-full">
                <p>No playlists yet</p>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'following' && (
          <div>
            <div className="mb-6">
              <h3 className="text-white text-lg font-semibold mb-4">Artists</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {followedArtists.length > 0 ? (
                  followedArtists.map(artist => (
                    <ArtistCard key={artist.id} artist={artist} />
                  ))
                ) : (
                  <div className="text-[#a1a1aa] text-center py-10 col-span-full">
                    <p>No followed artists yet</p>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Users</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {followedUsers.length > 0 ? (
                  followedUsers.map(user => (
                    <UserCard key={user.id} user={user} />
                  ))
                ) : (
                  <div className="text-[#a1a1aa] text-center py-10 col-span-full">
                    <p>No followed users yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <PlaylistCreate 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreatePlaylist}
      />
    </div>
  )
})

export default ProfileMain