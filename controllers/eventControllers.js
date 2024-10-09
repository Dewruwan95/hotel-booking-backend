import Event from "../models/event.js";

// create event -------------------
export function createEvent(req, res) {
  const user = req.user;
  if (!user) {
    res.status(403).json({
      message: "Please login to create an event",
    });
    return;
  }
  if (user.type != "admin") {
    res.status(403).json({
      message: "you do not have permission to create an event",
    });
    return;
  }
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
}

// get event ----------------------
export function getEvents(req, res) {
  Event.find().then((events) => {
    res.json({
      list: events,
    });
  });
}
