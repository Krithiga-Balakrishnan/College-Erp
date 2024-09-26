import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch, useSelector } from "react-redux";
import FileBase from "react-file-base64";
import { addFaculty } from "../../../redux/actions/adminActions";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Spinner from "../../../utils/Spinner";
import { ADD_FACULTY, SET_ERRORS } from "../../../redux/actionTypes";
import * as classes from "../../../utils/styles";

const Body = () => {
  const dispatch = useDispatch();
  const store = useSelector((state) => state);
  const departments = useSelector((state) => state.admin.allDepartment);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [avatarError, setAvatarError] = useState(false); // Track avatar-specific errors
  const [value, setValue] = useState({
    name: "",
    dob: "",
    email: "",
    department: "",
    contactNumber: "",
    avatar: "",
    joiningYear: Date().split(" ")[3],
    gender: "",
    designation: "",
  });

  // Ensure email errors only reset email field
  useEffect(() => {
    if (store.errors?.emailError) {
      setError(store.errors); // Set email errors
      setValue({ ...value, email: "" }); // Clear email field if there is an email error
    } else if (Object.keys(store.errors).length !== 0) {
      setError(store.errors); // Set other errors (like avatar or backend errors)
    }
  }, [store.errors]);

  // const validateAvatar = (file) => {
  //   const validTypes = ["image/jpeg", "image/png", "image/jpg"];
  //   const maxSize = 2 * 1024 * 1024; // 2MB
  //   if (!validTypes.includes(file.type)) {
  //     setError({ avatarError: "Invalid file type. Only JPEG, JPG, and PNG are allowed." });
  //     setAvatarError(true); // Mark as invalid
  //     return false;
  //   }
  //   if (file.size > maxSize) {
  //     setError({ avatarError: "File size exceeds 2MB." });
  //     setAvatarError(true); // Mark as invalid
  //     return false;
  //   }
  //   setAvatarError(false); // Clear avatar errors if valid
  //   return true;
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError({});

    // Check if there's any error related to the avatar file type
    if (error.avatarError) {
      alert("Please upload a valid image file (JPEG, PNG, JPG) before submitting.");
      return; // Prevent form submission if there's an avatar error
    }
  

//  // Name validation: must be at least 3 characters long and should not contain '{' or '}'
//  if (!value.name || value.name.length < 3) {
//   alert("Name must be at least 3 characters long");
//   return;
// }

if (/[{}:;,"]/g.test(value.name)) {
  alert("Name contains invalid characters: {, }, :, ;, ,, or ' ");
  return;
}

if (/[{}:;,"]/g.test(value.designation)) {
  alert("designation contains invalid characters: {, }, :, ;, ,, or ' ");
  return;
}

// Contact number validation: must be exactly 10 digits
if (!/^\d{10}$/.test(value.contactNumber)) {
  alert("Contact number must be 10 digits");
  return;
}

// Sanitize email input: Remove any invalid characters including '{' and '}'
const sanitizedEmail = value.email.replace(/[^\w@.-]/g, '');
if (/[{}:;,"]/g.test(sanitizedEmail)) {
  alert("Email contains invalid characters: {, }, :, ;, ,, or ' ");
  return;
}
setValue({ ...value, email: sanitizedEmail });



    setLoading(true);
    dispatch(addFaculty(value));
  };

  useEffect(() => {
    if (store.errors || store.admin.facultyAdded) {
      setLoading(false);
      if (store.admin.facultyAdded) {
        setValue({
          name: "",
          dob: "",
          email: "",
          department: "",
          contactNumber: "",
          avatar: "",
          joiningYear: Date().split(" ")[3],
          gender: "",
          designation: "",
        });
        dispatch({ type: SET_ERRORS, payload: {} });
        dispatch({ type: ADD_FACULTY, payload: false });
      }
    } else {
      setLoading(true);
    }
  }, [store.errors, store.admin.facultyAdded]);

  useEffect(() => {
    dispatch({ type: SET_ERRORS, payload: {} });
  }, []);

   // Validate file type for avatar upload
   const handleFileUpload = ({ base64, type }) => {
    const allowedFileTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedFileTypes.includes(type)) {
      setError({ ...error, avatarError: "Only JPEG, PNG, JPG files are allowed" });
      setValue({ ...value, avatar: "" }); // Clear the avatar value if invalid
    } else {
      setValue({ ...value, avatar: base64 });
      setError({ ...error, avatarError: "" }); // Clear the error if valid file
    }
  };

  return (
    <div className="flex-[0.8] mt-3">
      <div className="space-y-5">
        <div className="flex text-gray-400 items-center space-x-2">
          <AddIcon />
          <h1>Add Faculty</h1>
        </div>
        <div className="mr-10 bg-white flex flex-col rounded-xl ">
          <form className={classes.adminForm0} onSubmit={handleSubmit}>
            <div className={classes.adminForm1}>
              <div className={classes.adminForm2l}>
                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>Name :</h1>
                  <input
                    placeholder="Full Name"
                    required
                    className={classes.adminInput}
                    type="text"
                    value={value.name}
                    onChange={(e) =>
                      setValue({ ...value, name: e.target.value })
                    }
                  />
                </div>
                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>DOB :</h1>
                  <input
                    placeholder="DD/MM/YYYY"
                    required
                    className={classes.adminInput}
                    type="date"
                    value={value.dob}
                    onChange={(e) =>
                      setValue({ ...value, dob: e.target.value })
                    }
                  />
                </div>
                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>Email :</h1>
                  <input
                    placeholder="Email"
                    required
                    className={classes.adminInput}
                    type="email"
                    value={value.email}
                    onChange={(e) =>
                      setValue({ ...value, email: e.target.value })
                    }
                  />
                </div>
                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>Designation :</h1>
                  <input
                    placeholder="Designation"
                    required
                    className={classes.adminInput}
                    type="text"
                    value={value.designation}
                    onChange={(e) =>
                      setValue({ ...value, designation: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className={classes.adminForm2r}>
                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>Department :</h1>
                  <Select
                    required
                    displayEmpty
                    sx={{ height: 36 }}
                    inputProps={{ "aria-label": "Without label" }}
                    value={value.department}
                    onChange={(e) =>
                      setValue({ ...value, department: e.target.value })
                    }
                  >
                    <MenuItem value="">None</MenuItem>
                    {departments?.map((dp, idx) => (
                      <MenuItem key={idx} value={dp.department}>
                        {dp.department}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>Gender :</h1>
                  <Select
                    required
                    displayEmpty
                    sx={{ height: 36 }}
                    inputProps={{ "aria-label": "Without label" }}
                    value={value.gender}
                    onChange={(e) =>
                      setValue({ ...value, gender: e.target.value })
                    }
                  >
                    <MenuItem value="">None</MenuItem>
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </div>
                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>Contact Number :</h1>
                  <input
                    required
                    placeholder="Contact Number"
                    className={classes.adminInput}
                    type="number"
                    value={value.contactNumber}
                    onChange={(e) =>
                      setValue({ ...value, contactNumber: e.target.value })
                    }
                  />
                </div>
                
                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>Avatar :</h1>
                  <FileBase
                    type="file"
                    multiple={false}
                    onDone={handleFileUpload}
                  />
                  {error.avatarError && (
                    <p className="text-red-500">{error.avatarError}</p>
                  )}
                </div>
              </div>
            </div>
            <div className={classes.adminFormButton}>
              <button className={classes.adminFormSubmitButton} type="submit">
                Submit
              </button>
              <button
                onClick={() => {
                  setValue({
                    name: "",
                    dob: "",
                    email: "",
                    department: "",
                    contactNumber: "",
                    avatar: "",
                    joiningYear: Date().split(" ")[3],
                    password: "",
                    username: "",
                  });
                  setError({});
                  setAvatarError(false);
                }}
                className={classes.adminFormClearButton}
                type="button"
              >
                Clear
              </button>
            </div>
            <div className={classes.loadingAndError}>
              {loading && (
                <Spinner
                  message="Adding Faculty"
                  height={30}
                  width={150}
                  color="#111111"
                  messageColor="blue"
                />
              )}
              {(error.emailError || error.backendError || error.avatarError) && (
                <p className="text-red-500">
                  {error.emailError || error.backendError || error.avatarError}
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Body;
