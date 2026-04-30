import { makeAutoObservable, runInAction } from 'mobx'
import { login, registration, check } from '../http/authApi'

export default class UserStore {
    constructor() {
        this._user = {}
        this._isAuth = false
        this._isLoading = true
        makeAutoObservable(this)
    }

    get user() {
        return this._user
    }

    get isAuth() {
        return this._isAuth
    }

    get isLoading() {
        return this._isLoading
    }

    login = async (email, password) => {
        try {
            const userData = await login(email, password)
            runInAction(() => {
                this._user = userData
                this._isAuth = true
            })
            return { success: true }
        } catch (e) {
            console.error('Ошибка входа', e)
            return { success: false, error: e.response?.data?.message || 'Ошибка входа' }
        }
    }

    registration = async (email, password) => {
        try {
            const userData = await registration(email, password)
            runInAction(() => {
                this._user = userData
                this._isAuth = true
            })
            return { success: true }
        } catch (e) {
            console.error('Ошибка регистрации', e)
            return { success: false, error: e.response?.data?.message || 'Ошибка регистрации' }
        }
    }

    checkAuth = async () => {
        this._isLoading = true
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
            })
        } finally {
            runInAction(() => {
                this._isLoading = false
            })
        }
    }

    logout = () => {
        localStorage.removeItem('token')
        this._user = {}
        this._isAuth = false
    }
}