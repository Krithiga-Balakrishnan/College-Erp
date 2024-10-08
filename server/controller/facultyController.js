import Faculty from "../models/faculty.js";
import Test from "../models/test.js";
import Student from "../models/student.js";
import Subject from "../models/subject.js";
import Marks from "../models/marks.js";
import Attendence from "../models/attendance.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import csrfProtection from "../middleware/csrfMiddleware.js";
import mongoose from 'mongoose';
import { body, validationResult } from "express-validator";

export const facultyLogin = [
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

      const existingFaculty = await Faculty.findOne({ username });
      if (!existingFaculty) {
        errorsResponse.usernameError = "Faculty doesn't exist.";
        return res.status(404).json(errorsResponse);
      }

      const isPasswordCorrect = await bcrypt.compare(password, existingFaculty.password);
      if (!isPasswordCorrect) {
        errorsResponse.passwordError = "Invalid Credentials";
        return res.status(404).json(errorsResponse);
      }
      const csrfToken = req.csrfToken();
      console.log('Generated CSRF Token:', csrfToken); // Log the generated toke
  
      const token = jwt.sign(
        {
          email: existingFaculty.email,
          id: existingFaculty._id,
          role: 'faculty'
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.status(200).json({ result: existingFaculty, token,  csrfToken  });
    } catch (error) {
      console.log(error);
      res.status(500).json({ backendError: error.message });
    }
  },
];


export const updatedPassword = async (req, res) => {
  try {
    const { newPassword, confirmPassword, email } = req.body;
    const errors = { mismatchError: String };
    if (newPassword !== confirmPassword) {
      errors.mismatchError =
        "Your password and confirmation password do not match";
      return res.status(400).json(errors);
    }

    const faculty = await Faculty.findOne({ email }).select('-password');
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(newPassword, 10);
    } catch (hashError) {
      return res.status(500).json({ message: "Error hashing the password" });
    }
    faculty.password = hashedPassword;
    await faculty.save();
    const csrfToken = req.csrfToken(); // Generate CSRF token
    if (faculty.passwordUpdated === false) {
      faculty.passwordUpdated = true;
      await faculty.save();
      const csrfToken = req.csrfToken(); // Generate CSRF token

    }

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
      response: faculty,
      csrfToken,
    });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};

export const updateFaculty = [
  // Apply trim and escape for sanitization
  body('name').optional().trim().escape(),
  body('dob').optional().trim().escape(),
  body('department').optional().trim().escape(),
  body('contactNumber').optional().trim().escape(),
  body('avatar').optional().trim().escape(),
  body('email').optional().trim().escape(),
  body('designation').optional().trim().escape(),

  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, dob, department, contactNumber, avatar, email, designation } = req.body;

      // Find the faculty by email
      const updatedFaculty = await Faculty.findOne({ email }).select('-password');
      if (!updatedFaculty) {
        return res.status(404).json({ error: "Faculty not found" });
      }

      // Only update the fields provided in the request
      if (name) updatedFaculty.name = name;
      if (dob) updatedFaculty.dob = dob;
      if (department) updatedFaculty.department = department;
      if (contactNumber) updatedFaculty.contactNumber = contactNumber;
      if (avatar) updatedFaculty.avatar = avatar;
      if (designation) updatedFaculty.designation = designation;

      // Save the updated faculty information
      await updatedFaculty.save();
      const csrfToken = req.csrfToken(); // Generate CSRF token

      res.status(200).json({
        message: "Faculty updated successfully",
        updatedFaculty,
        csrfToken,
      });
    } catch (error) {
      const errors = { backendError: error.message };
      res.status(500).json(errors);
    }
  }
];

export const createTest = [
  // Apply trim and escape for sanitization
  body('subjectCode').trim().escape(),
  body('department').trim().escape(),
  body('year').trim().escape(),
  body('section').trim().escape(),
  body('date').trim().escape(),
  body('test').trim().escape(),
  body('totalMarks').trim().escape(),

  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { subjectCode, department, year, section, date, test, totalMarks } = req.body;
      const testErrors = { testError: String };

      // Check if the test already exists
      const existingTest = await Test.findOne({
        subjectCode,
        department,
        year,
        section,
        test,
      }).select('-password');
      if (existingTest) {
        testErrors.testError = "Given Test is already created";
        return res.status(400).json(testErrors);
      }

      // Create a new test
      const newTest = new Test({
        totalMarks,
        section,
        test,
        date,
        department,
        subjectCode,
        year,
      });

      // Save the new test
      await newTest.save();
      const csrfToken = req.csrfToken(); // Generate CSRF token

      return res.status(200).json({
        success: true,
        message: "Test added successfully",
        response: newTest,
        csrfToken,
      });
    } catch (error) {
      const errors = { backendError: error.message };
      res.status(500).json(errors);
    }
  }
];

