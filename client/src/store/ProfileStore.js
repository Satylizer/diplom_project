import { makeAutoObservable, runInAction } from 'mobx'
import { getMe, getUser, updateUsername, updateEmail, updatePassword, updateAvatar } from '../http/userApi'

export default class ProfileStore {
    constructor() {
        this.user = null
        this.targetUser = null
        this.isEditModalOpen = false
        this.isLoading = false
        this.message = ''
        this.error = ''
        
        this.username = ''
        this.email = ''
        this.emailPassword = ''
        this.oldPassword = ''
        this.newPassword = ''
        
        makeAutoObservable(this)
    }

    get isOpen() {
        return this.isEditModalOpen
    }

    openModal = () => {
        this.username = this.user?.username || ''
        this.email = this.user?.email || ''
        this.emailPassword = ''
        this.oldPassword = ''
        this.newPassword = ''
        this.message = ''
        this.error = ''
        this.isEditModalOpen = true
    }

    closeModal = () => {
        this.isEditModalOpen = false
        this.emailPassword = ''
        this.oldPassword = ''
        this.newPassword = ''
        this.message = ''
        this.error = ''
        this.isLoading = false
    }

    setUsername = (value) => {
        this.username = value
    }

    setEmail = (value) => {
        this.email = value
    }

    setEmailPassword = (value) => {
        this.emailPassword = value
    }

    setOldPassword = (value) => {
        this.oldPassword = value
    }

    setNewPassword = (value) => {
        this.newPassword = value
    }

    fetchUser = async () => {
        try {
            const userData = await getMe()
            runInAction(() => {
                this.user = userData
            })
        } catch (e) {
            console.error('Ошибка загрузки профиля', e)
        }
    }

    fetchUserById = async (id) => {
        try {
            const userData = await getUser(id)
            runInAction(() => {
                this.targetUser = userData
            })
        } catch (e) {
            console.error('Ошибка загрузки пользователя', e)
        }
    }

    updateUsername = async () => {
        if (this.username === this.user?.username) {
            this.error = 'Имя не изменилось'
            setTimeout(() => this.error = '', 3000)
            return
        }
        this.isLoading = true
        try {
            const data = await updateUsername(this.username)
            runInAction(() => {
                this.user = { ...this.user, username: data.username || this.username }
                this.message = 'Имя пользователя обновлено'
            })
            setTimeout(() => this.message = '', 3000)
        } catch {
            this.error = 'Ошибка обновления имени'
            setTimeout(() => this.error = '', 3000)
        } finally {
            this.isLoading = false
        }
    }

    updateEmail = async () => {
        if (this.email === this.user?.email) {
            this.error = 'Email не изменился'
            setTimeout(() => this.error = '', 3000)
            return
        }
        if (!this.emailPassword) {
            this.error = 'Введите текущий пароль'
            setTimeout(() => this.error = '', 3000)
            return
        }
        this.isLoading = true
        try {
            const data = await updateEmail(this.email, this.emailPassword)
            runInAction(() => {
                this.user = { ...this.user, email: data.email || this.email }
                this.message = 'Email обновлен'
                this.emailPassword = ''
            })
            setTimeout(() => this.message = '', 3000)
        } catch {
            this.error = 'Ошибка обновления email'
            setTimeout(() => this.error = '', 3000)
        } finally {
            this.isLoading = false
        }
    }

    updatePassword = async () => {
        if (!this.oldPassword || !this.newPassword) {
            this.error = 'Заполните оба поля'
            setTimeout(() => this.error = '', 3000)
            return
        }
        this.isLoading = true
        try {
            await updatePassword(this.oldPassword, this.newPassword)
            runInAction(() => {
                this.message = 'Пароль обновлен'
                this.oldPassword = ''
                this.newPassword = ''
            })
            setTimeout(() => this.message = '', 3000)
        } catch {
            this.error = 'Ошибка обновления пароля'
            setTimeout(() => this.error = '', 3000)
        } finally {
            this.isLoading = false
        }
    }

    updateAvatar = async (file) => {
        this.isLoading = true
        try {
            const data = await updateAvatar(file)
            runInAction(() => {
                this.user = { ...this.user, img: data.img }
                this.message = 'Аватар обновлен'
            })
            setTimeout(() => this.message = '', 3000)
        } catch {
            this.error = 'Ошибка обновления аватара'
            setTimeout(() => this.error = '', 3000)
        } finally {
            this.isLoading = false
        }
    }
}