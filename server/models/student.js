import mongoose from "mongoose";
const { Schema } = mongoose;
const studentSchema = new Schema({
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
    type: String
  },
  year: {
    type: Number
  },
  subjects: [
    {
      type: Schema.Types.ObjectId,
      ref: "subject",
    },
  ],
  username: {
    type: String,
  },
  gender: {
    type: String,
  },
  fatherName: {
    type: String,
    maxlength: [50, "fatherName must be at most 50 characters long"],
  },
  motherName: {
    type: String,
    maxlength: [50, "motherName must be at most 50 characters long"],
  },
  department: {
    type: String,
    maxlength: [50, "department must be at most 50 characters long"],
  },
  section: {
    type: String
  },
  batch: {
    type: String,
  },
  contactNumber: {
    type: Number,
  },
  fatherContactNumber: {
    type: Number,
  },
  dob: {
    type: String
  },
  passwordUpdated: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model("student", studentSchema);
