import { $host } from './index'

export const getArtists = async () => {
    const { data } = await $host.get('/api/artist')
    return data
}

export const getArtist = async (id) => {
    const { data } = await $host.get(`/api/artist/${id}`)
    return data
}