import React from "react";
import { Avatar } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import useCsrfToken from "../../hooks/useCsrfToken"; 

const Header = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const csrfToken = useCsrfToken();

  const logout = () => {
    dispatch({ type: "LOGOUT" });
    localStorage.removeItem("user"); // Clear user data on logout
    localStorage.removeItem("csrfToken"); // Remove CSRF token
    console.log("CSRF token removed");
    navigate("/login/adminLogin");
  };

  // Use optional chaining to safely access user properties
  const userName = user?.result?.name || "User";
  const userAvatar = user?.result?.avatar || "https://icon-library.com/images/default-user-icon/default-user-icon-13.jpg"; // Default image if avatar is null

  return (
    <div className="flex-[0.05] flex justify-between items-center mx-5 my-2">
      <div className="flex items-center ">
        <img
          src="https://icon-library.com/images/cms-icon/cms-icon-11.jpg"
          alt=""
          className="h-7"
        />
        <h1 className="font-bold text-blue-600 text-sm">CMS</h1>
      </div>
      <h1 className="font-semibold text-black">Welcome, {userName}</h1>
      <div className="flex items-center space-x-3">
      <Avatar
          src={userAvatar} // Use userAvatar which defaults to a placeholder image
          alt={userName.charAt(0)} // Use the first character of the name as fallback
          sx={{ width: 24, height: 24 }}
          className="border-blue-600 border-2"
        />
        <h1>{userName}</h1>
        <LogoutIcon
          onClick={logout}
          className="cursor-pointer hover:scale-125 transition-all "
        />
      </div>
    </div>
  );
};

export default Header;
