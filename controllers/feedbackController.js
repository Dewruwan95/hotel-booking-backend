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
  let feedbacks;
  try {
    if (verifyAdmin(req)) {
      // Admin can see all verified and unverified reviews
      const page = parseInt(req.body.page) || 1; // Current page, default to 1
      const pageSize = parseInt(req.body.pageSize) || 5; // Items per page, default to 5
      const skip = (page - 1) * pageSize; // Number of items to skip
      const totalFeedbacks = await Feedback.countDocuments(); // Total number of rooms
      feedbacks = await Feedback.find()
        .sort({
          timestamp: -1,
        })
        .skip(skip)
        .limit(pageSize);

      return res.status(200).json({
        feedbacks: feedbacks,
        pagination: {
          currentPage: page,
          totalFeedbacks: totalFeedbacks,
          totalPages: Math.ceil(totalFeedbacks / pageSize),
        },
      });
    } else if (verifyCustomer(req)) {
      feedbacks = await Feedback.find({
        $or: [
          { approved: true }, // All verified reviews
          { approved: false, email: req.body.user.email }, // Unverified reviews created by the user
        ],
      }).sort({
        timestamp: -1,
      });
      return res.status(200).json({
        feedbacks: feedbacks,
      });
    } else {
      // If the user is not a registered customer, show only verified reviews
      feedbacks = await Feedback.find({ approved: true }).sort({
        timestamp: -1,
      });
      return res.status(200).json({
        feedbacks: feedbacks,
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
        { _id: feedbackId },
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
        _id: feedbackId,
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
