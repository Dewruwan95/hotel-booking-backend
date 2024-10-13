import Category from "../models/category.js";
import { verifyAdmin } from "../utils/userVerification.js";

//------------------------------------------------------------------
///------------------------- create category -----------------------
//------------------------------------------------------------------
export function createCategory(req, res) {
  if (verifyAdmin(req.user)) {
    const category = req.body;
    const newCategory = new Category(category);

    newCategory
      .save()
      .then(() => {
        res.status(200).json({
          message: "Category created successfully",
        });
      })
      .catch(() => {
        res.status(400).json({
          message: "Category creation failed",
        });
      });
  } else {
    res.status(400).json({
      message: "Unauthorized",
    });
  }
}

//------------------------------------------------------------------
///-------------------------- get category -------------------------
//------------------------------------------------------------------
export function getCategory(req, res) {
  Category.find()
    .then((categories) => {
      res.json({
        list: categories,
      });
    })
    .catch(() => {
      res.status(400).json({
        message: "Failed to get categories",
      });
    });
}

//------------------------------------------------------------------
///---------------------- get category by name ---------------------
//------------------------------------------------------------------
export function getCategoryByName(req, res) {
  const name = req.params.name;

  Category.findOne({ name: name })
    .then((result) => {
      if (result) {
        res.status(200).json({
          category: result,
        });
      } else {
        res.status(400).json({
          message: "Category not found",
        });
      }
    })
    .catch(() => {
      res.status(400).json({
        message: "Failed to get category",
      });
    });
}
//------------------------------------------------------------------
///--------------------- update category by name -------------------
//------------------------------------------------------------------
export function updateCategoryByName(req, res) {
  const user = req.user;
  if (verifyAdmin(user)) {
    const name = req.params.name;
    Category.findOneAndUpdate({ name: name }, req.body, { new: true })
      .then((updatedCategory) => {
        if (updatedCategory) {
          res.status(200).json({
            message: "category updated successfully",
          });
        } else {
          return res.status(404).json({
            message: "Category Not Found",
          });
        }
      })
      .catch(() => {
        res.status(400).json({
          message: "Category updation failed",
        });
      });
  } else {
    res.status(400).json({
      message: "Unauthorized",
    });
  }
}

//------------------------------------------------------------------
///------------------------- delete category -----------------------
//------------------------------------------------------------------
export function deleteCategory(req, res) {
  const user = req.user;
  if (verifyAdmin(user)) {
    const name = req.params.name;
    Category.findOneAndDelete({ name: name })
      .then(() => {
        res.status(200).json({
          message: "category deleted successfully",
        });
      })
      .catch(() => {
        res.status(400).json({
          message: "Category deletion failed",
        });
      });
  } else {
    res.status(400).json({
      message: "Unauthorized",
    });
  }
}
