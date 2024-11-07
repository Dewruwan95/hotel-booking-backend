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
