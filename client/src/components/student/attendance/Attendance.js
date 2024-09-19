import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getAttendance } from "../../../redux/actions/studentActions";

import Header from "../Header";
import Sidebar from "../Sidebar";
import Body from "./Body";
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

const Attendance = () => {

  const navigate = useNavigate();
  // Extract token from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  let role;

  if (user && user.token) {
    // Decode the JWT token to get the role
    const decodedToken = jwtDecode(user.token);
    role = decodedToken.role; // This will give you the role
    console.log('Decoded Token Role:', role);
  }

  useEffect(() => {
    if (!role || role !== 'student') {
      navigate('/unauthorized'); // Redirect to unauthorized page if role is not faculty
    }
  }, [role, navigate]);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      getAttendance(
        user.result.department,
        user.result.year,
        user.result.section
      )
    );
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

export default Attendance;
