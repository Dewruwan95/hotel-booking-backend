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
  let events;
  try {
    if (verifyAdmin(req)) {
      const page = parseInt(req.body.page) || 1; // Current page, default to 1
      const pageSize = parseInt(req.body.pageSize) || 5; // Items per page, default to 5
      const skip = (page - 1) * pageSize; // Number of items to skip
      const totalEvents = await Event.countDocuments(); // Total number of bookings

      events = await Event.find()
        .sort({
          _id: -1,
        })
        .skip(skip)
        .limit(pageSize);

      return res.status(200).json({
        events: events,
        pagination: {
          currentPage: page,
          totalEvents: totalEvents,
          totalPages: Math.ceil(totalEvents / pageSize),
        },
        eventsSummary: {
          totalEvents: totalEvents,
        },
      });
    } else {
      events = await Event.find().sort({ _id: -1 });
      return res.status(200).json({
        events: events,
      });
    }
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
    const event = await Event.findOne({ _id: eventId });
    if (event) {
      res.status(200).json({
        event: event,
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
        { _id: eventId },
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
      const deletedEvent = await Event.findOneAndDelete({ _id: eventId });
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
