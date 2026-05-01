import { makeAutoObservable, runInAction } from 'mobx'
import { getMe, updateUsername, updateEmail, updatePassword, updateAvatar } from '../http/userApi'

export default class ProfileStore {
    constructor() {
        this.user = null
        this.targetUser = null
        this.isEditModalOpen = false
        
        makeAutoObservable(this)
    }

    get isOpen() {
        return this.isEditModalOpen
    }

    openModal = () => {
        this.isEditModalOpen = true
    }

    closeModal = () => {
        this.isEditModalOpen = false
    }

    clearUser = () => {
        runInAction(() => {
            this.user = null
            this.targetUser = null
        })
    }

    fetchUser = async () => {
        try {
            const userData = await getMe()
            runInAction(() => {
                this.user = userData
            })
        } catch (e) {
            console.error('Ошибка загрузки профиля', e)
            runInAction(() => {
                this.user = null
            })
        }
    }

    updateUsername = async (username) => {
        const data = await updateUsername(username)
        runInAction(() => {
            this.user = { ...this.user, username: data.username || username }
        })
        return data
    }

    updateEmail = async (email, password) => {
        const data = await updateEmail(email, password)
        runInAction(() => {
            this.user = { ...this.user, email: data.email || email }
        })
        return data
    }

    updatePassword = async (oldPassword, newPassword) => {
        const data = await updatePassword(oldPassword, newPassword)
        return data
    }

    updateAvatar = async (file) => {
        const data = await updateAvatar(file)
        runInAction(() => {
            this.user = { ...this.user, img: data.img }
        })
        return data
    }
}