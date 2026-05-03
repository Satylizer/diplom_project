import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FaUserCircle } from 'react-icons/fa'

const UserCard = ({ 
  user,
  cardSize = "w-full",
  titleSize = "text-sm font-semibold mt-2",
  hasOverlay = true,
  inlineView = false,
}) => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/user/${user.id}`)
  }

  if (inlineView) {
    return (
      <div 
        onClick={handleClick}
        className="group flex items-center gap-4 px-2 py-3 rounded-lg hover:bg-white/5 transition cursor-pointer"
      >
        <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-white/5">
          {user.img ? (
            <img src={`${import.meta.env.VITE_API_URL}/${user.img}`} alt={user.username} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#9F9FA9]">
              <FaUserCircle className="w-6 h-6" />
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="text-white font-medium truncate">{user.username}</h4>
          {user.email && (
            <p className="text-[#9F9FA9] text-sm truncate">{user.email}</p>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-[#9F9FA9] text-xs px-2 py-0.5 bg-white/5 rounded">User</span>
        </div>
      </div>
    )
  }

  if (!hasOverlay) {
    return (
      <div 
        onClick={handleClick}
        className={`cursor-pointer w-full group ${cardSize}`}
      >
        <div className="w-full pb-[100%] relative mb-3">
          <div className="absolute inset-0 rounded-full bg-linear-to-br from-teal-400 to-cyan-600 overflow-hidden">
            {user.img ? (
              <img 
                src={`${import.meta.env.VITE_API_URL}/${user.img}`} 
                alt={user.username} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <FaUserCircle className="w-1/2 h-1/2 text-white/40" />
              </div>
            )}
          </div>
        </div>
        
        <div className="text-center">
          <h4 className={`text-white font-semibold truncate ${titleSize}`}>
            {user.username}
          </h4>
        </div>
      </div>
    )
  }

  return (
    <div 
      onClick={handleClick}
      className={`cursor-pointer w-full group ${cardSize}`}
    >
      <div className="bg-[#181818] rounded-lg p-4 overflow-hidden relative">
        <div className="aspect-square rounded-full bg-linear-to-br from-teal-400 to-cyan-600 overflow-hidden mb-3">
          {user.img ? (
            <img 
              src={`${import.meta.env.VITE_API_URL}/${user.img}`} 
              alt={user.username} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FaUserCircle className="w-1/2 h-1/2 text-white/40" />
            </div>
          )}
        </div>
        
        <div className="text-center">
          <h4 className={`text-white font-semibold truncate ${titleSize}`}>
            {user.username}
          </h4>
        </div>

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition duration-300 pointer-events-none rounded-lg" />
      </div>
    </div>
  )
}

export default UserCard