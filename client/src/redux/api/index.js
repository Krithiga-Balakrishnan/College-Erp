import axios from "../../utils/axiosInstance";

// const API = axios.create({ baseURL: process.env.REACT_APP_SERVER_URL });
const API = axios.create({ baseURL: "http://localhost:5001/" });

API.interceptors.request.use((req) => {
  if (localStorage.getItem("user")) {
    req.headers.Authorization = `Bearer ${
      JSON.parse(localStorage.getItem("user")).token
    }`;
  }
  return req;
});

// Admin

export const adminSignIn = (formData) => API.post("/api/admin/login", formData, { withCredentials: true });

export const adminUpdatePassword = (updatedPassword) =>{
  const csrfToken = localStorage.getItem('csrfToken'); 
  return API.post("/api/admin/updatepassword", updatedPassword, {
    headers: {
      'X-CSRF-Token': csrfToken // Include CSRF token in the request
    },
    withCredentials: true // Important for sending cookies
  });
};

export const getAllStudent = () => API.get("/api/admin/getallstudent");

export const getAllFaculty = () => {
  const csrfToken = localStorage.getItem('csrfToken'); // Get the CSRF token
  //const authToken = localStorage.getItem('authtoken'); // Get the Auth token
  return API.get("/api/admin/getallfaculty", {
    headers: {
      'X-CSRF-Token': csrfToken, // Include CSRF token
    },
    withCredentials: true // Important for sending cookies
  });
};

export const getAllAdmin = () => API.get("/api/admin/getalladmin");

export const getAllDepartment = () => API.get("/api/admin/getalldepartment");
export const getAllSubject = () => {
  const csrfToken = localStorage.getItem('csrfToken'); // Get the CSRF token
  return API.get("/api/admin/getallsubject", {
    headers: {
      'X-CSRF-Token': csrfToken // Include CSRF token in the request
    },
    withCredentials: true // Important for sending cookies
  });
};

export const updateAdmin = (updatedAdmin) =>
  API.post("/api/admin/updateprofile", updatedAdmin);

export const addAdmin = (admin) =>{
  const csrfToken = localStorage.getItem('csrfToken'); // Get the CSRF token
  return API.post("/api/admin/addadmin", admin, {
    headers: {
      'X-CSRF-Token': csrfToken // Include CSRF token in the request
    },
    withCredentials: true // Important for sending cookies
  });
};
export const createNotice = (notice) =>{
  const csrfToken = localStorage.getItem('csrfToken'); 
  return API.post("/api/admin/createnotice", notice, {
    headers: {
      'X-CSRF-Token': csrfToken // Include CSRF token in the request
    },
    withCredentials: true // Important for sending cookies
  });
};
export const deleteAdmin = (data) =>{
  const csrfToken = localStorage.getItem('csrfToken'); 
  return API.post("/api/admin/deleteadmin", data, {
    headers: {
      'X-CSRF-Token': csrfToken // Include CSRF token in the request
    },
    withCredentials: true // Important for sending cookies
  });
};
export const deleteFaculty = (data) =>{
  const csrfToken = localStorage.getItem('csrfToken'); 
  return API.post("/api/admin/deletefaculty", data, {
    headers: {
      'X-CSRF-Token': csrfToken // Include CSRF token in the request
    },
    withCredentials: true // Important for sending cookies
  });
};

export const deleteStudent = (data) =>{
  const csrfToken = localStorage.getItem('csrfToken'); 
  return API.post("/api/admin/deletestudent", data, {
    headers: {
      'X-CSRF-Token': csrfToken // Include CSRF token in the request
    },
    withCredentials: true // Important for sending cookies
  });
};
export const deleteSubject = (data) =>{
  const csrfToken = localStorage.getItem('csrfToken'); 
  return API.post("/api/admin/deletesubject", data, {
    headers: {
      'X-CSRF-Token': csrfToken // Include CSRF token in the request
    },
    withCredentials: true // Important for sending cookies
  });
};
export const deleteDepartment = (data) =>{
  const csrfToken = localStorage.getItem('csrfToken'); 
  return API.post("/api/admin/deletedepartment", data, {
    headers: {
      'X-CSRF-Token': csrfToken // Include CSRF token in the request
    },
    withCredentials: true // Important for sending cookies
  });
};

export const getAdmin = (admin) => {
  const csrfToken = localStorage.getItem('csrfToken'); 
  return API.post("/api/admin/getadmin", admin, {
    headers: {
      'X-CSRF-Token': csrfToken // Include CSRF token in the request
    },
    withCredentials: true // Important for sending cookies
  });
};

export const addDepartment = (department) =>{
  const csrfToken = localStorage.getItem('csrfToken'); 
  return API.post("/api/admin/adddepartment", department, {
    headers: {
      'X-CSRF-Token': csrfToken // Include CSRF token in the request
    },
    withCredentials: true // Important for sending cookies
  });
};

