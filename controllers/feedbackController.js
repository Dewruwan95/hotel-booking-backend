//------------------------------------------------------------------
///-------------------------- create feedback ----------------------
//------------------------------------------------------------------

export function createFeedback(req, res) {
  const feedback = req.body;
  const newFeedback = new Feedback(feedback);
  newFeedback
    .save()
    .then(() => {
      res.json({
        message: "Feedback created successfully",
      });
    })
    .catch(() => {
      res.json({
        message: "Feedback creation failed",
      });
    });
}
