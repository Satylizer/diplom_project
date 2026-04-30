import ApiError from "../error/ApiError.js"
import bcrypt from 'bcrypt'
import models from "../models/models.js"
const { User } = models
import jwt from "jsonwebtoken" 

const generateJwt = (id, email, role) => {
            return jwt.sign(
                {id: id, email: email, role}, 
                process.env.SECRET_KEY,
                {expiresIn: '24h'},
        )
}

class AuthController{
    async registration(req, res, next) {
        const {email, password, role} = req.body

        if(!email || !password) {
            return next(ApiError.badRequest("Некорректные данные"))
        }

        const candidate = await User.findOne({where: {email}})
        if (candidate) {
            return next(ApiError.badRequest("Пользователь с таким email уже существует"))
        }

        const hashpassword = await bcrypt.hash(password, 5)
        const user = await User.create({email, role, password: hashpassword})
        const token = generateJwt(user.id, user.email, user.role)
        return res.json({token})
    }

    async login(req, res, next) {
        const {email, password} = req.body
        const user = await User.findOne({where: {email}})

        if(!user) {
            return next(ApiError.badRequest("Пользователь не найден"))
        }

        const comparePassword = bcrypt.compareSync(password, user.password)
        if(!comparePassword) {
            return next(ApiError.badRequest("Указан неверный пароль"))
        }
        
        const token = generateJwt(user.id, user.email, user.role)
        return res.json({token})
    }

    async check(req, res) {
       const token = generateJwt(req.user.id, req.user.email, req.user.role)
       return res.json({token})
    }
}

export default new AuthController()