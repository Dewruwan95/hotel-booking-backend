import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { verifyAdmin, verifyCustomer } from "../utils/userVerification.js";
import nodemailer from "nodemailer";
import Otp from "../models/otp.js";
import { generateOtp } from "../utils/generateOtp.js";

//------------------------------------------------------------------
///--------------------------- create user -------------------------
//------------------------------------------------------------------
export async function createUser(req, res) {
  const user = req.body;

  // Salting & hashing user password
  const password = user.password;
  const saltingText = generateSaltingText();
  const saltedPassword = password + saltingText;

  const passwordHash = bcrypt.hashSync(saltedPassword, 10);

  user.password = passwordHash;
  user.saltingText = saltingText;

  const newUser = new User(user);

  try {
    await newUser.save();

    sendOtpEmail(req, res);

    console.log("User created successfully");
  } catch (error) {
    console.log(error);
  }
}

//------------------------------------------------------------------
///-------------------------- get All users ------------------------
//------------------------------------------------------------------
export async function getAllUsers(req, res) {
  if (verifyAdmin(req)) {
    const page = parseInt(req.body.page) || 1; // Current page, default to 1
    const pageSize = parseInt(req.body.pageSize) || 5; // Items per page, default to 5
    const skip = (page - 1) * pageSize; // Number of items to skip
    try {
      const totalUsers = await User.countDocuments(); // Total number of users
      const totalActiveUsers = await User.countDocuments({ disabled: false });
      const totalBannedUsers = await User.countDocuments({ disabled: true });
      const totalEmailVerifiedUsers = await User.countDocuments({
        emailVerify: true,
      });
      const users = await User.find().skip(skip).limit(pageSize);

      res.json({
        users: users,
        pagination: {
          currentPage: page,
          totalUsers: totalUsers,
          totalPages: Math.ceil(totalUsers / pageSize),
        },
        usersSummary: {
          totalUsers: totalUsers,
          totalActiveUsers: totalActiveUsers,
          totalBannedUsers: totalBannedUsers,
          totalEmailVerifiedUsers: totalEmailVerifiedUsers,
        },
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to retrieve users",
      });
    }
  } else {
    res.status(403).json({
      message: "Unauthorized",
    });
  }
}

//------------------------------------------------------------------
///------------------------- get single users ----------------------
//------------------------------------------------------------------
export async function getUser(req, res) {
  const user = req.body.user;

  try {
    if (user) {
      const updatedUser = await User.findOne({ email: user.email });

      if (!updatedUser) {
        return res.status(404).json({
          message: "User Not Found",
        });
      }
      res.status(200).json({
        message: "User Found",
        user: {
          email: updatedUser.email,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          phone: updatedUser.phone,
          whatsApp: updatedUser.whatsApp,
          image: updatedUser.image,
          emailVerify: updatedUser.emailVerify,
        },
      });
    } else {
      res.status(404).json({
        message: "User Not Found",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving user",
    });
  }
}

//------------------------------------------------------------------
///---------------- get single users by email ----------------------
//------------------------------------------------------------------
export async function getUserByEmail(req, res) {
  if (!verifyAdmin(req)) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    res.status(200).json({
      user: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        whatsApp: user.whatsApp,
        image: user.image,
        emailVerify: user.emailVerify,
      },
    });
  } catch {
    res.status(500).json({ message: "Error retrieving user" });
  }
}

//------------------------------------------------------------------
///------------------- generate salting characters -----------------
//------------------------------------------------------------------
function generateSaltingText() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const numberOfCharacters = 3;
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < numberOfCharacters; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

//------------------------------------------------------------------
///--------------------------- update user -------------------------
//------------------------------------------------------------------
export async function updateUser(req, res) {
  if (verifyAdmin(req)) {
    try {
      const updatedUser = await User.findOneAndUpdate(
        { email: req.body.email },
        req.body,
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({
          message: "User Not Found",
        });
      } else {
        res.status(200).json({
          message: "User Updated Successfully",
        });
      }
    } catch (error) {
      res.status(400).json({
        message: "User Updation Failed",
      });
    }
  } else if (verifyCustomer(req)) {
    const userUpdates = req.body;
    // Remove fields restricted to admins if the user is a customer
    delete userUpdates.type;
    delete userUpdates.disabled;
    delete userUpdates.emailVerifiey;

    try {
      const updatedUser = await User.findOneAndUpdate(
        { email: req.body.user.email },
        req.body,
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({
          message: "User Not Found",
        });
      } else {
        res.status(200).json({
          message: "User Updated Successfully",
        });
      }
    } catch (error) {
      res.status(400).json({
        message: "User Updation Failed",
      });
    }
  }
}

