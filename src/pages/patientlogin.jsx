// //This is for the patient login
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "../styles/patientlogin.css";
// import { useNavigate } from "react-router-dom";
// import { Link } from "react-router-dom";

// export default function Patientlogin() {
//   const [contact, setContact] = useState("");
//   const [otp, setOtp] = useState("");
//   const [generatedOtp, setGeneratedOtp] = useState(null);
//   const [isOtpSent, setIsOtpSent] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [popupmessage, setPoupmessage] = useState("");
//   const [patientdetails, setPatientdetails] = useState([]);
//   const [patientlistpopup, setPatientlistpopup] = useState(false); // State to control popup visibility
//   const navigate = useNavigate();
//   const [patientid, setPatienid] = useState(false);
//   const [selectedPatient, setSelectedPatient] = useState(null);
//   const validateContact = (contact) => /^[0-9]{10}$/.test(contact);

//   const checkUserExists = async (contact) => {
//     try {
//       const response = await axios.post(
//         `${process.env.REACT_APP_API_BASE_URL}/AppoinmentLogin/CheckUserExists`,
//         { contact }
//       );
//       return response.status === 200; // Return true if user exists
//     } catch (error) {
//       setErrorMessage("User not registered. Please sign up first.");
//       return false;
//     }
//   };

//   const sendOtp = async () => {
//     if (!validateContact(contact)) {
//       setErrorMessage(
//         "Please enter a valid 10-digit mobile number starting with 6-9."
//       );
//       return;
//     }

//     const userExists = await checkUserExists(contact);
//     if (!userExists) return;

//     if (!validateContact(contact)) {
//       setErrorMessage("Please enter a valid 10-digit contact number.");
//       return;
//     }

//     try {
//       const response = await axios.post(
//         `${process.env.REACT_APP_API_BASE_URL}/AppoinmentLogin/patient-login-contact`,
//         { contact }
//       );

//       console.log(response.data);

//       setGeneratedOtp(response.data.otpcode); // Store the OTP code in state

//       setPoupmessage("OTP sent to your contact. Please check.");
//       setIsOtpSent(true);

//       setErrorMessage("");
//     } catch (error) {
//       setErrorMessage(
//         error.response?.data?.message || "Failed to send OTP. Please try again."
//       );
//     }
//   };

//   const proceedWithLogin = async () => {
//     if (!selectedPatient) {
//       setErrorMessage("Please select a user to proceed.");
//       return;
//     }

//     try {
//       const response = await axios.post(
//         `${process.env.REACT_APP_API_BASE_URL}/AppoinmentLogin/patient-login-api`,
//         { patientcode: selectedPatient.MPD_PATIENT_CODE }
//       );

//       localStorage.setItem("Token", response.data.Token);
//       localStorage.setItem("Email", response.data.Email);
//       localStorage.setItem("isLoggedIn", true);
//       localStorage.setItem("PatientCode", selectedPatient.MPD_PATIENT_CODE);
//       localStorage.setItem("Name", selectedPatient.MPD_PATIENT_NAME);
//       localStorage.setItem("Contact", selectedPatient.MPD_MOBILE_NO);
//       localStorage.setItem("Role", response.data.Role);

//       setErrorMessage("");
//       setPatientlistpopup(false); // Close the popup
//       navigate("/home");
//     } catch (error) {
//       setErrorMessage("An error occurred during login.");
//     }
//   };

//   const fetchPatientList = async () => {
//     try {
//       const response = await axios.post(
//         `${process.env.REACT_APP_API_BASE_URL}/AppoinmentLogin/userlists`,
//         { contact }
//       );

//       setPatientdetails(response.data);
//       setPoupmessage("Here are the users with the same contact number:");
//       setPatientlistpopup(true); // Show the popup
//     } catch (error) {
//       setErrorMessage("Failed to fetch patient details.");
//     }
//   };

//   const handleLogin = async () => {
//     if (otp === generatedOtp?.toString()) {
//       await fetchPatientList(); // Fetch patient list after OTP verification
//     } else {
//       setErrorMessage("Invalid OTP. Please check your contact.");
//     }
//   };

//   const handleCancel = () => {
//     setContact("");
//     setOtp("");
//     setIsOtpSent(false);
//     setErrorMessage(""); // Clear any previous error message
//   };

//   return (
//     <div className="login-page-container">
//       <div className="left-login-page-container">
//         <div className="welcome-patient-message">
//           {/* <h1>Welcome Back!</h1> */}
//         </div>
//       </div>

//       <div className="right-login-page-container">
//         <div className="form-content">
//           <h1 style={{ textAlign: "center" }}>Welcome Back!</h1>
//           <p className="intro-text">Please log in to your account</p>

//           <div className="group1">
//             <label>Contact</label>
//             <input
//               type="text"
//               placeholder="Please enter your contact"
//               value={contact}
//               max={10}
//               onChange={(e) => setContact(e.target.value)}
//             />
//           </div>

