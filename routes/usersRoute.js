import express from "express";
import {
  loginUser,
  createUser,
  updateUser,
  deleteUser,
  getUser,
  getAllUsers,
} from "../controllers/userControllers.js";

const userRouter = express.Router();

userRouter.post("/", createUser);

userRouter.get("/", getUser);

userRouter.get("/all", getAllUsers);

userRouter.put("/", updateUser);

userRouter.delete("/", deleteUser);

userRouter.post("/login", loginUser);

export default userRouter;
