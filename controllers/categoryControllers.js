import Category from "../models/category.js";
import { verifyAdmin } from "../utils/userVerification.js";

//------------------------------------------------------------------
///------------------------- create category -----------------------
//------------------------------------------------------------------
export async function createCategory(req, res) {
  if (verifyAdmin(req)) {
    const category = req.body;
    const newCategory = new Category(category);

    try {
      await newCategory.save();
      res.status(200).json({
        message: "Category created successfully",
      });
    } catch (error) {
      res.status(400).json({
        message: "Category creation failed",
      });
    }
  } else {
    res.status(400).json({
      message: "Unauthorized",
    });
  }
}

//------------------------------------------------------------------
///-------------------------- get category -------------------------
//------------------------------------------------------------------
export async function getCategory(req, res) {
  try {
    const categories = await Category.find();
    res.json({
      categories: categories,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to get categories",
    });
  }
}

//------------------------------------------------------------------
///---------------------- get category by name ---------------------
//------------------------------------------------------------------
export async function getCategoryByName(req, res) {
  const name = req.params.name;

  try {
    const result = await Category.findOne({ name: name });
    if (result) {
      res.status(200).json({
        category: result,
      });
    } else {
      res.status(400).json({
        message: "Category not found",
      });
    }
  } catch (error) {
    res.status(400).json({
      message: "Failed to get category",
    });
  }
}

//------------------------------------------------------------------
///--------------------- update category by name -------------------
//------------------------------------------------------------------
export async function updateCategoryByName(req, res) {
  if (verifyAdmin(req)) {
    const name = req.params.name;

    try {
      const updatedCategory = await Category.findOneAndUpdate(
        { name: name },
        req.body,
        { new: true }
      );

      if (updatedCategory) {
        res.status(200).json({
          message: "Category updated successfully",
        });
      } else {
        return res.status(404).json({
          message: "Category Not Found",
        });
      }
    } catch (error) {
      res.status(400).json({
        message: "Category updation failed",
      });
    }
  } else {
    res.status(400).json({
      message: "Unauthorized",
    });
  }
}

//------------------------------------------------------------------
///------------------------- delete category -----------------------
//------------------------------------------------------------------
export async function deleteCategoryByName(req, res) {
  if (verifyAdmin(req)) {
    const name = req.params.name;

    try {
      await Category.findOneAndDelete({ name: name });
      res.status(200).json({
        message: "Category deleted successfully",
      });
    } catch (error) {
      res.status(400).json({
        message: "Category deletion failed",
      });
    }
  } else {
    res.status(400).json({
      message: "Unauthorized",
    });
  }
}
