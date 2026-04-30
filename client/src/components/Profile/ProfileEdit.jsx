import { observer } from 'mobx-react-lite'
import { useContext, useState } from 'react'
import { HiOutlineX } from 'react-icons/hi'
import { ProfileContext } from '../../main'

const ProfileEdit = observer(() => {
  const profileStore = useContext(ProfileContext)
  const [activeTab, setActiveTab] = useState('profile')

  if (!profileStore.isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/70 z-50" onClick={() => profileStore.closeModal()} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-[#1A1A1A] rounded-2xl shadow-2xl z-50 overflow-hidden">
        
        <div className="flex justify-between items-center p-5 border-b border-white/10">
          <h2 className="text-white text-2xl font-semibold">Edit Profile</h2>
          <button onClick={() => profileStore.closeModal()} className="text-[#a1a1aa] hover:text-white transition p-1">
            <HiOutlineX className="w-6 h-6" />
          </button>
        </div>

        <div className="px-6 pt-4 pb-2">
          <div className="text-sm text-[#a1a1aa]">
            <span className="text-white">Current username:</span> {profileStore.user?.username || '-'}
          </div>
          <div className="text-sm text-[#a1a1aa] mt-1">
            <span className="text-white">Current email:</span> {profileStore.user?.email || '-'}
          </div>
        </div>

        <div className="flex border-b border-white/10 px-6">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 mr-6 text-sm font-medium transition ${
              activeTab === 'profile'
                ? 'text-white border-b-2 border-[#2B7FFF]'
                : 'text-[#a1a1aa] hover:text-white'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('email')}
            className={`py-3 mr-6 text-sm font-medium transition ${
              activeTab === 'email'
                ? 'text-white border-b-2 border-[#2B7FFF]'
                : 'text-[#a1a1aa] hover:text-white'
            }`}
          >
            Email
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`py-3 text-sm font-medium transition ${
              activeTab === 'password'
                ? 'text-white border-b-2 border-[#2B7FFF]'
                : 'text-[#a1a1aa] hover:text-white'
            }`}
          >
            Password
          </button>
        </div>

        <div className="p-6 space-y-5">
          {profileStore.message && (
            <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-sm text-center">
              {profileStore.message}
            </div>
          )}
          {profileStore.error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
              {profileStore.error}
            </div>
          )}

          {activeTab === 'profile' && (
            <>
              <div>
                <label className="block text-white text-sm font-medium mb-2">New username</label>
                <input
                  type="text"
                  value={profileStore.username}
                  onChange={(e) => profileStore.setUsername(e.target.value)}
                  placeholder="Enter new username"
                  className="w-full px-4 py-2.5 bg-[#2A2A2A] border border-white/10 rounded-xl text-white placeholder:text-[#52525B] focus:outline-none focus:border-[#2B7FFF] transition"
                />
              </div>
              <button
                onClick={() => profileStore.updateUsername()}
                disabled={profileStore.isLoading}
                className="w-full mt-4 py-2.5 bg-[#2B7FFF] hover:bg-[#2B7FFF]/80 rounded-xl text-white text-sm font-medium transition disabled:opacity-50"
              >
                {profileStore.isLoading ? 'Сохранение...' : 'Update Username'}
              </button>
            </>
          )}

          {activeTab === 'email' && (
            <>
              <div>
                <label className="block text-white text-sm font-medium mb-2">New email</label>
                <input
                  type="email"
                  value={profileStore.email}
                  onChange={(e) => profileStore.setEmail(e.target.value)}
                  placeholder="Enter new email"
                  className="w-full px-4 py-2.5 bg-[#2A2A2A] border border-white/10 rounded-xl text-white placeholder:text-[#52525B] focus:outline-none focus:border-[#2B7FFF] transition"
                />
                <input
                  type="password"
                  placeholder="Current password"
                  value={profileStore.emailPassword}
                  onChange={(e) => profileStore.setEmailPassword(e.target.value)}
                  className="w-full mt-3 px-4 py-2.5 bg-[#2A2A2A] border border-white/10 rounded-xl text-white placeholder:text-[#52525B] focus:outline-none focus:border-[#2B7FFF] transition"
                />
              </div>
              <button
                onClick={() => profileStore.updateEmail()}
                disabled={profileStore.isLoading}
                className="w-full mt-4 py-2.5 bg-[#2B7FFF] hover:bg-[#2B7FFF]/80 rounded-xl text-white text-sm font-medium transition disabled:opacity-50"
              >
                {profileStore.isLoading ? 'Сохранение...' : 'Update Email'}
              </button>
            </>
          )}

          {activeTab === 'password' && (
            <>
              <div>
                <input
                  type="password"
                  placeholder="Current password"
                  value={profileStore.oldPassword}
                  onChange={(e) => profileStore.setOldPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#2A2A2A] border border-white/10 rounded-xl text-white placeholder:text-[#52525B] focus:outline-none focus:border-[#2B7FFF] transition"
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="New password"
                  value={profileStore.newPassword}
                  onChange={(e) => profileStore.setNewPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#2A2A2A] border border-white/10 rounded-xl text-white placeholder:text-[#52525B] focus:outline-none focus:border-[#2B7FFF] transition"
                />
              </div>
              <button
                onClick={() => profileStore.updatePassword()}
                disabled={profileStore.isLoading}
                className="w-full mt-4 py-2.5 bg-[#2B7FFF] hover:bg-[#2B7FFF]/80 rounded-xl text-white text-sm font-medium transition disabled:opacity-50"
              >
                {profileStore.isLoading ? 'Сохранение...' : 'Update Password'}
              </button>
            </>
          )}
        </div>
      </div>
    </>
  )
})

export default ProfileEdit