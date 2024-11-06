import express from "express";
import {
  createEvent,
  deleteEventById,
  getEventById,
  getEvents,
  updateEventById,
} from "../controllers/eventControllers.js";

const eventRouter = express.Router();

eventRouter.post("/", createEvent);
eventRouter.get("/", getEvents);
eventRouter.get("/:eventId", getEventById);
eventRouter.put("/:id", updateEventById);
eventRouter.delete("/:eventId", deleteEventById);

export default eventRouter;
