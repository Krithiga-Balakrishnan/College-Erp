import mongoose from "mongoose";

const adminSchema = mongoose.Schema(
  {
      name: {
      type: String,
      require: true,
      maxlength: [50, "Name must be at most 50 characters long"],
      match: [/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"]
    },
    email: {
      type: String,
      required: true,
      unique: true,
      maxlength: [50, "Name must be at most 50 characters long"],
    },
    password: {
      type: String,
    },
    username: {
      type: String,
      maxlength: [50, "Name must be at most 50 characters long"],
    },
    department: {
      type: String,
    },
    dob: {
      type: String,
    },
    joiningYear: {
      type: String,
    },
    avatar: {
      type: String,
    },
    contactNumber: {
      type: Number,
    },
    passwordUpdated: {
      type: Boolean,
      default: false,
    },
  },
  { strict: false }
);

export default mongoose.model("admin", adminSchema);
