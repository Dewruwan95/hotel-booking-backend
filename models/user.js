import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  saltingText: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
  },
  type: {
    type: String,
    required: true,
    default: "customer",
  },
  whatsApp: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: "https://cdn-icons-png.flaticon.com/512/9187/9187604.png",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  emailVerifiey: {
    type: Boolean,
    default: false,
  },
});

const User = mongoose.model("users", userSchema);

export default User;
