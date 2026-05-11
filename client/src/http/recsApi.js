import { $authHost } from './index'

export const getRecommendations = async (userId, top_k = 100) => {
    const { data } = await $authHost.get(
        `/api/recommendations/${userId}?top_k=${top_k}`
    )
    return data
}