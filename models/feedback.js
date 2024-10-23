import mongoose from "mongoose";

const feedbackSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
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
  date: {
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
