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
  if (!verifyCustomer(req)) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    console.log("req.body", req.body);

    const { start, end, category, reason, notes, user } = req.body;
    const bookingStart = new Date(start);
    const bookingEnd = new Date(end);

    // Fetch reserved bookings within the selected date period
    const ReservedBookings = await Booking.find({
      start: { $lte: bookingEnd },
      end: { $gte: bookingStart },
    });

    console.log("ReservedBookings", ReservedBookings);

    // Extract reserved room IDs
    const reservedRooms = ReservedBookings.map((booking) => booking.roomId);

    console.log("reservedRooms", reservedRooms);

    // Fetch available rooms based on category and availability
    const availableRooms = await Room.find({
      roomNo: { $nin: reservedRooms },
      category: category,
      available: true,
    });

    console.log("availableRooms", availableRooms);

    if (availableRooms.length === 0) {
      return res.status(400).json({
        message:
          "No rooms available for the selected period in the selected category.",
      });
    }

    const startingId = 1362;
    const count = await Booking.countDocuments();
    console.log("count", count);
    const bookingId = startingId + count + 1;

    // Create a new booking
    const newBooking = new Booking({
      bookingId: bookingId,
      roomId: availableRooms[0].roomNo,
      email: user.email,
      reason: reason,
      start: bookingStart,
      end: bookingEnd,
      notes: notes,
    });

    console.log("newBooking", newBooking);

    const savedBooking = await newBooking.save();

    console.log("savedBooking", savedBooking);

    res.status(200).json({
      message: "Booking creation successful",
      booking: savedBooking,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({
      message: "Booking creation failed",
      error: error.message,
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

//------------------------------------------------------------------
///---------------------- delete booking by Id ---------------------
//------------------------------------------------------------------
export async function deleteBookingById(req, res) {
  if (!verifyAdmin(req)) {
    return res.status(400).json({ message: "Unauthorized" });
  }

  try {
    const deletedBooking = await Booking.findOneAndDelete({
      bookingId: req.params.bookingId,
    });

    if (deletedBooking) {
      return res.status(200).json({ message: "Booking deleted successfully" });
    }

    return res.status(400).json({ message: "Booking not found" });
  } catch (err) {
    return res.status(400).json({
      message: "Booking deletion failed",
      error: err.message,
    });
  }
}
