import Admin from "../models/admin.js";
import Department from "../models/department.js";
import Faculty from "../models/faculty.js";
import Student from "../models/student.js";
import Subject from "../models/subject.js";
import Notice from "../models/notice.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import csrfProtection from "../middleware/csrfMiddleware.js";
import { body, validationResult } from "express-validator";


export const adminLogin = [
  // Validation and sanitization
  body('username').trim().escape(),
  body('password').trim().escape(),

  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { username, password } = req.body;
      const errorsResponse = { usernameError: String, passwordError: String };

      const existingAdmin = await Admin.findOne({ username });
      if (!existingAdmin) {
        errorsResponse.usernameError = "Admin doesn't exist.";
        return res.status(404).json(errorsResponse);
      }

      const isPasswordCorrect = await bcrypt.compare(password, existingAdmin.password);
      if (!isPasswordCorrect) {
        errorsResponse.passwordError = "Invalid Credentials";
        return res.status(404).json(errorsResponse);
      }
      const csrfToken = req.csrfToken();
      console.log('Generated CSRF Token:', csrfToken);
  
      const token = jwt.sign(
        {
          email: existingAdmin.email,
          id: existingAdmin._id,
          role: 'admin'
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.status(200).json({ result: existingAdmin, token: token ,csrfToken});
    } catch (error) {
      console.error(error);
      res.status(500).json({ backendError: error.message });
    }
  },
];

export const updatedPassword = [
  // Validation and sanitization
  body('newPassword').trim().escape(),
  body('confirmPassword').trim().escape(),
  body('email').isEmail().normalizeEmail(),

  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { newPassword, confirmPassword, email } = req.body;
      const mismatchErrors = { mismatchError: String };

      if (newPassword !== confirmPassword) {
        mismatchErrors.mismatchError = "Your password and confirmation password do not match";
        return res.status(400).json(mismatchErrors);
      }

      const admin = await Admin.findOne({ email }).select('-password');
      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }

      let hashedPassword;
      try {
        hashedPassword = await bcrypt.hash(newPassword, 10);
      } catch (hashError) {
        return res.status(500).json({ message: "Error hashing the password" });
      }

      admin.password = hashedPassword;
    await admin.save();
    const csrfToken = req.csrfToken(); // Generate CSRF token
    if (admin.passwordUpdated === false) {
      admin.passwordUpdated = true;
      await admin.save();
      const csrfToken = req.csrfToken(); // Generate CSRF token
    }
      res.status(200).json({
        success: true,
        message: "Password updated successfully",
        response: admin,
        csrfToken,
      });
    } catch (error) {
      console.error("Error in updateAdminPassword controller:", error);
      const errors = { backendError: String };
      errors.backendError = error.message;
      res.status(500).json(errors);
    }
  },
];

export const updateAdmin = [
  // Validation and sanitization
  body('name').optional().trim().escape(),
  body('dob').optional().trim().escape(),
  body('department').optional().trim().escape(),
  body('contactNumber').optional().trim().escape(),
  body('avatar').optional().trim().escape(),
  body('email').isEmail().normalizeEmail(),

  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, dob, department, contactNumber, avatar, email } = req.body;

      // Find the admin by email
      const updatedAdmin = await Admin.findOne({ email }).select('-password');
      if (!updatedAdmin) {
        return res.status(404).json({ message: 'Admin not found' });
      }

      // Update the fields if provided
      if (name) updatedAdmin.name = name;
      if (dob) updatedAdmin.dob = dob;
      if (department) updatedAdmin.department = department;
      if (contactNumber) updatedAdmin.contactNumber = contactNumber;
      if (avatar) updatedAdmin.avatar = avatar;

      // Save the updated admin information
      await updatedAdmin.save();

      res.status(200).json(updatedAdmin);
    } catch (error) {
      const errors = { backendError: String };
      errors.backendError = error;
      res.status(500).json(errors);
    }
  },
];

