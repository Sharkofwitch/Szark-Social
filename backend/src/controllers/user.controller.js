import asyncHandler from "express-async-handler";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import { v2 as cloudinary } from "cloudinary";

import { getAuth } from "@clerk/express";
import { clerkClient } from "@clerk/express";

export const getUserProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({ username });
  if (!user) return res.status(404).json({ error: "User not found" });

  res.status(200).json({ user });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const updateData = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    bio: req.body.bio,
    location: req.body.location,
  };

  // Handle profile picture upload
  if (req.files?.profilePicture?.[0]) {
    try {
      const base64 = req.files.profilePicture[0].buffer.toString("base64");
      const dataURI = `data:${req.files.profilePicture[0].mimetype};base64,${base64}`;
      
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: "szark-social/profiles",
        resource_type: "auto",
      });
      
      updateData.profilePicture = result.secure_url;
    } catch (error) {
      console.error("Profile picture upload error:", error);
    }
  }

  // Handle banner image upload
  if (req.files?.bannerImage?.[0]) {
    try {
      const base64 = req.files.bannerImage[0].buffer.toString("base64");
      const dataURI = `data:${req.files.bannerImage[0].mimetype};base64,${base64}`;
      
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: "szark-social/banners",
        resource_type: "auto",
      });
      
      updateData.bannerImage = result.secure_url;
    } catch (error) {
      console.error("Banner image upload error:", error);
    }
  }

  const user = await User.findOneAndUpdate({ clerkId: userId }, updateData, { new: true });

  if (!user) return res.status(404).json({ error: "User not found" });

  res.status(200).json({ user });
});

export const syncUser = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);

  // check if user already exists in mongodb
  const existingUser = await User.findOne({ clerkId: userId });
  if (existingUser) {
    return res.status(200).json({ user: existingUser, message: "User already exists" });
  }

  // create new user from Clerk data
  const clerkUser = await clerkClient.users.getUser(userId);

  const userData = {
    clerkId: userId,
    email: clerkUser.emailAddresses[0].emailAddress,
    firstName: clerkUser.firstName || "",
    lastName: clerkUser.lastName || "",
    username: clerkUser.emailAddresses[0].emailAddress.split("@")[0],
    profilePicture: clerkUser.imageUrl || "",
  };

  const user = await User.create(userData);

  res.status(201).json({ user, message: "User created successfully" });
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const user = await User.findOne({ clerkId: userId });

  if (!user) return res.status(404).json({ error: "User not found" });

  res.status(200).json({ user });
});

export const followUser = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const { targetUserId } = req.params;

  if (userId === targetUserId) return res.status(400).json({ error: "You cannot follow yourself" });

  const currentUser = await User.findOne({ clerkId: userId });
  const targetUser = await User.findById(targetUserId);

  if (!currentUser || !targetUser) return res.status(404).json({ error: "User not found" });

  const isFollowing = currentUser.following.includes(targetUserId);

  if (isFollowing) {
    // unfollow
    await User.findByIdAndUpdate(currentUser._id, {
      $pull: { following: targetUserId },
    });
    await User.findByIdAndUpdate(targetUserId, {
      $pull: { followers: currentUser._id },
    });
  } else {
    // follow
    await User.findByIdAndUpdate(currentUser._id, {
      $push: { following: targetUserId },
    });
    await User.findByIdAndUpdate(targetUserId, {
      $push: { followers: currentUser._id },
    });

    // create notification
    await Notification.create({
      from: currentUser._id,
      to: targetUserId,
      type: "follow",
    });
  }

  res.status(200).json({
    message: isFollowing ? "User unfollowed successfully" : "User followed successfully",
  });
});