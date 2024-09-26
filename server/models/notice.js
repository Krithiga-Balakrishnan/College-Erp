import mongoose from "mongoose";

const noticeSchema = mongoose.Schema({
  topic: {
    type: String,
    require: true,
    maxlength: [50, "Name must be at most 50 characters long"],
  },
  date: {
    type: String,
    require: true,
  },
  content: {
    type: String,
    require: true,
    maxlength: [500, "Name must be at most 50 characters long"],
  },
  from: {
    type: String,
    require: true,
    maxlength: [50, "Name must be at most 50 characters long"],
  },
  noticeFor: {
    type: String,
    require: true,
  },
});

export default mongoose.model("notice", noticeSchema);
