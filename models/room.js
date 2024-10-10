import mongoose from "mongoose";

const roomSchema = mongoose.Schema({
  roomNo: {
    type: Number,
    required: true,
    unique: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  maxGuest: {
    type: Number,
    required: true,
  },
  photos: {
    type: Object,
    default: {},
    required: true,
  },
  isDisabled: {
    type: Boolean,
    default: false,
  },
  isBooked: {
    type: Boolean,
    default: false,
  },
});

const Room = mongoose.model("rooms", roomSchema);

export default Room;
