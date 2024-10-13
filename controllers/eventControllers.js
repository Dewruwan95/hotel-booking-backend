import Event from "../models/event.js";
import { verifyAdmin } from "../utils/userVerification.js";

//------------------------------------------------------------------
///-------------------------- create event -------------------------
//------------------------------------------------------------------
export function createEvent(req, res) {
  const user = req.user;
  if (verifyAdmin(user)) {
    const event = req.body;
    const newEvent = new Event(event);
    newEvent
      .save()
      .then(() => {
        res.json({
          message: "Event Created successfully",
        });
      })
      .catch(() => {
        res.json({
          message: "event created failed",
        });
      });
  } else {
    res.status(400).json({
      message: "Unauthorized",
    });
  }
}

//------------------------------------------------------------------
///--------------------------- get event ---------------------------
//------------------------------------------------------------------
export function getEvents(req, res) {
  Event.find()
    .then((events) => {
      res.status(200).json({
        list: events,
      });
    })
    .catch(() => {
      res.status(400).json({
        message: "Failed to get events",
      });
    });
}
