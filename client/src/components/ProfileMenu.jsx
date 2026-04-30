import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { HiOutlineChevronDown } from 'react-icons/hi2';
import { UserContext, ProfileContext } from '../main';
import { observer } from 'mobx-react-lite';

const ProfileMenu = observer(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const userStore = useContext(UserContext);
  const profileStore = useContext(ProfileContext);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
      if (!profileStore.user) {
        profileStore.fetchUser()
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    userStore.logout();
    navigate('/login');
  };

  const handleNavigation = (path, tab) => {
    if (location.pathname === '/profile') {
      navigate(`${path}?tab=${tab}`);
    } else {
      navigate(`${path}?tab=${tab}`);
    }
    setIsOpen(false);
  };

  const menuItems = [
    { label: 'Profile', onClick: () => handleNavigation('/profile', 'playlists') },
    { label: 'Liked Songs', onClick: () => navigate('/likes') },
    { label: 'Playlists', onClick: () => handleNavigation('/profile', 'playlists') },
    { label: 'Following', onClick: () => handleNavigation('/profile', 'following') },
    { label: 'Logout', onClick: handleLogout, danger: true },
  ];

  const username = profileStore.user?.username || 'User'
  const avatarUrl = profileStore.user?.img || null
  const initials = username.slice(0, 2).toUpperCase()

  return (
    <div className="fixed top-4 right-4 lg:top-6 lg:right-8 z-50">
      <div 
        onClick={toggleMenu}
        className="bg-[rgba(24,24,27,0.5)] border border-[#27272A] rounded-full p-1.5 lg:p-2 cursor-pointer hover:bg-[rgba(24,24,27,0.7)] transition duration-200 backdrop-blur-sm"
      >
        <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-full bg-linear-to-br from-[#2B7FFF] to-[#1447E6] flex items-center justify-center overflow-hidden">
          {avatarUrl ? (
            <img 
              src={`${import.meta.env.VITE_API_URL}/${avatarUrl}`} 
              alt={username} 
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-white text-sm lg:text-base font-semibold">{initials}</span>
          )}
        </div>
      </div>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-[rgba(24,24,27,0.95)] backdrop-blur-sm border border-[#27272A] rounded-xl shadow-xl overflow-hidden z-50">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  item.onClick();
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                  item.danger 
                    ? 'text-red-500 hover:bg-red-500/10' 
                    : 'text-[#d4d4d4] hover:bg-white/5 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
});

export default ProfileMenu;