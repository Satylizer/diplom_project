import SongCard from './SongCard'
import { HiOutlineClock, HiOutlineMusicalNote } from 'react-icons/hi2'

const SongGrid = ({
  songs = [],
  onPlay,
  showHeader = true,
  showAlbum = true,
  playlistId = null
}) => {

  const isEmpty = songs.length === 0

  return (
    <div className="w-full">

      {showHeader && (
        <div className="grid grid-cols-12 gap-4 px-4 h-10 uppercase tracking-wider border-b border-white/10 items-center">

          <div className="col-span-1 flex items-center justify-start pl-2 text-[#d4d4d4] text-lg font-medium">#</div>

          {showAlbum && (
            <div className="col-span-1 flex items-center"></div>
          )}

          <div className={`${showAlbum ? 'col-span-5' : 'col-span-6'} flex items-center text-[#d4d4d4] text-sm font-medium`}>
            Title
          </div>  

          {showAlbum && (
            <div className="col-span-3 flex items-center text-[#d4d4d4] text-sm font-medium">
              Album
            </div>
          )}

          <div className={`${showAlbum ? 'col-span-2' : 'col-span-5'} flex justify-end pr-8`}>
            <HiOutlineClock className="w-5 h-5 text-[#d4d4d4]" />
          </div>

        </div>
      )}

      <div>
        {songs.map((song, idx) => (
          <SongCard
            key={song.id}
            songId={song.id}
            index={idx + 1}
            onPlay={onPlay}
            showAlbum={showAlbum}
            playlistId={playlistId}
          />
        ))}
      </div>

      {isEmpty && (
        <div className="flex flex-col items-center justify-center py-20 text-center">

          <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-4">
            <HiOutlineMusicalNote className="w-10 h-10 text-white/40" />
          </div>

          <h3 className="text-white text-xl font-semibold mb-2">
            Nothing here yet
          </h3>

          <p className="text-[#9F9FA9] text-sm">
            Songs will appear here soon
          </p>

        </div>
      )}

    </div>
  )
}

export default SongGrid