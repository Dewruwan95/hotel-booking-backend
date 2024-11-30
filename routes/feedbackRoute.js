import express from "express";
import {
  createFeedback,
  deleteFeedbackById,
  getFeedback,
  getFeedbackByBookingId,
  updateFeedbackById,
} from "../controllers/feedbackController.js";

const feedbackRouter = express.Router();

feedbackRouter.post("/", createFeedback);
feedbackRouter.post("/all", getFeedback);
feedbackRouter.get("/:bookingId", getFeedbackByBookingId);
feedbackRouter.put("/:feedbackId", updateFeedbackById);
feedbackRouter.delete("/:feedbackId", deleteFeedbackById);

export default feedbackRouter;
