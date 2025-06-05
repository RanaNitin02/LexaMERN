import { generateToken } from "../config/token.js";
import User from "../models/user.model.js";
import bcrypt from 'bcryptjs'


export const signup = async(req, res) => {
    try {
        
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(400).json({
                status: false, message: "user already exists!"
            })
        }if( password.length < 6 ){
            return res.status(400).json({
                status: false, message: "password must be atleast 6 characters!"
            })
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name, password: hashPassword, email
        })

        const authToken = await generateToken(user._id);

        res.cookie("token", authToken, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "strict",
            secure: false
        })

        return res.status(201).json({ status: true, message: "User created successfully!", user });

    } catch (error) {
        return res.status(500).json({ status: false, message: `Error creating user: ${error.message}` });
    }
}


export const login = async(req, res) => {
    try {
        
        const { email, password } = req.body;

        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({
                status: false, message: "user does not exist!"
            })
        }
        
        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if(!isPasswordMatch){
            return res.status(400).json({
                status: false, message: "Incorrect password!"
            })
        }

        const authToken = await generateToken(user._id);

        res.cookie("token", authToken, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "strict",
            secure: false
        })

        return res.status(200).json({ status: true, message: "User logged in successfully!", user });

    } catch (error) {
        return res.status(500).json({ status: false, message: `Error login user: ${error.message}` });
    }
}


export const logout = async(req, res) => {
    try {
        
        res.clearCookie("token", {
            httpOnly: true,
            sameSite: "strict",
            secure: false
        });

        return res.status(200).json({ status: true, message: "User logged out successfully!" });

    } catch (error) {
        return res.status(500).json({ status: false, message: `Error logging out user: ${error.message}` });
    }
}