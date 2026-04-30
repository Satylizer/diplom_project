import { $authHost } from './index'

export const getLikedSongs = async () => {
    const { data } = await $authHost.get('/api/likes/')
    return data
}

export const toggleLike = async (songId) => {
    const { data } = await $authHost.post(`/api/likes/${songId}`)
    return data
}