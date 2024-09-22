import express from "express";
import auth from "../middleware/auth.js";
import {
  adminLogin,
  updateAdmin,
  addAdmin,
  addFaculty,
  getFaculty,
  addSubject,
  getSubject,
  addStudent,
  getStudent,
  addDepartment,
  getAllStudent,
  getAllFaculty,
  getAllAdmin,
  getAllDepartment,
  getAllSubject,
  updatedPassword,
  getAdmin,
  deleteAdmin,
  deleteDepartment,
  deleteFaculty,
  deleteStudent,
  deleteSubject,
  createNotice,
  getNotice,
} from "../controller/adminController.js";
import csrfProtection from "../middleware/csrfMiddleware.js";

const router = express.Router();
const checkRole = (requiredRole) => (req, res, next) => {
  if (req.userRole !== requiredRole) {
    return res.status(403).json({ message: "Forbidden: Insufficient Permissions" });
  }
  next();
};
router.post("/login", csrfProtection, adminLogin);
router.post("/updatepassword", auth, checkRole('admin'), csrfProtection, updatedPassword);
router.get("/getallstudent", auth, getAllStudent);
router.post("/createnotice", auth, checkRole('admin'), csrfProtection, createNotice);
router.get("/getallfaculty", auth, getAllFaculty);
router.get("/getalldepartment", auth, getAllDepartment);
router.get("/getallsubject", auth, getAllSubject);
router.get("/getalladmin", auth, getAllAdmin);
router.post("/updateprofile", auth, checkRole('admin'), updateAdmin);
router.post("/addadmin", auth, checkRole('admin'),csrfProtection, addAdmin);
router.post("/adddepartment", auth, checkRole('admin'), csrfProtection, addDepartment);
router.post("/addfaculty", auth, checkRole('admin'), csrfProtection, addFaculty);
router.post("/getfaculty", auth,csrfProtection, getFaculty);
router.post("/addsubject", auth, checkRole('admin'), csrfProtection, addSubject);
router.post("/getsubject", auth, csrfProtection, getSubject);
router.post("/addstudent", auth, checkRole('admin'), csrfProtection, addStudent);
router.post("/getstudent", auth,csrfProtection, getStudent);
router.post("/getnotice", auth, csrfProtection,getNotice);
router.post("/getadmin", auth,csrfProtection, getAdmin);
router.post("/deleteadmin", auth, checkRole('admin'),csrfProtection, deleteAdmin);
router.post("/deletefaculty", auth, checkRole('admin'),csrfProtection, deleteFaculty);
router.post("/deletestudent", auth, checkRole('admin'), csrfProtection,deleteStudent);
router.post("/deletedepartment", auth, checkRole('admin'),csrfProtection, deleteDepartment);
router.post("/deletesubject", auth, checkRole('admin'), csrfProtection,deleteSubject);




export default router;
