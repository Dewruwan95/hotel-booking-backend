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
///------------------------- get Bookings  -------------------------
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

//------------------------------------------------------------------
///---------------------- get Bookings by Id -----------------------
//------------------------------------------------------------------
export function getBookingById(req, res) {
  const bookingId = req.params.bookingId;
  // if user is an admin
  if (verifyAdmin(req)) {
    Booking.findOne({ bookingId: bookingId })
      .then((booking) => {
        if (booking) {
          res.status(200).json({
            list: booking,
          });
        } else {
          res.status(400).json({
            message: "Booking not found",
          });
        }
      })
      .catch(() => {
        res.status(400).json({
          message: "Failed to get booking",
        });
      });
    // if user is an customer
  } else if (verifyCustomer(req)) {
    Booking.findOne({ bookingId: bookingId, email: req.user.email })
      .then((booking) => {
        if (booking) {
          res.status(200).json({
            list: booking,
          });
        } else {
          res.status(400).json({
            message: "Booking not found",
          });
        }
      })
      .catch(() => {
        res.status(400).json({
          message: "Failed to get booking",
        });
      });
  } else {
    res.status(400).json({
      message: "Unauthorized",
    });
  }
}

//------------------------------------------------------------------
///-------------------- update Bookings by Id ----------------------
//------------------------------------------------------------------
export function updateBookingById(req, res) {
  const bookingId = req.params.bookingId;
  // if user is an admin
  if (verifyAdmin(req)) {
    Booking.findOneAndUpdate({ bookingId: bookingId }, req.body, { new: true })
      .then((updatedBooking) => {
        if (updatedBooking) {
          res.status(200).json({
            message: "Booking updated successfully",
          });
        } else {
          res.status(400).json({
            message: "Booking not found",
          });
        }
      })
      .catch(() => {
        res.status(400).json({
          message: "Booking updation failed",
        });
      });
  } else {
    res.status(400).json({
      message: "Unauthorized",
    });
  }
}
