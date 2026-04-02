// //Patient Profile Details Section
// import axios from "axios";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom"; // Import useNavigate
// import "../styles/profile.css";

// export default function Profile() {
//   const [userAppointments, setUserAppointments] = useState([]);
//   const [displayedAppointments, setDisplayedAppointments] = useState([]); // New state for displayed appointments
//   const email1 = localStorage.getItem("Email");
//   const [profiledata, setProfiledata] = useState({});
//   const [isEditing, setIsEditing] = useState(false);
//   const [updatedProfile, setUpdatedProfile] = useState({});
//   const [profileImage, setProfileImage] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [emailerror, setEmailerror] = useState("");
//   const [mobilerror, setMobilerror] = useState("");
//   const [nicerror, setNicerror] = useState("");
//   const patientid = localStorage.getItem("PatientCode");
//   const navigate = useNavigate(); // Initialize useNavigate

//   const [showAllAppointments, setShowAllAppointments] = useState(false); // New state to track the toggle

//   const handleToggleAppointments = () => {
//     if (showAllAppointments) {
//       setDisplayedAppointments(userAppointments.slice(0, 5)); // Show only first 5
//     } else {
//       setDisplayedAppointments(userAppointments); // Show all appointments
//     }
//     setShowAllAppointments(!showAllAppointments); // Toggle the state
//   };

//   const fetchAppointmentDetails = async () => {
//     if (email1) {
//       try {
//         const response = await axios.get(
//           `${process.env.REACT_APP_API_BASE_URL}/Appointment/getappointment/patientcode?patientcode=${patientid}`
//         );
//         setUserAppointments(response.data);
//         setDisplayedAppointments(response.data.slice(0, 5)); // Initially display the first 5 appointments
//       } catch (error) {
//         console.error("Error fetching appointment details:", error);
//       }
//     } else {
//       console.warn("No email found in localStorage");
//     }
//   };

//   const fetchProfileDetails = async () => {
//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API_BASE_URL}/Patient/patient/findbyid?patientcode=${patientid}`
//       );
//       setProfiledata(response.data);
//       setUpdatedProfile(response.data);

//       if (response.data.MPD_PHOTO) {
//         setImagePreview(`data:image/jpeg;base64,${response.data.MPD_PHOTO}`);
//       }
//     } catch (error) {
//       console.error("Error fetching patient details:", error);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;

//     // Update the state
//     setUpdatedProfile({ ...updatedProfile, [name]: value });

//     // Real-time validation
//     if (name === "MPD_EMAIL") {
//       const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//       if (!emailRegex.test(value)) {
//         setEmailerror("Please enter a valid email address.");
//       } else {
//         setEmailerror("");
//       }
//     }

//     if (name === "MPD_MOBILE_NO") {
//       const mobileRegex = /^\d{10}$/; // Example for a 10-digit mobile number
//       if (!mobileRegex.test(value)) {
//         setMobilerror("Please enter a valid 10-digit mobile number.");
//       } else {
//         setMobilerror("");
//       }
//     }

//     if (name === "MPD_NIC_NO") {
//       if (value.length !== 10 && value.length !== 12) {
//         setNicerror("NIC must be 10 or 12 characters long.");
//       } else {
//         setNicerror("");
//       }
//     }
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     setProfileImage(file);
//     setImagePreview(URL.createObjectURL(file));
//   };

//   const handleSave = async (e) => {
//     e.preventDefault();

//     if (emailerror || mobilerror || nicerror) {
//       alert("Please correct the errors before updating the profile.");
//       return;
//     }

//     const formData = new FormData();
//     Object.keys(updatedProfile).forEach((key) => {
//       if (updatedProfile[key] !== null) {
//         formData.append(key, updatedProfile[key]);
//       }
//     });

//     if (profileImage) {
//       formData.append("profileImage", profileImage);
//     }