export const addAdmin = [
  // Validation and sanitization
  body('name').trim().escape(),
  body('dob').trim().escape(),
  body('department').trim().escape(),
  body('contactNumber').trim().escape(),
  body('avatar').trim().escape(),
  body('email').isEmail().normalizeEmail(),
  body('joiningYear').trim().escape(),

  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, dob, department, contactNumber, avatar, email, joiningYear } = req.body;

      const errorsObj = { emailError: String };
      const existingAdmin = await Admin.findOne({ email }).select('-password');
      if (existingAdmin) {
        errorsObj.emailError = "Email already exists";
        return res.status(400).json(errorsObj);
      }

      const existingDepartment = await Department.findOne({ department });
      let departmentHelper = existingDepartment.departmentCode;
      const admins = await Admin.find({ department });

      let helper;
      if (admins.length < 10) {
        helper = "00" + admins.length.toString();
      } else if (admins.length < 100 && admins.length > 9) {
        helper = "0" + admins.length.toString();
      } else {
        helper = admins.length.toString();
      }

      var date = new Date();
      var components = ["ADM", date.getFullYear(), departmentHelper, helper];
      var username = components.join("");

      let hashedPassword;
      const newDob = dob.split("-").reverse().join("-");


       try {
      hashedPassword = await bcrypt.hash(newDob, 10);
    } catch (hashError) {
      return res.status(500).json({ message: "Error hashing the password" });
    }

      var passwordUpdated = false;

      const newAdmin = new Admin({
        name,
        email,
        password: hashedPassword,
        joiningYear,
        username,
        department,
        avatar,
        contactNumber,
        dob,
        passwordUpdated,
      });

      await newAdmin.save();
      const csrfToken = req.csrfToken(); // Generate CSRF token

      return res.status(200).json({
        success: true,
        message: "Admin registered successfully",
        response: newAdmin,
        csrfToken, // Send CSRF token in response
      });
    } catch (error) {
      const errors = { backendError: String };
      errors.backendError = error;
      res.status(500).json(errors);
    }
  },
];

export const addDummyAdmin = async () => {
  const email = "dummy@gmail.com";
  const password = "123";
  const name = "dummy";
  const username = "ADMDUMMY";
  let hashedPassword;

    hashedPassword = await bcrypt.hash(password, 10);
 
  var passwordUpdated = true;

  const dummyAdmin = await Admin.findOne({ email }).select('-password');

  if (!dummyAdmin) {
    await Admin.create({
      name,
      email,
      password: hashedPassword,
      username,
      passwordUpdated,
    });
    console.log("Dummy user added.");
  } else {
    console.log("Dummy user already exists.");
  }
};
export const createNotice = [
  // Validation and sanitization for input fields
  body('from').trim().escape(),
  body('content').trim().escape(),
  body('topic').trim().escape(),
  body('date').trim().escape(),
  body('noticeFor').trim().escape(),

  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Destructure sanitized input fields
      const { from, content, topic, date, noticeFor } = req.body;

      // Check if a notice with the same topic, content, and date already exists
      const existingNotice = await Notice.findOne({ topic, content, date });
      if (existingNotice) {
        return res.status(400).json({ noticeError: "Notice already created" });
      }

      // Create new notice with sanitized inputs
      const newNotice = new Notice({
        from,
        content,
        topic,
        noticeFor,
        date,
      });

      // Save the new notice to the database
      await newNotice.save();
      const csrfToken = req.csrfToken(); // Generate CSRF token

      return res.status(200).json({
        success: true,
        message: "Notice created successfully",
        response: newNotice,
        csrfToken,
      });
    } catch (error) {
      // Handle backend errors
      console.error("Error in createNotice controller:", error);
      return res.status(500).json({ backendError: error.message });
    }
  },
];
export const addDepartment = [
  // Validation and sanitization
  body('department').trim().escape(),

  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { department } = req.body;

      // Check if the department already exists
      const existingDepartment = await Department.findOne({ department });
      if (existingDepartment) {
        return res.status(400).json({ departmentError: "Department already added" });
      }

      // Get the number of existing departments to generate departmentCode
      const departments = await Department.find({});
      let add = departments.length + 1;
      let departmentCode;
      if (add < 9) {
        departmentCode = "0" + add.toString();
      } else {
        departmentCode = add.toString();
      }

      // Create new department with sanitized inputs
      const newDepartment = new Department({
        department,
        departmentCode,
      });

      // Save the new department to the database
      await newDepartment.save();
      const csrfToken = req.csrfToken(); // Generate CSRF token

      return res.status(200).json({
        success: true,
        message: "Department added successfully",
        response: newDepartment,
        csrfToken,
      });
    } catch (error) {
      // Handle backend errors
      console.error("Error in addDepartment controller:", error);
      return res.status(500).json({ backendError: error.message });
    }
  },
];


