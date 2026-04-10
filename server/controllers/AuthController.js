import { compare } from "bcrypt";
import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import cloudinary from "../config/cloudinary.js";
import { unlink } from "fs/promises";
import Channel from "../models/ChannelModel.js";
import {
  getCachedUser,
  setCachedUser,
  deleteCachedUser,
} from "../utils/cache.js";

const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (email, userId) => {
  const jwtSecret = process.env.JWT_SECRET || process.env.JWT_KEY;
  return jwt.sign({ email, userId }, jwtSecret, {
    expiresIn: maxAge,
  });
};

const signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send("Email and Password are required");
    }
    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return res.status(400).json({ message: "Email already resgistered" });
    }
    const user = await User.create({
      email,
      password,
    });
    res.cookie("jwt", createToken(email, user.id), {
      maxAge,
      secure: true,
      sameSite: "None",
    });
    return res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
      },
    });
  } catch (error) {
    console.log("error");
    return res.status(500).send("Internal Server Error");
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and Password are required" });
    }

    const user = await User.findOne({
      email,
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const auth = await compare(password, user.password);
    if (!auth) {
      return res.status(400).json({ message: "Password is wrong" });
    }
    res.cookie("jwt", createToken(email, user.id), {
      maxAge,
      secure: true,
      sameSite: "None",
    });
    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        color: user.color,
      },
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send("Internal Server Error");
  }
};

export const getUserInfo = async (req, res, next) => {
  try {
    //cache hit
    const cachedUser = await getCachedUser(req.userId);
    if (cachedUser) {
      console.log("Cache hit for user:", req.userId);
      return res.status(200).json(cachedUser);
    }
    console.log("Cache miss for user: ", req.userId);

    //cache miss
    const userData = await User.findById(req.userId);
    if (!userData) {
      return res.status(404).send("User data not found");
    }

    const responseData = {
      id: userData.id,
      email: userData.email,
      profileSetup: userData.profileSetup,
      firstName: userData.firstName,
      lastName: userData.lastName,
      image: userData.image,
      color: userData.color,
    };

    await setCachedUser(req.userId, responseData);

    return res.status(200).json(responseData);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send("Internal Server Error");
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { firstName, lastName, color } = req.body;

    if (!firstName || !lastName || color === undefined) {
      return res
        .status(400)
        .send("FirstName, LastName, and Color are required");
    }

    const updateData = { profileSetup: true };

    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (color !== undefined) updateData.color = color;

    const userData = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true },
    );

    if (!userData) {
      return res.status(404).send("User not found");
    }

    //Invalidate cache after update
    await deleteCachedUser(userId);

    let generalChat = await Channel.findOne({ isGeneral: true });
    if (!generalChat) {
      return res.status(500).json({ error: "General chat not initialized" });
    }
    if (!generalChat.members.includes(userId)) {
      await Channel.findByIdAndUpdate(generalChat._id, {
        $push: { members: userId },
      });
    }

    return res.status(200).json({
      id: userData.id,
      email: userData.email,
      profileSetup: userData.profileSetup,
      firstName: userData.firstName,
      lastName: userData.lastName,
      image: userData.image,
      color: userData.color,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send("Internal Server Error");
  }
};

export const addProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("File is required.");
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "communique/profile-images",
    });

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { image: result.secure_url },
      { new: true, runValidators: true },
    );

    await deleteCachedUser(req.userId);

    // Optionally delete the local file
    await unlink(req.file.path);

    return res.status(200).json({ image: updatedUser.image });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const removeProfileImage = async (req, res, next) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send("User not found");
    }

    if (user.image) {
      // Extract public_id from URL for deletion
      const publicId = user.image.split("/").slice(-1)[0].split(".")[0];
      await cloudinary.uploader.destroy(
        `communique/profile-images/${publicId}`,
      );
    }

    user.image = null;
    await user.save();
    await deleteCachedUser(userId);
    return res.status(200).send("Profile image removed successfully");
  } catch (error) {
    console.log(error.message);
    return res.status(500).send("Internal Server Error");
  }
};

export const logout = async (req, res, next) => {
  try {
    await deleteCachedUser(req.userId);
    console.log("Cache invalidated for user: ", req.userId);
    res.cookie("jwt", "", { maxAge: 1, secure: true, sameSite: "None" });

    return res.status(200).send("Logout successful");
  } catch (error) {
    console.log(error.message);
    return res.status(500).send("Internal Server Error");
  }
};

export default { signup, login, logout };
