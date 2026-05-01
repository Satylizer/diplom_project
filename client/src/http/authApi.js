import { $host, $authHost } from "./index";
import { jwtDecode } from 'jwt-decode'

export const registration = async (email, password) => {
    const { data } = await $host.post('/api/auth/registration', { email, password, role: 'USER' })
    localStorage.setItem('token', data.token)
    return jwtDecode(data.token)
}

export const login = async (email, password) => {
    const { data } = await $host.post('/api/auth/login', { email, password })
    localStorage.setItem('token', data.token)
    return jwtDecode(data.token)
}

export const check = async () => {
    const { data } = await $authHost.get('/api/auth/check')
    localStorage.setItem('token', data.token)
    return jwtDecode(data.token)
}