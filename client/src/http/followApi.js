import { $authHost } from './index'

export const toggleUserFollow = async (userId) => {
    const { data } = await $authHost.post(`/api/follow/user/${userId}/toggle`)
    return data
}

export const getUserFollowing = async () => {
    const { data } = await $authHost.get('/api/follow/user/following')
    return data
}

export const toggleArtistFollow = async (artistId) => {
    const { data } = await $authHost.post(`/api/follow/artist/${artistId}/toggle`)
    return data
}

export const getUserFollowedArtists = async () => {
    const { data } = await $authHost.get('/api/follow/artist/my')
    return data
}