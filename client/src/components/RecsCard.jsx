import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { IoMusicalNote } from 'react-icons/io5'

const RecsCard = ({
  playlist,
  cardSize,
  titleSize,
  hasTransition = true,
  hasOverlay = false,
}) => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/recs/${playlist.id}`)
  }

  const playlistTitle = playlist?.title || 'Untitled'

  const images = useMemo(() => {
    const seen = new Set()

    return (playlist?.songs || [])
      .map(s => s?.imgUrl)
      .filter(Boolean)
      .filter(url => {
        if (seen.has(url)) return false
        seen.add(url)
        return true
      })
      .slice(0, 4)
  }, [playlist])

  return (
    <div
      onClick={handleClick}
      className={`cursor-pointer w-full group ${cardSize}`}
    >
      <div className="aspect-square bg-black rounded-lg mb-1.5 overflow-hidden relative">

        {images.length === 4 ? (
          <div
            className={`
              w-full h-full grid grid-cols-2 grid-rows-2
              overflow-hidden
              ${hasTransition ? 'transition-transform duration-300 group-hover:scale-105' : ''}
            `}
          >
            {images.map((img, i) => (
              <div key={i} className="relative overflow-hidden">
                <img
                  src={img}
                  alt=""
                  className="
                    w-full h-full object-cover
                    scale-[1.02]
                    will-change-transform
                  "
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full h-full bg-linear-to-br from-[#2B7FFF] to-[#1447E6] flex items-center justify-center">
            <IoMusicalNote className="w-6 h-6 text-white/40" />
          </div>
        )}

        <div className="absolute inset-0 bg-black/20" />


        {hasOverlay && (
          <div className="
            absolute inset-0
            bg-black/0
            group-hover:bg-black/30
            transition duration-300
            pointer-events-none
          " />
        )}
      </div>

      <h4 className={`text-white font-semibold truncate text-center lg:text-left ${titleSize}`}>
        {playlistTitle}
      </h4>
    </div>
  )
}

export default RecsCard