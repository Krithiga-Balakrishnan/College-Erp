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
    try {
      const { data } = await api.studentUpdatePassword(formData);
      dispatch({ type: UPDATE_PASSWORD, payload: true });
      alert("Password Updated");
      navigate("/student/home");
    } catch (error) {
      dispatch({ type: SET_ERRORS, payload: error.response.data });
    }
  };

export const updateStudent = (formData) => async (dispatch) => {
  try {
    const { data } = await api.updateStudent(formData);
    dispatch({ type: UPDATE_STUDENT, payload: true });
  } catch (error) {
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
    try {
      const formData = {
        department,
        year,
        section,
      };
      const { data } = await api.getTestResult(formData);
      dispatch({ type: TEST_RESULT, payload: data });
    } catch (error) {
      dispatch({ type: SET_ERRORS, payload: error.response.data });
    }
  };

export const getAttendance =
  (department, year, section) => async (dispatch) => {
    try {
      const formData = {
        department,
        year,
        section,
      };
      const { data } = await api.getAttendance(formData);
      dispatch({ type: ATTENDANCE, payload: data });
    } catch (error) {
      dispatch({ type: SET_ERRORS, payload: error.response.data });
    }
  };
