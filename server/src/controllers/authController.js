import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import Workspace from '../models/workspace.model.js';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import WorkspaceMember from '../models/workspaceMember.model.js';

import cloudinary from '../config/cloudinary.js';
import uploadToCloudinary from '../utils/cloudinary.js';

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
        const userExists = await User.findOne({ email: normalizedEmail });
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
                sameSite: 'none',
                maxAge: 24 * 60 * 60 * 1000,
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

        const user = await User.findOne({ email: normalizedEmail });
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
                sameSite: 'none',
                maxAge: 24 * 60 * 60 * 1000,
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
                sameSite: "none",
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

const uploadProfilePhoto = async(req, res) => {
    try {
        const userId = req.user.userId;
        const file = req.file;
        
        if(!file) {
            return res.status(400).json({
                success: false,
                message: "No file found!",
            });
        }

        if (file.size > 2 * 1024 * 1024) {
            return res.status(400).json({
                success: false,
                message: "File must be under 2 MB.",
            });
        }

        const user = await User.findOne({ _id: userId });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found!",
            });
        }

        const oldPublicId = user.avatarPublicId;

        const result = await uploadToCloudinary(file.buffer);

        user.avatar = result.secure_url;
        user.avatarPublicId = result.public_id;

        await user.save();

        if(oldPublicId) {
            try {
                await cloudinary.uploader.destroy(oldPublicId);
            } catch (error) {
                console.error("Failed to delete old profile photo: ", error);
            }
        }

        return res.status(200).json({
            success: true,
            user: {
                name: user.name,
                email: user.email,
                _id: user._id,
                avatar: user.avatar,
                role: user.role,
            },
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error.",
            error: error.message,
        }); 
    }
}

export const removeProfilePhoto = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const oldPublicId = user.avatarPublicId;

    // Clear the profile photo in MongoDB first.
    user.avatar = "";
    user.avatarPublicId = "";

    await user.save();

    // Delete the old Cloudinary image, if one exists.
    if (oldPublicId) {
      try {
        await cloudinary.uploader.destroy(oldPublicId);
      } catch (error) {
        console.error(
          "Failed to delete profile photo from Cloudinary:",
          error
        );
      }
    }

    return res.status(200).json({
      success: true,
      message: "Profile photo removed successfully.",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Remove profile photo error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to remove profile photo.",
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const name = req.body.name?.trim();

    if (!name || name.length > 80) {
      return res.status(400).json({
        success: false,
        message: "Name must be between 1 and 80 characters.",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    user.name = name;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update profile.",
    });
  }
};


export const changePassword = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All password fields are required.",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters.",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New passwords do not match.",
      });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: "New password must differ from current password.",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect.",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error) {
    console.error("Change password error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to change password.",
    });
  }
};

export {
    registerAdmin,
    loginUser,
    logoutUser,
    getCurrentUser,
    uploadProfilePhoto,
    updateProfile,
}