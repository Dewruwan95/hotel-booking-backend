import Category from "../models/category.js";

// create category -------------------
export function createCategory(req, res) {
  const category = req.body;
  console.log(category);

  const newCategory = new Category(category);

  newCategory
    .save()
    .then(() => {
      res.json({
        message: "Category created successfully",
      });
    })
    .catch(() => {
      message: "Category creation failed";
    });
}
