import express from "express";
import { createRoom } from "../controllers/roomControllers.js";

const roomRouter = express.Router();

roomRouter.post("/", createRoom);

export default roomRouter;
