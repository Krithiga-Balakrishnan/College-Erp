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

const checkRole = (requiredRole) => (req, res, next) => {
  if (req.userRole !== requiredRole) {
    return res.status(403).json({ message: "Forbidden: Insufficient Permissions" });
  }
  next();
};

router.post("/login", csrfProtection,facultyLogin);
router.post("/updatepassword", auth, checkRole('faculty'), updatedPassword);
router.post("/updateprofile", auth, checkRole('faculty'), updateFaculty);
router.post("/createtest", auth, checkRole('faculty'), createTest);
router.post("/gettest", auth, checkRole('faculty'), getTest);
router.post("/getstudent", auth, checkRole('faculty'), getStudent);
router.post("/uploadmarks", auth, checkRole('faculty'), uploadMarks);
router.post("/markattendance", auth, checkRole('faculty'), csrfProtection,markAttendance);

export default router;
