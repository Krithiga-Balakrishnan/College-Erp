import express from "express";
import {
  studentLogin,
  updatedPassword,
  updateStudent,
  testResult,
  attendance,
} from "../controller/studentController.js";
import auth from "../middleware/auth.js";
import csrfProtection from "../middleware/csrfMiddleware.js";

const router = express.Router();

router.post("/login",csrfProtection, studentLogin);
router.post("/updatepassword", auth('student'), csrfProtection,updatedPassword);
router.post("/updateprofile", auth('student'),csrfProtection, updateStudent);
router.post("/testresult", auth('student'), csrfProtection,testResult);
router.post("/attendance", auth('student'), csrfProtection,attendance);

export default router;
