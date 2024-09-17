import student from "../models/student.js";
import Test from "../models/test.js";
import Student from "../models/student.js";
import Department from '../models/department.js'; // Adjust the import path as necessary
import Subject from "../models/subject.js";
import Marks from "../models/marks.js";
import Attendence from "../models/attendance.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { OAuth2Client } from 'google-auth-library'; // Import Google's OAuth2 client

const client = new OAuth2Client(process.env.GOOGLE_OAUTH_CLIENT_ID); // Make sure to set GOOGLE_CLIENT_ID in your .env file

// export const studentLogin = async (req, res) => {
//   const { username, password } = req.body;
//   const errors = { usernameError: String, passwordError: String };
//   try {
//     const existingStudent = await Student.findOne({ username });
//     if (!existingStudent) {
//       errors.usernameError = "Student doesn't exist.";
//       return res.status(404).json(errors);
//     }
//     const isPasswordCorrect = await bcrypt.compare(
//       password,
//       existingStudent.password
//     );
//     if (!isPasswordCorrect) {
//       errors.passwordError = "Invalid Credentials";
//       return res.status(404).json(errors);
//     }

//     const token = jwt.sign(
//       {
//         email: existingStudent.email,
//         id: existingStudent._id,
//       },
//       "sEcReT",
//       { expiresIn: "1h" }
//     );

//     res.status(200).json({ result: existingStudent, token: token });
//   } catch (error) {
//     console.log(error);
//   }
// };

