import { $authHost } from './index'

export const getArtists = async () => {
    const { data } = await $authHost.get('/api/artist')
    return data
}

export const getArtist = async (id) => {
    const { data } = await $authHost.get(`/api/artist/${id}`)
    return data
}