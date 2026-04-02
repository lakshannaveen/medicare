// //Patient loggin page, Button click of Create One and Navigate to this page

// import React, { useState } from "react";
// import "../styles/userRegistration.css";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// export default function Userregistration() {
//   const [formData, setFormData] = useState({
//     MPD_EMAIL: "",
//     MPD_NIC_NO: "",
//     MPD_MOBILE_NO: "",
//     MPD_ADDRESS: "",
//     MPD_PASSWORD: "",
//     MPD_PATIENT_NAME: "",
//     MPD_BIRTHDAY: null,
//   });

//   const [formErrors, setFormErrors] = useState({
//     email: "",
//     contact: "",
//     nic: "",
//   });

//   const [errorMessage, setErrorMessage] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");
//   const navigate = useNavigate("");

//   const validateEmail = (email) => {
//     const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//     return emailPattern.test(email);
//   };

//   const validateContactNumber = (contact) => {
//     const contactPattern = /^[0-9]{10}$/; // Adjust pattern as per your country's phone format
//     return contactPattern.test(contact);
//   };
//   const validateNIC = (nic) => {
//     const nicPattern = /^[0-9]{9}[vV]$|^[0-9]{12}$/;
//     return nicPattern.test(nic);
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     // Update form data
//     setFormData({
//       ...formData,
//       [name]: value,
//     });

//     // Create a copy of the current errors
//     let updatedErrors = { ...formErrors };

//     // Validate email
//     if (name === "MPD_EMAIL") {
//       updatedErrors.email =
//         value.trim() === "" || validateEmail(value)
//           ? ""
//           : "Please enter a valid email address.";
//     }

//     // Validate contact number
//     if (name === "MPD_MOBILE_NO") {
//       updatedErrors.contact =
//         value.trim() === "" || validateContactNumber(value)
//           ? ""
//           : "Please enter a valid 10-digit contact number.";
//     }

//     // Validate guardian contact number
//     if (name === "MPD_GUARDIAN_CONTACT_NO") {
//       updatedErrors.guardianContact =
//         value.trim() === "" || validateContactNumber(value)
//           ? ""
//           : "Please enter a valid 10-digit guardian contact number.";
//     }

//     // Validate NIC
//     if (name === "MPD_NIC_NO") {
//       updatedErrors.nic =
//         value.trim() === "" || validateNIC(value)
//           ? ""
//           : "Please enter a valid NIC.";
//     }

//     // Update form errors
//     setFormErrors(updatedErrors);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Check if there are any errors before submitting
//     if (formErrors.email || formErrors.contact || formErrors.nic) {
//       setErrorMessage("Please correct the errors before submitting the form.");
//       return;
//     }

//     try {
//       const response = await axios.post(
//         `${process.env.REACT_APP_API_BASE_URL}/Patient/patient-registration`,
//         formData
//       );
//       setSuccessMessage("Patient registered successfully!");
//       setErrorMessage("");
//       alert("User registered successfully");
//       console.log(formData);
//       setFormData({
//         MPD_EMAIL: "",
//         MPD_NIC_NO: "",
//         MPD_MOBILE_NO: "",
//         MPD_ADDRESS: "",
//         MPD_PASSWORD: "",
//         MPD_PATIENT_NAME: "",
//         MPD_BIRTHDAY: "",
//       });
//       navigate("/");

//       console.log(formData);
//     } catch (error) {
//       console.error(error);
//       if (error.response && error.response.data && error.response.data.error) {
//         setErrorMessage(error.response.data.error);
//       } else {
//         setErrorMessage("Failed to register user. Please try again.");
//       }
//     }
//   };

//   const handleCancel = () => {
//     setFormData({
//       MPD_EMAIL: "",
//       MPD_NIC_NO: "",
//       MPD_MOBILE_NO: "",
//       MPD_ADDRESS: "",
//       MPD_PASSWORD: "",
//       MPD_PATIENT_NAME: "",
//       MPD_BIRTHDAY: "",
//     });
//     setErrorMessage("");
//     setSuccessMessage("");
//   };

