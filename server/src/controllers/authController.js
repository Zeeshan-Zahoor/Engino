import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';

const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if(!name || !email || !password || !role) {
            return res
                .status(400)
                .json({
                    message: "Invalid or insufficient credentials!",
                })
        }

        // check for already existing user
        const userExists = await User.findOne({ email });
        if(userExists) {
            return res
                .status(409)
                .json({
                    message: "User with this email already exists!",
                })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ 
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            role,
         });

         await newUser.save();

        // generate jwt
        const token = jwt.sign(
            { userId: newUser._id },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRY,
            }
        )

        res.cookie(
            'authToken',
            token,
            {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: process.env.JWT_EXPIRY,
            }
        );

        res.status(201).json({
            success: true,
            message: "User registered successfully",
        })

    } catch (error) {
        return res
                .status(500)
                .json({
                    message: "Internal Server Error",
                })
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if(!email || !password) {
            return res.status(400).json({
                        message: "Invalid or insufficient credentials!",
                    })
        }

        const user = await User.findOne({ email });
        if(!user) {
            return res.status(404).json({
                success: false,
                message: "User does not exists!",
            });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if(!passwordMatch) {
            return res.status(400).json({
                success: false,
                message: "Incorrect Password",
            });
        }

        // generate jwt
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRY,
            }
        )

        res.cookie(
            'authToken',
            token,
            {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: process.env.JWT_EXPIRY,
            }
        );

        return res.status(200).json({
            success: true,
            message: "User logged in successfully!",
            user: { ...user.toObject(), password: undefined }
        });

    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
        })
    }
}

const logoutUser = async (req, res) => {
    try {
        res.clearCookie(
            'authToken',
            {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
            }
        );

        return res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        })
    }
}

const getCurrentUser = async(req, res) => {
    try {
        const userId = req.user.userId;

        const user = await User.findOne({ _id: userId });
        if(!user) {
            return res.status(404).json({
                success: false,
                message: "User not found!",
            });
        }

        return res.status(200).json({
            success: true,
            user: { ...user.toObject(), password: undefined },
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

export default {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
}