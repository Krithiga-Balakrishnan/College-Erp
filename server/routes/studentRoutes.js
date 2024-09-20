import express from "express";
import {
  studentLogin,
  updatedPassword,
  updateStudent,
  testResult,
  attendance,
} from "../controller/studentController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/login", studentLogin);
router.post("/updatepassword", auth('student'), updatedPassword);
router.post("/updateprofile", auth('student'), updateStudent);
router.post("/testresult", auth('student'), testResult);
router.post("/attendance", auth('student'), attendance);

export default router;