//           {!isOtpSent && (
//             <button className="b1" onClick={sendOtp}>
//               Send OTP
//             </button>
//           )}

//           {/* After patient enter the contact number it goes to this section */}
//           {isOtpSent && (
//             <>
//               {popupmessage && (
//                 <p className="popup-message-login">{popupmessage}</p>
//               )}
//               <label style={{ marginTop: "10px" }}>OTP</label>
//               <input
//                 type="text"
//                 placeholder="Enter OTP"
//                 value={otp}
//                 onChange={(e) => setOtp(e.target.value)}
//               />
//               <div className="button-container">
//                 <button className="b1" onClick={handleLogin}>
//                   Login
//                 </button>
//                 <button className="b1" onClick={handleCancel}>
//                   Cancel
//                 </button>
//               </div>
//             </>
//           )}

//           {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

//           <p>
//             Don't have an account?<Link to="/addusers"> Create One</Link>
//           </p>

//           {/* Display the patient list popup */}
//           {patientlistpopup && (
//             <div className="popup-patient">
//               <div className="popup-content-patient">
//                 <button
//                   className="close-button"
//                   onClick={() => setPatientlistpopup(false)}
//                 >
//                   &times;
//                 </button>
//                 <h3>Select user</h3>
//                 {patientdetails.length > 0 ? (
//                   <div className="user-list">
//                     {patientdetails.map((patientDetail, index) => (
//                       <div key={index} className="list">
//                         <label htmlFor={`patient-${index}`}>
//                           {patientDetail.MPD_PATIENT_NAME}
//                         </label>
//                         <input
//                           type="checkbox"
//                           id={`patient-${index}`}
//                           checked={selectedPatient === patientDetail}
//                           style={{ width: "5%" }}
//                           onChange={() =>
//                             setSelectedPatient(
//                               selectedPatient === patientDetail
//                                 ? null
//                                 : patientDetail
//                             )
//                           }
//                         />
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <p>No users found.</p>
//                 )}
//                 <button
//                   className="b1"
//                   onClick={proceedWithLogin}
//                   disabled={!selectedPatient}
//                 >
//                   Proceed
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

//Using MUI

