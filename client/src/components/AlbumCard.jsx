import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoMusicalNote } from 'react-icons/io5';

const AlbumCard = ({ 
  album,
  cardSize, 
  titleSize, 
  artistNamesSize, 
  hasTransition = true, 
  hasOverlay = false,
  inlineView = false,
}) => {
  const navigate = useNavigate();

  const animationClass = hasTransition && !inlineView
    ? 'transition-transform duration-300 group-hover:scale-105 will-change-transform' 
    : '';

  const artistName = album.artists?.[0]?.name || album.artist?.name || ''

  const handleClick = () => {
    navigate(`/album/${album.id}`)
  }

  if (inlineView) {
    return (
      <div 
        onClick={handleClick}
        className="group flex items-center gap-4 px-2 py-3 rounded-lg hover:bg-white/5 transition cursor-pointer"
      >
        <div className="w-10 h-10 rounded-md overflow-hidden shrink-0 bg-white/5">
          {album.imgUrl ? (
            <img src={album.imgUrl} alt={album.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#9F9FA9]">
              <IoMusicalNote className="w-5 h-5" />
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="text-white font-medium truncate">{album.title}</h4>
          <p className="text-[#9F9FA9] text-sm truncate">{artistName || 'Unknown artist'}</p>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-[#9F9FA9] text-xs px-2 py-0.5 bg-white/5 rounded">Album</span>
        </div>
      </div>
    )
  }

  return (
    <div 
      onClick={handleClick}
      className={`cursor-pointer w-full group ${cardSize}`}
    >
      <div className="aspect-square bg-black rounded-lg mb-1.5 overflow-hidden relative">
        {album.imgUrl ? (
          <img 
            src={album.imgUrl} 
            alt={album.title} 
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
        {album.title}
      </h4>
      
      {artistName && (
        <p className={`text-[#9F9FA9] truncate text-center lg:text-left ${artistNamesSize}`}>
          {artistName}
        </p>
      )}
    </div>
  );
};

export default AlbumCard;