import mongoose from "mongoose";

const facultySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: [50, "Name must be at most 50 characters long"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    maxlength: [50, "Name must be at most 50 characters long"],
  },
  avatar: {
    type: String,
  },
  password: {
    type: String,
  },
  username: {
    type: String,
    maxlength: [50, "Name must be at most 50 characters long"],
  },
  gender: {
    type: String,
  },
  designation: {
    type: String,
    required: true,
    maxlength: [50, "Name must be at most 50 characters long"],
  },
  department: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: Number,
  },
  dob: {
    type: String,
    required: true,
  },
  joiningYear: {
    type: Number,
    required: true,
  },
  passwordUpdated: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model("faculty", facultySchema);
