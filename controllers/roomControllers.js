import Room from "../models/room.js";

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
