import express from "express";
import {
  createEvent,
  deleteEventById,
  getEventbyId,
  getEvents,
  updateEventById,
} from "../controllers/eventControllers.js";

const eventRouter = express.Router();

eventRouter.post("/", createEvent);
eventRouter.get("/", getEvents);
eventRouter.get("/:eventId", getEventbyId);
eventRouter.put("/:eventId", updateEventById);
eventRouter.delete("/:eventId", deleteEventById);

export default eventRouter;
