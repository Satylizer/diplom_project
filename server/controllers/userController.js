import ApiError from "../error/ApiError.js"
import models from "../models/models.js"
import bcrypt from 'bcrypt'
import path from "path"
import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'
import {fileURLToPath} from 'url'
import { Op } from 'sequelize'
const { User, UserFollowers, Playlist } = models

class UserController {
    async updateImg(req, res, next) {
        try {
            const userId = req.user.id
            const user = await User.findByPk(userId)

            if (!user) {
                return next(ApiError.notFound('Пользователь не найден'))
            }
            
            const { img } = req.files || {}

            if (!img) {
                return next(ApiError.badRequest('Картинка обязательна'))
            }

            if (user.img) {
                const __dirname = path.dirname(fileURLToPath(import.meta.url))
                const oldPath = path.resolve(__dirname, '..', 'static', user.img)
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath)
                }
            }

            let filename = uuidv4() + ".jpg"
            const __dirname = path.dirname(fileURLToPath(import.meta.url))
            const uploadPath = path.resolve(__dirname, '..', 'static', filename)
            
            await img.mv(uploadPath)

            user.img = filename
            await user.save()

            return res.json({ 
                message: 'Аватар успешно обновлен', 
                img: user.img
            })
        } catch (e) {
            next(ApiError.internal(`Ошибка при загрузке img: ${e.message}`)) 
        }
    }

    async updateUsername(req, res, next) {
        try {
            const userId = req.user.id
            const { username } = req.body

            if (!username) {
                return next(ApiError.badRequest('Имя пользователя обязательно'))
            }

            const user = await User.findByPk(userId)
            if (!user) {
                return next(ApiError.notFound('Пользователь не найден'))
            }

            const existingUser = await User.findOne({ where: { username } })
            if (existingUser && existingUser.id !== userId) {
                return next(ApiError.badRequest('Имя пользователя уже занято'))
            }

            user.username = username
            await user.save()

            return res.json({ 
                message: 'Имя пользователя обновлено', 
                username: user.username 
            })
        } catch (e) {
            next(ApiError.internal(`Ошибка обновления имени: ${e.message}`))
        }
    }

    async updatePassword(req, res, next) {
        try {
            const userId = req.user.id
            const { oldPassword, newPassword } = req.body

            if (!oldPassword || !newPassword) {
                return next(ApiError.badRequest('Старый и новый пароль обязательны'))
            }

            if (newPassword.length < 6) {
                return next(ApiError.badRequest('Новый пароль должен содержать минимум 6 символов'))
            }

            const user = await User.findByPk(userId)
            if (!user) {
                return next(ApiError.notFound('Пользователь не найден'))
            }

            const isPasswordValid = bcrypt.compareSync(oldPassword, user.password)
            if (!isPasswordValid) {
                return next(ApiError.badRequest('Неверный старый пароль'))
            }

            const hashedPassword = await bcrypt.hash(newPassword, 5)
            user.password = hashedPassword
            await user.save()

            return res.json({ message: 'Пароль успешно изменен' })
        } catch (e) {
            next(ApiError.internal(`Ошибка: ${e.message}`))
        }
    }

    async updateEmail(req, res, next) {
        try {
            const userId = req.user.id
            const { email, password } = req.body

            if (!email || !password) {
                return next(ApiError.badRequest('Email и пароль обязательны'))
            }

            const user = await User.findByPk(userId)
            if (!user) {
                return next(ApiError.notFound('Пользователь не найден'))
            }

            const isPasswordValid = bcrypt.compareSync(password, user.password)
            if (!isPasswordValid) {
                return next(ApiError.badRequest('Неверный пароль'))
            }

            const existingUser = await User.findOne({ where: { email } })
            if (existingUser && existingUser.id !== userId) {
                return next(ApiError.badRequest('Email уже используется'))
            }

            user.email = email
            await user.save()

            return res.json({ 
                message: 'Email обновлен', 
                email: user.email 
            })
        } catch (e) {
            next(ApiError.internal(`Ошибка: ${e.message}`))
        }
    }

    async getAll(req, res, next) {
        try {
            const currentUserId = req.user.id
            
            const users = await User.findAll({
                where: {
                    id: { [Op.ne]: currentUserId }
                },
                attributes: { exclude: ['password'] },
                order: [['username', 'ASC']]
            })
            
            return res.json(users)
        } catch (e) {
            next(ApiError.internal(`Ошибка получения пользователей: ${e.message}`))
        }
    }

    async getOne(req, res, next) {
        const { id } = req.params
        const currentUserId = req.user.id
        
        try {
            const user = await User.findByPk(id, {
                attributes: { exclude: ['password'] },
                include: [
                    {
                        model: Playlist,
                        as: 'playlists',
                        where: { type: 'user' },
                        required: false,
                        attributes: ['id', 'title', 'description', 'img', 'type', 'createdAt']
                    }
                ]
            })
            
            if (!user) {
                return next(ApiError.notFound('Пользователь не найден'))
            }
            
            const userJSON = user.toJSON()
            
            const followersCount = await UserFollowers.count({
                where: { followingId: id }
            })

            const followingCount = await UserFollowers.count({
                where: { followerId: id }
            })
            
            userJSON.followersCount = followersCount
            userJSON.followingCount = followingCount
 
            if (currentUserId && currentUserId !== parseInt(id)) {
                const isFollowing = await UserFollowers.findOne({
                    where: {
                        followerId: currentUserId,
                        followingId: id
                    }
                })
                userJSON.isFollowing = !!isFollowing
            } else {
                userJSON.isFollowing = false
            }
            
            return res.json(userJSON)
        } catch (e) {
            next(ApiError.internal(`Ошибка получения пользователя: ${e.message}`))
        }
    }

    async getMe(req, res, next) {
        const userId = req.user.id
        const user = await User.findByPk(userId, {
            attributes: { exclude: ['password'] }
        })
        
        if (!user) {
            return next(ApiError.notFound('Пользователь не найден'))
        }
        
        return res.json(user)
    }   
}

export default new UserController()