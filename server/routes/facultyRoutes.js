import express from "express";
import {
  facultyLogin,
  updatedPassword,
  updateFaculty,
  createTest,
  getTest,
  getStudent,
  uploadMarks,
  markAttendance,
} from "../controller/facultyController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/login", facultyLogin);
router.post("/updatepassword", auth('faculty'), updatedPassword);
router.post("/updateprofile", auth('faculty'), updateFaculty);
router.post("/createtest", auth('faculty'), createTest);
router.post("/gettest", auth('faculty'), getTest);
router.post("/getstudent", auth('faculty'), getStudent);
router.post("/uploadmarks", auth('faculty'), uploadMarks);
router.post("/markattendance", auth('faculty'), markAttendance);

export default router;
