import mongoose from "mongoose";

const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

// Force creation of the unique index for 'name'
categorySchema.index({ name: 1 }, { unique: true });

const Category = mongoose.model("categories", categorySchema);

export default Category;