//   return (
//     <div className="user-registration-container">
//       <div className="user-registration">
//         <form onSubmit={handleSubmit} className="registration-form">
//           {errorMessage && <div className="error-message">{errorMessage}</div>}
//           <h1>Register Patients</h1>
//           <div className="form-group">
//             <label>Name</label>
//             <input
//               type="text"
//               name="MPD_PATIENT_NAME"
//               value={formData.MPD_PATIENT_NAME}
//               onChange={handleChange}
//               placeholder="enter your name"
//               required
//             />
//           </div>

//           <div className="form-group">
//             <label>Contact</label>
//             <input
//               type="number"
//               name="MPD_MOBILE_NO"
//               placeholder="Enter your contact"
//               value={formData.MPD_MOBILE_NO}
//               onChange={handleChange}
//               required
//               maxLength="10"
//             />
//             {formErrors.contact && (
//               <div className="error-message1">{formErrors.contact}</div>
//             )}
//           </div>

//           {/* <div className='form-group'>

//             <label>parent / </label>









//           </div> */}

//           <div className="form-group">
//             <label>Address</label>
//             <input
//               type="text"
//               name="MPD_ADDRESS"
//               placeholder="Enter your address"
//               value={formData.MPD_ADDRESS}
//               onChange={handleChange}
//             />
//           </div>

//           <div className="form-group">
//             <label>Email</label>
//             <input
//               type="email"
//               name="MPD_EMAIL"
//               placeholder="Enter your email"
//               value={formData.MPD_EMAIL}
//               onChange={handleChange}
//               required
//             />
//             {formErrors.email && (
//               <div className="error-message1">{formErrors.email}</div>
//             )}
//           </div>

//           <div className="form-group">
//             <label>NIC</label>
//             <input
//               type="text"
//               name="MPD_NIC_NO"
//               placeholder="Enter your NIC"
//               value={formData.MPD_NIC_NO}
//               onChange={handleChange}
//             />
//             {formErrors.nic && (
//               <div className="error-message1">{formErrors.nic}</div>
//             )}
//           </div>

//           <div className="form-group">
//             <label>Birthdate</label>
//             <input
//               type="date"
//               name="MPD_BIRTHDAY"
//               placeholder="Enter your birthdate"
//               value={formData.MPD_BIRTHDAY}
//               onChange={handleChange}
//             />
//           </div>

//           <button type="submit" className="btn-primary">
//             Register
//           </button>

//           {successMessage && (
//             <div className="success-message">{successMessage}</div>
//           )}
//         </form>
//       </div>
//     </div>
//   );
// }


import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Alert,
  Avatar,
  CssBaseline,
  InputAdornment,
  CircularProgress,
  Fade,
} from "@mui/material";
import {
  Person,
  Email,
  Phone,
  Home,
  Badge,
  Cake,
  Lock,
  CheckCircle,
} from "@mui/icons-material";
import LoginImage from "../assets/Login.jpeg";


