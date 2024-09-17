import mongoose from "mongoose";
const { Schema } = mongoose;
const studentSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
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
  },
  motherName: {
    type: String,
  },
  department: {
    type: String
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
