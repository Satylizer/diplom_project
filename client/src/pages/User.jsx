import { useContext, useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useParams, useNavigate } from 'react-router-dom'
import { UserContext, FollowContext, PlaylistContext } from '../main'
import Sidebar from '../components/Sidebar/Sidebar'
import ProfileMenu from '../components/ProfileMenu'
import PlaylistCard from '../components/Playlist/PlaylistCard'
import { FaUserCircle, FaUsers, FaMusic, FaHeart } from 'react-icons/fa'

const UserPage = observer(() => {
  const { id } = useParams()
  const navigate = useNavigate()
  const userStore = useContext(UserContext)
  const followStore = useContext(FollowContext)
  const playlistStore = useContext(PlaylistContext)
  
  const [isFollowing, setIsFollowing] = useState(false)
  const [followersCount, setFollowersCount] = useState(0)
  const [followingCount, setFollowingCount] = useState(0)

  const user = userStore.targetUser
  const isLoading = userStore.isTargetLoading
  const error = userStore.error
  const userPlaylists = playlistStore.userPlaylists || []

  useEffect(() => {
    if (id) {
      userStore.fetchUserById(id)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  useEffect(() => {
    if (user) {
      setFollowersCount(user.followersCount || 0)
      setFollowingCount(user.followingCount || 0)
      setIsFollowing(user.isFollowing || false)
      playlistStore.fetchUserPlaylists(id)
      }
  }, [user, id, playlistStore])

  const handleToggleFollow = async () => {
    const result = await followStore.toggleUserFollow(id)
    if (result.success) {
      setIsFollowing(result.isFollowing)
      setFollowersCount(prev => result.isFollowing ? prev + 1 : prev - 1)
    }
  }

  if (isLoading) {
    return (
      <div className="flex bg-black min-h-screen">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-[#27272A] border-t-[#2B7FFF] rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="flex bg-black min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col items-center justify-center text-white">
          <p className="text-red-400 mb-4">{error || 'Пользователь не найден'}</p>
          <button 
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-[#2B7FFF] rounded-lg hover:bg-[#2B7FFF]/80 transition"
          >
            Go Home
          </button>
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
            className="absolute top-0 left-0 right-0 h-96 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: user.img ? `url(${import.meta.env.VITE_API_URL}/${user.img})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center 30%'
            }}
          />
          <div className="absolute top-0 left-0 right-0 h-96 bg-linear-to-b from-teal-500/60 via-teal-500/30 to-[#121212]" />
          
          <div className="relative z-10">
            <div className="px-8 pt-8">
              <ProfileMenu />
            </div>
          
            <div className="px-5 pt-15 pb-8 ml-12">
              <div className="flex items-end gap-8">
                <div className="w-60 h-60 rounded-full bg-linear-to-br from-teal-400 to-cyan-600 overflow-hidden shadow-2xl shrink-0">
                  {user.img ? (
                    <img 
                      src={`${import.meta.env.VITE_API_URL}/${user.img}`} 
                      alt={user.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FaUserCircle className="w-24 h-24 text-white/40" />
                    </div>
                  )}
                </div>

                <div className="flex flex-col mb-2">
                  <h1 className="text-white font-bold text-7xl tracking-tight leading-none mb-4">
                    {user.username}
                  </h1>
                  
                  <div className="flex items-center gap-6 text-[#a1a1aa] text-sm">
                    <div className="flex items-center gap-2">
                      <FaUsers className="w-4 h-4" />
                      <span>{followersCount} followers</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaHeart className="w-4 h-4" />
                      <span>{followingCount} following</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaMusic className="w-4 h-4" />
                      <span>{userPlaylists.length} playlists</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleToggleFollow}
                    className={`mt-4 px-6 py-2 rounded-full font-semibold text-sm transition w-fit ${
                      isFollowing 
                        ? 'bg-white/10 text-white hover:bg-white/20 border border-white/20' 
                        : 'bg-white text-black hover:bg-white/90'
                    }`}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 bg-[#121212] px-10 pt-8 pb-24">
          <div className="mb-6">
            <h2 className="text-white text-2xl font-bold tracking-tight mb-4">Playlists</h2>
            
            {userPlaylists.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {userPlaylists.map(playlist => (
                  <PlaylistCard 
                    key={playlist.id}
                    playlist={playlist}
                    cardSize="w-full"
                    titleSize="text-sm"
                    subtitleSize="text-xs"
                    hasTransition={true}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
})

export default UserPage