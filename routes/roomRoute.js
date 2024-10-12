import express from "express";
import {
  createRoom,
  getRoomByNumber,
  getRooms,
  updateRoomByNumber,
} from "../controllers/roomControllers.js";

const roomRouter = express.Router();

roomRouter.post("/", createRoom);
roomRouter.get("/", getRooms);

roomRouter.get("/:number", getRoomByNumber);
roomRouter.put("/:number", updateRoomByNumber);

export default roomRouter;
