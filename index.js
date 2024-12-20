import express from "express";
import bodyParser from "body-parser";
import userRouter from "./routes/usersRoute.js";
import mongoose from "mongoose";
import eventRouter from "./routes/eventRoute.js";
import categoryRouter from "./routes/categoryRoute.js";
import roomRouter from "./routes/roomRoute.js";
import dotenv from "dotenv";
import { authenticateUser } from "./middlewares/userAuthentication.js";
import bookingRouter from "./routes/bookingRoute.js";
import feedbackRouter from "./routes/feedbackRoute.js";
import cors from "cors";
import inquiryRouter from "./routes/inquiryRoute.js";

dotenv.config();
const app = express();
app.use(cors());

app.use(bodyParser.json());

const connectionString = process.env.MONGODB_URL;

app.use(authenticateUser);

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
app.use("/api/bookings", bookingRouter);
app.use("/api/feedbacks", feedbackRouter);
app.use("/api/inquiries", inquiryRouter);

app.listen(5000, (req, res) => {
  console.log("Server is running on port 5000");
});