//     try {
//       await axios.put(
//         `${process.env.REACT_APP_API_BASE_URL}/Patient/${updatedProfile.MPD_PATIENT_CODE}`,
//         formData,
//         { headers: { "Content-Type": "multipart/form-data" } }
//       );
//       setProfiledata(updatedProfile);
//       alert("Profile details updated");
//       setIsEditing(false);
//     } catch (error) {
//       console.error("Error updating profile:", error);
//     }
//   };

//   const handleShowAllAppointments = () => {
//     setDisplayedAppointments(userAppointments); // Show all appointments when button is clicked
//   };

//   useEffect(() => {
//     fetchAppointmentDetails();
//     fetchProfileDetails();
//   }, [email1]);

//   return (
//     <div className="profile-body">
//       <div className="profile-container">
//         <button className="back-button" onClick={() => navigate(-1)}>
//           Go Back
//         </button>

//         {/* Profile details Section */}
//         <section className="profile-details">
//           <h2 className="section-title">Profile</h2>
//           <form onSubmit={handleSave}>
//             <div className="profile-icon-wrapper">
//               <label
//                 htmlFor="profileImageUpload"
//                 className="profile-image-label"
//               >
//                 <img
//                   src={imagePreview || "default-profile-icon.png"}
//                   alt="Profile"
//                   className="profile-icon"
//                 />
//               </label>
//               <input
//                 id="profileImageUpload"
//                 type="file"
//                 name="profileImage"
//                 accept="image/*"
//                 onChange={handleImageChange}
//                 style={{ display: "none" }}
//               />
//             </div>

//             <div className="profile-input-group">
//               <label htmlFor="MPD_EMAIL">Email</label>
//               <input
//                 type="text"
//                 name="MPD_EMAIL"
//                 id="MPD_EMAIL"
//                 value={updatedProfile?.MPD_EMAIL || "Email not available"}
//                 onChange={handleInputChange}
//               />
//               {emailerror && <p className="error-message">{emailerror}</p>}
//             </div>

//             <div className="profile-input-group">
//               <label htmlFor="MPD_PATIENT_NAME">Name</label>
//               <input
//                 type="text"
//                 name="MPD_PATIENT_NAME"
//                 id="MPD_PATIENT_NAME"
//                 value={updatedProfile?.MPD_PATIENT_NAME || "Name not available"}
//                 onChange={handleInputChange}
//               />
//             </div>

//             <div className="profile-input-group">
//               <label htmlFor="MPD_MOBILE_NO">Mobile Number</label>
//               <input
//                 type="text"
//                 name="MPD_MOBILE_NO"
//                 id="MPD_MOBILE_NO"
//                 value={
//                   updatedProfile?.MPD_MOBILE_NO || "Mobile number not available"
//                 }
//                 onChange={handleInputChange}
//               />
//               {mobilerror && <p className="error-message">{mobilerror}</p>}
//             </div>

//             <div className="profile-input-group">
//               <label htmlFor="MPD_ADDRESS">Address</label>
//               <input
//                 type="text"
//                 name="MPD_ADDRESS"
//                 id="MPD_ADDRESS"
//                 value={updatedProfile?.MPD_ADDRESS || "Address not available"}
//                 onChange={handleInputChange}
//               />
//             </div>

//             <div className="profile-input-group">
//               <label htmlFor="MPD_NIC_NO">NIC</label>
//               <input
//                 type="text"
//                 name="MPD_NIC_NO"
//                 id="MPD_NIC_NO"
//                 value={updatedProfile?.MPD_NIC_NO || "NIC not available"}
//                 onChange={handleInputChange}
//               />
//               {nicerror && <p className="error-message">{nicerror}</p>}
//             </div>

//             {/* <div className="button-group">
//               {isEditing ? (
//                 <button type="submit" className="save-button">Save Profile</button>
//               ) : (
//                 <button type="button" className="edit-button" onClick={() => setIsEditing(true)}>
//                   Update Profile
//                 </button>
//               )}
//             </div> */}
//           </form>
//         </section>

//         {/* Appointments Table       */}
//         <section className="user-appointments">
//           <h2 className="section-title">Your Appointments</h2>

