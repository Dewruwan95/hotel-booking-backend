import express from "express";
import {
  createFeedback,
  getFeedback,
  updateFeedback,
} from "../controllers/feedbackController.js";

const feedbackRouter = express.Router();

feedbackRouter.post("/", createFeedback);
feedbackRouter.get("/", getFeedback);
feedbackRouter.put("/", updateFeedback);

export default feedbackRouter;
