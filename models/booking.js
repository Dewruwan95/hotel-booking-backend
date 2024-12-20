import mongoose from "mongoose";

const bookingSchema = mongoose.Schema({
  bookingId: {
    type: Number,
    required: true,
    unique: true,
  },
  roomId: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    require: true,
  },
  status: {
    type: String,
    required: true,
    default: "pending",
  },
  reason: {
    type: String,
    default: "",
  },
  start: {
    type: Date,
    required: true,
  },
  end: {
    type: Date,
    required: true,
  },
  notes: {
    type: String,
    default: "",
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

const Booking = mongoose.model("bookings", bookingSchema);

export default Booking;
