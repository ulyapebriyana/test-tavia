import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

import { User } from "../models/index.js"
import { sendEmailVerification, sendForgotPassword } from "../events/email.js"
import { errorServerHandler, errorClientHandler, successHandler } from "../helpers/response-handler.js"

const self = {}

self.signUp = async (req, res) => {
    try {
        const { email, password, passwordConfirmation } = req.body
        const existedEmail = await User.findOne({
            where: {
                email: email
            }
        })

        if (existedEmail) return errorClientHandler(res, 422, "email already exist")

        if (password !== passwordConfirmation) return errorClientHandler(res, 422, "password confirmation must match")

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({ email: email, password: hashedPassword })

        const encodedEmail = jwt.sign({ email: email }, process.env.VERIFYCATION_EMAIL_SECRET, { expiresIn: '1h' })
        const sendEmail = sendEmailVerification(email, encodedEmail)

        return successHandler(res, 201, "user registered successfully, please verify your email", user)

    } catch (error) {
        return errorServerHandler(res, error)
    }
}

self.signIn = async (req, res) => {
    try {
        const { email, password } = req.body
        const currentUser = await User.findOne({
            where: {
                email: email
            }
        })

        if (!currentUser) return errorClientHandler(res, 404, "user not found")
        if (currentUser.isActive == false) return errorClientHandler(res, 400, "please activate your email")

        const comparedPassword = await bcrypt.compare(password, currentUser.password)
        if (!comparedPassword) return errorClientHandler(res, 422, "password incorrect")

        const accessToken = jwt.sign({ id: currentUser.id, email: currentUser.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1m" })
        const refreshToken = jwt.sign({ id: currentUser.id, email: currentUser.email }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1d" })

        await User.update({ refreshToken: refreshToken }, {
            where: { email: email }
        })

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
        })

        return successHandler(res, 200, "login successfully", {
            id: currentUser.id,
            email: currentUser.email,
            accessToken: accessToken
        })


    } catch (error) {
        errorServerHandler(res, error)
    }
}

self.refreshToken = async (req, res) => {
    try {
        const currentUser = await User.findByPk(req.currentUser.id)
        if (!currentUser) return errorClientHandler(res, 404, "user not found")
        const accessToken = jwt.sign({ id: currentUser.id, email: currentUser.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1m' })

        return successHandler(res, 200, "generated new access token", {
            id: currentUser.id,
            email: currentUser.email,
            accessToken: accessToken
        })
    } catch (error) {
        return errorServerHandler(res, error)
    }
}

self.verifyEmail = async (req, res) => {
    try {
        const token = req.params.token
        jwt.verify(token, process.env.VERIFYCATION_EMAIL_SECRET, async function (err, decoded) {

            if (err) return errorClientHandler(res, 400, "token invalid")

            await User.update({ isActive: true }, {
                where: {
                    email: decoded.email
                }
            })
            return successHandler(res, 200, "successfully activated your email", {
                isActive: true
            })
        });

    } catch (error) {
        return errorServerHandler(res, error)
    }
}

self.resendVerifyEmail = async (req, res) => {
    try {
        const { email } = req.body
        const existedEmail = await User.findOne({
            where: {
                email: email
            }
        })
        if (!existedEmail) return errorClientHandler(res, 404, "user not found")
        const encodedEmail = jwt.sign({ email: email }, process.env.VERIFICATION_VERIFYCATION_EMAIL_SECRET, { expiresIn: '1h' })
        sendEmailVerification(email, encodedEmail)

        return successHandler(res, 200, "please check your email to verified", existedEmail)

    } catch (error) {
        return errorServerHandler(res, error)
    }
}

self.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body
        const existedEmail = await User.findOne({
            where: {
                email: email
            }
        })
        if (!existedEmail) return errorClientHandler(res, 404, "user not found")
        const encodedEmail = jwt.sign({ email: email }, process.env.FORGOT_PASSWORD_SECRET, { expiresIn: '1h' })
        const sendEmail = sendForgotPassword(email, encodedEmail)

        return successHandler(res, 200, "please check your email to reset password", existedEmail)

    } catch (error) {
        return errorServerHandler(res, error)
    }

}

self.resetPassword = async (req, res) => {
    try {
        const token = req.params.token
        const { newPassword } = req.body
        jwt.verify(token, process.env.FORGOT_PASSWORD_SECRET, async function (err, decoded) {
            if (err) return errorClientHandler(res, 400, "token invalid")

            const hashedPassword = await bcrypt.hash(newPassword, 10)

            await User.update({ password: hashedPassword }, {
                where: {
                    email: decoded.email
                }
            })
            return successHandler(res, 200, "reset password succesfully", {})
        });

    } catch (error) {
        return errorServerHandler(res, error)
    }
}

self.signOut = async (req, res) => {
    try {
        const currentUser = await User.findByPk(req.currentUser.id)
        if (!currentUser) return errorClientHandler(res, 404, "user not found")
        await User.update({ refreshToken: null }, {
            where: {
                id: req.currentUser.id
            }
        })
        res.clearCookie('refreshToken')
        return successHandler(res, 200, "user logged out successfully", currentUser)
        
    } catch (error) {
        return errorServerHandler(res, error)
    }
}

export default self