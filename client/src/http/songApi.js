import { $host } from './index'

export const getSongs = async () => {
    const { data } = await $host.get('/api/song')
    return data
}

export const getSong = async (id) => {
    const { data } = await $host.get(`/api/song/${id}`)
    return data
}