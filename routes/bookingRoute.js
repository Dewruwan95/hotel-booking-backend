import express from "express";
import { createBooking } from "../controllers/bookingControllers.js";

const bookingRouter = express.Router();

bookingRouter.post("/", createBooking);
//bookingRouter.get("/", getBookingsAsAdmin);

export default bookingRouter;
