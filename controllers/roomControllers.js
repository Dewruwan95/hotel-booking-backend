import Room from "../models/room.js";
import { verifyAdmin } from "../utils/userVerification.js";

//------------------------------------------------------------------
///--------------------------- create room -------------------------
//------------------------------------------------------------------
export function createRoom(req, res) {
  if (verifyAdmin(req)) {
    const room = req.body;
    const newRoom = new Room(room);

    newRoom
      .save()
      .then(() => {
        res.status(200).json({
          message: "Room created successfully",
        });
      })
      .catch((err) => {
        res.status(400).json({
          message: "Room creation failed",
          error: err,
        });
      });
  } else {
    res.status(403).json({
      message: "Unauthorized",
    });
  }
}

//------------------------------------------------------------------
///---------------------------- get rooms --------------------------
//------------------------------------------------------------------
export function getRooms(req, res) {
  Room.find()
    .then((rooms) => {
      if (rooms) {
        res.json({
          list: rooms,
        });
      } else {
        res.status(400).json({
          message: "Room not found",
        });
      }
    })
    .catch(() => {
      res.status(400).json({
        message: "Failed to get room",
      });
    });
}

//------------------------------------------------------------------
///----------------------- get room by number ----------------------
//------------------------------------------------------------------
export function getRoomByNumber(req, res) {
  const number = req.params.number;

  Room.findOne({ roomNo: number })
    .then((result) => {
      if (result) {
        res.status(200).json({
          room: result,
        });
      } else {
        res.status(400).json({
          message: "Room not found",
        });
      }
    })
    .catch(() => {
      res.status(400).json({
        message: "Failed to get Room",
      });
    });
}

//------------------------------------------------------------------
///----------------------- get room by category ----------------------
//------------------------------------------------------------------
export function getRoomByCategory(req, res) {
  const category = req.params.category;

  Room.find({ category: category })
    .then((result) => {
      if (result) {
        res.status(200).json({
          room: result,
        });
      } else {
        res.status(400).json({
          message: "Room not found",
        });
      }
    })
    .catch(() => {
      res.status(400).json({
        message: "Failed to get Room",
      });
    });
}

//------------------------------------------------------------------
///---------------------- update room by number --------------------
//------------------------------------------------------------------
export function updateRoomByNumber(req, res) {
  if (verifyAdmin(req)) {
    const number = req.params.number;
    Room.updateOne({ roomNo: number }, req.body, { new: true }).then(
      (result) => {
        if (result) {
          res.status(200).json({
            room: result,
          });
        } else {
          res.status(400).json({
            message: "Room not found",
          });
        }
      }
    );
  } else {
    res.status(403).json({
      message: "Unauthorized",
    });
  }
}

//------------------------------------------------------------------
///---------------------- delete room by number --------------------
//------------------------------------------------------------------

export function deleteRoomByNumber(req, res) {
  if (verifyAdmin(req)) {
    const number = req.params.number;
    Room.findOneAndDelete({ roomNo: number })
      .then(() => {
        res.status(200).json({
          message: "Room deleted successfully",
        });
      })
      .catch(() => {
        res.status(400).json({
          message: "Room deletion failed",
        });
      });
  } else {
    res.status(403).json({
      message: "Unauthorized",
    });
  }
}
