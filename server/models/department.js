import mongoose from "mongoose";

const departmentSchema = mongoose.Schema({
  department: {
    type: String,
    required: true,
    maxlength: [50, "Name must be at most 50 characters long"],
  },
  departmentCode: {
    type: String,
    required: true,
    unique: true,
    maxlength: [50, "Name must be at most 50 characters long"],
  },
});

export default mongoose.model("department", departmentSchema);
