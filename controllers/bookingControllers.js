import Booking from "../models/booking.js";
import Room from "../models/room.js";
import { verifyAdmin, verifyCustomer } from "../utils/userVerification.js";

//------------------------------------------------------------------
///------------------------- create Booking ------------------------
//------------------------------------------------------------------
export async function createBooking(req, res) {
  if (verifyCustomer(req)) {
    const booking = req.body;
    const startingId = 1362;

    try {
      const count = await Booking.countDocuments();
      const bookingId = startingId + count;

      booking.bookingId = bookingId;
      booking.email = req.user.email;

      const newBooking = new Booking(booking);
      await newBooking.save();

      res.status(200).json({
        message: "Booking creation successful",
      });
    } catch (err) {
      res.status(400).json({
        message: "Booking creation failed",
        error: err,
      });
    }
  } else {
    res.status(400).json({
      message: "Unauthorized",
    });
  }
}

//------------------------------------------------------------------
///------------------ create Booking using category-----------------
//------------------------------------------------------------------

export async function createBookingByCategory(req, res) {
  if (verifyCustomer(req)) {
    const bookingStart = new Date(req.body.start);
    const bookingEnd = new Date(req.body.end);

    // get reserved bookings within the selected date period
    const ReservedBookings = await Booking.find({
      start: { $lte: bookingEnd },
      end: { $gte: bookingStart },
    });

    if (ReservedBookings.length > 0) {
      // get reserved room numbers
      const reservedRooms = ReservedBookings.map((booking) => booking.roomId);

      //get available rooms
      const availableRooms = await Room.find({
        roomNo: { $nin: reservedRooms },
        category: req.body.category,
      });

      if (availableRooms.length === 0) {
        res.status(400).json({
          message:
            "No rooms available for selected period on selected category",
        });
      } else {
        const startingId = 1362;

        try {
          const count = await Booking.countDocuments();
          const bookingId = startingId + count;

          // create new booking
          const newBooking = new Booking({
            bookingId: bookingId,
            roomId: availableRooms[0].roomNo,
            email: req.body.user.email,
            reason: req.body.reason,
            start: bookingStart,
            end: bookingEnd,
            notes: req.body.notes,
          });

          await newBooking.save();

          res.status(200).json({
            message: "Booking creation successful",
          });
        } catch (err) {
          res.status(400).json({
            message: "Booking creation failed",
            error: err,
          });
        }
      }
    } else {
      //get available rooms
      const availableRooms = await Room.find({
        category: req.body.category,
      });

      const startingId = 1362;

      try {
        const count = await Booking.countDocuments();
        const bookingId = startingId + count;

        // create new booking
        const newBooking = new Booking({
          bookingId: bookingId,
          roomId: availableRooms[0].roomNo,
          email: req.body.user.email,
          reason: req.body.reason,
          start: bookingStart,
          end: bookingEnd,
          notes: req.body.notes,
        });

        await newBooking.save();

        res.status(200).json({
          message: "Booking creation successful",
        });
      } catch (err) {
        res.status(400).json({
          message: "Booking creation failed",
          error: err,
        });
      }
    }
  } else {
    res.status(400).json({
      message: "Unauthorized",
    });
  }
}

//------------------------------------------------------------------
///------------------------- get Bookings  -------------------------
//------------------------------------------------------------------
export async function getBookings(req, res) {
  try {
    let bookings;

    // if user is an admin
    if (verifyAdmin(req)) {
      bookings = await Booking.find();
    }
    // if user is a customer
    else if (verifyCustomer(req)) {
      bookings = await Booking.find({ email: req.user.email });
    } else {
      return res.status(400).json({
        message: "Unauthorized",
      });
    }

    if (bookings && bookings.length > 0) {
      res.status(200).json({
        bookings: bookings,
      });
    } else {
      res.status(400).json({
        message: "Bookings not found",
      });
    }
  } catch (err) {
    res.status(400).json({
      message: "Failed to get bookings",
      error: err,
    });
  }
}

//------------------------------------------------------------------
///---------------------- get Bookings by Id -----------------------
//------------------------------------------------------------------
export async function getBookingById(req, res) {
  const bookingId = req.params.bookingId;

  try {
    let booking;

    // if user is an admin
    if (verifyAdmin(req)) {
      booking = await Booking.findOne({ bookingId: bookingId });
    }
    // if user is a customer
    else if (verifyCustomer(req)) {
      booking = await Booking.findOne({
        bookingId: bookingId,
        email: req.user.email,
      });
    } else {
      return res.status(400).json({
        message: "Unauthorized",
      });
    }

    if (booking) {
      res.status(200).json({
        list: booking,
      });
    } else {
      res.status(400).json({
        message: "Booking not found",
      });
    }
  } catch (err) {
    res.status(400).json({
      message: "Failed to get booking",
      error: err,
    });
  }
}

//------------------------------------------------------------------
///-------------------- update Bookings by Id ----------------------
//------------------------------------------------------------------
export async function updateBookingById(req, res) {
  const bookingId = req.params.bookingId;

  if (verifyAdmin(req)) {
    try {
      const updatedBooking = await Booking.findOneAndUpdate(
        { bookingId: bookingId },
        req.body,
        { new: true }
      );

      if (updatedBooking) {
        res.status(200).json({
          message: "Booking updated successfully",
        });
      } else {
        res.status(400).json({
          message: "Booking not found",
        });
      }
    } catch (err) {
      res.status(400).json({
        message: "Booking updation failed",
        error: err,
      });
    }
  } else {
    res.status(400).json({
      message: "Unauthorized",
    });
  }
}
