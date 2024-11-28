import express from "express";
import {
  createCategory,
  deleteCategoryByName,
  getCategory,
  getCategoryByName,
  updateCategoryByName,
} from "../controllers/categoryControllers.js";

const categoryRouter = express.Router();

categoryRouter.post("/", createCategory);

categoryRouter.post("/all", getCategory);

categoryRouter.get("/:name", getCategoryByName);

categoryRouter.put("/:name", updateCategoryByName);

categoryRouter.delete("/:name", deleteCategoryByName);

export default categoryRouter;
