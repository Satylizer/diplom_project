import { makeAutoObservable, runInAction } from 'mobx'
import { login, registration, check } from '../http/authApi'
import { getUsers, getUser } from '../http/userApi'

export default class UserStore {
    constructor() {
        this._user = {}
        this._users = []
        this._isAuth = false
        this._isLoading = true
        this._error = null
        makeAutoObservable(this)
    }

    get user() {
        return this._user
    }

    get users() {
        return this._users
    }

    get isAuth() {
        return this._isAuth
    }

    get isLoading() {
        return this._isLoading
    }

    get error() {
        return this._error
    }

    login = async (email, password) => {
        this._isLoading = true
        this._error = null
        try {
            const userData = await login(email, password)
            runInAction(() => {
                this._user = userData
                this._isAuth = true
            })
            return { success: true }
        } catch (e) {
            runInAction(() => {
                this._error = e.response?.data?.message || 'Ошибка входа'
            })
            console.error('Ошибка входа', e)
            return { success: false, error: this._error }
        } finally {
            runInAction(() => {
                this._isLoading = false
            })
        }
    }

    registration = async (email, password) => {
        this._isLoading = true
        this._error = null
        try {
            const userData = await registration(email, password)
            runInAction(() => {
                this._user = userData
                this._isAuth = true
            })
            return { success: true }
        } catch (e) {
            runInAction(() => {
                this._error = e.response?.data?.message || 'Ошибка регистрации'
            })
            console.error('Ошибка регистрации', e)
            return { success: false, error: this._error }
        } finally {
            runInAction(() => {
                this._isLoading = false
            })
        }
    }

    checkAuth = async () => {
        this._isLoading = true
        this._error = null
        try {
            const token = localStorage.getItem('token')
            if (token) {
                const userData = await check()
                runInAction(() => {
                    this._user = userData
                    this._isAuth = true
                })
            }
        } catch (e) {
            console.error('Ошибка проверки авторизации', e)
            localStorage.removeItem('token')
            runInAction(() => {
                this._user = {}
                this._isAuth = false
                this._error = e.response?.data?.message || 'Ошибка авторизации'
            })
        } finally {
            runInAction(() => {
                this._isLoading = false
            })
        }
    }

    logout = () => {
        localStorage.removeItem('token')
        runInAction(() => {
            this._user = {}
            this._users = []
            this._isAuth = false
            this._error = null
        })
    }

    fetchUsers = async () => {
        this._isLoading = true
        this._error = null
        try {
            const data = await getUsers()
            runInAction(() => {
                this._users = data
            })
        } catch (e) {
            runInAction(() => {
                this._error = e.response?.data?.message || 'Ошибка загрузки пользователей'
            })
            console.error('Ошибка загрузки пользователей:', e)
        } finally {
            runInAction(() => {
                this._isLoading = false
            })
        }
    }

    fetchUserById = async (id) => {
        this._isLoading = true
        this._error = null
        try {
            const userData = await getUser(id)
            return userData
        } catch (e) {
            runInAction(() => {
                this._error = e.response?.data?.message || 'Ошибка загрузки пользователя'
            })
            console.error('Ошибка загрузки пользователя:', e)
            return null
        } finally {
            runInAction(() => {
                this._isLoading = false
            })
        }
    }
}