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
  let rooms;
  try {
    if (verifyAdmin(req)) {
      const page = parseInt(req.body.page) || 1; // Current page, default to 1
      const pageSize = parseInt(req.body.pageSize) || 5; // Items per page, default to 5
      const skip = (page - 1) * pageSize; // Number of items to skip
      const totalRooms = await Room.countDocuments(); // Total number of rooms

      // Fetch room summaries
      const availableRooms = await Room.countDocuments({ available: true });
      const notAvailableRooms = await Room.countDocuments({ available: false });
      rooms = await Room.find()
        .sort({
          roomNo: 1,
        })
        .skip(skip)
        .limit(pageSize);

      return res.status(200).json({
        rooms: rooms,
        pagination: {
          currentPage: page,
          totalRooms: totalRooms,
          totalPages: Math.ceil(totalRooms / pageSize),
        },
        roomsSummary: {
          totalRooms: totalRooms,
          availableRooms: availableRooms,
          notAvailableRooms: notAvailableRooms,
        },
      });
    } else {
      const page = parseInt(req.body.page) || 1; // Current page, default to 1
      const pageSize = parseInt(req.body.pageSize) || 5; // Items per page, default to 5
      const skip = (page - 1) * pageSize; // Number of items to skip
      const totalRooms = await Room.countDocuments({ available: true }); // Total number of rooms
      rooms = await Room.find({ available: true })
        .sort({
          roomNo: 1,
        })
        .skip(skip)
        .limit(pageSize);

      return res.json({
        rooms: rooms,
        pagination: {
          currentPage: page,
          totalRooms: totalRooms,
          totalPages: Math.ceil(totalRooms / pageSize),
        },
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
    res.status(200).json({
      exists: !!result, // true if room exists, false otherwise
      room: result || null, // room data if exists, otherwise null
      message: result ? "Room found" : "Room not found",
    });
  } catch (error) {
    res.status(500).json({
      exists: false,
      room: null,
      message: "Failed to get room",
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
  if (!verifyAdmin(req)) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  try {
    const result = await Room.findOneAndUpdate(
      { roomNo: req.params.roomNo },
      req.body,
      { new: true }
    );

    if (result) {
      return res.status(200).json({ room: result });
    }

    res.status(400).json({ message: "Room not found" });
  } catch (error) {
    res.status(400).json({
      message: "Failed to update room",
      error: error.message,
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
