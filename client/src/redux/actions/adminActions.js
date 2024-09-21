import {
  ADMIN_LOGIN,
  UPDATE_ADMIN,
  ADD_ADMIN,
  ADD_DEPARTMENT,
  ADD_FACULTY,
  GET_ALL_FACULTY,
  ADD_SUBJECT,
  ADD_STUDENT,
  GET_ALL_STUDENT,
  GET_FACULTY,
  GET_SUBJECT,
  GET_STUDENT,
  GET_ALL_ADMIN,
  GET_ALL_DEPARTMENT,
  SET_ERRORS,
  UPDATE_PASSWORD,
  GET_ALL_SUBJECT,
  DELETE_ADMIN,
  DELETE_DEPARTMENT,
  DELETE_FACULTY,
  DELETE_STUDENT,
  DELETE_SUBJECT,
  CREATE_NOTICE,
  GET_NOTICE,
} from "../actionTypes";
import * as api from "../api";
import axios from '../../utils/axiosInstance'; // Adjust the path as necessary

export const adminSignIn = (formData, navigate) => async (dispatch) => {
  try {
    const { data } = await api.adminSignIn(formData);
    // Decode the token to extract the role from it
    const tokenPayload = JSON.parse(atob(data.token.split('.')[1])); // Decode JWT payload
    console.log('Decoded JWT Token:', tokenPayload); // You should see the role here

    // Store the entire user data including token
    localStorage.setItem('user', JSON.stringify({ ...data, token: data.token }));

    // Log the role
    console.log('User Role:', tokenPayload.role); // Ensure role is present
    console.log('Login Response:', data);
    dispatch({ type: ADMIN_LOGIN, data });
    if (data.result.passwordUpdated) navigate("/admin/home");
    else navigate("/admin/update/password");
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response.data });
  }
};

export const adminUpdatePassword = (formData, navigate) => async (dispatch) => {
  const csrfToken = localStorage.getItem('csrfToken'); // Get the CSRF token
  const user = JSON.parse(localStorage.getItem('user')); // Retrieve the user object from local storage
  const token = user?.token; // Extract the JWT token from the user object
  
  if (!token) {
    console.error("JWT token not found in local storage");
    return;
  }
  try {
    const { data } = await axios.post('/api/admin/updatepassword', formData, {
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
    navigate("/admin/home");
  } catch (error) {
    const errorMessage = error.response?.data || { message: "An error occurred" };
    console.error("Error in updatePassword:", errorMessage); // Log the error for debugging
    dispatch({ type: SET_ERRORS, payload: error.response.data });
  }
};

export const getAllStudent = () => async (dispatch) => {
  try {
    const { data } = await api.getAllStudent();
    dispatch({ type: GET_ALL_STUDENT, payload: data });
  } catch (error) {
    console.log("Redux Error", error);
  }
};
export const getAllFaculty = () => async (dispatch) => {
  try {
    const { data } = await api.getAllFaculty();
    dispatch({ type: GET_ALL_FACULTY, payload: data });
  } catch (error) {
    console.log("Redux Error", error);
  }
};
export const getAllAdmin = () => async (dispatch) => {
  try {
    const { data } = await api.getAllAdmin();
    dispatch({ type: GET_ALL_ADMIN, payload: data });
  } catch (error) {
    console.log("Redux Error", error);
  }
};

export const getAllDepartment = () => async (dispatch) => {
  try {
    console.log('Decoded departments:'); 
    const { data } = await api.getAllDepartment();
    dispatch({ type: GET_ALL_DEPARTMENT, payload: data });
  } catch (error) {
    console.log("Redux Error", error);
  }
};

export const getAllSubject = () => async (dispatch) => {
  try {
    const { data } = await api.getAllSubject();
    dispatch({ type: GET_ALL_SUBJECT, payload: data });
  } catch (error) {
    console.log("Redux Error", error);
  }
};

export const updateAdmin = (formData) => async (dispatch) => {
  try {
    const { data } = await api.updateAdmin(formData);
    dispatch({ type: UPDATE_ADMIN, payload: true });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response.data });
  }
};