export default function UserRegistration() {
  const [formData, setFormData] = useState({
    MPD_EMAIL: "",
    MPD_NIC_NO: "",
    MPD_MOBILE_NO: "",
    MPD_ADDRESS: "",
    MPD_PASSWORD: "",
    MPD_PATIENT_NAME: "",
    MPD_BIRTHDAY: "",
  });

  const [formErrors, setFormErrors] = useState({
    email: false,
    contact: false,
    nic: false,
    password: false,
    birthdate: false,
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const emptyForm = {
    MPD_EMAIL: "",
    MPD_NIC_NO: "",
    MPD_MOBILE_NO: "",
    MPD_ADDRESS: "",
    MPD_PASSWORD: "",
    MPD_PATIENT_NAME: "",
    MPD_BIRTHDAY: "",
  };

  useEffect(() => {
    // Reset internal form state on mount to avoid showing previous values
    setFormData(emptyForm);

    // Try to prevent browser autofill where possible
    const formEl = document.getElementById("signup-form");
    if (formEl) {
      try {
        formEl.reset();
        const inputs = formEl.querySelectorAll("input");
        inputs.forEach((i) => {
          i.autocomplete = "off";
          // clear any visual value that may be set by browser autofill
          i.value = "";
        });
      } catch (err) {
        // ignore
      }
    }
  }, []);

  const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  };

  const validateContactNumber = (contact) => {
    const contactPattern = /^[0-9]{10}$/;
    return contactPattern.test(contact);
  };

  const validateNIC = (nic) => {
    const nicPattern = /^[0-9]{9}[vV]$|^[0-9]{12}$/;
    return nicPattern.test(nic);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "MPD_EMAIL") {
      setFormErrors({
        ...formErrors,
        email: value.trim() !== "" && !validateEmail(value),
      });
    }

    if (name === "MPD_MOBILE_NO") {
      setFormErrors({
        ...formErrors,
        contact: value.trim() !== "" && !validateContactNumber(value),
      });
    }

    if (name === "MPD_NIC_NO") {
      setFormErrors({
        ...formErrors,
        nic: value.trim() !== "" && !validateNIC(value),
      });
    }

    if (name === "MPD_PASSWORD") {
      setFormErrors({
        ...formErrors,
        password: value.trim() !== "" && !validatePassword(value),
      });
    }
    if (name === "MPD_BIRTHDAY") {
      setFormErrors({
        ...formErrors,
        birthdate: value.trim() !== "" && !validateBirthdate(value),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = {
      email: !validateEmail(formData.MPD_EMAIL),
      contact: !validateContactNumber(formData.MPD_MOBILE_NO),
      nic: formData.MPD_NIC_NO && !validateNIC(formData.MPD_NIC_NO),
      password: !validatePassword(formData.MPD_PASSWORD),
      birthdate: !validateBirthdate(formData.MPD_BIRTHDAY),
    };

    setFormErrors(validationErrors);

    if (Object.values(validationErrors).some((error) => error)) {
      setErrorMessage("Please correct the highlighted errors before submitting.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/Patient/patient-registration`,
        formData
      );

      setSuccessMessage("Registration successful! Redirecting to login...");
      setErrorMessage("");

      setTimeout(() => {
        navigate("/");
      }, 2000);

      setFormData({
        MPD_EMAIL: "",
        MPD_NIC_NO: "",
        MPD_MOBILE_NO: "",
        MPD_ADDRESS: "",
        MPD_PASSWORD: "",
        MPD_PATIENT_NAME: "",
        MPD_BIRTHDAY: "",
      });
    } catch (error) {
      console.error(error);
      const errorMsg =
        error.response?.data?.error || "Failed to register. Please try again.";
      setErrorMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };
  const validateBirthdate = (date) => {
    if (!date) return true;
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate <= today;
  };
  return (
    <>
      <CssBaseline />
      <Grid container sx={{ height: "100vh", width: "100vw" }}>
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            color: "white",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundImage: `url(${LoginImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "brightness(0.7)",
              zIndex: 1,
            },
          }}
        >
          <Box
            sx={{
              position: "relative",
              zIndex: 2,
              p: 4,
              maxWidth: "800px",
            }}
          >
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              sx={{ fontWeight: 700, mb: 3 }}
            >
              Sign Up
            </Typography>
            <Typography variant="h5" sx={{ mb: 4 }}>
              Join Our Healthcare Community
            </Typography>
            <Typography variant="body1" paragraph sx={{ mb: 2 }}>
              Register today to access our comprehensive medical services and
              personalized care from our team of experienced healthcare
              professionals.
            </Typography>
            <Button
              variant="outlined"
              color="inherit"
              size="large"
              onClick={() => navigate("/")}
              sx={{
                color: "white",
                borderColor: "white",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
              }}
            >
              Already have an account? Sign In
            </Button>
          </Box>
        </Grid>

        {/* Right Section - Registration Form */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            p: { xs: 4, md: 8 },
            overflowY: "auto",
          }}
        >
          <Box sx={{ maxWidth: "600px", margin: "0 auto", width: "100%" }}>
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              sx={{ fontWeight: 700 }}
            >
              Create Your Account
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Fill in your details to get started
            </Typography>

            <form id="signup-form" autoComplete="off" noValidate onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="MPD_PATIENT_NAME"
                    value={formData.MPD_PATIENT_NAME}
                    onChange={handleChange}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person color="primary" />
                        </InputAdornment>
                      ),
                      inputProps: { autoComplete: 'off' }
                    }}
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Contact Number"
                    name="MPD_MOBILE_NO"
                    value={formData.MPD_MOBILE_NO}
                    onChange={handleChange}
                    required
                    error={formErrors.contact}
                    helperText={formErrors.contact && "10 digits required"}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Phone color={formErrors.contact ? "error" : "primary"} />
                        </InputAdornment>
                      ),
                      inputProps: { maxLength: 10, autoComplete: 'off' },
                    }}
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="MPD_EMAIL"
                    type="email"
                    value={formData.MPD_EMAIL}
                    onChange={handleChange}
                    required
                    error={formErrors.email}
                    helperText={formErrors.email && "Valid email required"}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email color={formErrors.email ? "error" : "primary"} />
                        </InputAdornment>
                      ),
                      inputProps: { autoComplete: 'off' },
                    }}
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address"
                    name="MPD_ADDRESS"
                    value={formData.MPD_ADDRESS}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Home color="primary" />
                        </InputAdornment>
                      ),
                      inputProps: { autoComplete: 'off' },
                    }}
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Password"
                    name="MPD_PASSWORD"
                    type="password"
                    value={formData.MPD_PASSWORD}
                    onChange={handleChange}
                    required
                    error={formErrors.password}
                    helperText={formErrors.password && "Min 6 characters"}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock color={formErrors.password ? "error" : "primary"} />
                        </InputAdornment>
                      ),
                      inputProps: { autoComplete: 'new-password' }
                    }}
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="NIC Number"
                    name="MPD_NIC_NO"
                    value={formData.MPD_NIC_NO}
                    onChange={handleChange}
                    error={formErrors.nic}
                    helperText={formErrors.nic && "9 digits with V or 12 digits"}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Badge color={formErrors.nic ? "error" : "primary"} />
                        </InputAdornment>
                      ),
                      inputProps: { autoComplete: 'off' }
                    }}
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                </Grid>

                <Grid item xs={12}>
                  {/* <TextField
                    fullWidth
                    label="Birthdate"
                    name="MPD_BIRTHDAY"
                    type="date"
                    value={formData.MPD_BIRTHDAY}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Cake color="primary" />
                        </InputAdornment>
                      ),
                    }}
                    variant="outlined"
                    sx={{ mb: 4 }}
                  /> */}
                  <TextField
                    fullWidth
                    label="Birthdate"
                    name="MPD_BIRTHDAY"
                    type="date"
                    value={formData.MPD_BIRTHDAY}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    error={formErrors.birthdate}
                    helperText={formErrors.birthdate && "Add a Valid Birthdate"}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Cake color={formErrors.birthdate ? "error" : "primary"} />
                        </InputAdornment>
                      ),
                      inputProps: {
                        max: new Date().toISOString().split('T')[0],
                        autoComplete: 'off'
                      }
                    }}
                    variant="outlined"
                    sx={{ mb: 4 }}
                  />
                </Grid>
              </Grid>

              <Button
                // fullWidth
                variant="contained"
                size="large"
                type="submit"
                disabled={isLoading}
                sx={{
                  py: 1.5,
                  // mb: 1,
                  fontWeight: 700,
                  background: "linear-gradient(45deg, #1976d2, #2196f3)",
                  width: "100%",
                  maxWidth: "560px",
                }}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Register Now"
                )}
              </Button>

              {successMessage && (
                <Fade in={!!successMessage}>
                  <Alert
                    icon={<CheckCircle fontSize="inherit" />}
                    severity="success"
                    sx={{ mb: 2 }}
                  >
                    {successMessage}
                  </Alert>
                </Fade>
              )}

              {errorMessage && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {errorMessage}
                </Alert>
              )}
            </form>

            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              sx={{ mt: 3 }}
            >
              By registering, you agree to our Terms of Service and Privacy Policy
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}