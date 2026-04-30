import { $authHost } from './index'

export const getHistory = async () => {
    const { data } = await $authHost.get('/api/history')
    return data
}

export const addToHistory = async (songId) => {
    const { data } = await $authHost.post('/api/history', { songId })
    return data
}