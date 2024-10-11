import Room from "../models/room.js";

// create room function ---------------
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

// get rooms function ---------------
export function getRooms(req, res) {
  Room.find().then((categories) => {
    res.json({
      list: categories,
    });
  });
}
