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
  specialDescription: {
    type: String,
    default: "",
  },
  maxGuests: {
    type: Number,
    required: true,
  },
  photos: [
    {
      type: String,
    },
  ],
  availabe: {
    type: Boolean,
    default: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  notes: {
    type: String,
    default: "",
  },
});

const Room = mongoose.model("rooms", roomSchema);

export default Room;
