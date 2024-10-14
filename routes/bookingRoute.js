import express from "express";
import {
  createBooking,
  getBookings,
  getBookingsById,
} from "../controllers/bookingControllers.js";

const bookingRouter = express.Router();

bookingRouter.post("/", createBooking);
bookingRouter.get("/", getBookings);
bookingRouter.get("/:bookingId", getBookingsById);

export default bookingRouter;
