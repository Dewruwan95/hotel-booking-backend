import express from "express";
import bodyParser from "body-parser";
import userRouter from "./routes/usersRoute.js";
import mongoose from "mongoose";
import eventRouter from "./routes/eventRoute.js";
import categoryRouter from "./routes/categoryRoute.js";
import roomRouter from "./routes/roomRoute.js";
import dotenv from "dotenv";
import { verifyUser } from "./middlewares/userVerification.js";

dotenv.config();
const app = express();

app.use(bodyParser.json());

const connectionString = process.env.MONGODB_URL;

app.use(verifyUser);

mongoose
  .connect(connectionString)
  .then(() => {
    console.log("Connected to the database");
  })
  .catch(() => {
    console.log("Connection Failed");
  });

app.use("/api/users", userRouter);
app.use("/api/events", eventRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/rooms", roomRouter);

app.listen(5000, (req, res) => {
  console.log("Server is running on port 5000");
});
