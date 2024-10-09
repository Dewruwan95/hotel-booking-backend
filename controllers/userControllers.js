import User from "../models/user.js";
import jwt from "jsonwebtoken";

// create user -------------------
export function createUser(req, res) {
  const user = req.body;
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
// get users -------------------
export function getUsers(req, res) {
  User.find().then((users) => {
    res.json({
      list: users,
    });
  });
}

// update users -------------------
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

// delete users -------------------
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

// login users -------------------
export function loginUser(req, res) {
  const credentials = req.body;
  User.findOne({
    email: credentials.email,
    password: credentials.password,
  }).then((user) => {
    if (user == null) {
      res.json({
        message: "User not found",
      });
    } else {
      const payload = {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        type: user.type,
      };

      // sign in with payload and secret key
      const token = jwt.sign(payload, "secret", { expiresIn: "1h" });
      res.json({
        message: "User found",
        user: user,
        toket: token,
      });
    }
  });
}
