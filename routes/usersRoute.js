import express from "express";
import {
  loginUser,
  createUser,
  updateUser,
  deleteUserByEmail,
  getUser,
  getAllUsers,
} from "../controllers/userControllers.js";

const userRouter = express.Router();

userRouter.post("/", createUser);

userRouter.get("/", getUser);

userRouter.get("/all", getAllUsers);

userRouter.put("/", updateUser);

userRouter.delete("/:email", deleteUserByEmail);

userRouter.post("/login", loginUser);

export default userRouter;
