import { $authHost } from './index'

export const getMe = async () => {
    const { data } = await $authHost.get('/api/user/me')
    return data
}

export const getUsers = async () => {
    const { data } = await $authHost.get('/api/user/')
    return data
}

export const getUser = async (id) => {
    const { data } = await $authHost.get(`/api/user/${id}`)
    return data
}

export const updateAvatar = async (file) => {
    const formData = new FormData()
    formData.append('img', file)
    const { data } = await $authHost.put('/api/user/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })
    return data
}

export const updateUsername = async (username) => {
    const { data } = await $authHost.put('/api/user/username', { username })
    return data
}

export const updateEmail = async (email, password) => {
    const { data } = await $authHost.put('/api/user/email', { email, password })
    return data
}

export const updatePassword = async (oldPassword, newPassword) => {
    const { data } = await $authHost.put('/api/user/password', { oldPassword, newPassword })
    return data
}