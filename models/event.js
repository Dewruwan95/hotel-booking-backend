import mongoose from "mongoose";

const eventSchema = mongoose.Schema({
  eventId: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    default: "image-placeholder.png",
  },
  description: {
    type: String,
    required: true,
  },
});

const Event = mongoose.model("events", eventSchema);

export default Event;