export const addFaculty = [
  // Validation and sanitization
  body('name').trim().escape(),
  body('dob').trim().escape(),
  body('department').trim().escape(),
  body('contactNumber').trim().escape(),
  body('avatar').trim().escape(),
  body('email').isEmail().trim().escape(),
  body('joiningYear').trim().escape(),
  body('gender').trim().escape(),
  body('designation').trim().escape(),

  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        name,
        dob,
        department,
        contactNumber,
        avatar,
        email,
        joiningYear,
        gender,
        designation,
      } = req.body;

      // Check if faculty with the same email already exists
      const existingFaculty = await Faculty.findOne({ email }).select('-password');
      if (existingFaculty) {
        return res.status(400).json({ emailError: "Email already exists" });
      }

      // Get department code from existing department
      const existingDepartment = await Department.findOne({ department });
      let hashedPassword; 
      let departmentHelper = existingDepartment.departmentCode;

      // Generate a unique username for the faculty
      const faculties = await Faculty.find({ department });
      let helper;
      if (faculties.length < 10) {
        helper = "00" + faculties.length.toString();
      } else if (faculties.length < 100 && faculties.length > 9) {
        helper = "0" + faculties.length.toString();
      } else {
        helper = faculties.length.toString();
      }

      var date = new Date();
      var components = ["FAC", date.getFullYear(), departmentHelper, helper];
   // Hash the password
   var username = components.join("");
   let hashedPassword;
   const newDob = dob.split("-").reverse().join("-");
   try {
     hashedPassword = await bcrypt.hash(newDob, 10);
   } catch (hashError) {
     return res.status(500).json({ message: "Error hashing the password" });
   }
      var passwordUpdated = false;

      // Create new faculty record
      const newFaculty = new Faculty({
        name,
        email,
        password: hashedPassword,
        joiningYear,
        username,
        department,
        avatar,
        contactNumber,
        dob,
        gender,
        designation,
        passwordUpdated,
      });

      // Save the new faculty to the database
      await newFaculty.save();
      const csrfToken = req.csrfToken(); // Generate CSRF token
      return res.status(200).json({
        success: true,
        message: "Faculty registered successfully",
        response: newFaculty,
        csrfToken,
      });
    } catch (error) {
      // Handle backend errors
      console.error("Error in addFaculty controller:", error);
      return res.status(500).json({ backendError: error.message });
    }
  },
];

export const getFaculty = async (req, res) => {
  try {
    const { department } = req.body;
    const errors = { noFacultyError: String };
    const faculties = await Faculty.find({ department });
    const csrfToken = req.csrfToken(); // Generate CSRF token
    if (faculties.length === 0) {
      errors.noFacultyError = "No Faculty Found";
      return res.status(404).json(errors);
    }
    res.status(200).json({ result: faculties,csrfToken });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};
export const getNotice = async (req, res) => {
  try {
    const errors = { noNoticeError: String };
    const notices = await Notice.find({});
    const csrfToken = req.csrfToken(); // Generate CSRF token
    if (notices.length === 0) {
      errors.noNoticeError = "No Notice Found";
      return res.status(404).json(errors);
    }
    res.status(200).json({ result: notices,csrfToken });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};

export const addSubject = [
  // Validation and sanitization
  body('totalLectures').isNumeric().trim().escape(),
  body('department').trim().escape(),
  body('subjectCode').trim().escape(),
  body('subjectName').trim().escape(),
  body('year').isNumeric().trim().escape(),

  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { totalLectures, department, subjectCode, subjectName, year } = req.body;

      // Check if the subject already exists
      const subject = await Subject.findOne({ subjectCode });
      if (subject) {
        return res.status(400).json({ subjectError: "Given Subject is already added" });
      }

      // Create new subject
      const newSubject = new Subject({
        totalLectures,
        department,
        subjectCode,
        subjectName,
        year,
      });

      await newSubject.save();
      const csrfToken = req.csrfToken(); // Generate CSRF token
      // Find students in the same department and year and add the subject to their records
      const students = await Student.find({ department, year });
      if (students.length !== 0) {
        for (let i = 0; i < students.length; i++) {
          students[i].subjects.push(newSubject._id);
          await students[i].save();
        }
      }

      return res.status(200).json({
        success: true,
        message: "Subject added successfully",
        response: newSubject,
        csrfToken,
      });
    } catch (error) {
      // Handle backend errors
      console.error("Error in addSubject controller:", error);
      return res.status(500).json({ backendError: error.message });
    }
  },
];