// export const addAdmin = (formData) => async (dispatch) => {
//   const csrfToken = localStorage.getItem('csrfToken');
//   try {
//     // Use the axios instance that automatically adds the CSRF token
//     const { data } = await axios.post('/api/admin/addadmin', formData, csrfToken);
//     alert("Admin Added Successfully");
//     dispatch({ type: ADD_ADMIN, payload: true });
//   } catch (error) {
//     // Check if the error response is available and dispatch accordingly
//     const errorMessage = error.response?.data || { message: "An error occurred" };
//     dispatch({ type: SET_ERRORS, payload: errorMessage });
//   }
// };
export const addAdmin = (formData) => async (dispatch) => {
  const csrfToken = localStorage.getItem('csrfToken'); // Get the CSRF token
  const user = JSON.parse(localStorage.getItem('user')); // Retrieve the user object from local storage
  const token = user?.token; // Extract the JWT token from the user object  
  if (!token) {
    console.error("JWT token not found in local storage");
    return;
  }
  try {
    // Ensure you pass headers in the third argument as an object
    const { data } = await axios.post('/api/admin/addadmin', formData, {
      headers: {
        'X-CSRF-Token': csrfToken, // Include CSRF token
        Authorization: `Bearer ${token}`, // Include JWT token
      },
      withCredentials: true // Important for sending cookies
    });
    alert("Admin Added Successfully");
    dispatch({ type: ADD_ADMIN, payload: true });
  } catch (error) {
    // Handle errors properly
    const errorMessage = error.response?.data || { message: "An error occurred" };
    dispatch({ type: SET_ERRORS, payload: errorMessage });
  }
};
export const createNotice = (formData) => async (dispatch) => {
  const csrfToken = localStorage.getItem('csrfToken'); // Get the CSRF token
  const user = JSON.parse(localStorage.getItem('user')); // Retrieve the user object from local storage
  const token = user?.token; // Extract the JWT token from the user object
  
  if (!token) {
    console.error("JWT token not found in local storage");
    return;
  }
  try {
    const { data } = await  axios.post('/api/admin/createNotice',formData, {
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
    alert("Notice Created Successfully");
    dispatch({ type: CREATE_NOTICE, payload: true });
  } catch (error) {
    const errorMessage = error.response?.data || { message: "An error occurred" };
    console.error("Error in addCreateNotice:", errorMessage); // Log the error for debugging
    dispatch({ type: SET_ERRORS, payload: error.response.data });
  }
};
export const getAdmin = (formData) => async (dispatch) => {
  const csrfToken = localStorage.getItem('csrfToken'); // Get the CSRF token
  const user = JSON.parse(localStorage.getItem('user')); // Retrieve the user object from local storage
  const token = user?.token; // Extract the JWT token from the user object
  
  if (!token) {
    console.error("JWT token not found in local storage");
    return;
  }
  try {
    const { data } = await axios.post("/api/admin/getadmin",formData, {
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
    dispatch({ type: GET_STUDENT, payload: data });
  } catch (error) {
    const errorMessage = error.response?.data || { message: "An error occurred" };
    console.error("Error in getAdmin:", errorMessage); // Log the error for debugging
    dispatch({ type: SET_ERRORS, payload: error.response.data });
  }
};
export const deleteAdmin = (formData) => async (dispatch) => {
  try {
    const { data } = await api.deleteAdmin(formData);
    alert("Admin Deleted");
    dispatch({ type: DELETE_ADMIN, payload: true });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response.data });
  }
};
export const deleteFaculty = (formData) => async (dispatch) => {
  try {
    const { data } = await api.deleteFaculty(formData);
    alert("Faculty Deleted");
    dispatch({ type: DELETE_FACULTY, payload: true });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response.data });
  }
};
export const deleteStudent = (formData) => async (dispatch) => {
  try {
    const { data } = await api.deleteStudent(formData);
    alert("Student Deleted");
    dispatch({ type: DELETE_STUDENT, payload: true });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response.data });
  }
};
export const deleteSubject = (formData) => async (dispatch) => {
  try {
    const { data } = await api.deleteSubject(formData);
    alert("Subject Deleted");
    dispatch({ type: DELETE_SUBJECT, payload: true });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response.data });
  }
};
export const deleteDepartment = (formData) => async (dispatch) => {
  try {
    const { data } = await api.deleteDepartment(formData);
    alert("Department Deleted");
    dispatch({ type: DELETE_DEPARTMENT, payload: true });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response.data });
  }
};
export const addDepartment = (formData) => async (dispatch) => {
  const csrfToken = localStorage.getItem('csrfToken'); // Get the CSRF token
  const user = JSON.parse(localStorage.getItem('user')); // Retrieve the user object from local storage
  const token = user?.token; // Extract the JWT token from the user object
  
  if (!token) {
    console.error("JWT token not found in local storage");
    return;
  }
  try {
    const { data } = await axios.post('/api/admin/adddepartment',formData, {
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
    alert("Department Added Successfully");
    dispatch({ type: ADD_DEPARTMENT, payload: true });
  } catch (error) {
    const errorMessage = error.response?.data || { message: "An error occurred" };
    console.error("Error in addDepartment:", errorMessage); // Log the error for debugging
    dispatch({ type: SET_ERRORS, payload: error.response.data });
  }
};

export const addFaculty = (formData) => async (dispatch) => {
  const csrfToken = localStorage.getItem('csrfToken'); // Get the CSRF token
  const user = JSON.parse(localStorage.getItem('user')); // Retrieve the user object from local storage
  const token = user?.token; // Extract the JWT token from the user object
  
  if (!token) {
    console.error("JWT token not found in local storage");
    return;
  }
  try {
    const { data } = await api.addFaculty(formData, {
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
    alert("Faculty Added Successfully");
    dispatch({ type: ADD_FACULTY, payload: true });
  } catch (error) {
    const errorMessage = error.response?.data || { message: "An error occurred" };
    console.error("Error in addFaculty:", errorMessage); // Log the error for debugging
    dispatch({ type: SET_ERRORS, payload: error.response.data });
  }
};

export const getFaculty = (department) => async (dispatch) => {
  try {
    const { data } = await api.getFaculty(department);
    dispatch({ type: GET_FACULTY, payload: data });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response.data });
  }
};

export const addSubject = (formData) => async (dispatch) => {
  const csrfToken = localStorage.getItem('csrfToken'); // Get the CSRF token
  const user = JSON.parse(localStorage.getItem('user')); // Retrieve the user object from local storage
  const token = user?.token; // Extract the JWT token from the user object
  
  if (!token) {
    console.error("JWT token not found in local storage");
    return;
  }
  try {
   // const { data } = await api.addSubject(formData);
   const { data } = await axios.post('/api/admin/addsubject',formData, {
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
    alert("Subject Added Successfully");
    dispatch({ type: ADD_SUBJECT, payload: true });
  } catch (error) {
    const errorMessage = error.response?.data || { message: "An error occurred" };
    console.error("Error in addSubject:", errorMessage); // Log the error for debugging
    dispatch({ type: SET_ERRORS, payload: error.response.data });
  }
};

export const getSubject = (formData) => async (dispatch) => {
  try {
    const { data } = await api.getSubject(formData);
    dispatch({ type: GET_SUBJECT, payload: data });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response.data });
  }
};

export const addStudent = (formData) => async (dispatch) => {
  const csrfToken = localStorage.getItem('csrfToken'); // Get the CSRF token
  const user = JSON.parse(localStorage.getItem('user')); // Retrieve the user object from local storage
  const token = user?.token; // Extract the JWT token from the user object
  
  if (!token) {
    console.error("JWT token not found in local storage");
    return;
  }

  try {
    const { data } = await axios.post('/api/admin/addstudent', formData, {
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

    alert("Student Added Successfully");
    dispatch({ type: ADD_STUDENT, payload: true });
  } catch (error) {
    const errorMessage = error.response?.data || { message: "An error occurred" };
    console.error("Error in addStudent:", errorMessage); // Log the error for debugging
    dispatch({ type: SET_ERRORS, payload: errorMessage });
  }
};


export const getStudent = (formData) => async (dispatch) => {
  try {
    const { data } = await api.getStudent(formData);
    dispatch({ type: GET_STUDENT, payload: data });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response.data });
  }
};

export const getNotice = (formData) => async (dispatch) => {
   const csrfToken = localStorage.getItem('csrfToken');
  const user = JSON.parse(localStorage.getItem('user')); 
  const token = user?.token; // Ensure the JWT token is retrieved

  if (!token) {
    console.error("JWT token not found in local storage");
    return;
  }
//   try {
//     const { data } = await api.getNotice(formData);
//     dispatch({ type: GET_NOTICE, payload: data });
//   } catch (error) {
//     dispatch({ type: SET_ERRORS, payload: error.response.data });
//   }
// };
try {
  const { data } = await axios.post("/api/admin/getnotice", formData, {
    headers: {
      'X-CSRF-Token': csrfToken, // Include CSRF token
      Authorization: `Bearer ${token}`, // Include JWT token for authorization
    },
    withCredentials: true, // Include credentials (cookies)
  });

  dispatch({ type: GET_NOTICE, payload: data });
} catch (error) {
  const errorMessage = error.response?.data || { message: "An error occurred" };
  dispatch({ type: SET_ERRORS, payload: errorMessage });
}
};
