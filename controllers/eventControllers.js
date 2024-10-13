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

//------------------------------------------------------------------
///------------------------ get event by id ------------------------
//------------------------------------------------------------------
export function getEventbyId(req, res) {
  const eventId = req.params.eventId;
  Event.findOne({ eventId: eventId })
    .then((events) => {
      if (events) {
        res.status(200).json({
          list: events,
        });
      } else {
        res.status(400).json({
          message: "Event not found",
        });
      }
    })
    .catch(() => {
      res.status(400).json({
        message: "Failed to get events",
      });
    });
}

//------------------------------------------------------------------
///---------------------- update event by id -----------------------
//------------------------------------------------------------------

export function updateEventById(req, res) {
  const user = req.user;
  if (verifyAdmin(user)) {
    const eventId = req.params.eventId;
    Event.findOneAndUpdate({ eventId: eventId }, req.body, { new: true })
      .then((updatedEvent) => {
        res.status(200).json({
          message: "Event updated successfully",
        });
      })
      .catch(() => {
        res.status(400).json({
          message: "Event updation failed",
        });
      });
  } else {
    res.status(400).json({
      message: "Unauthorized",
    });
  }
}

//------------------------------------------------------------------
///---------------------- delete event by id -----------------------
//------------------------------------------------------------------
export function deleteEventById(req, res) {
  const user = req.user;
  if (verifyAdmin(user)) {
    const eventId = req.params.eventId;
    Event.findOneAndDelete({ eventId: eventId })
      .then(() => {
        res.status(200).json({
          message: "Event deleted successfully",
        });
      })
      .catch(() => {
        res.status(400).json({
          message: "Event deletion failed",
        });
      });
  } else {
    res.status(400).json({
      message: "Unauthorized",
    });
  }
}