import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  FormControlLabel,
  Alert,
  Avatar,
  CssBaseline,
  InputAdornment,
  IconButton,
  CircularProgress,
  Fade,
  Card,
  CardContent,
} from "@mui/material";
import {
  Phone as PhoneIcon,
  Add as AddIcon,
  ArrowForward as ArrowForwardIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import Login from "../assets/Login.jpeg";

export default function Patientlogin() {
  const [contact, setContact] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState(null);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [popupmessage, setPopupmessage] = useState("");
  const [patientdetails, setPatientdetails] = useState([]);
  const [patientlistpopup, setPatientlistpopup] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateContact = (contact) => /^[0-9]{10}$/.test(contact);

  const checkUserExists = async (contact) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/AppoinmentLogin/CheckUserExists`,
        { contact }
      );
      return response.status === 200;
    } catch (error) {
      setErrorMessage("User not registered. Please sign up first.");
      return false;
    }
  };

  const sendOtp = async () => {
    if (!validateContact(contact)) {
      setErrorMessage("Please enter a valid 10-digit mobile number");
      return;
    }

    setIsLoading(true);
    const userExists = await checkUserExists(contact);
    if (!userExists) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/AppoinmentLogin/patient-login-contact`,
        { contact }
      );

      setGeneratedOtp(response.data.otpcode);
      setPopupmessage("OTP sent successfully to your mobile number");
      setIsOtpSent(true);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Failed to send OTP. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const proceedWithLogin = async () => {
    if (!selectedPatient) {
      setErrorMessage("Please select a user to proceed.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/AppoinmentLogin/patient-login-api`,
        { patientcode: selectedPatient.MPD_PATIENT_CODE }
      );

      localStorage.setItem("Token", response.data.Token);
      localStorage.setItem("Email", response.data.Email);
      localStorage.setItem("isLoggedIn", true);
      localStorage.setItem("PatientCode", selectedPatient.MPD_PATIENT_CODE);
      localStorage.setItem("Name", selectedPatient.MPD_PATIENT_NAME);
      localStorage.setItem("Contact", selectedPatient.MPD_MOBILE_NO);
      localStorage.setItem("Role", response.data.Role);

      setErrorMessage("");
      setPatientlistpopup(false);
      navigate("/home");
    } catch (error) {
      setErrorMessage("An error occurred during login.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPatientList = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/AppoinmentLogin/userlists`,
        { contact }
      );

      setPatientdetails(response.data);
      setPopupmessage("Please select your profile to continue");
      setPatientlistpopup(true);
    } catch (error) {
      setErrorMessage("Failed to fetch patient details.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    if (otp === generatedOtp?.toString()) {
      await fetchPatientList();
    } else {
      setErrorMessage("Invalid OTP. Please try again.");
    }
  };

  const handleCancel = () => {
    setContact("");
    setOtp("");
    setIsOtpSent(false);
    setErrorMessage("");
  };

  return (
    <>
      <CssBaseline />
      <Grid container sx={{ height: "100vh", display: "flex" }}>
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            width: { xs: "100%", md: "50%" },
            position: "relative",
            overflow: "hidden",
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
              backgroundImage: `url(${Login})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "brightness(0.7)",
              zIndex: 1,
            },
            "& > *": {
              position: "relative",
              zIndex: 2,
            },
          }}
        >
          <Avatar
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.5)",
              color: "red",
              width: 80,
              height: 80,
              mb: 2,
              backdropFilter: "blur(4px)",
            }}
          >
            <AddIcon sx={{ fontSize: 80 }} />
          </Avatar>

          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
            Welcome to MediCare
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Securely access your medical records and appointments
          </Typography>
          <Box sx={{ mt: 3, }}>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>Don't have an account?</Typography>
            <Button
              component={Link}
              to="/addusers"
              variant="outlined"
              color="inherit"
              size="large"
              sx={{
                fontWeight: 500, mt: 1, color: "white",
                borderColor: "white",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
              }}
            >
              Create Account
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box
            sx={{
              p: { xs: 3, md: 8 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              height: "100%",
              ml: { xs: 0, md: 10 },
            }}
          >
            <Typography variant="h4"
              component="h2"
              gutterBottom
              sx={{ fontWeight: 700 }}>
              Patient Login
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mb: 1 }}>
              Enter your mobile number to receive OTP
            </Typography>

            <TextField
              label="Mobile Number"
              variant="outlined"
              fullWidth
              margin="normal"
              value={contact}
              inputProps={{ maxLength: 10 }}
              onChange={(e) => setContact(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />

            {!isOtpSent ? (
              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={sendOtp}
                disabled={isLoading}
                sx={{
                  py: 1.5, mt: 1, fontWeight: 700,
                  background: "linear-gradient(45deg, #1976d2, #2196f3)",
                }}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Send OTP"
                )}
              </Button>
            ) : (
              <Fade in={isOtpSent}>
                <Box>
                  {popupmessage && (
                    <Alert
                      icon={<CheckCircleIcon fontSize="inherit" />}
                      severity="success"
                      sx={{ mb: 2 }}
                    >
                      {popupmessage}
                    </Alert>
                  )}

                  <TextField
                    label="Enter OTP"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AddIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 2 }}
                  />

                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12} sm={6}>
                      <Button
                        variant="contained"
                        fullWidth
                        size="large"
                        onClick={handleLogin}
                        disabled={isLoading || !otp}
                        endIcon={<ArrowForwardIcon />}
                        sx={{ py: 1.5 }}
                      >
                        {isLoading ? (
                          <CircularProgress size={24} color="inherit" />
                        ) : (
                          "Verify"
                        )}
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Button
                        variant="outlined"
                        fullWidth
                        size="large"
                        onClick={handleCancel}
                        disabled={isLoading}
                        sx={{ py: 1.5 }}
                      >
                        Cancel
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Fade>
            )}

            {errorMessage && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {errorMessage}
              </Alert>
            )}

            <Typography
              variant="body2"
              color="textSecondary"
              align="center"
              sx={{ mt: 3 }}
            >
              By continuing, you agree to our Terms of Service and Privacy
              Policy
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Dialog
        open={patientlistpopup}
        onClose={() => setPatientlistpopup(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle
          sx={{
            bgcolor: "#f5f5f5",
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Typography variant="h6">Select Your Profile</Typography>
          <Typography variant="body2" color="textSecondary">
            {popupmessage}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          {patientdetails.length > 0 ? (
            <Box>
              {patientdetails.map((patientDetail, index) => (
                <Card
                  key={index}
                  variant="outlined"
                  sx={{
                    m: 2,
                    cursor: "pointer",
                    borderColor:
                      selectedPatient === patientDetail
                        ? "primary.main"
                        : "divider",
                    boxShadow:
                      selectedPatient === patientDetail
                        ? "0 0 0 2px #1976d2"
                        : "none",
                    transition: "all 0.2s ease-in-out",
                  }}
                  onClick={() => setSelectedPatient(patientDetail)}
                >
                  <CardContent>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedPatient === patientDetail}
                          onChange={() =>
                            setSelectedPatient(
                              selectedPatient === patientDetail
                                ? null
                                : patientDetail
                            )
                          }
                        />
                      }
                      label={
                        <Box>
                          <Typography variant="subtitle1">
                            {patientDetail.MPD_PATIENT_NAME}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {patientDetail.MPD_MOBILE_NO}
                          </Typography>
                        </Box>
                      }
                    />
                  </CardContent>
                </Card>
              ))}
            </Box>
          ) : (
            <Typography variant="body2" sx={{ p: 3 }}>
              No patient records found.
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setPatientlistpopup(false)} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={proceedWithLogin}
            variant="contained"
            disabled={!selectedPatient}
          >
            Proceed
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
