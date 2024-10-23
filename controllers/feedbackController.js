import Feedback from "../models/feedback.js";
import { verifyAdmin, verifyCustomer } from "../utils/userVerification.js";

//------------------------------------------------------------------
///-------------------------- create feedback ----------------------
//------------------------------------------------------------------
export function createFeedback(req, res) {
  if (verifyCustomer(req)) {
    const feedback = req.body;
    const newFeedback = new Feedback(feedback);
    newFeedback
      .save()
      .then(() => {
        res.status(200).json({
          message: "Feedback created successfully",
        });
      })
      .catch(() => {
        res.status(400).json({
          message: "Feedback creation failed",
        });
      });
  } else {
    res.status(400).json({
      message: "Unauthorized",
    });
  }
}

//------------------------------------------------------------------
///--------------------------- get feedback ------------------------
//------------------------------------------------------------------
export function getFeedback(req, res) {
  if (verifyAdmin(req)) {
    Feedback.find()
      .then((feedbacks) => {
        if (feedbacks) {
          res.status(200).json({
            list: feedbacks,
          });
        } else {
          res.status(400).json({
            message: "Feedbacks not found",
          });
        }
      })
      .catch(() => {
        res.status(400).json({
          message: "Failed to get feedbacks",
        });
      });
  } else {
    Feedback.find({ approved: true }).then((feedbacks) => {
      if (feedbacks) {
        res.status(200).json({
          list: feedbacks,
        });
      } else {
        res.status(400).json({
          message: "Feedbacks not found",
        });
      }
    });
  }
}

//------------------------------------------------------------------
///---------------------- update feedback by id---------------------
//------------------------------------------------------------------
export function updateFeedbackById(req, res) {
  if (verifyAdmin(req)) {
    const feedbackId = req.params.feedbackId;

    Feedback.findOneAndUpdate({ feedbackId: feedbackId }, req.body, {
      new: true,
    })
      .then((updatedFeedback) => {
        res.status(200).json({
          message: "Feedback updated successfully",
        });
      })
      .catch(() => {
        res.status(400).json({
          message: "Feedback updation failed",
        });
      });
  } else {
    res.status(400).json({
      message: "Unauthorized",
    });
  }
}
