// client/src/components/RecsCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoMusicalNote } from 'react-icons/io5';

const RecsCard = ({ 
  playlist,
  cardSize, 
  titleSize, 
  subtitleSize, 
  hasTransition = true, 
  hasOverlay = false,
}) => {
  const navigate = useNavigate();

  const animationClass = hasTransition
    ? 'transition-transform duration-300 group-hover:scale-105 will-change-transform' 
    : '';

  const handleClick = () => {
    if (playlist.type === 'sequence_recs' || playlist.type === 'same_energy_recs' ) {
      navigate(`/playlist/${playlist.id}`)
    }
  }

  const songCount = playlist.songs?.length || 0
  const playlistTitle = playlist.title || 'Untitled'
  const coverImage = playlist.img || playlist.songs?.[0]?.imgUrl || playlist.songs?.[0]?.album?.imgUrl

  return (
    <div 
      onClick={handleClick}
      className={`cursor-default w-full group ${cardSize}`}
    >
      <div className="aspect-square bg-black rounded-lg mb-1.5 overflow-hidden relative">
        {coverImage ? (
          <img 
            src={coverImage} 
            alt={playlistTitle} 
            className={`w-full h-full object-cover ${animationClass}`}
            style={{
              backfaceVisibility: 'hidden',
              transform: 'translateZ(0)',
              WebkitBackfaceVisibility: 'hidden'
            }}
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-[#2B7FFF] to-[#1447E6] flex items-center justify-center">
            <IoMusicalNote className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white/40" />
          </div>
        )}

        {hasOverlay && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition duration-300 pointer-events-none" />
        )}
      </div>
      
      <h4 className={`text-white font-semibold truncate text-center lg:text-left ${titleSize}`}>
        {playlistTitle}
      </h4>
      
      {songCount > 0 && (
        <p className={`text-[#9F9FA9] truncate text-center lg:text-left ${subtitleSize}`}>
          {songCount} {songCount === 1 ? 'song' : 'songs'} • AI Generated
        </p>
      )}
    </div>
  );
};

export default RecsCard;