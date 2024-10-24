import express from "express";
import {
  createCategory,
  deleteCategory,
  getCategory,
  getCategoryByName,
  updateCategoryByName,
} from "../controllers/categoryControllers.js";

const categoryRouter = express.Router();

categoryRouter.post("/", createCategory);

categoryRouter.get("/", getCategory);

categoryRouter.get("/:name", getCategoryByName);

categoryRouter.put("/:name", updateCategoryByName);

categoryRouter.delete("/:name", deleteCategory);

export default categoryRouter;
