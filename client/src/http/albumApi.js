import { $host, $authHost } from './index'

export const getAlbums = async () => {
    const { data } = await $host.get('/api/album')
    return data
}

export const getAlbum = async (id) => {
    const { data } = await $authHost.get(`/api/album/${id}`)
    return data
}

export const toggleAlbumLike = async (albumId) => {
    const { data } = await $authHost.post(`/api/album/${albumId}/like`)
    return data
}

export const getLikedAlbums = async () => {
    const { data } = await $authHost.get('/api/album/liked')
    return data
}