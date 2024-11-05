import mongoose from "mongoose";

const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  price: {
    type: Number,
    required: true,
  },
  features: [
    {
      type: String,
    },
  ],
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: "image-placeholder.png",
  },
});

// Force creation of the unique index for 'name'
categorySchema.index({ name: 1 }, { unique: true });

const Category = mongoose.model("categories", categorySchema);

export default Category;
