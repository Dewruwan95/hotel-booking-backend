import express from "express";
import {
  createFeedback,
  getFeedback,
  updateFeedbackById,
} from "../controllers/feedbackController.js";

const feedbackRouter = express.Router();

feedbackRouter.post("/", createFeedback);
feedbackRouter.get("/", getFeedback);
feedbackRouter.put("/:feedbackId", updateFeedbackById);

export default feedbackRouter;
