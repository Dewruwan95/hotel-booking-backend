import express from "express";
import { createCategory } from "../controllers/categoryControllers.js";

const categoryRouter = express.Router();

categoryRouter.post("/", createCategory);

export default categoryRouter;
