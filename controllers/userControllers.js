import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

//------------------------------------------------------------------
///--------------------------- create user -------------------------
//------------------------------------------------------------------
export function createUser(req, res) {
  const user = req.body;

  // salting & hashing user password
  const password = user.password;
  const saltingText = generateSaltingText();
  const saltedPassword = password + saltingText;

  const passwordHash = bcrypt.hashSync(saltedPassword, 10);

  user.password = passwordHash;
  user.saltingText = saltingText;

  const newUser = new User(user);

  newUser
    .save()
    .then(() => {
      res.status(201).json({
        message: "user Created Successfully",
      });
    })
    .catch(() => {
      res.status(409).json({
        message: "User Created Failed",
      });
    });
}

//------------------------------------------------------------------
///-------------------------- get All users ------------------------
//------------------------------------------------------------------
export function getAllUsers(req, res) {
  User.find().then((users) => {
    res.json({
      list: users,
    });
  });
}

//------------------------------------------------------------------
///------------------------- get single users ----------------------
//------------------------------------------------------------------
export function getUser(req, res) {
  const user = req.body.user;
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
export function updateUser(req, res) {
  User.findOneAndUpdate({ email: req.body.email }, req.body, { new: true })
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(404).json({
          message: "User Not Found",
        });
      } else {
        res.status(200).json({
          message: "User Updated Successfully",
        });
      }
    })
    .catch(() => {
      res.status(400).json({
        message: "User Updation Failed",
      });
    });
}

//------------------------------------------------------------------
///---------------------------- delete user ------------------------
//------------------------------------------------------------------
export function deleteUser(req, res) {
  User.deleteOne({ email: req.body.email })
    .then((result) => {
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
    })
    .catch(() => {
      res.status(400).json({
        message: "User Deletion Failed",
      });
    });
}

//------------------------------------------------------------------
///---------------------------- login user -------------------------
//------------------------------------------------------------------
export function loginUser(req, res) {
  const credentials = req.body;

  User.findOne({
    email: credentials.email,
  }).then((user) => {
    if (!user) {
      res.json({
        message: "User not found",
      });
      // check user banned or not
    } else if (user.disabled) {
      res.json({
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
        };

        // sign in with payload and secret key
        const token = jwt.sign(payload, process.env.HASHING_KEY, {
          expiresIn: "48h",
        });
        res.json({
          message: "User found",
          user: user,
          token: token,
        });
      } else {
        res.status(403).json({
          message: "Incorrect Password",
        });
      }
    }
  });
}
