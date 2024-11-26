import express from "express";
import {
  loginUser,
  createUser,
  updateUser,
  deleteUserByEmail,
  getAllUsers,
  getUserByEmail,
  getUser,
  sendOtpEmail,
  validateOtp,
} from "../controllers/userControllers.js";

const userRouter = express.Router();

userRouter.post("/", createUser);

userRouter.get("/", getUser);

userRouter.get("/all", getAllUsers);

userRouter.get("/:email", getUserByEmail);

userRouter.put("/", updateUser);

userRouter.delete("/:email", deleteUserByEmail);

userRouter.post("/login", loginUser);

userRouter.post("/send-otp", sendOtpEmail);

userRouter.post("/validate-otp", validateOtp);

export default userRouter;
