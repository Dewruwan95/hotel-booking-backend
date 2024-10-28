import Room from "../models/room.js";
import { verifyAdmin } from "../utils/userVerification.js";

//------------------------------------------------------------------
///--------------------------- create room -------------------------
//------------------------------------------------------------------
export async function createRoom(req, res) {
  if (verifyAdmin(req)) {
    const room = req.body;
    const newRoom = new Room(room);

    try {
      await newRoom.save();
      res.status(200).json({
        message: "Room created successfully",
      });
    } catch (err) {
      res.status(400).json({
        message: "Room creation failed",
        error: err,
      });
    }
  } else {
    res.status(403).json({
      message: "Unauthorized",
    });
  }
}

//------------------------------------------------------------------
///---------------------------- get rooms --------------------------
//------------------------------------------------------------------
export async function getRooms(req, res) {
  try {
    const rooms = await Room.find();

    if (rooms) {
      res.json({
        rooms: rooms,
      });
    } else {
      res.status(400).json({
        message: "Room not found",
      });
    }
  } catch (error) {
    res.status(400).json({
      message: "Failed to get room",
    });
  }
}

//------------------------------------------------------------------
///----------------------- get room by number ----------------------
//------------------------------------------------------------------
export async function getRoomByNumber(req, res) {
  const number = req.params.number;

  try {
    const result = await Room.findOne({ roomNo: number });
    if (result) {
      res.status(200).json({
        room: result,
      });
    } else {
      res.status(400).json({
        message: "Room not found",
      });
    }
  } catch (error) {
    res.status(400).json({
      message: "Failed to get Room",
    });
  }
}

//------------------------------------------------------------------
///----------------------- get room by category ----------------------
//------------------------------------------------------------------
export async function getRoomByCategory(req, res) {
  const category = req.params.category;

  try {
    const result = await Room.find({ category: category });
    if (result.length > 0) {
      res.status(200).json({
        room: result,
      });
    } else {
      res.status(400).json({
        message: "Room not found",
      });
    }
  } catch (error) {
    res.status(400).json({
      message: "Failed to get Room",
    });
  }
}

//------------------------------------------------------------------
///---------------------- update room by number --------------------
//------------------------------------------------------------------
export async function updateRoomByNumber(req, res) {
  if (verifyAdmin(req)) {
    const number = req.params.number;

    try {
      const result = await Room.updateOne({ roomNo: number }, req.body, {
        new: true,
      });
      if (result.matchedCount > 0) {
        res.status(200).json({
          room: result,
        });
      } else {
        res.status(400).json({
          message: "Room not found",
        });
      }
    } catch (error) {
      res.status(400).json({
        message: "Failed to update room",
        error: error.message,
      });
    }
  } else {
    res.status(403).json({
      message: "Unauthorized",
    });
  }
}

//------------------------------------------------------------------
///---------------------- delete room by number --------------------
//------------------------------------------------------------------
export async function deleteRoomByNumber(req, res) {
  if (verifyAdmin(req)) {
    const number = req.params.number;

    try {
      const result = await Room.findOneAndDelete({ roomNo: number });
      if (result) {
        res.status(200).json({
          message: "Room deleted successfully",
        });
      } else {
        res.status(400).json({
          message: "Room not found",
        });
      }
    } catch (error) {
      res.status(400).json({
        message: "Room deletion failed",
        error: error.message,
      });
    }
  } else {
    res.status(403).json({
      message: "Unauthorized",
    });
  }
}
