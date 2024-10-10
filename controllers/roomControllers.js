import Room from "../models/room.js";

// create room function ---------------
export function createRoom(req, res) {
  const room = req.body;
  const newRoom = new Room(room);

  newRoom
    .save()
    .then(() => {
      res.json({
        message: "Room created successfully",
      });
    })
    .catch(() => {
      res.json({
        message: "Room creation failed",
      });
    });
}

// get rooms function ---------------
export function getRooms(req, res) {
  Room.find().then((categories) => {
    res.json({
      list: categories,
    });
  });
}
