import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  inquiryType: {
    type: String,
    required: true,
    default: "other",
  },
  message: {
    type: String,
    required: true,
  },
  reply: {
    type: String,
    default: "",
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now,
  },
  status: {
    type: String,
    required: true,
    default: "pending",
  },
});

const Inquiry = mongoose.model("inquiries", inquirySchema);

export default Inquiry;
