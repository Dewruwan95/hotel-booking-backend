import express from "express";
import bodyParser from "body-parser";
import userRouter from "./routes/usersRoute.js";
import mongoose from "mongoose";
import eventRouter from "./routes/eventRoute.js";
import jwt from "jsonwebtoken";
import categoryRouter from "./routes/categoryRoute.js";

const app = express();

app.use(bodyParser.json());

const connectionString =
  "mongodb+srv://user1:1234@cluster0.kk17j.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

app.use((req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (token) {
    jwt.verify(token, "secret", (err, decoded) => {
      if (decoded != null) {
        req.user = decoded;
        next();
      } else {
        next();
      }
    });
  } else {
    next();
  }
});

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

app.listen(5000, (req, res) => {
  console.log("Server is running on port 5000");
});
