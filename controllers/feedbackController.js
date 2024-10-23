import Feedback from "../models/feedback.js";
import { verifyCustomer } from "../utils/userVerification.js";

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
