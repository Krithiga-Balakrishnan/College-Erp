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

const checkRole = (requiredRole) => (req, res, next) => {
  if (req.userRole !== requiredRole) {
    return res.status(403).json({ message: "Forbidden: Insufficient Permissions" });
  }
  next();
};

router.post("/login",csrfProtection, studentLogin);
router.post("/updatepassword", auth, checkRole('student'), csrfProtection,updatedPassword);
router.post("/updateprofile", auth, checkRole('student'), csrfProtection, updateStudent);
router.post("/testresult", auth, checkRole('student'),csrfProtection, testResult);
router.post("/attendance", auth, checkRole('student'), csrfProtection,attendance);

export default router;
