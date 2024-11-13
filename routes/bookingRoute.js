import express from "express";
import {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingById,
  createBookingByCategory,
} from "../controllers/bookingControllers.js";

const bookingRouter = express.Router();

bookingRouter.post("/", createBooking);
bookingRouter.get("/", getBookings);
bookingRouter.get("/:bookingId", getBookingById);
bookingRouter.put("/:bookingId", updateBookingById);
bookingRouter.post("/:create-by-category", createBookingByCategory);

export default bookingRouter;
