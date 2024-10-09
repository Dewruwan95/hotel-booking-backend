import mongoose from "mongoose";

const eventSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    default:
      "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
  },
  description: {
    type: String,
    required: true,
  },
});

const Event = mongoose.model("events", eventSchema);

export default Event;
