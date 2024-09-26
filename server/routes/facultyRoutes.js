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
import csrfProtection from "../middleware/csrfMiddleware.js";

const router = express.Router();

router.post("/login",csrfProtection, facultyLogin);
router.post("/updatepassword", auth('faculty'), csrfProtection,updatedPassword);
router.post("/updateprofile", auth('faculty'),csrfProtection, updateFaculty);
router.post("/createtest", auth('faculty'),csrfProtection, createTest);
router.post("/gettest", auth('faculty'), csrfProtection,getTest);
router.post("/getstudent", auth('faculty'),csrfProtection, getStudent);
router.post("/uploadmarks", auth('faculty'),csrfProtection, uploadMarks);
router.post("/markattendance", auth('faculty'), csrfProtection,markAttendance);

export default router;
