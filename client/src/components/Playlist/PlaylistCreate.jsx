import { useState, useRef } from 'react'
import { HiOutlineX, HiOutlinePhotograph } from 'react-icons/hi'

const PlaylistCreate = ({ isOpen, onClose, onCreate }) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [imgFile, setImgFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef(null)

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImgFile(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async () => {
    if (!title.trim()) {
      alert('Введите название плейлиста')
      return
    }
    if (!imgFile) {
      alert('Выберите изображение для плейлиста')
      return
    }

    setIsLoading(true)
    try {
      await onCreate({ title, description, img: imgFile })
      setTitle('')
      setDescription('')
      setImgFile(null)
      setPreview(null)
      onClose()
    } catch (error) {
      console.error('Ошибка создания плейлиста:', error)
      alert('Не удалось создать плейлист')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/70 z-50" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#1A1A1A] rounded-2xl shadow-2xl z-50 overflow-hidden">

        <div className="flex justify-between items-center p-5 border-b border-white/10">
          <h2 className="text-white text-2xl font-semibold">Create Playlist</h2>
          <button onClick={onClose} className="text-[#a1a1aa] hover:text-white transition p-1">
            <HiOutlineX className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div 
            onClick={handleImageClick}
            className="relative group cursor-pointer"
          >
            <div className="w-40 h-40 mx-auto rounded-lg bg-[#2A2A2A] border-2 border-white/10 overflow-hidden flex items-center justify-center">
              {preview ? (
                <img src={preview} alt="Playlist cover" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-[#7f7f7f]">
                  <HiOutlinePhotograph className="w-10 h-10" />
                  <span className="text-xs">Upload image</span>
                </div>
              )}
            </div>
            <div className="absolute inset-0 rounded-lg bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-sm">Click to change</span>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />

          <div>
            <label className="block text-white text-sm font-medium mb-2">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter playlist title"
              className="w-full px-4 py-2.5 bg-[#2A2A2A] border border-white/10 rounded-xl text-white placeholder:text-[#52525B] focus:outline-none focus:border-[#2B7FFF] transition"
            />
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">Description (optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
              rows="3"
              className="w-full px-4 py-2.5 bg-[#2A2A2A] border border-white/10 rounded-xl text-white placeholder:text-[#52525B] focus:outline-none focus:border-[#2B7FFF] transition resize-none"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 p-5 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white text-sm font-medium transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading || !title.trim() || !imgFile}
            className="px-4 py-2 bg-[#2B7FFF] hover:bg-[#2B7FFF]/80 rounded-xl text-white text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating...' : 'Create'}
          </button>
        </div>
      </div>
    </>
  )
}

export default PlaylistCreate