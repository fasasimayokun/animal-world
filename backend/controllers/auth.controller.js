import { generateTokenAndSetcookie } from "../lib/utils/generateToken.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
    try {
        const {username, fullname, email, password } = req.body;

        const existedUser = await User.findOne({ username });
        if(existedUser) {
            return res.status(400).json({ error: "username already existed"});
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)) {
            return res.status(400).json({ error: "Wrong email format"});
        }

        const emailExisted = await User.findOne({ email });
        if(emailExisted) {
            return res.status(400).json({ error: "Email already existed"});
        }

        if(password.length < 6) {
            return res.status(400).json({ error: "Password must be more the 6 characters"});
        }

        const salt = await bcrypt.genSalt(10);
        const encryptPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            fullname,
            email,
            password: encryptPassword,
        });

        // if new user was created successfully generate a token for the new user
        if (newUser) {
            generateTokenAndSetcookie(newUser._id, res);

            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                username: newUser.username,
                fullname: newUser.fullname,
                email: newUser.email,
                profileImg: newUser.profileImg,
                bio: newUser.bio,
                saved: newUser.saved
            });
        } else {
            res.status(400).json({ error: "Invalid user data"});
        }
    } catch (error) {
        console.log("Error in signup controller ", error.message);
        res.status(500).json({ error: "Internal server error"});
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const getUser = await User.findOne({ username });
        const verifyPassword = await bcrypt.compare(password, getUser?.password || "");

        if(!getUser || !verifyPassword) {
            return res.status(400).json({ error: "Invalid username or password"});
        }

        generateTokenAndSetcookie(getUser._id, res);

        res.status(200).json({
            _id: getUser._id,
            username: getUser.username,
            fullname: getUser.fullname,
            email: getUser.email,
            profileImg: getUser.profileImg,
            bio: getUser.bio,
            saved: getUser.saved
        });
    } catch (error) {
        console.log("Error in the login controller ", error.message);
        res.status(500).json({ error: "Internal server error"});
    }
};

export const logout = (req, res) => {
    try {
        res.cookies("jwt","",{maxAge:0});
        res.status(200).json({ messagee: "Logout sucessfully"});
    } catch (error) {
        console.log("Error in the logout controller", error.message);
        res.status(500).json({ error: "Internal server error"});
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        res.status(200).json(user);
    } catch (error) {
        console.log("Error in the getme controller", error.message);
        res.status(500).json({ error: "Internal server error"});
    }
};

export const updateUser = async (req, res) => {
    const {fullname, email, username, currentPassword, newPassword, bio} = req.body;
    let {profileImg } = req.body;

    const userId = req.user._id;
    try {
        let user = await User.findById(userId);
        if(!user) {
            return res.status(404).json({ message: "User not found"});
        }
        if((!newPassword && currentPassword) || (!currentPassword && newPassword)) {
            return res.status(400).json({ error: "Please provide both current password and new password"});
        }

        if(currentPassword && newPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if(!isMatch) return res.status(400).json({ error: "Current password is incorrect"});
            if(newPassword.length < 6) {
                return res.status(400).json({ error: "Password must be at least 6 characters long"});
            }

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
        }

        if (profileImg) {
            if(user.profileImg) {
                await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0]);
            }
            const uploadedResponse = await cloudinary.uploader.upload(profileImg);
            profileImg = uploadedResponse.secure_url;
        }

        user.fullname = fullname || user.fullname;
        user.email = email || user.email;
        user.username = username || user.username;
        user.bio = bio || user.bio;
        user.profileImg = profileImg || user.profileImg;

        user = await user.save();

        user.password = null;

        return res.status(200).json(user);

    } catch (error) {
        console.log("Error in updateUser ", error.message);
        res.status(500).json({ error: error.message});
    }
};