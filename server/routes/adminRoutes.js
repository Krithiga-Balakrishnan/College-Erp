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
// const checkRole = (requiredRole) => (req, res, next) => {
//   if (req.userRole !== requiredRole) {
//     return res.status(403).json({ message: "Forbidden: Insufficient Permissions" });
//   }
//   next();
// };
router.post("/login", adminLogin);
router.post("/updatepassword", auth('admin'), updatedPassword);
router.get("/getallstudent", auth(), getAllStudent);
router.post("/createnotice", auth('admin'), createNotice);
router.get("/getallfaculty", auth(), getAllFaculty);
router.get("/getalldepartment", auth(), getAllDepartment);
router.get("/getallsubject", auth(), getAllSubject);
router.get("/getalladmin", auth(), getAllAdmin);
router.post("/updateprofile", auth('admin'), updateAdmin);
router.post("/addadmin", auth('admin'), addAdmin);
router.post("/adddepartment", auth('admin'), addDepartment);
router.post("/addfaculty", auth('admin'), addFaculty);
router.post("/getfaculty", auth(), getFaculty);
router.post("/addsubject", auth('admin'), addSubject);
router.post("/getsubject", auth(), getSubject);
router.post("/addstudent", auth('admin'), addStudent);
router.post("/getstudent", auth(), getStudent);
router.post("/getnotice", auth(), getNotice);
router.post("/getadmin", auth(), getAdmin);
router.post("/deleteadmin", auth('admin'), deleteAdmin);
router.post("/deletefaculty", auth('admin'), deleteFaculty);
router.post("/deletestudent", auth('admin'), deleteStudent);
router.post("/deletedepartment", auth('admin'), deleteDepartment);
router.post("/deletesubject", auth('admin'), deleteSubject);




export default router;
