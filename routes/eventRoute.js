import express from "express";
import {
  createEvent,
  getEvents,
  updateEventById,
} from "../controllers/eventControllers.js";

const eventRouter = express.Router();

eventRouter.post("/", createEvent);
eventRouter.get("/", getEvents);
eventRouter.put("/:eventId", updateEventById);

export default eventRouter;
