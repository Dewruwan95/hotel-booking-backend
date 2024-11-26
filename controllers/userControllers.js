import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { verifyAdmin, verifyCustomer } from "../utils/userVerification.js";
import nodemailer from "nodemailer";

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
    res.status(201).json({
      message: "User Created Successfully",
    });
  } catch (error) {
    res.status(409).json({
      message: "User Creation Failed",
    });
  }
}

//------------------------------------------------------------------
///-------------------------- get All users ------------------------
//------------------------------------------------------------------
export async function getAllUsers(req, res) {
  if (verifyAdmin(req)) {
    try {
      const users = await User.find();
      res.json({
        users: users,
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
      res.status(200).json({
        message: "User Found",
        user: user,
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
      console.log(req.body);

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
///------------------------- verify user email----------------------
//------------------------------------------------------------------
export async function sendEmail(req, res) {
  const email = req.body.email;

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
    text: "Sample Email for OTP", // Plain text body
  };

  try {
    // Send the email
    const info = await transporter.sendMail(message);
    console.log("Message sent: %s", info.messageId);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
}
