import express from "express";
import {
  createFeedback,
  deleteFeedbackById,
  getFeedback,
  updateFeedbackById,
} from "../controllers/feedbackController.js";

const feedbackRouter = express.Router();

feedbackRouter.post("/", createFeedback);
feedbackRouter.post("/all", getFeedback);
feedbackRouter.put("/:feedbackId", updateFeedbackById);
feedbackRouter.delete("/:feedbackId", deleteFeedbackById);

export default feedbackRouter;