//------------------------------------------------------------------
///---------------------------- delete user ------------------------
//------------------------------------------------------------------
export async function deleteUserByEmail(req, res) {
  if (verifyAdmin(req)) {
    const email = req.params.email;
    const requesterType = req.body.user.type;
    try {
      // Find the user to delete
      const targetUser = await User.findOne({ email: email });

      if (!targetUser) {
        return res.status(404).json({
          message: "User Not Found",
        });
      }

      // Prevent deletion if the target user is an admin and the requester is not a super admin
      if (targetUser.type === "admin" && requesterType !== "superAdmin") {
        return res.status(403).json({
          message: "Admins cannot delete other admins",
        });
      }

      const result = await User.deleteOne({ email: email });

      if (result.deletedCount === 0) {
        res.status(404).json({
          message: "User Not Found",
        });
      } else {
        res.status(200).json({
          message: "User Deleted Successfully",
          result,
        });
      }
    } catch (error) {
      res.status(400).json({
        message: "User Deletion Failed",
      });
    }
  } else {
    res.status(403).json({
      message: "Unauthorized",
    });
  }
}

//------------------------------------------------------------------
///---------------------------- login user -------------------------
//------------------------------------------------------------------
export async function loginUser(req, res) {
  const credentials = req.body;

  try {
    const user = await User.findOne({ email: credentials.email });

    if (!user) {
      return res.json({
        message: "User not found",
      });
    } else if (user.disabled) {
      return res.json({
        message: "User already banned",
      });
    } else {
      const saltingText = user.saltingText;
      const password = credentials.password + saltingText;
      const isPasswordValid = bcrypt.compareSync(password, user.password);

      if (isPasswordValid) {
        const payload = {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          type: user.type,
          phone: user.phone,
          whatsApp: user.whatsApp,
          image: user.image,
          emailVerify: user.emailVerify,
        };

        // Sign in with payload and secret key
        const token = jwt.sign(payload, process.env.HASHING_KEY, {
          expiresIn: "48h",
        });
        return res.json({
          message: "User found",
          user: user,
          token: token,
        });
      } else {
        return res.status(403).json({
          message: "Incorrect Password",
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      message: "Login failed",
      error: error,
    });
  }
}

//------------------------------------------------------------------
///--------------------------- send otp email-----------------------
//------------------------------------------------------------------
export async function sendOtpEmail(req, res) {
  const email = req.body.email;
  const otpCode = generateOtp();

  try {
    // Save the OTP to the database
    const newOtp = new Otp({ email: email, otp: otpCode });
    await newOtp.save();

    // Configure the transporter
    const transporter = nodemailer.createTransport({
      service: "gmail", // Use 'gmail' as the service
      auth: {
        user: process.env.EMAIL, // Your Gmail address
        pass: process.env.PASSWORD, // App password for Gmail
      },
    });

    // Define the email message
    const message = {
      from: `"Hotel ABC" <${process.env.EMAIL}>`, // Sender's email
      to: email, // Receiver's email
      subject: "One Time Passcode", // Subject line
      text: `Your One Time Passcode is: ${otpCode} \nThis passcode will expire in 5 minutes`, // Plain text body
    };

    // Send the email
    const info = await transporter.sendMail(message);
    console.log("Message sent: %s", info.messageId);

    // Send response
    return res.status(200).json({
      message: "OTP code sent to your email successfully",
    });
  } catch (error) {
    console.error("Error sending email:", error);

    return res.status(500).json({
      message: "Failed to send OTP code",
    });
  }
}

//------------------------------------------------------------------
///------------------------ validate otp code ----------------------
//------------------------------------------------------------------
export async function validateOtp(req, res) {
  const email = req.body.email;
  const otp = req.body.otp;

  const otpList = await Otp.find({ email: email }).sort({ createdAt: -1 });

  if (otpList.length === 0) {
    return res.status(400).json({
      message: "Invalid OTP",
    });
  }

  const latestOtp = otpList[0];

  if (latestOtp.otp === otp) {
    await User.findOneAndUpdate({ email: email }, { emailVerify: true });
    return res.status(200).json({
      message: "Email Verified Successfully",
    });
  } else {
    return res.status(400).json({
      message: "Invalid OTP",
    });
  }
}