export const getTest = async (req, res) => {
  try {
    const { department, year, section } = req.body;

    const tests = await Test.find({ department, year, section });
    const csrfToken = req.csrfToken(); // Generate CSRF token

    res.status(200).json({ result: tests, csrfToken });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};

export const getStudent = async (req, res) => {
  try {
    const { department, year, section } = req.body;
    const errors = { noStudentError: String };
const students = await Student.find({ department, year, section }).select('-password');
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

export const uploadMarks = async (req, res) => {
  try {
    const { department, year, section, test, marks } = req.body;

    const errors = { examError: String };
    const existingTest = await Test.findOne({
      department,
      year,
      section,
      test,
    });
    const isAlready = await Marks.find({
      exam: existingTest._id,
    });

    if (isAlready.length !== 0) {
      errors.examError = "You have already uploaded marks of given exam";
      return res.status(400).json(errors);
    }

     // Ensure marks is an array and its length is reasonable
     if (!Array.isArray(marks) || marks.length === 0 || marks.length > 1000) {
      return res.status(400).json({ message: "Invalid input: marks must be an array with at most 1000 items." });
    }


    for (var i = 0; i < marks.length; i++) {
      console.log(`Processed DOB: ${marks[i]._id}`);
      console.log(`Processed DOB: ${marks[i].value}`);
      // Validate studentId and marks value
      if (!mongoose.Types.ObjectId.isValid(marks[i]._id)) {
        console.log(`Processed DOB: In`);
        return res.status(400).json({ message: `Invalid data for student at index ${i}.` });
      }

      const newMarks = await new Marks({
        student: marks[i]._id,
        exam: existingTest._id,
        marks: marks[i].value,
      });
      await newMarks.save();
    }
    const csrfToken = req.csrfToken();
    console.log("CSRF Token generated:", csrfToken);
    res.status(200).json({ message: "Marks uploaded successfully" ,csrfToken});
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};

export const markAttendance = async (req, res) => {
  try {
    const { selectedStudents, subjectName, department, year, section } =
      req.body;

    const sub = await Subject.findOne({ subjectName });

    const allStudents = await Student.find({ department, year, section }).select('-password');

    for (let i = 0; i < allStudents.length; i++) {
      const pre = await Attendence.findOne({
        student: allStudents[i]._id,
        subject: sub._id,
      }).select('-password');
      if (!pre) {
        const attendence = new Attendence({
          student: allStudents[i]._id,
          subject: sub._id,
        });
        attendence.totalLecturesByFaculty += 1;
        await attendence.save();
      } else {
        pre.totalLecturesByFaculty += 1;
        await pre.save();
      }
    }

    // Validate selectedStudents input
    if (!Array.isArray(selectedStudents) || selectedStudents.length === 0 || selectedStudents.length > 1000) {
      return res.status(400).json({ message: "Invalid input: selectedStudents must be a non-empty array with at most 1000 items." });
    }

    for (var a = 0; a < selectedStudents.length; a++) {
      
      // Validate selectedStudents input
      if (!Array.isArray(selectedStudents) || selectedStudents.length === 0 || selectedStudents.length > 1000) {
        return res.status(400).json({ message: "Invalid input: selectedStudents must be a non-empty array with at most 1000 items." });
      }

      const pre = await Attendence.findOne({
        student: selectedStudents[a],
        subject: sub._id,
      }).select('-password');
      if (!pre) {
        const attendence = new Attendence({
          student: selectedStudents[a],
          subject: sub._id,
        });

        attendence.lectureAttended += 1;
        await attendence.save();
      } else {
        pre.lectureAttended += 1;
        await pre.save();
      }
    }
    const csrfToken = req.csrfToken(); 
    res.status(200).json({ message: "Attendance Marked successfully",csrfToken, });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};
