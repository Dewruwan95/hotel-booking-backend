import express from "express";
import {
  loginUser,
  createUser,
  getUsers,
  updateUser,
  deleteUser,
} from "../controllers/userControllers.js";

const userRouter = express.Router();

userRouter.post("/", createUser);

userRouter.get("/", getUsers);

userRouter.put("/", updateUser);

userRouter.delete("/", deleteUser);

userRouter.post("/login", loginUser);

export default userRouter;
