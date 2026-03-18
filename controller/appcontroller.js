
import bcrypt from "bcrypt"
import { tokenManager } from "../utils/tokenManager.js"
import login_model from "../models/loginmodel.js"
import validator from "validator"
// import jwt from "jsonwebtoken"

export const signup = async (req, res) => {
    try {
        const { email, password } = req.body

        // 1. Check missing fields
        if (!email || !password) {
            return res.json({ message: "Email or Password is Missing" })
        }

        // 2. Normalize email
        const normalizedEmail = validator.normalizeEmail(email)

        // 3. Validate email
        if (!validator.isEmail(normalizedEmail)) {
            return res.json({ message: "Invalid Email format" })
        }

        // 4. Check existing user
        const existingUser = await login_model.findOne({ email: normalizedEmail })
        if (existingUser) {
            return res.json({ message: "Email already exists" })
        }

        // 5. Password validation
        if (password.length < 8) {
            return res.json({ message: "Password must be at least 8 characters" })
        }

        // 6. Hash password
        const salt = await bcrypt.genSalt(10)
        const hashed_pass = await bcrypt.hash(password, salt)

        // 7. Save user
        const newUser = await login_model.create({
            email: normalizedEmail,
            password: hashed_pass
        })

        // 8. Generate token
        const token = tokenManager.generateToken(newUser._id)

        // 9. Response
        return res.status(201).json({
            message: "Signup Successful",
            token
        })

    } catch (error) {
        return res.status(500).json({
            message: "Server Error",
            error: error.message
        })
    }
}

export const login = async (req, res, next) => {
    const { email, password } = req.body
    if (!validator.isEmail(email)) {
        return res.json({ message: "Invalid Email format" })
    }

    // if (!email.includes("@gmail.com")) {
    //     return res.json({ message: "Invalid Email. Try Again." })
    // }
    const user = await login_model.findOne({ email })
    if (!user) {
        return res.json({ message: "Account doesn't exist. Signup...." })
    }
    const pass_check = await bcrypt.compare(password, user.password)
    if (!pass_check) {
        return res.json({ message: "Wrong password." })
    }
    const token = tokenManager.generateToken(user._id)
    // const token = jwt.sign({ email }, process.env.jwt_secret_key, {
    //     expiresIn: "1h",


    // })
    // console.log(token)
    return res.json({ message: "Login Successfull", token: token })
}

//jwt.sign(payload,secret,options)


