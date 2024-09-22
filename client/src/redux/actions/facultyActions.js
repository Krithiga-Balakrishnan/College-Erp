import {
  SET_ERRORS,
  FACULTY_LOGIN,
  UPDATE_PASSWORD,
  UPDATE_FACULTY,
  ADD_TEST,
  GET_TEST,
  GET_STUDENT,
  MARKS_UPLOADED,
  ATTENDANCE_MARKED,
} from "../actionTypes";
import * as api from "../api";
import axios from '../../utils/axiosInstance'; // Adjust the path as necessary

export const facultySignIn = (formData, navigate) => async (dispatch) => {
  try {
    const { data } = await api.facultySignIn(formData);


        // Decode the token to extract the role from it
        const tokenPayload = JSON.parse(atob(data.token.split('.')[1])); // Decode JWT payload
        console.log('Decoded JWT Token:', tokenPayload); // You should see the role here
    
        // Store the entire user data including token
        localStorage.setItem('user', JSON.stringify(data));
    
        // Log the role
        console.log('User Role:', tokenPayload.role); // Ensure role is present

        
    dispatch({ type: FACULTY_LOGIN, data });
    if (data.result.passwordUpdated) navigate("/faculty/home");
    else navigate("/faculty/password");
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response.data });
  }
};

export const facultyUpdatePassword =
  (formData, navigate) => async (dispatch) => {
    try {
      const { data } = await api.facultyUpdatePassword(formData);
      dispatch({ type: UPDATE_PASSWORD, payload: true });
      alert("Password Updated");
      navigate("/faculty/home");
    } catch (error) {
      dispatch({ type: SET_ERRORS, payload: error.response.data });
    }
  };

export const updateFaculty = (formData) => async (dispatch) => {
  try {
    const { data } = await api.updateFaculty(formData);
    dispatch({ type: UPDATE_FACULTY, payload: true });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response.data });
  }
};

export const createTest = (formData) => async (dispatch) => {
  try {
    const { data } = await api.createTest(formData);
    alert("Test Created Successfully");

    dispatch({ type: ADD_TEST, payload: true });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response.data });
  }
};

export const getTest = (formData) => async (dispatch) => {
  try {
    const { data } = await api.getTest(formData);
    dispatch({ type: GET_TEST, payload: data });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response.data });
  }
};

export const getStudent = (formData) => async (dispatch) => {
  try {
    const { data } = await api.getMarksStudent(formData);
    dispatch({ type: GET_STUDENT, payload: data });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response.data });
  }
};

export const uploadMark =
  (marks, department, section, year, test) => async (dispatch) => {
    try {
      const formData = {
        marks,
        department,
        section,
        year,
        test,
      };
      const { data } = await api.uploadMarks(formData);
      alert("Marks Uploaded Successfully");
      dispatch({ type: MARKS_UPLOADED, payload: true });
    } catch (error) {
      dispatch({ type: SET_ERRORS, payload: error.response.data });
    }
  };

export const markAttendance =
  (checkedValue, subjectName, department, year, section) =>
  async (dispatch) => {
    const csrfToken = localStorage.getItem('csrfToken'); // Get the CSRF token
    const user = JSON.parse(localStorage.getItem('user')); // Retrieve the user object from local storage
    const token = user?.token; // Extract the JWT token from the user object
    
    if (!token) {
      console.error("JWT token not found in local storage");
      return;
    }
    try {
      const formData = {
        selectedStudents: checkedValue,
        subjectName,
        department,
        year,
        section,
      };
      const { data } = await axios.post("/api/faculty/markattendance",formData, {
        headers: {
          'X-CSRF-Token': csrfToken, // Include CSRF token
          Authorization: `Bearer ${token}`, // Include JWT token
        },
        withCredentials: true // Important for sending cookies
      });
  
      // Update CSRF token in localStorage if included in response
      if (data.csrfToken) {
        localStorage.setItem('csrfToken', data.csrfToken);
      }  
      alert("Attendance Marked Successfully");
      dispatch({ type: ATTENDANCE_MARKED, payload: true });
    } catch (error) {
      const errorMessage = error.response?.data || { message: "An error occurred" };
      console.error("Error in markAttendance:", errorMessage); // Log the error for debugging  
      dispatch({ type: SET_ERRORS, payload: error.response.data });
    }
  };
