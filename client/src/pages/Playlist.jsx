import { useParams } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import Sidebar from '../components/Sidebar/Sidebar'
import ProfileMenu from '../components/ProfileMenu'
import SongGrid from '../components/Song/SongGrid'
import { PlaylistContext, PlayerContext } from '../main'
import { FaPlay, FaTrash } from 'react-icons/fa'
import { BsPauseFill } from 'react-icons/bs'

const PlaylistPage = observer(() => {
  const { id } = useParams()
  const playlistStore = useContext(PlaylistContext)
  const playerStore = useContext(PlayerContext)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    if (id && playlistStore.currentPlaylist?.id !== parseInt(id)) {
      playlistStore.fetchPlaylist(id)
    }
  }, [id, playlistStore])

  useEffect(() => {
    if (playlistStore.currentPlaylist?.songs?.length > 0) {
      playerStore.setSelectedPlaylist(playlistStore.currentPlaylist.songs)
    }
  }, [playlistStore.currentPlaylist, playerStore])

  const playlist = playlistStore.currentPlaylist
  const loading = playlistStore.isLoading
  const playlistSongs = playlist?.songs || []
  const songCount = playlistStore.songCount
  const totalDuration = playlistStore.totalDuration

  const isPlayingThisPlaylist = playerStore.currentPlaylist === playlistSongs && playerStore.isPlaying

  const handlePlayAll = () => {
    if (playlistSongs.length === 0) return
    
    if (playerStore.currentPlaylist === playlistSongs && playerStore.isPlaying) {
      playerStore.toggle()
      return
    }
    
    if (playerStore.currentPlaylist === playlistSongs && !playerStore.isPlaying) {
      playerStore.toggle()
      return
    }
    
    playerStore.playSelectedPlaylist()
  }

  const handleDelete = async () => {
    await playlistStore.deletePlaylist(playlist.id)
    window.location.href = '/profile'
  }

  if (loading) {
    return (
      <div className="flex bg-[#121212] min-h-screen">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-[#27272A] border-t-[#2B7FFF] rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  if (!playlist) {
    return (
      <div className="flex bg-[#121212] min-h-screen">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-white">Playlist not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex bg-[#121212] min-h-screen text-white font-sans">
      <Sidebar />
      
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <div className="bg-linear-to-b from-[#404040] to-[#282828] relative">
          <div className="relative z-20 px-8 pt-8">
            <ProfileMenu />
          </div>

          <div className="px-8 pb-8">
            <div className="flex items-end gap-6 ml-8">
              <div className="w-48 h-48 rounded-lg bg-[#181818] shadow-2xl flex items-center justify-center shrink-0 overflow-hidden">
                {playlist.img ? (
                  <img 
                    src={`${import.meta.env.VITE_API_URL}/${playlist.img}`} 
                    alt={playlist.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-linear-to-br from-[#2B7FFF] to-[#1447E6] flex items-center justify-center">
                    <svg className="w-24 h-24 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex flex-col">
                  <p className="text-white/70 text-sm font-medium mb-2">Playlist</p>
                  <h1 className="text-white font-bold text-6xl tracking-tight leading-none mb-2">
                    {playlist.title}
                  </h1>
                  {playlist.description && (
                    <p className="text-[#a1a1aa] text-sm mt-2 max-w-2xl">{playlist.description}</p>
                  )}
                  <div className="flex items-center gap-2 text-white/70 text-sm font-medium mt-2">
                    <span>{songCount} songs</span>
                    <span className="opacity-50">•</span>
                    <span>{totalDuration}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="absolute bottom-4 right-8 px-3 py-1.5 bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.15)] rounded-lg text-[#9F9FA9] hover:text-red-500 text-sm font-medium transition flex items-center gap-2"
          >
            <FaTrash className="w-4 h-4" />
            Delete Playlist
          </button>
        </div>

        <div className="flex-1 bg-[#121212] px-8 pt-6 pb-24">
          <div className="flex items-center gap-4 mb-6">
            <button 
              onClick={handlePlayAll}
              className="size-14 rounded-full bg-[#2B7FFF] flex items-center justify-center hover:scale-105 transition-all cursor-pointer shadow-lg"
            >
              {isPlayingThisPlaylist ? (
                <BsPauseFill className="text-black text-2xl" />
              ) : (
                <FaPlay className="text-black text-lg ml-0.5" />
              )}
            </button>
          </div>
          <SongGrid 
            songs={playlistSongs}
            showAlbum={true}
            playlistId={parseInt(id)}
          />
        </div>
      </div>

      {showDeleteConfirm && (
        <>
          <div className="fixed inset-0 bg-black/70 z-50" onClick={() => setShowDeleteConfirm(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#1A1A1A] rounded-2xl shadow-2xl z-50 overflow-hidden">
            <div className="p-6">
              <h2 className="text-white text-xl font-semibold mb-2">Delete Playlist?</h2>
              <p className="text-[#a1a1aa] text-sm mb-6">
                Are you sure you want to delete "{playlist.title}"? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white text-sm font-medium transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-xl text-white text-sm font-medium transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
})

export default PlaylistPage