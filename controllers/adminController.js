import User from "../models/userModel.js";
import Instructor from "../models/InstructorSchema.models.js";
import Learner from "../models/LearnerSchema.models.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import fast2sms from "fast-two-sms"; // Install using `npm install fast-two-sms`
import fs from "fs";
import { uploadFile } from "../util/googleDriveUpload.js";

// export const createUser = async (req, res) => {
//   const { username, mobileNumber, password, role } = req.body;

//   try {
//     if (role === "Admin")
//       return res.status(403).json({ message: "Cannot create admin" });

//     // Validate file upload
//     if (!req.file) {
//       return res.status(400).json({ message: "Photo is required" });
//     }

//     // Upload file to Google Drive
//     const filePath = req.file.path;
//     const fileName = req.file.originalname;
//     const photoUrl = await uploadFile(filePath, fileName);
//     fs.unlinkSync(filePath); // Delete local file after upload

//     // Create a new user
//     const newUser = new User({ username, mobileNumber, password, role });

//     let newRoleData;

//     if (role === "Instructor") {
//       newRoleData = new Instructor({ ...req.body, photo: photoUrl });
//       newUser.refId = newRoleData._id;
//       newRoleData.userId = newUser._id;

//       await newRoleData.save();
//       await newUser.save();
//     } else if (role === "Learner") {
//       newRoleData = new Learner({ ...req.body, photo: photoUrl });
//       newUser.refId = newRoleData._id;
//       newRoleData.userId = newUser._id;

//       await newRoleData.save();
//       await newUser.save();
//     }

//     res
//       .status(201)
//       .json({ message: `${newUser.role} created successfully`, user: newUser });
//   } catch (err) {
//     res
//       .status(500)
//       .json({ message: "Error creating user", error: err.message });
//   }
// };

// // Adjust path as per your project


const login = async (req, res) => {
  const { username, mobileNumber, password } = req.body;

  try {
    const user = await User.findOne({ $or: [{ username }, { mobileNumber }] });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Send OTP for password reset
const forgotPassword = async (req, res) => {
  const { mobileNumber } = req.body;
  try {
    const user = await User.findOne({ mobileNumber });
    if (!user) return res.status(400).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // OTP valid for 5 minutes

    // Update user with OTP and expiration time
    user.otp = otp;
    user.expiresAt = expiresAt;
    await user.save();

    // Use Fast2SMS to send OTP
    const response = await fast2sms.sendMessage({
      authorization: process.env.SMS_API, // Replace with your API key
      message: `Your OTP for password reset is: ${otp}`,
      numbers: [mobileNumber],
    });

    if (response.return) {
      return res.status(200).json({ message: "OTP sent successfully" });
    } else {
      throw new Error("Failed to send OTP");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Verify OTP
const verifyOtp = async (req, res) => {
  const { mobileNumber, otp } = req.body;
  try {
    const user = await User.findOne({ mobileNumber });
    if (!user) return res.status(400).json({ message: "User not found" });

    // Check if OTP is valid
    if (!user.otp || user.otp !== parseInt(otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Check if OTP is expired
    if (user.expiresAt < Date.now()) {
      user.otp = null; // Clear expired OTP
      user.expiresAt = null;
      await user.save();
      return res.status(400).json({ message: "OTP expired" });
    }

    // OTP is verified; clear the OTP and expiration
    user.otp = null;
    user.expiresAt = null;
    await user.save();

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Change Password
const changePassword = async (req, res) => {
  const { mobileNumber, newPassword } = req.body;
  try {
    const user = await User.findOne({ mobileNumber });
    if (!user) return res.status(400).json({ message: "User not found" });

    // Hash the new password using bcryptjs
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export default { login, forgotPassword, verifyOtp, changePassword };
// export default { createUser}
