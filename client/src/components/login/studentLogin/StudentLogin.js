import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Spinner from "../../../utils/Spinner";
import { studentSignIn } from "../../../redux/actions/studentActions";
import { GoogleLogin } from "@react-oauth/google"; // Import GoogleLogin
import jwt_decode from "jwt-decode"; 
import { toast } from "react-toastify";


const StudentLogin = () => {
  const [translate, setTranslate] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const store = useSelector((state) => state);
  const [error, setError] = useState({});
  useEffect(() => {
    setTimeout(() => {
      setTranslate(true);
    }, 1000);
  }, []);

  useEffect(() => {
    if (store.errors) {
      setError(store.errors);
    }
  }, [store.errors]);

  const login = (e) => {
    e.preventDefault();
    setLoading(true);
    dispatch(
      studentSignIn({ username: username, password: password }, navigate)
    );
  };

  // const handleGoogleLogin = async (response) => {
  //   if (response.credential) {
  //     try {
  //       const userData = jwt_decode(response.credential);
  //       const formData = {
  //         email: userData.email,
  //         name: userData.name,
  //         avatar: userData.picture || null, // Use the picture URL or null if not available
  //       };
  //       localStorage.setItem("user", JSON.stringify({ result: formData })); // Store user data with the correct structure
  //       navigate("/student/home"); // Navigate after successful login
  //     } catch (error) {
  //       console.error("Error during Google login:", error);
  //       toast.error("Google Login failed!");
  //     }
  //   } else {
  //     console.error("No credential found in Google response");
  //   }
  // };
  const handleGoogleLogin = async (response) => {
    if (response.credential) {
      try {
        const formData = {
          googleCredential: response.credential,  // Send the credential (JWT) directly to the backend
        };
        // Store Google credential in local storage if necessary
        localStorage.setItem("user", JSON.stringify({ result: formData }));
        // Dispatch to the backend for login
        await dispatch(studentSignIn(formData, navigate));
      } catch (error) {
        console.error("Error during Google login:", error); // Log error details
        toast.error("Google Login failed: " + (error.response?.data?.message || error.message));
      }
    } else {
      console.error("No credential found in Google response");
    }
  };
  
  useEffect(() => {
    if (store.errors) {
      setLoading(false);
      setUsername("");
      setPassword("");
    }
  }, [store.errors]);
  return (
    <div className="bg-[#d65158] h-screen w-screen flex items-center justify-center">
      <div className="grid grid-cols-2">
        <div
          className={`h-96 w-96 bg-white flex items-center justify-center ${
            translate ? "translate-x-[12rem]" : ""
          }  duration-1000 transition-all rounded-3xl shadow-2xl`}>
          <h1 className="text-[3rem]  font-bold text-center">
            Student
            <br />
            Login
          </h1>
        </div>
        <form
          onSubmit={login}
          className={`${
            loading ? "h-[27rem]" : "h-96"
          } w-96 bg-[#2c2f35] flex flex-col items-center justify-center ${
            translate ? "-translate-x-[12rem]" : ""
          }  duration-1000 transition-all space-y-6 rounded-3xl shadow-2xl`}>
          <h1 className="text-white text-3xl font-semibold">Student</h1>
          <div className="space-y-1">
            <p className="text-[#515966] font-bold text-sm">Username</p>
            <div className="bg-[#515966] rounded-lg w-[14rem] flex  items-center">
              <input
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                type="text"
                required
                className="bg-[#515966] text-white px-2 outline-none py-2 rounded-lg placeholder:text-sm"
                placeholder="Username"
              />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-[#515966] font-bold text-sm">Password</p>
            <div className="bg-[#515966] rounded-lg px-2 flex  items-center">
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
                type={showPassword ? "text" : "password"}
                className=" bg-[#515966] text-white rounded-lg outline-none py-2  placeholder:text-sm"
                placeholder="Password"
              />
              {showPassword ? (
                <VisibilityIcon
                  onClick={() => setShowPassword(!showPassword)}
                  className="cursor-pointer"
                />
              ) : (
                <VisibilityOffIcon
                  onClick={() => setShowPassword(!showPassword)}
                  className="cursor-pointer"
                />
              )}
            </div>
          </div>
          <button
            type="submit"
            className="w-32 hover:scale-105 transition-all duration-150 rounded-lg flex items-center justify-center text-white text-base py-1 bg-[#04bd7d]">
            Login
          </button>
          {loading && (
            <Spinner
              message="Logging In"
              height={30}
              width={150}
              color="#ffffff"
              messageColor="#fff"
            />
          )}
          {(error.usernameError || error.passwordError) && (
            <p className="text-red-500">
              {error.usernameError || error.passwordError}
            </p>
          )}
           {/* Google Sign-In Button */}
           <GoogleLogin
  onSuccess={handleGoogleLogin}
  onFailure={(error) => {
    console.error("Login Failed:", error);
    toast.error("Google Login failed!"); // Show an error message
  }}
  style={{
    marginTop: "1rem",
    width: "100%",
  }}
  logo_alignment="left" // Optional: adjust as necessary
  text="Sign in with Google" // Add custom text if needed
/>

        </form>
      </div>
    </div>
  );
};

export default StudentLogin;
