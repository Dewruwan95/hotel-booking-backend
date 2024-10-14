import Booking from "../models/booking";
import { verifyCustomer } from "../utils/userVerification";

export function createBooking(req, res) {
  const user = req.user;

  if (verifyCustomer(user)) {
    const startingId = 1362;
    Booking.countDocuments().then((count) => {
      const bookingId = startingId + count;
      req.body.bookingId = bookingId;
      req.body.email = user.email;

      const newBooking = new Booking(req.body);

      newBooking
        .save()
        .then(() => {
          res.status(200).json({
            message: "Booking creation successful",
          });
        })
        .catch(() => {
          res.status(400).json({
            message: "Booking creation failed",
          });
        });
    });
  } else {
    res.status(400).json({
      message: "Unauthorized",
    });
  }
}
