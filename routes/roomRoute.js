import express from "express";
import {
  createRoom,
  deleteRoomByNumber,
  getRoomByCategory,
  getRoomByNumber,
  getRooms,
  updateRoomByNumber,
} from "../controllers/roomControllers.js";

const roomRouter = express.Router();

roomRouter.post("/", createRoom);
roomRouter.post("/all", getRooms);
roomRouter.get("/category/:category", getRoomByCategory);
roomRouter.get("/:number", getRoomByNumber);

roomRouter.put("/:roomNo", updateRoomByNumber);
roomRouter.delete("/:number", deleteRoomByNumber);

export default roomRouter;
