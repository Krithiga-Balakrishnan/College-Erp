import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  getAllStudent,
  getAllFaculty,
  getAllAdmin,
  getAllDepartment,
  getNotice,
} from "../../redux/actions/adminActions";
import Body from "./Body";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import useCsrfToken from "../../hooks/useCsrfToken"; 


const AdminHome = () => {

  const navigate = useNavigate();
  // Extract token from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const csrfToken = useCsrfToken()
  let role;

  if (user && user.token) {
    // Decode the JWT token to get the role
    const decodedToken = jwtDecode(user.token);
    role = decodedToken.role; // This will give you the role
    console.log('Decoded Token Role:', role);
  }

  useEffect(() => {
    if (!role || role !== 'admin') {
      navigate('/unauthorized'); // Redirect to unauthorized page if role is not faculty
    }
  }, [role, navigate]);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllStudent());
    dispatch(getAllFaculty());
    dispatch(getAllAdmin());
    dispatch(getAllDepartment());
    dispatch(getNotice());
  }, [dispatch]);
  return (
    <div className="bg-[#d6d9e0] h-screen flex items-center justify-center">
      <div className="flex flex-col  bg-[#f4f6fa] h-5/6 w-[95%] rounded-2xl shadow-2xl space-y-6 overflow-y-hidden">
        <Header />
        <div className="flex flex-[0.95]">
          <Sidebar />
          <Body />
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
