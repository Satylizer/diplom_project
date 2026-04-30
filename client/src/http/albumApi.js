import { $host } from './index'

export const getAlbums = async () => {
    const { data } = await $host.get('/api/album')
    return data
}

export const getAlbum = async (id) => {
    const { data } = await $host.get(`/api/album/${id}`)
    return data
}