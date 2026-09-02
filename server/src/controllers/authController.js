import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import Workspace from '../models/workspace.model.js';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import WorkspaceMember from '../models/workspaceMember.model.js';

const registerAdmin = async (req, res) => {
    try {
        const { name, email, password, description } = req.body;

        if(!name || !email || !password) {
            return res
                .status(400)
                .json({
                    message: "Invalid or insufficient credentials!",
                })
        }

        const normalizedEmail = email.toLowerCase().trim();

        // check for already existing user
        const userExists = await User.findOne({ normalizedEmail });
        if(userExists) {
            return res
                .status(409)
                .json({
                    message: "User with this email already exists!",
                })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        let newUser;

        // transaction for atomicity
        const session = await mongoose.startSession();
        try {
            session.startTransaction();

            newUser = new User({ 
                name: name.trim(),
                email: normalizedEmail,
                password: hashedPassword,
                role: "Admin",
            });

            const workspace = new Workspace({
                name: `${newUser.name}'s Workspace`,
                description,
                ownerId: newUser._id,
            });

            const workspaceMember = new WorkspaceMember({
                workspaceId: workspace._id,
                userId: newUser._id,
                role: "Admin",
                status: "active",
                joinedAt: Date.now(),
            })
            
            await newUser.save({ session });
            await workspace.save({ session });
            await workspaceMember.save({ session });

            await session.commitTransaction();

        } catch (error) {
            await session.abortTransaction();
            throw error;

        } finally {
            await session.endSession();
        }

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
                maxAge: 15 * 60 * 1000,
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
                    error: error.message,
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

        const normalizedEmail = email.toLowerCase().trim();

        const user = await User.findOne({ normalizedEmail });
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
                maxAge: 15 * 60 * 1000,
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

export {
    registerAdmin,
    loginUser,
    logoutUser,
    getCurrentUser,
}