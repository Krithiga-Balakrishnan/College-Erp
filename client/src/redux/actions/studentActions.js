import {
  SET_ERRORS,
  UPDATE_PASSWORD,
  TEST_RESULT,
  STUDENT_LOGIN,
  ATTENDANCE,
  UPDATE_STUDENT,
  GET_SUBJECT,
} from "../actionTypes";
import * as api from "../api";
import axios from '../../utils/axiosInstance'; // Adjust the path as necessary

export const studentSignIn = (formData, navigate) => async (dispatch) => {
  try {
    const { data } = await api.studentSignIn(formData);
    // Decode the token to extract the role from it
    const tokenPayload = JSON.parse(atob(data.token.split('.')[1])); // Decode JWT payload
    console.log('Decoded JWT Token:', tokenPayload); // You should see the role here

    // Store the entire user data including token
    localStorage.setItem('user', JSON.stringify(data));

    // Log the role
    console.log('User Role:', tokenPayload.role); // Ensure role is present
    dispatch({ type: STUDENT_LOGIN, data });
    if (data.result.passwordUpdated) navigate("/student/home");
    else navigate("/student/password");
  } catch (error) {
    console.error("Error during student sign-in:", error.response?.data || error.message); // Log error
    dispatch({ type: SET_ERRORS, payload: error.response?.data || { message: "Authentication failed" } });
  }
};

export const studentUpdatePassword =
  (formData, navigate) => async (dispatch) => {
    const csrfToken = localStorage.getItem('csrfToken'); // Get the CSRF token
    const user = JSON.parse(localStorage.getItem('user')); // Retrieve the user object from local storage
    const token = user?.token; // Extract the JWT token from the user object
    
    if (!token) {
      console.error("JWT token not found in local storage");
      return;
    }
    try {
      const { data } = await axios.post("/api/student/updatepassword",formData, {
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
      dispatch({ type: UPDATE_PASSWORD, payload: true });
      alert("Password Updated");
      navigate("/student/home");
    } catch (error) {
      const errorMessage = error.response?.data || { message: "An error occurred" };
      console.error("Error in updatePassword:", errorMessage); // Log the error for debugging    
      dispatch({ type: SET_ERRORS, payload: error.response.data });
    }
  };

export const updateStudent = (formData) => async (dispatch) => {
  const csrfToken = localStorage.getItem('csrfToken'); // Get the CSRF token
    const user = JSON.parse(localStorage.getItem('user')); // Retrieve the user object from local storage
    const token = user?.token; // Extract the JWT token from the user object
    
    if (!token) {
      console.error("JWT token not found in local storage");
      return;
    }
  try {
    const { data } = await axios.post("/api/student/updateprofile", formData, {
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
    dispatch({ type: UPDATE_STUDENT, payload: true });
  } catch (error) {
    const errorMessage = error.response?.data || { message: "An error occurred" };
    console.error("Error in updateStudent:", errorMessage); // Log the error for debugging  
    dispatch({ type: SET_ERRORS, payload: error.response.data });
  }
};

export const getSubject = (department, year) => async (dispatch) => {
  try {
    const formData = {
      department,
      year,
    };
    const { data } = await api.getSubject(formData);
    dispatch({ type: GET_SUBJECT, payload: data });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response.data });
  }
};

export const getTestResult =
  (department, year, section) => async (dispatch) => {
    const csrfToken = localStorage.getItem('csrfToken'); // Get the CSRF token
    const user = JSON.parse(localStorage.getItem('user')); // Retrieve the user object from local storage
    const token = user?.token; // Extract the JWT token from the user object
    
    if (!token) {
      console.error("JWT token not found in local storage");
      return;
    }
    try {
      const formData = {
        department,
        year,
        section,
      };
      const { data } = await axios.post("/api/student/testresult",formData, {
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
      dispatch({ type: TEST_RESULT, payload: data });
    } catch (error) {
      dispatch({ type: SET_ERRORS, payload: error.response.data });
    }
  };

export const getAttendance =
  (department, year, section) => async (dispatch) => {
    const csrfToken = localStorage.getItem('csrfToken'); // Get the CSRF token
    const user = JSON.parse(localStorage.getItem('user')); // Retrieve the user object from local storage
    const token = user?.token; // Extract the JWT token from the user object
    
    if (!token) {
      console.error("JWT token not found in local storage");
      return;
    }
    try {
      const formData = {
        department,
        year,
        section,
      };
      const { data } = await axios.post("/api/student/attendance",formData, {
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
      dispatch({ type: ATTENDANCE, payload: data });
    } catch (error) {
      const errorMessage = error.response?.data || { message: "An error occurred" };
      console.error("Error in getAttendance:", errorMessage); // Log the error for debugging  
      dispatch({ type: SET_ERRORS, payload: error.response.data });
    }
  };
