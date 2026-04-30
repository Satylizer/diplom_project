import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineUser } from 'react-icons/hi';

const ArtistCard = ({ 
  artist, 
  cardSize, 
  nameSize, 
  hasTransition = true,
  hasOverlay = false,
  inlineView = false,
}) => {
  const navigate = useNavigate();

  const animationClass = hasTransition && !inlineView
    ? 'transition-transform duration-300 group-hover:scale-105 will-change-transform' 
    : '';

  const handleClick = () => {
    navigate(`/artist/${artist.id}`)
  }

  if (inlineView) {
      return (
        <div 
          onClick={handleClick}
          className="group flex items-center gap-4 px-2 py-3 rounded-lg hover:bg-white/5 transition cursor-pointer"
        >
          <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-white/5">
            {artist.imgUrl ? (
              <img src={artist.imgUrl} alt={artist.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#9F9FA9]">
                <HiOutlineUser className="w-5 h-5" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="text-white font-medium truncate">{artist.name}</h4>
            <p className="text-[#9F9FA9] text-sm truncate">Artist</p>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-[#9F9FA9] text-xs px-2 py-1 bg-white/5 rounded">Artist</span>
          </div>
        </div>
      )
    }

  return (
    <div 
      onClick={handleClick}
      className={`cursor-pointer w-full group ${cardSize}`}
    >
      <div className="aspect-square rounded-full bg-black mb-3 overflow-hidden relative">
        {artist.imgUrl ? (
          <img 
            src={artist.imgUrl} 
            alt={artist.name} 
            className={`w-full h-full object-cover ${animationClass}`}
            style={{
              backfaceVisibility: 'hidden',
              transform: 'translateZ(0)',
              WebkitBackfaceVisibility: 'hidden'
            }}
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-[#2B7FFF] to-[#1447E6] flex items-center justify-center">
            <span className="text-2xl font-bold text-white/40">{artist.name?.[0]}</span>
          </div>
        )}

        {hasOverlay && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition duration-300 rounded-full pointer-events-none" />
        )}
      </div>
      
      <h3 className={`text-white font-semibold truncate text-center ${nameSize}`}>
        {artist.name}
      </h3>
    </div>
  );
};

export default ArtistCard;