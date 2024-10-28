import Feedback from "../models/feedback.js";
import { verifyAdmin, verifyCustomer } from "../utils/userVerification.js";

//------------------------------------------------------------------
///-------------------------- create feedback ----------------------
//------------------------------------------------------------------
export async function createFeedback(req, res) {
  if (verifyCustomer(req)) {
    const feedback = req.body;
    const newFeedback = new Feedback(feedback);

    try {
      await newFeedback.save();
      res.status(200).json({
        message: "Feedback created successfully",
      });
    } catch (err) {
      res.status(400).json({
        message: "Feedback creation failed",
        error: err,
      });
    }
  } else {
    res.status(400).json({
      message: "Unauthorized",
    });
  }
}

//------------------------------------------------------------------
///--------------------------- get feedback ------------------------
//------------------------------------------------------------------
export async function getFeedback(req, res) {
  try {
    let feedbacks;

    if (verifyAdmin(req)) {
      feedbacks = await Feedback.find();
    } else {
      feedbacks = await Feedback.find({ approved: true });
    }

    if (feedbacks.length > 0) {
      res.status(200).json({
        feedbacks: feedbacks,
      });
    } else {
      res.status(404).json({
        message: "Feedbacks not found",
      });
    }
  } catch (err) {
    res.status(400).json({
      message: "Failed to get feedbacks",
      error: err,
    });
  }
}

//------------------------------------------------------------------
///---------------------- update feedback by id---------------------
//------------------------------------------------------------------
export async function updateFeedbackById(req, res) {
  if (verifyAdmin(req)) {
    const feedbackId = req.params.feedbackId;

    try {
      const updatedFeedback = await Feedback.findOneAndUpdate(
        { feedbackId: feedbackId },
        req.body,
        { new: true }
      );

      if (updatedFeedback) {
        res.status(200).json({
          message: "Feedback updated successfully",
        });
      } else {
        res.status(404).json({
          message: "Feedback not found",
        });
      }
    } catch (err) {
      res.status(400).json({
        message: "Feedback updation failed",
        error: err,
      });
    }
  } else {
    res.status(400).json({
      message: "Unauthorized",
    });
  }
}

//------------------------------------------------------------------
///------------------------- delete feedback -----------------------
//------------------------------------------------------------------
export async function deleteFeedbackById(req, res) {
  if (verifyAdmin(req)) {
    const feedbackId = req.params.feedbackId;

    try {
      const deletedFeedback = await Feedback.findOneAndDelete({
        feedbackId: feedbackId,
      });

      if (deletedFeedback) {
        res.status(200).json({
          message: "Feedback deleted successfully",
        });
      } else {
        res.status(404).json({
          message: "Feedback not found",
        });
      }
    } catch (err) {
      res.status(400).json({
        message: "Feedback deletion failed",
        error: err,
      });
    }
  } else {
    res.status(400).json({
      message: "Unauthorized",
    });
  }
}
