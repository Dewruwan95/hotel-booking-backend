import Category from "../models/category";

// create category -------------------
export function createCategory(req, res) {
  const category = req.user;

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
