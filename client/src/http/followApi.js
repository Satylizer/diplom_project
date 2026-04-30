import { $authHost, $host } from './index'

export const toggleUserFollow = async (userId) => {
    const { data } = await $authHost.post(`/api/follow/user/${userId}/toggle`)
    return data
}

export const checkUserFollow = async (userId) => {
    const { data } = await $authHost.get(`/api/follow/user/${userId}/check`)
    return data
}

export const getUserFollowers = async (userId) => {
    const { data } = await $host.get(`/api/follow/user/${userId}/followers`)
    return data
}

export const getUserFollowing = async (userId) => {
    const { data } = await $host.get(`/api/follow/user/${userId}/following`)
    return data
}

export const toggleArtistFollow = async (artistId) => {
    const { data } = await $authHost.post(`/api/follow/artist/${artistId}/toggle`)
    return data
}

export const checkArtistFollow = async (artistId) => {
    const { data } = await $authHost.get(`/api/follow/artist/${artistId}/check`)
    return data
}

export const getUserFollowedArtists = async () => {
    const { data } = await $authHost.get('/api/follow/artist/my')
    return data
}