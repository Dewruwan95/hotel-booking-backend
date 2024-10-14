import Booking from "../models/booking.js";
import { verifyAdmin, verifyCustomer } from "../utils/userVerification.js";

//------------------------------------------------------------------
///------------------------- create Booking ------------------------
//------------------------------------------------------------------
export function createBooking(req, res) {
  if (verifyCustomer(req)) {
    const booking = req.body;
    const startingId = 1362;

    Booking.countDocuments().then((count) => {
      const bookingId = startingId + count;

      booking.bookingId = bookingId;
      booking.email = req.user.email;

      const newBooking = new Booking(booking);

      newBooking
        .save()
        .then(() => {
          res.status(200).json({
            message: "Booking creation successful",
          });
        })
        .catch((err) => {
          res.status(400).json({
            message: "Booking creation failed",
            error: err,
          });
        });
    });
  } else {
    res.status(400).json({
      message: "Unauthorized",
    });
  }
}

//------------------------------------------------------------------
///--------------------- get Bookings as admin ---------------------
//------------------------------------------------------------------
export function getBookings(req, res) {
  // if user is an admin
  if (verifyAdmin(req)) {
    Booking.find()
      .then((bookings) => {
        if (bookings) {
          res.status(200).json({
            list: bookings,
          });
        } else {
          res.status(400).json({
            message: "Bookings not found",
          });
        }
      })
      .catch(() => {
        res.status(400).json({
          message: "Failed to get bookings",
        });
      });
    // if user is an customer
  } else if (verifyCustomer(req)) {
    Booking.find({ email: req.user.email }).then((bookings) => {
      if (bookings) {
        res.status(200).json({
          list: bookings,
        });
      } else {
        res
          .status(400)
          .json({
            message: "Bookings not found",
          })
          .catch((err) => {
            res.status(400).json({
              message: "Failed to get bookings",
            });
          });
      }
    });
  } else {
    res.status(400).json({
      message: "Unauthorized",
    });
  }
}
