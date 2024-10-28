import Event from "../models/event.js";
import { verifyAdmin } from "../utils/userVerification.js";

//------------------------------------------------------------------
///-------------------------- create event -------------------------
//------------------------------------------------------------------
export async function createEvent(req, res) {
  if (verifyAdmin(req)) {
    const event = req.body;
    const newEvent = new Event(event);

    try {
      await newEvent.save();
      res.json({
        message: "Event Created successfully",
      });
    } catch (err) {
      res.status(400).json({
        message: "Event creation failed",
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
///--------------------------- get events ---------------------------
//------------------------------------------------------------------
export async function getEvents(req, res) {
  try {
    const events = await Event.find();
    res.status(200).json({
      list: events,
    });
  } catch (err) {
    res.status(400).json({
      message: "Failed to get events",
      error: err,
    });
  }
}

//------------------------------------------------------------------
///------------------------ get event by id ------------------------
//------------------------------------------------------------------
export async function getEventById(req, res) {
  const eventId = req.params.eventId;

  try {
    const event = await Event.findOne({ eventId: eventId });
    if (event) {
      res.status(200).json({
        list: event,
      });
    } else {
      res.status(404).json({
        message: "Event not found",
      });
    }
  } catch (err) {
    res.status(400).json({
      message: "Failed to get event",
      error: err,
    });
  }
}

//------------------------------------------------------------------
///---------------------- update event by id -----------------------
//------------------------------------------------------------------
export async function updateEventById(req, res) {
  if (verifyAdmin(req)) {
    const eventId = req.params.eventId;

    try {
      const updatedEvent = await Event.findOneAndUpdate(
        { eventId: eventId },
        req.body,
        { new: true }
      );

      if (updatedEvent) {
        res.status(200).json({
          message: "Event updated successfully",
        });
      } else {
        res.status(404).json({
          message: "Event not found",
        });
      }
    } catch (err) {
      res.status(400).json({
        message: "Event updation failed",
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
///---------------------- delete event by id -----------------------
//------------------------------------------------------------------
export async function deleteEventById(req, res) {
  if (verifyAdmin(req)) {
    const eventId = req.params.eventId;

    try {
      const deletedEvent = await Event.findOneAndDelete({ eventId: eventId });
      if (deletedEvent) {
        res.status(200).json({
          message: "Event deleted successfully",
        });
      } else {
        res.status(404).json({
          message: "Event not found",
        });
      }
    } catch (err) {
      res.status(400).json({
        message: "Event deletion failed",
        error: err,
      });
    }
  } else {
    res.status(400).json({
      message: "Unauthorized",
    });
  }
}
