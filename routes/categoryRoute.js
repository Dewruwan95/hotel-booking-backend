import express from "express";
import {
  createCategory,
  deleteCategory,
  getCategory,
} from "../controllers/categoryControllers.js";

const categoryRouter = express.Router();

categoryRouter.post("/", createCategory);

categoryRouter.get("/", getCategory);

categoryRouter.delete("/:name", deleteCategory);

export default categoryRouter;
