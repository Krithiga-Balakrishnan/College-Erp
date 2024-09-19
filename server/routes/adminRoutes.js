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
const router = express.Router();
const checkRole = (requiredRole) => (req, res, next) => {
  if (req.userRole !== requiredRole) {
    return res.status(403).json({ message: "Forbidden: Insufficient Permissions" });
  }
  next();
};
router.post("/login", adminLogin);
router.post("/updatepassword", auth, checkRole('admin'), updatedPassword);
router.get("/getallstudent", auth, getAllStudent);
router.post("/createnotice", auth, checkRole('admin'), createNotice);
router.get("/getallfaculty", auth, getAllFaculty);
router.get("/getalldepartment", auth, getAllDepartment);
router.get("/getallsubject", auth, getAllSubject);
router.get("/getalladmin", auth, getAllAdmin);
router.post("/updateprofile", auth, checkRole('admin'), updateAdmin);
router.post("/addadmin", auth, checkRole('admin'), addAdmin);
router.post("/adddepartment", auth, checkRole('admin'), addDepartment);
router.post("/addfaculty", auth, checkRole('admin'), addFaculty);
router.post("/getfaculty", auth, getFaculty);
router.post("/addsubject", auth, checkRole('admin'), addSubject);
router.post("/getsubject", auth, getSubject);
router.post("/addstudent", auth, checkRole('admin'), addStudent);
router.post("/getstudent", auth, getStudent);
router.post("/getnotice", auth, getNotice);
router.post("/getadmin", auth, getAdmin);
router.post("/deleteadmin", auth, checkRole('admin'), deleteAdmin);
router.post("/deletefaculty", auth, checkRole('admin'), deleteFaculty);
router.post("/deletestudent", auth, checkRole('admin'), deleteStudent);
router.post("/deletedepartment", auth, checkRole('admin'), deleteDepartment);
router.post("/deletesubject", auth, checkRole('admin'), deleteSubject);




export default router;
