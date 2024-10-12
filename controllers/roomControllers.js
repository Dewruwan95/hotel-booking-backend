import Room from "../models/room.js";

//------------------------------------------------------------------
///--------------------------- create room -------------------------
//------------------------------------------------------------------
export function createRoom(req, res) {
  const user = req.user;

  if (user) {
    if (user.type == "admin") {
      const room = req.body;
      const newRoom = new Room(room);

      newRoom
        .save()
        .then(() => {
          res.status(200).json({
            message: "Room created successfully",
          });
        })
        .catch(() => {
          res.status(400).json({
            message: "Room creation failed",
          });
        });
    } else {
      res.status(403).json({
        message: "You dont have permission to create a room",
      });
    }
  } else {
    res.status(403).json({
      message: "Please log in before create a room",
    });
  }
}

//------------------------------------------------------------------
///---------------------------- get rooms --------------------------
//------------------------------------------------------------------
export function getRooms(req, res) {
  Room.find()
    .then((categories) => {
      res.json({
        list: categories,
      });
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
///---------------------- update room by number --------------------
//------------------------------------------------------------------
export function updateRoomByNumber(req, res) {
  const user = req.user;

  if (user) {
    if (user.type == "admin") {
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
        message: "You dont have permission to create a room",
      });
    }
  } else {
    res.status(403).json({
      message: "Please log in before create a room",
    });
  }
}

//------------------------------------------------------------------
///---------------------- delete room by number --------------------
//------------------------------------------------------------------

export function deleteRoomByNumber(req, res) {
  const user = req.user;
  if (user) {
    if (user.type == "admin") {
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
        message: "you do not have permission to delete a room",
      });
    }
  } else {
    res.status(403).json({
      message: "Please login to delete a room",
    });
  }
}
