import { useParams } from 'react-router-dom'
import { useContext, useEffect, useMemo } from 'react'
import { observer } from 'mobx-react-lite'
import Sidebar from '../components/Sidebar/Sidebar'
import ProfileMenu from '../components/ProfileMenu'
import SongGrid from '../components/Song/SongGrid'
import { PlaylistContext, PlayerContext } from '../main'
import { FaPlay } from 'react-icons/fa'
import { BsPauseFill } from 'react-icons/bs'

const RecsPage = observer(() => {
  const { id } = useParams()
  const playlistStore = useContext(PlaylistContext)
  const playerStore = useContext(PlayerContext)

  useEffect(() => {
    playlistStore.fetchRecsPlaylistById(id)
  }, [id, playlistStore])

  const playlist = playlistStore.currentRecsPlaylist
  
  const playlistSongs = useMemo(() => {
    return playlist?.songs || []
  }, [playlist])

  const isPlayingThisPlaylist =
    playerStore.currentRecsPlaylist === playlistSongs &&
    playerStore.isPlaying

  useEffect(() => {
    if (playlistSongs.length > 0) {
      playerStore.setSelectedPlaylist(playlistSongs)
    }
  }, [playlistSongs, playerStore])

  const handlePlayAll = () => {
    if (!playlistSongs.length) return

    if (playerStore.currentRecsPlaylist === playlistSongs) {
      playerStore.toggle()
      return
    }

    playerStore.playSelectedPlaylist()
  }

  const coverImages = useMemo(() => {
    const seen = new Set()

    return playlistSongs
      .map(s => s?.imgUrl)
      .filter(Boolean)
      .filter(url => {
        if (seen.has(url)) return false
        seen.add(url)
        return true
      })
      .slice(0, 4)
  }, [playlistSongs])

  const totalDuration = () => {
    const totalMs = playlistSongs.reduce(
      (acc, song) => acc + (song.durationMs || 0),
      0
    )

    const minutes = Math.floor(totalMs / 60000)
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60

    return hours > 0
      ? `${hours} hr ${remainingMinutes} min`
      : `${minutes} min`
  }

  if (playlistStore.isLoading || !playlist) {
    return (
      <div className="flex bg-[#09090b] min-h-screen">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-[#27272A] border-t-[#2B7FFF] rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex bg-[#09090b] min-h-screen text-white">
      <Sidebar />

      <div className="flex-1 relative flex flex-col h-screen overflow-y-auto">

        <div
          className="absolute top-0 left-0 right-0 h-98 pointer-events-none z-0"
          style={{
            background: `linear-gradient(to bottom, #8B5CF6 0%, #6D28D9 40%, #09090b 100%)`
          }}
        />

        <div className="relative z-20">
          <ProfileMenu />
        </div>

        <div className="relative z-10 px-12 pt-40">
          <div className="flex items-end gap-8 pb-5">

            <div className="size-56 shrink-0 rounded-lg overflow-hidden shadow-2xl bg-black">
              {coverImages.length === 4 ? (
                <div className="w-full h-full grid grid-cols-2 grid-rows-2 overflow-hidden">
                  {coverImages.map((img, i) => (
                    <div key={i} className="overflow-hidden">
                      <img
                        src={img}
                        className="w-full h-full object-cover scale-[1.02]"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="w-full h-full bg-linear-to-br from-[#8B5CF6] to-[#6D28D9]" />
              )}
            </div>

            <div className="flex-1">
              <div className="mb-2">
                <span className="text-[#8B5CF6] text-sm font-medium">
                  Playlist
                </span>
              </div>

              <h1 className="text-white font-bold text-6xl tracking-tight leading-none mb-6">
                {playlist.title}
              </h1>

              <div className="flex items-center gap-2 text-white/70 text-sm font-medium">
                <span>{playlistSongs.length} songs</span>
                <span className="opacity-50">•</span>
                <span>{totalDuration()}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 pl-4">
            <button
              onClick={handlePlayAll}
              className="size-14 rounded-full bg-[#2B7FFF] flex items-center justify-center shadow-lg transition-transform duration-200 hover:scale-105 active:scale-95"
            >
              {isPlayingThisPlaylist ? (
                <BsPauseFill className="text-black text-2xl" />
              ) : (
                <FaPlay className="text-black text-lg ml-1" />
              )}
            </button>
          </div>
        </div>

        <div className="relative z-10 mt-5 px-2 py-2 rounded-lg mx-auto w-300">
          <div className="pb-24">
            <SongGrid songs={playlistSongs} showAlbum={true} />
          </div>
        </div>
      </div>
    </div>
  )
})

export default RecsPage