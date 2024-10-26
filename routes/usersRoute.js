import express from "express";
import {
  loginUser,
  createUser,
  updateUser,
  deleteUser,
  getUser,
} from "../controllers/userControllers.js";

const userRouter = express.Router();

userRouter.post("/", createUser);

userRouter.get("/", getUser);

userRouter.put("/", updateUser);

userRouter.delete("/", deleteUser);

userRouter.post("/login", loginUser);

export default userRouter;
