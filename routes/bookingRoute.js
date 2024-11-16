import express from "express";
import {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingById,
  createBookingByCategory,
  deleteBookingById,
} from "../controllers/bookingControllers.js";

const bookingRouter = express.Router();

bookingRouter.post("/", createBooking);
bookingRouter.get("/", getBookings);
bookingRouter.get("/:bookingId", getBookingById);
bookingRouter.put("/:bookingId", updateBookingById);
bookingRouter.post("/:create-by-category", createBookingByCategory);
bookingRouter.delete("/:bookingId", deleteBookingById);

export default bookingRouter;