//           <div className="user-appoiment-table">
//             {displayedAppointments.length > 0 ? (
//               <table className="appointments-table">
//                 <thead>
//                   <tr>
//                     <th>Doctor</th>
//                     <th>Date</th>
//                     <th>Doctor available time</th>
//                     <th>Your time</th>
//                     <th>Status</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {displayedAppointments.map((appointment, index) => (
//                     <tr key={index}>
//                       <td>Dr {appointment.MAD_DOCTOR}</td>
//                       <td style={{ textAlign: "center" }}>
//                         {
//                           new Date(appointment.MAD_APPOINMENT_DATE)
//                             .toISOString()
//                             .split("T")[0]
//                         }
//                       </td>
//                       <td>
//                         {new Date(
//                           `1970-01-01T${appointment.MAD_START_TIME}`
//                         ).toLocaleTimeString("en-LK", {
//                           timeZone: "Asia/Colombo",
//                           hour: "numeric",
//                           minute: "numeric",
//                           hour12: true,
//                         })}
//                         -
//                         {new Date(
//                           `1970-01-01T${appointment.MAD_END_TIME}`
//                         ).toLocaleTimeString("en-LK", {
//                           timeZone: "Asia/Colombo",
//                           hour: "numeric",
//                           minute: "numeric",
//                           hour12: true,
//                         })}
//                       </td>
//                       <td>
//                         {new Date(
//                           `1970-01-01T${appointment.MAD_ALLOCATED_TIME}`
//                         ).toLocaleTimeString("en-LK", {
//                           timeZone: "Asia/Colombo",
//                           hour: "numeric",
//                           minute: "numeric",
//                           hour12: true,
//                         })}
//                       </td>
//                       <td
//                         style={{
//                           backgroundColor:
//                             appointment.TreatmentStatus === "Completed"
//                               ? "green"
//                               : "#FF474D",
//                           color: "white",
//                         }}
//                       >
//                         {appointment.TreatmentStatus}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             ) : (
//               <p>No appointments found.</p>
//             )}
//           </div>

//           {/* Show 'Show All' button if there are more than 5 appointments */}
//           {userAppointments.length > 5 && (
//             <button
//               onClick={handleToggleAppointments}
//               className="show-all-button"
//             >
//               {showAllAppointments ? "Show Less" : "Show More"}
//             </button>
//           )}
//         </section>
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  styled,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Snackbar,
  Alert,
  InputAdornment,
  Chip,
} from "@mui/material";
import {
  Edit as EditIcon,
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  ExpandMore as ExpandMoreIcon,
  Person as PersonIcon,
  Cancel as CancelIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  Badge as BadgeIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  MedicalServices as MedicalIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelStatusIcon,
  MoreHoriz as MoreHorizIcon,
} from "@mui/icons-material";

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(15),
  height: theme.spacing(15),
  margin: "0 auto",
  cursor: "pointer",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: theme.shadows[4],
  },
  [theme.breakpoints.down("sm")]: {
    width: theme.spacing(12),
    height: theme.spacing(12),
  },
}));

const StatusBadge = styled(Chip)(({ theme, status }) => ({
  fontWeight: theme.typography.fontWeightMedium,
  backgroundColor:
    status === "Completed"
      ? theme.palette.success.light
      : theme.palette.error.light,
  color: "#fff",
  "& .MuiChip-icon": {
    color:
      status === "Completed"
        ? theme.palette.success.dark
        : theme.palette.error.dark,
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5, 3),
  borderRadius: theme.shape.borderRadius * 2,
  fontWeight: theme.typography.fontWeightBold,
  textTransform: "none",
  letterSpacing: 0.5,
  boxShadow: theme.shadows[2],
  "&:hover": {
    boxShadow: theme.shadows[4],
  },
}));

const ProfileCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 3,
  boxShadow: theme.shadows[4],
  background: theme.palette.background.paper,
  transition: "all 0.3s ease",
  "&:hover": {
    boxShadow: theme.shadows[8],
  },
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  },
}));

