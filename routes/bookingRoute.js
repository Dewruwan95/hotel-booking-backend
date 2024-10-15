import express from "express";
import {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingById,
} from "../controllers/bookingControllers.js";

const bookingRouter = express.Router();

bookingRouter.post("/", createBooking);
bookingRouter.get("/", getBookings);
bookingRouter.get("/:bookingId", getBookingById);
bookingRouter.put("/:bookingId", updateBookingById);

export default bookingRouter;
