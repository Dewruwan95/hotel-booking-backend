import express from "express";
import {
  createRoom,
  getRoomByNumber,
  getRooms,
} from "../controllers/roomControllers.js";

const roomRouter = express.Router();

roomRouter.post("/", createRoom);
roomRouter.get("/", getRooms);

roomRouter.get("/:number", getRoomByNumber);

export default roomRouter;
