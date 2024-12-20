import express from "express";
import {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBookingById,
  createBookingByCategory,
  deleteBookingById,
  createBookingByRoom,
  getBookingsForDashboard,
} from "../controllers/bookingControllers.js";

const bookingRouter = express.Router();

bookingRouter.post("/", createBooking);
bookingRouter.post("/all", getAllBookings);
bookingRouter.get("/:bookingId", getBookingById);
bookingRouter.put("/:bookingId", updateBookingById);
bookingRouter.post("/:create-by-category", createBookingByCategory);
bookingRouter.post("/:create-by-room", createBookingByRoom);
bookingRouter.patch("/:bookingId/delete", deleteBookingById); // For deletion
bookingRouter.post("/dashboard-bookings", getBookingsForDashboard);

export default bookingRouter;
