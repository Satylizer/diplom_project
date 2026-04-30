import { useContext, useEffect, useRef } from 'react'
import { observer } from 'mobx-react-lite'
import Sidebar from '../components/Sidebar/Sidebar'
import ProfileMenu from '../components/ProfileMenu'
import ProfileEdit from '../components/Profile/ProfileEdit'
import ProfileMain from '../components/Profile/ProfileMain'
import { ProfileContext } from '../main'
import { HiOutlineUser, HiOutlinePencil, HiOutlineCamera } from 'react-icons/hi'

const Profile = observer(() => {
  const profileStore = useContext(ProfileContext)
  const fileInputRef = useRef(null)
  const username = profileStore.user?.username || 'User'
  const avatarUrl = profileStore.user?.img || null

  useEffect(() => {
    if (!profileStore.user) {
      profileStore.fetchUser()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      await profileStore.updateAvatar(file)
    }
  }

  if (profileStore.isLoading) {
    return (
      <div className="flex bg-[#121212] min-h-screen text-white">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-[#27272A] border-t-[#2B7FFF] rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex bg-black min-h-screen text-white font-sans">
      <Sidebar />
      
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <div className="bg-linear-to-b from-[#404040] to-[#282828] px-8 pt-8 pb-8 relative">
          <div className="relative z-20 mb-8">
            <ProfileMenu />
          </div>

          <div className="flex items-end gap-6 ml-8">
            <div 
              onClick={handleAvatarClick}
              className="relative group cursor-pointer"
            >
              <div className="w-48 h-48 rounded-full bg-[#181818] shadow-2xl flex items-center justify-center shrink-0 overflow-hidden">
                {avatarUrl ? (
                  <img src={`${import.meta.env.VITE_API_URL}/${avatarUrl}`} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <HiOutlineUser className="w-24 h-24 text-[#7f7f7f]" />
                )}
              </div>
              <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <HiOutlineCamera className="w-8 h-8 text-white" />
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            
            <div className="flex flex-col mb-10">
              <span className="text-xs font-medium text-white/60 mb-1 tracking-wide">PROFILE</span>
              <h1 className="text-white font-bold text-6xl tracking-tight leading-tight">
                {username}
              </h1>
            </div>

            <ProfileEdit />
          </div>

          <button
            onClick={() => profileStore.openModal()}
            className="absolute bottom-4 right-8 flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition text-sm"
          >
            <HiOutlinePencil className="w-4 h-4" />
            Edit
          </button>
        </div>

        <ProfileMain />

      </div>


    </div>
  )
})

export default Profile