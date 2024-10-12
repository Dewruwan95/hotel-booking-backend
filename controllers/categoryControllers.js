import Category from "../models/category.js";

// create category -------------------
export function createCategory(req, res) {
  const user = req.user;
  if (user) {
    if (user.type == "admin") {
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
      res.status(403).json({
        message: "you do not have permission to create a category",
      });
    }
  } else {
    res.status(403).json({
      message: "Please login to create a category",
    });
  }
}

// get category -------------------
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

// delete category ----------------
export function deleteCategory(req, res) {
  const user = req.user;
  if (user) {
    if (user.type == "admin") {
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
      res.status(403).json({
        message: "you do not have permission to create a category",
      });
    }
  } else {
    res.status(403).json({
      message: "Please login to create a category",
    });
  }
}
