import { $authHost } from './index'

export const getPlaylists = async () => {
    const { data } = await $authHost.get('/api/playlist')
    return data
}

export const getPlaylist = async (id) => {
    const { data } = await $authHost.get(`/api/playlist/${id}`)
    return data
}

export const createPlaylist = async (playlistData) => {
    const { data } = await $authHost.post('/api/playlist', playlistData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })
    return data
}

export const deletePlaylist = async (id) => {
    const { data } = await $authHost.delete(`/api/playlist/${id}`)
    return data
}

export const addSongToPlaylist = async (playlistId, songId) => {
    const { data } = await $authHost.post(`/api/playlist/${playlistId}/songs`, { songId })
    return data
}

export const removeSongFromPlaylist = async (playlistId, songId) => {
    const { data } = await $authHost.delete(`/api/playlist/${playlistId}/songs/${songId}`)
    return data
}