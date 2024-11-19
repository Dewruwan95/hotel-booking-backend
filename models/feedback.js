import mongoose from "mongoose";

const feedbackSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now,
  },
  approved: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const Feedback = mongoose.model("feedbacks", feedbackSchema);

export default Feedback;