export const studentLogin = async (req, res) => {
  const { googleCredential, username, password } = req.body;
  
  try {
    if (googleCredential) {
      // Verify the Google credential
      const ticket = await client.verifyIdToken({
        idToken: googleCredential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const googleData = ticket.getPayload();
      const { email, name, picture } = googleData;

      // Fetch or create student in the database
      let existingStudent = await Student.findOne({ email });
      
      if (!existingStudent) {
        const existingDepartment = await Department.findOne({ department: 'General' });
    let departmentHelper = existingDepartment ? existingDepartment.departmentCode : '000';
    const currentYear = new Date().getFullYear();

    // Generate username
    const lastStudent = await Student.findOne({ department: 'General' }).sort({ _id: -1 });
    const lastIdNumber = lastStudent ? parseInt(lastStudent.username.slice(-3)) : 0;
    const newIdNumber = lastIdNumber + 1;
    const helper = String(newIdNumber).padStart(3, '0'); // Helper for padding
    const newUsername = `STU${currentYear}${departmentHelper}${helper}`;

    // Create a new student with default required fields
    const defaultData = {
        email,
        name,
        avatar: picture || null,
        dob: '2000-01-01',
        section: 'A',
        department: 'General',
        year: 1,
        username: newUsername,
        password: await bcrypt.hash('default_password', 10), // Hash the default password
        passwordUpdated: false // Set it to false for first-time user
    };

    // Create the new student
    existingStudent = await Student.create(defaultData); // Assign created student to existingStudent
}

// Generate a JWT token for the session
const token = jwt.sign(
    { email: existingStudent.email, id: existingStudent._id },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
);

return res.status(200).json({ result: existingStudent, token });

    } else if (username && password) {
      const errors = { usernameError: null, passwordError: null };
      
      const existingStudent = await Student.findOne({ username });
      if (!existingStudent) {
        errors.usernameError = "Student doesn't exist.";
        return res.status(404).json(errors);
      }

      const isPasswordCorrect = await bcrypt.compare(password, existingStudent.password);
      if (!isPasswordCorrect) {
        errors.passwordError = "Invalid Credentials";
        return res.status(401).json(errors); // Changed status to 401 for invalid credentials
      }

      // Generate JWT token for traditional login
      const token = jwt.sign(
        { email: existingStudent.email, id: existingStudent._id },
        process.env.JWT_SECRET, // Use the environment variable for JWT secret
        { expiresIn: '1h' }
      );

      return res.status(200).json({ result: existingStudent, token });
    } else {
      return res.status(400).json({ message: 'Invalid login attempt.' });
    }
  } catch (error) {
    console.error('Error during student login:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};


export const updatedPassword = async (req, res) => {
  try {
    const { newPassword, confirmPassword, email } = req.body;
    const errors = { mismatchError: String };
    if (newPassword !== confirmPassword) {
      errors.mismatchError =
        "Your password and confirmation password do not match";
      return res.status(400).json(errors);
    }

    const student = await Student.findOne({ email });
    let hashedPassword;
    hashedPassword = await bcrypt.hash(newPassword, 10);
    student.password = hashedPassword;
    await student.save();
    if (student.passwordUpdated === false) {
      student.passwordUpdated = true;
      await student.save();
    }

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
      response: student,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const updateStudent = async (req, res) => {
  try {
    const {
      name,
      dob,
      department,
      contactNumber,
      avatar,
      email,
      batch,
      section,
      year,
      fatherName,
      motherName,
      fatherContactNumber,
    } = req.body;
    const updatedStudent = await Student.findOne({ email });
    if (name) {
      updatedStudent.name = name;
      await updatedStudent.save();
    }
    if (dob) {
      updatedStudent.dob = dob;
      await updatedStudent.save();
    }
    if (department) {
      updatedStudent.department = department;
      await updatedStudent.save();
    }
    if (contactNumber) {
      updatedStudent.contactNumber = contactNumber;
      await updatedStudent.save();
    }
    if (batch) {
      updatedStudent.batch = batch;
      await updatedStudent.save();
    }
    if (section) {
      updatedStudent.section = section;
      await updatedStudent.save();
    }
    if (year) {
      updatedStudent.year = year;
      await updatedStudent.save();
    }
    if (motherName) {
      updatedStudent.motherName = motherName;
      await updatedStudent.save();
    }
    if (fatherName) {
      updatedStudent.fatherName = fatherName;
      await updatedStudent.save();
    }
    if (fatherContactNumber) {
      updatedStudent.fatherContactNumber = fatherContactNumber;
      await updatedStudent.save();
    }
    if (avatar) {
      updatedStudent.avatar = avatar;
      await updatedStudent.save();
    }
    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const testResult = async (req, res) => {
  try {
    const { department, year, section } = req.body;
    const errors = { notestError: String };
    const student = await Student.findOne({ department, year, section });
    const test = await Test.find({ department, year, section });
    if (test.length === 0) {
      errors.notestError = "No Test Found";
      return res.status(404).json(errors);
    }
    var result = [];
    for (var i = 0; i < test.length; i++) {
      var subjectCode = test[i].subjectCode;
      var subject = await Subject.findOne({ subjectCode });
      var marks = await Marks.findOne({
        student: student._id,
        exam: test[i]._id,
      });
      if (marks) {
        var temp = {
          marks: marks.marks,
          totalMarks: test[i].totalMarks,
          subjectName: subject.subjectName,
          subjectCode,
          test: test[i].test,
        };

        result.push(temp);
      }
    }

    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const attendance = async (req, res) => {
  try {
    const { department, year, section } = req.body;
    const errors = { notestError: String };
    const student = await Student.findOne({ department, year, section });

    const attendence = await Attendence.find({
      student: student._id,
    }).populate("subject");
    if (!attendence) {
      res.status(400).json({ message: "Attendence not found" });
    }

    res.status(200).json({
      result: attendence.map((att) => {
        let res = {};
        res.percentage = (
          (att.lectureAttended / att.totalLecturesByFaculty) *
          100
        ).toFixed(2);
        res.subjectCode = att.subject.subjectCode;
        res.subjectName = att.subject.subjectName;
        res.attended = att.lectureAttended;
        res.total = att.totalLecturesByFaculty;
        return res;
      }),
    });
  } catch (error) {
    res.status(500).json(error);
  }
};
