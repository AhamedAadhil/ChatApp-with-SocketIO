import bcrpt from "bcryptjs";

import User from "../models/user.model.js";
import cloudinary from "../libs/cloudinary.js";
import { generateToken } from "../libs/utils.js";

export const signUp = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    // validate user input
    if (!fullName || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }
    // validate user password length
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
        success: false,
      });
    }
    // check if user already exist
    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
      return res
        .status(400)
        .json({ message: "This email is already in use", success: false });
    }
    // hash the password
    const salt = await bcrpt.genSalt(10);
    const hashedPassword = await bcrpt.hash(password, salt);
    // store user in database
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });
    if (newUser) {
      // generate jwt token
      generateToken(newUser._id, res);
      await newUser.save();
      const { password, ...rest } = newUser._doc;
      return res.status(201).json({
        user: rest,
        message: "Account created successfully",
        success: true,
      });
    } else {
      return res
        .status(500)
        .json({ message: "Something went wrong", success: false });
    }
  } catch (error) {
    console.error(error.message);
    console.log(error.message);
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const signIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    // check account exist
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid credentials", success: false });
    }
    // compare password
    const isPasswordMatch = await bcrpt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res
        .status(400)
        .json({ message: "Invalid credentials", success: false });
    }
    // generate jwt token
    generateToken(user._id, res);
    return res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
      message: "User logged in successfully",
      success: true,
    });
  } catch (error) {
    console.error(error.message);
    console.log(error.message);
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const signOut = (req, res) => {
  try {
    res.cookie("jwt", "", {
      maximumAge: 0,
    });
    return res
      .status(200)
      .json({ message: "User logged out successfully", success: true });
  } catch (error) {
    console.error(error.message);
    console.log(error.message);
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;
    if (!profilePic) {
      return res
        .status(400)
        .json({ message: "Profile picture is required", success: false });
    }
    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const user = await User.findById(userId);
    if (user) {
      user.profilePic = uploadResponse.secure_url;
      await user.save();
      return res.status(200).json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic,
        message: "User profile updated successfully",
        success: true,
      });
    } else {
      return res
        .status(400)
        .json({ message: "User not found", success: false });
    }
  } catch (error) {
    console.error(error.message);
    console.log(error.message);
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const checkAuth = (req, res) => {
  try {
    return res.status(200).json({ user: req.user, success: true });
  } catch (error) {
    console.error(error.message);
    console.log(error.message);
    return res.status(500).json({ message: error.message, success: false });
  }
};