export const addFaculty = (faculty) =>{
  const csrfToken = localStorage.getItem('csrfToken'); 
  return API.post("/api/admin/addfaculty", faculty, {
    headers: {
      'X-CSRF-Token': csrfToken // Include CSRF token in the request
    },
    withCredentials: true // Important for sending cookies
  });
};

export const getFaculty = (department) =>{
  const csrfToken = localStorage.getItem('csrfToken'); 
  return API.post("/api/admin/getfaculty", department, {
    headers: {
      'X-CSRF-Token': csrfToken // Include CSRF token in the request
    },
    withCredentials: true // Important for sending cookies
  });
};

export const addSubject = (subject) =>{
  const csrfToken = localStorage.getItem('csrfToken'); 
  return API.post("/api/admin/addsubject", subject, {
    headers: {
      'X-CSRF-Token': csrfToken // Include CSRF token in the request
    },
    withCredentials: true // Important for sending cookies
  });
};
export const getSubject = (subject) =>{
  const csrfToken = localStorage.getItem('csrfToken'); 
  return API.post("/api/admin/getsubject", subject, {
    headers: {
      'X-CSRF-Token': csrfToken // Include CSRF token in the request
    },
    withCredentials: true // Important for sending cookies
  });
};
export const addStudent = (student) =>{
  const csrfToken = localStorage.getItem('csrfToken'); // Get the CSRF token
  return API.post("/api/admin/addstudent", student, {
    headers: {
      'X-CSRF-Token': csrfToken // Include CSRF token in the request
    },
    withCredentials: true // Important for sending cookies
  });
};

export const getStudent = (student) =>{
  const csrfToken = localStorage.getItem('csrfToken'); // Get the CSRF token
  return API.post("/api/admin/getstudent", student, {
    headers: {
      'X-CSRF-Token': csrfToken // Include CSRF token in the request
    },
    withCredentials: true // Important for sending cookies
  });
};
export const getNotice = (notice) => {
  const csrfToken = localStorage.getItem('csrfToken'); // Get the CSRF token
  return API.post("/api/admin/getnotice", notice, {
    headers: {
      'X-CSRF-Token': csrfToken // Include CSRF token in the request
    },
    withCredentials: true // Important for sending cookies
  });
};

// Faculty

export const facultySignIn = (formData) =>
  API.post("/api/faculty/login", formData, { withCredentials: true });

export const facultyUpdatePassword = (updatedPassword) =>
  API.post("/api/faculty/updatepassword", updatedPassword);

export const updateFaculty = (updatedFaculty) =>
  API.post("/api/faculty/updateprofile", updatedFaculty);

export const createTest = (test) => API.post("/api/faculty/createtest", test);
export const getTest = (test) => API.post("/api/faculty/gettest", test);
export const getMarksStudent = (student) =>
  API.post("/api/faculty/getstudent", student);
export const uploadMarks = (data) => API.post("/api/faculty/uploadmarks", data);
export const markAttendance = (data) =>{
  const csrfToken = localStorage.getItem('csrfToken'); // Get the CSRF token
  return API.post("/api/faculty/markattendance", data, {
    headers: {
      'X-CSRF-Token': csrfToken // Include CSRF token in the request
    },
    withCredentials: true // Important for sending cookies
  });
};

// Student

export const studentSignIn = (formData) =>
  API.post("/api/student/login", formData, { withCredentials: true });

export const studentUpdatePassword = (updatedPassword) =>{
  const csrfToken = localStorage.getItem('csrfToken'); // Get the CSRF token
  return API.post("/api/student/updatepassword", updatedPassword, {
    headers: {
      'X-CSRF-Token': csrfToken // Include CSRF token in the request
    },
    withCredentials: true // Important for sending cookies
  });
};

export const updateStudent = (updatedStudent) =>{
  const csrfToken = localStorage.getItem('csrfToken'); // Get the CSRF token
  return API.post("/api/student/updateprofile", updatedStudent, {
    headers: {
      'X-CSRF-Token': csrfToken // Include CSRF token in the request
    },
    withCredentials: true // Important for sending cookies
  });
};
export const getTestResult = (testResult) =>{
  const csrfToken = localStorage.getItem('csrfToken'); // Get the CSRF token
  return API.post("/api/student/testresult", testResult, {
    headers: {
      'X-CSRF-Token': csrfToken // Include CSRF token in the request
    },
    withCredentials: true // Important for sending cookies
  });
};
export const getAttendance = (attendance) =>{
  const csrfToken = localStorage.getItem('csrfToken'); // Get the CSRF token
  return API.post("/api/student/attendance", attendance, {
    headers: {
      'X-CSRF-Token': csrfToken // Include CSRF token in the request
    },
    withCredentials: true // Important for sending cookies
  });
};