const AppointmentTableRow = styled(TableRow)(({ theme }) => ({
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function Profile() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const [userAppointments, setUserAppointments] = useState([]);
  const [displayedAppointments, setDisplayedAppointments] = useState([]);
  const email1 = localStorage.getItem("Email");
  const [profiledata, setProfiledata] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({});
  const [originalProfile, setOriginalProfile] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [emailerror, setEmailerror] = useState("");
  const [mobilerror, setMobilerror] = useState("");
  const [nicerror, setNicerror] = useState("");
  const patientid = localStorage.getItem("PatientCode");
  const [showAllAppointments, setShowAllAppointments] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleToggleAppointments = () => {
    if (showAllAppointments) {
      setDisplayedAppointments(userAppointments.slice(0, 5));
    } else {
      setDisplayedAppointments(userAppointments);
    }
    setShowAllAppointments(!showAllAppointments);
  };

  const fetchAppointmentDetails = async () => {
    if (email1) {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/Appointment/getappointment/patientcode?patientcode=${patientid}`,
        );
        setUserAppointments(response.data);
        setDisplayedAppointments(response.data.slice(0, 5));
      } catch (error) {
        console.error("Error fetching appointment details:", error);
        showSnackbar("Failed to load appointments", "error");
      }
    } else {
      console.warn("No email found in localStorage");
    }
  };

  const fetchProfileDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/Patient/patient/findbyid?patientcode=${patientid}`,
      );
      setProfiledata(response.data);
      setUpdatedProfile(response.data);
      setOriginalProfile(response.data);

      if (response.data.MPD_PHOTO) {
        setImagePreview(`data:image/jpeg;base64,${response.data.MPD_PHOTO}`);
      }
    } catch (error) {
      console.error("Error fetching patient details:", error);
      showSnackbar("Failed to load profile data", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setUpdatedProfile({ ...updatedProfile, [name]: value });

    if (name === "MPD_EMAIL") {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(value)) {
        setEmailerror("Please enter a valid email address.");
      } else {
        setEmailerror("");
      }
    }

    if (name === "MPD_MOBILE_NO") {
      const mobileRegex = /^\d{10}$/;
      if (!mobileRegex.test(value)) {
        setMobilerror("Please enter a valid 10-digit mobile number.");
      } else {
        setMobilerror("");
      }
    }

    if (name === "MPD_NIC_NO") {
      if (value.length !== 10 && value.length !== 12) {
        setNicerror("NIC must be 10 or 12 characters long.");
      } else {
        setNicerror("");
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showSnackbar("Image size should be less than 2MB", "error");
        return;
      }
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (emailerror || mobilerror || nicerror) {
      showSnackbar("Please correct the errors before saving", "error");
      return;
    }

    const formData = new FormData();
    Object.keys(updatedProfile).forEach((key) => {
      if (updatedProfile[key] !== null) {
        formData.append(key, updatedProfile[key]);
      }
    });

    if (profileImage) {
      formData.append("profileImage", profileImage);
    }

    try {
      setLoading(true);
      await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/Patient/${updatedProfile.MPD_PATIENT_CODE}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      setProfiledata(updatedProfile);
      setOriginalProfile(updatedProfile);
      showSnackbar("Profile updated successfully!", "success");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      showSnackbar("Failed to update profile. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setUpdatedProfile(originalProfile);
    setImagePreview(
      originalProfile.MPD_PHOTO
        ? `data:image/jpeg;base64,${originalProfile.MPD_PHOTO}`
        : null,
    );
    setProfileImage(null);
    setEmailerror("");
    setMobilerror("");
    setNicerror("");
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  useEffect(() => {
    fetchAppointmentDetails();
    fetchProfileDetails();
  }, [email1]);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          variant="outlined"
          color="primary"
          onClick={() => navigate(-1)}
          sx={{ mb: 3, borderRadius: 2 }}
        >
          Back
        </Button>

        <ProfileCard elevation={3}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography
              variant="h5"
              component="h2"
              sx={{
                fontWeight: "bold",
                color: theme.palette.primary.dark,
                display: "flex",
                alignItems: "center",
              }}
            >
              <MedicalIcon color="primary" sx={{ mr: 1 }} />
              Patient Profile
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 4,
            }}
          >
            <input
              accept="image/*"
              id="profileImageUpload"
              type="file"
              style={{ display: "none" }}
              onChange={handleImageChange}
              disabled={!isEditing}
            />
            <label htmlFor="profileImageUpload">
              <IconButton component="span" disabled={!isEditing}>
                <ProfileAvatar
                  src={imagePreview}
                  alt="Profile"
                  sx={{
                    border: `3px solid ${theme.palette.primary.main}`,
                  }}
                >
                  {!imagePreview && <PersonIcon sx={{ fontSize: 60 }} />}
                </ProfileAvatar>
              </IconButton>
            </label>
            <Typography
              variant="h4"
              sx={{ mt: 2, fontWeight: "bold" }}
              color="text.primary"
            >
              {profiledata.MPD_PATIENT_NAME || "Name not available"}
            </Typography>
            <Chip
              label={`Patient ID: ${patientid}`}
              variant="outlined"
              size="medium"
              sx={{ mt: 1 }}
              color="primary"
            />
          </Box>

          <CardContent>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6} md={4} lg={2.4}>
                <TextField
                  fullWidth
                  label="Email"
                  name="MPD_EMAIL"
                  value={updatedProfile?.MPD_EMAIL || ""}
                  onChange={handleInputChange}
                  error={!!emailerror}
                  helperText={emailerror}
                  disabled={!isEditing}
                  variant={isEditing ? "outlined" : "filled"}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color="primary" />
                      </InputAdornment>
                    ),
                    readOnly: !isEditing,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={2.4}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="MPD_PATIENT_NAME"
                  value={updatedProfile?.MPD_PATIENT_NAME || ""}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  variant={isEditing ? "outlined" : "filled"}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon color="primary" />
                      </InputAdornment>
                    ),
                    readOnly: !isEditing,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={2.4}>
                <TextField
                  fullWidth
                  label="Mobile Number"
                  name="MPD_MOBILE_NO"
                  value={updatedProfile?.MPD_MOBILE_NO || ""}
                  onChange={handleInputChange}
                  error={!!mobilerror}
                  helperText={mobilerror}
                  disabled={!isEditing}
                  variant={isEditing ? "outlined" : "filled"}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon color="primary" />
                      </InputAdornment>
                    ),
                    readOnly: !isEditing,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={2.4}>
                <TextField
                  fullWidth
                  label="NIC Number"
                  name="MPD_NIC_NO"
                  value={updatedProfile?.MPD_NIC_NO || ""}
                  onChange={handleInputChange}
                  error={!!nicerror}
                  helperText={nicerror}
                  disabled={!isEditing}
                  variant={isEditing ? "outlined" : "filled"}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BadgeIcon color="primary" />
                      </InputAdornment>
                    ),
                    readOnly: !isEditing,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={2.4}>
                <TextField
                  fullWidth
                  label="Address"
                  name="MPD_ADDRESS"
                  value={updatedProfile?.MPD_ADDRESS || ""}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  variant={isEditing ? "outlined" : "filled"}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <HomeIcon color="primary" />
                      </InputAdornment>
                    ),
                    readOnly: !isEditing,
                  }}
                />
              </Grid>
            </Grid>

            <Box
              sx={{
                display: "flex",
                justifyContent: "right",
                gap: 2,
                mt: 4,
                mb: 4,
              }}
            >
              {isEditing ? (
                <>
                  <ActionButton
                    startIcon={<CancelIcon />}
                    variant="outlined"
                    color="error"
                    onClick={handleCancelEdit}
                    disabled={loading}
                  >
                    Cancel
                  </ActionButton>
                  <ActionButton
                    startIcon={
                      loading ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        <SaveIcon />
                      )
                    }
                    variant="contained"
                    color="primary"
                    onClick={handleSave}
                    disabled={
                      !!(emailerror || mobilerror || nicerror) || loading
                    }
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </ActionButton>
                </>
              ) : (
                <ActionButton
                  startIcon={<EditIcon />}
                  variant="contained"
                  color="primary"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </ActionButton>
              )}
            </Box>

            <Divider sx={{ my: 4 }} />

            <Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{
                    fontWeight: "bold",
                    color: theme.palette.primary.dark,
                  }}
                >
                  <MedicalIcon
                    color="primary"
                    sx={{ verticalAlign: "middle", mr: 1 }}
                  />
                  Your Appointments
                </Typography>
                {userAppointments.length > 5 && (
                  <Button
                    endIcon={
                      showAllAppointments ? (
                        <ExpandMoreIcon />
                      ) : (
                        <MoreHorizIcon />
                      )
                    }
                    onClick={handleToggleAppointments}
                    color="primary"
                    size="small"
                    sx={{ textTransform: "none" }}
                  >
                    {showAllAppointments ? "Show Less" : "Show More"}
                  </Button>
                )}
              </Box>

              {displayedAppointments.length > 0 ? (
                <TableContainer component={Paper} elevation={0}>
                  <Table>
                    <TableHead>
                      <TableRow
                        sx={{
                          backgroundColor: theme.palette.primary.light,
                          "& th": {
                            color: theme.palette.primary.contrastText,
                            fontWeight: "bold",
                          },
                        }}
                      >
                        <TableCell>Doctor</TableCell>
                        <TableCell align="center">Date</TableCell>
                        {!isMobile && (
                          <>
                            <TableCell>Doctor Schedule</TableCell>
                            <TableCell>Your Time</TableCell>
                          </>
                        )}
                        <TableCell align="center">Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {displayedAppointments.map((appointment, index) => (
                        <AppointmentTableRow key={index} hover>
                          <TableCell>
                            <Box sx={{ fontWeight: "medium" }}>
                              Dr. {appointment.MAD_DOCTOR}
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                              }}
                            >
                              <CalendarIcon
                                color="primary"
                                fontSize="small"
                                sx={{ mb: 0.5 }}
                              />
                              {formatDate(appointment.MAD_APPOINMENT_DATE)}
                            </Box>
                          </TableCell>
                          {!isMobile && (
                            <>
                              <TableCell>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <TimeIcon
                                    color="primary"
                                    fontSize="small"
                                    sx={{ mr: 1 }}
                                  />
                                  {formatTime(appointment.MAD_START_TIME)} -{" "}
                                  {formatTime(appointment.MAD_END_TIME)}
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <TimeIcon
                                    color="primary"
                                    fontSize="small"
                                    sx={{ mr: 1 }}
                                  />
                                  {formatTime(appointment.MAD_ALLOCATED_TIME)}
                                </Box>
                              </TableCell>
                            </>
                          )}
                          <TableCell align="center">
                            <StatusBadge
                              status={appointment.TreatmentStatus}
                              icon={
                                appointment.TreatmentStatus === "Completed" ? (
                                  <CheckCircleIcon fontSize="small" />
                                ) : (
                                  <CancelStatusIcon fontSize="small" />
                                )
                              }
                              label={appointment.TreatmentStatus}
                            />
                          </TableCell>
                        </AppointmentTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box
                  sx={{
                    textAlign: "center",
                    py: 4,
                    backgroundColor: theme.palette.grey[50],
                    borderRadius: theme.shape.borderRadius,
                  }}
                >
                  <Typography variant="body1" color="textSecondary">
                    No appointments found.
                  </Typography>
                </Box>
              )}
            </Box>
          </CardContent>
        </ProfileCard>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {/* <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert> */}
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          variant="filled"
          sx={{
            width: "100%",
            minWidth: "420px",
            fontSize: "1.1rem",
            fontWeight: 600,
            py: 1.5,
            px: 2,
            borderRadius: "14px",
            boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
            "& .MuiAlert-icon": {
              fontSize: "32px",
              alignItems: "center",
            },
            "& .MuiAlert-message": {
              fontSize: "1.05rem",
              fontWeight: 600,
            },
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}
