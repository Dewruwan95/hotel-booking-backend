import express from "express";
import { createEvent, getEvents } from "../controllers/eventControllers.js";

const eventRouter = express.Router();

eventRouter.post("/", createEvent);
eventRouter.get("/", getEvents);

export default eventRouter;