export const getSubject = async (req, res) => {
  try {
    const { department, year } = req.body;

    if (!req.userId) return res.json({ message: "Unauthenticated" });
    const errors = { noSubjectError: String };

    const subjects = await Subject.find({ department, year });
    const csrfToken = req.csrfToken(); // Generate CSRF token
    if (subjects.length === 0) {
      errors.noSubjectError = "No Subject Found";
      return res.status(404).json(errors);
    }
    res.status(200).json({ result: subjects,csrfToken});
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};

export const getAdmin = async (req, res) => {
  try {
    const { department } = req.body;

    const errors = { noAdminError: String };

    const admins = await Admin.find({ department }).select('-password');
    if (admins.length === 0) {
      errors.noAdminError = "No Subject Found";
      return res.status(404).json(errors);
    }
    res.status(200).json({ result: admins });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};

export const deleteAdmin = async (req, res) => {
  try {
    const admins = req.body;
    let csrfToken = req.csrfToken(); // Generate CSRF token outside the loop
    const errors = { noAdminError: String };
    for (var i = 0; i < admins.length; i++) {
      var admin = admins[i];

      await Admin.findOneAndDelete({ _id: admin });
     
    }
    
    res.status(200).json({ message: "Admin Deleted", csrfToken,});
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    console.error("Error in deleteAdmin controller:", error);
    res.status(500).json(errors);
  }
};
export const deleteFaculty = async (req, res) => {
  try {
    const faculties = req.body;
    const errors = { noFacultyError: String };
    for (var i = 0; i < faculties.length; i++) {
      var faculty = faculties[i];

      await Faculty.findOneAndDelete({ _id: faculty });
    }
    const csrfToken = req.csrfToken(); // Generate CSRF token
    res.status(200).json({ message: "Faculty Deleted",csrfToken });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};
export const deleteStudent = async (req, res) => {
  try {
    const students = req.body;
    const csrfToken = req.csrfToken(); // Generate CSRF token
    const errors = { noStudentError: String };
    for (var i = 0; i < students.length; i++) {
      var student = students[i];

      await Student.findOneAndDelete({ _id: student });
    }
    res.status(200).json({ message: "Student Deleted",csrfToken });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};
export const deleteSubject = async (req, res) => {
  try {
    const subjects = req.body;
    const csrfToken = req.csrfToken(); // Generate CSRF token
    const errors = { noSubjectError: String };
    for (var i = 0; i < subjects.length; i++) {
      var subject = subjects[i];

      await Subject.findOneAndDelete({ _id: subject });
    }
    res.status(200).json({ message: "Subject Deleted",csrfToken });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};

export const deleteDepartment = async (req, res) => {
  try {
    const { department } = req.body;

    await Department.findOneAndDelete({ department });
    const csrfToken = req.csrfToken(); // Generate CSRF token
    res.status(200).json({ message: "Department Deleted",csrfToken, });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};



export const addStudent = [
  // Apply trim and escape for sanitization
  body('name').trim().escape(),
  body('dob').trim().escape(),
  body('department').trim().escape(),
  body('contactNumber').trim().escape(),
  body('avatar').trim().escape(),
  body('email').trim().isEmail().normalizeEmail(), // Validates and normalizes email
  body('section').trim().escape(),
  body('gender').trim().escape(),
  body('batch').trim().escape(),
  body('fatherName').trim().escape(),
  body('motherName').trim().escape(),
  body('fatherContactNumber').trim().escape(),
  body('motherContactNumber').trim().escape(),
  body('year').trim().escape(),

  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const {
        name,
        dob,
        department,
        contactNumber,
        avatar,
        email,
        section,
        gender,
        batch,
        fatherName,
        motherName,
        fatherContactNumber,
        motherContactNumber,
        year,
      } = req.body;

      const existingStudent = await Student.findOne({ email }).select('-password');
      if (existingStudent) {
        return res.status(400).json({ emailError: "Email already exists" });
      }

      const existingDepartment = await Department.findOne({ department }).select('-password');
      if (!existingDepartment) {
        return res.status(400).json({ departmentError: "Department not found" });
      }
      const departmentHelper = existingDepartment.departmentCode;

      const students = await Student.find({ department }).select('-password');
      let helper;
      if (students.length < 10) {
        helper = "00" + students.length.toString();
      } else if (students.length < 100 && students.length > 9) {
        helper = "0" + students.length.toString();
      } else {
        helper = students.length.toString();
      }

      const date = new Date();
      const components  = ["STU", date.getFullYear(), departmentHelper, helper];
      
      // Hash the password
      var username = components.join("");
      let hashedPassword;
      const newDob = dob.split("-").reverse().join("-");
      try {
        hashedPassword = await bcrypt.hash(newDob, 10);
      } catch (hashError) {
        console.error("Hashing Error:", hashError); // Log the exact error
        return res.status(500).json({ message: "Error hashing the password" });
      }
      var passwordUpdated = false;

      
      const newStudent = new Student({
        name,
        dob,
        password: hashedPassword,
        username,
        department,
        contactNumber,
        avatar,
        email,
        section,
        gender,
        batch,
        fatherName,
        motherName,
        fatherContactNumber,
        motherContactNumber,
        year,
        passwordUpdated,
      });

      await newStudent.save();
      // Generate CSRF token

      const subjects = await Subject.find({ department, year }).select('-password');
      if (subjects.length !== 0) {
        for (const subject of subjects) {
          newStudent.subjects.push(subject._id);
        }
      }
      
      await newStudent.save();
      const csrfToken = req.csrfToken(); 
      return res.status(200).json({
        success: true,
        message: "Student registered successfully",
        response: newStudent,
        csrfToken,
      });
    } catch (error) {
      console.error("Error in addStudent controller:", error);
      return res.status(500).json({ backendError: error.message });
    }
  }
];

export const getStudent = async (req, res) => {
  try {
    const { department, year, section } = req.body;
    const errors = { noStudentError: String };
const students = await Student.find({ department, year }).select('-password');
const csrfToken = req.csrfToken(); // Generate CSRF token
    if (students.length === 0) {
      errors.noStudentError = "No Student Found";
      return res.status(404).json(errors);
    }

    res.status(200).json({ result: students ,csrfToken});
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};
export const getAllStudent = async (req, res) => {
  try {
    const students = await Student.find().select('-password');;
    res.status(200).json(students);
  } catch (error) {
    console.log("Backend Error", error);
  }
};

export const getAllFaculty = async (req, res) => {
  try {
    const faculties = await Faculty.find().select('-password');
    res.status(200).json(faculties);
  } catch (error) {
    console.log("Backend Error", error);
  }
};

export const getAllAdmin = async (req, res) => {
  try {
    const admins = await Admin.find().select('-password');
    res.status(200).json(admins);
  } catch (error) {
    console.log("Backend Error", error);
  }
};
  export const getAllDepartment = async (req, res) => {
    try {
      const departments = await Department.find().select('-password');
      res.status(200).json(departments);
    } catch (error) {
      console.log("Backend Error", error);
    }
  };
export const getAllSubject = async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.status(200).json(subjects);
  } catch (error) {
    console.log("Backend Error", error);
  }
};
