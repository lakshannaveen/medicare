// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "../styles/doctorprofile.css";

// export default function Doctorprofile() {
//   const [userDetails, setUserDetails] = useState({
//     MUD_USER_NAME: "",
//     MUD_USER_TYPE: "",
//     MUD_SPECIALIZATION: "",
//     MUD_STATUS: "",
//     MUD_PHOTO: null,
//     MUD_CONTACT: "",
//     MUD_EMAIL: "",
//     MUD_CREATED_DATE: "",
//     MUD_NIC_NO: "",
//     MUD_PASSWORD: "",
//     MUD_FULL_NAME: "",
//   });
//   const [imagePreview, setImagePreview] = useState("default-profile-icon.png");
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState({
//     MUD_CONTACT: "",
//     MUD_EMAIL: "",
//   });

//   const id = localStorage.getItem("id");

//   useEffect(() => {
//     if (!id) {
//       console.error("User ID is missing");
//       return;
//     }

//     const fetchUserDetails = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.get(
//           `${process.env.REACT_APP_API_BASE_URL}/User/${id}`
//         );
//         const data = response.data;

//         // Update MUD_USER_TYPE to "Doctor" if the response returns "doc     "
//         if (data.MUD_USER_TYPE === "Doc") {
//           data.MUD_USER_TYPE = "Doctor";
//         }
//         if (data.MUD_USER_TYPE === "Phuser") {
//           data.MUD_USER_TYPE = "Pharmacy user";
//         }
//         setUserDetails(data);

//         if (data.MUD_PHOTO) {
//           setImagePreview(`data:image/png;base64,${data.MUD_PHOTO}`);
//         }
//       } catch (error) {
//         console.error("Error fetching user details:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserDetails();
//   }, [id]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setUserDetails((prevDetails) => ({ ...prevDetails, [name]: value }));

//     if (name === "MUD_CONTACT") {
//       const isValidContact = /^[0-9]{10}$/.test(value);
//       setErrors((prevErrors) => ({
//         ...prevErrors,
//         MUD_CONTACT: isValidContact ? "" : "Contact number must be 10 digits.",
//       }));
//     } else if (name === "MUD_EMAIL") {
//       const isValidEmail =
//         /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i.test(value);
//       setErrors((prevErrors) => ({
//         ...prevErrors,
//         MUD_EMAIL: isValidEmail ? "" : "Please enter a valid email address.",
//       }));
//     } else if (name === "MUD_NIC_NO") {
//       const isValidNIC = /^[0-9]{9}[vV]$|^[0-9]{12}$/.test(value);
//       setErrors((prevErrors) => ({
//         ...prevErrors,
//         MUD_NIC_NO: isValidNIC ? "" : "Please enter a valid NIC number.",
//       }));
//     }
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setSelectedFile(file);
//       setImagePreview(URL.createObjectURL(file));
//     }
//   };

//   const updateUserProfile = async () => {
//     if (errors.MUD_CONTACT || errors.MUD_EMAIL || errors.MUD_NIC_NO) {
//       alert("Please fix validation errors before updating the profile.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("MUD_USER_ID", id);
//     formData.append("MUD_USER_NAME", userDetails.MUD_USER_NAME);

//     let userType = userDetails.MUD_USER_TYPE;
//     if (userType === "Doctor") {
//       userType = "Doc";
//     } else if (userType === "Pharmacy user") {
//       userType = "Phuser";
//     }
//     formData.append("MUD_USER_TYPE", userType);

//     formData.append("MUD_SPECIALIZATION", userDetails.MUD_SPECIALIZATION);
//     formData.append("MUD_FULL_NAME", userDetails.MUD_FULL_NAME);
//     formData.append("MUD_STATUS", userDetails.MUD_STATUS);
//     formData.append("MUD_NIC_NO", userDetails.MUD_NIC_NO);
//     formData.append("MUD_CONTACT", userDetails.MUD_CONTACT);
//     formData.append("MUD_EMAIL", userDetails.MUD_EMAIL);
//     formData.append("MUD_PASSWORD", userDetails.MUD_PASSWORD);

//     if (selectedFile) {
//       formData.append("MUD_PHOTO", selectedFile);
//     }

//     try {
//       setLoading(true);
//       await axios.put(
//         `${process.env.REACT_APP_API_BASE_URL}/User/${id}`,
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );
//       alert("Profile updated successfully!");
//     } catch (error) {
//       if (error.response && error.response.status === 409) {
//         alert(error.response.data); // Display the error message from the server
//       } else {
//         console.error("Error:", error);
//         alert("An unknown error occurred.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Helper function to format date
//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-GB"); // Formats to DD/MM/YYYY
//   };

//   return (
//     <div className="doctor-profile-container">
//       <h1>Your Profile</h1>

//       <label htmlFor="profileImageUpload" className="profile-image-label">
//         <img src={imagePreview} alt="Profile" className="profile-icon" />
//         <span className="edit-icon">✏️</span>
//       </label>

//       <input
//         id="profileImageUpload"
//         type="file"
//         name="profileImage"
//         accept="image/*"
//         style={{ display: "none" }}
//         onChange={handleImageChange}
//       />

//       <div className="user-form">
//         <div className="form-grid">
//           <div className="form-group">
//             <label>Username</label>
//             <input
//               type="text"
//               name="MUD_USER_NAME"
//               value={userDetails.MUD_USER_NAME || ""}
//               onChange={handleInputChange}
//               placeholder="Enter username"
//             />
//           </div>

//           <div className="form-group">
//             <label>Password</label>
//             <input
//               type="password"
//               name="MUD_PASSWORD"
//               value={userDetails.MUD_PASSWORD || ""}
//               onChange={handleInputChange}
//             />
//           </div>

//           <div className="form-group">
//             <label>Name</label>
//             <input
//               type="text"
//               name="MUD_FULL_NAME"
//               value={userDetails.MUD_FULL_NAME || ""}
//               onChange={handleInputChange}
//               placeholder="Enter your full name"
//             />
//           </div>
//           <div className="form-group">
//             <label>NIC number</label>
//             <input
//               type="text"
//               name="MUD_NIC_NO"
//               value={userDetails.MUD_NIC_NO || ""}
//               onChange={handleInputChange}
//               placeholder="Add NIC"
//             />
//             {errors.MUD_NIC_NO && (
//               <span className="error-text">{errors.MUD_NIC_NO}</span>
//             )}
//           </div>

//           <div className="form-group">
//             <label>User Category</label>
//             <input
//               type="text"
//               name="MUD_USER_TYPE"
//               value={userDetails.MUD_USER_TYPE || ""}
//               onChange={handleInputChange}
//               placeholder="Enter user category"
//               readOnly
//             />
//           </div>

//           <div className="form-group">
//             <label>Registered Date</label>
//             <input
//               type="text"
//               name="MUD_CREATED_DATE"
//               value={formatDate(userDetails.MUD_CREATED_DATE) || ""}
//               readOnly
//             />
//           </div>

//           <div className="form-group">
//             <label>Email</label>
//             <input
//               type="email"
//               name="MUD_EMAIL"
//               value={userDetails.MUD_EMAIL || ""}
//               onChange={handleInputChange}
//               placeholder="Enter email"
//             />

//             {errors.MUD_EMAIL && (
//               <span className="error-text">{errors.MUD_EMAIL}</span>
//             )}
//           </div>

//           <div className="form-group">
//             <label>Contact</label>
//             <input
//               type="text"
//               name="MUD_CONTACT"
//               value={userDetails.MUD_CONTACT || ""}
//               onChange={handleInputChange}
//             />
//             {errors.MUD_CONTACT && (
//               <span className="error-text">{errors.MUD_CONTACT}</span>
//             )}
//           </div>
//         </div>

//         <button
//           onClick={updateUserProfile}
//           className="update-profile-button"
//           disabled={loading}
//         >
//           {loading ? "Updating..." : "Save"}
//         </button>
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  TextField,
  Typography,
  Avatar,
  InputAdornment,
  FormControl,
  InputLabel,
  OutlinedInput,
  Snackbar,
  Alert,
  Divider,
  useTheme,
  useMediaQuery,
  Paper,
} from "@mui/material";
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Person as PersonIcon,
  Badge as BadgeIcon,
  Lock as LockIcon,
  CalendarToday as CalendarIcon,
  Category as CategoryIcon,
} from "@mui/icons-material";

export default function DoctorProfile() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [userDetails, setUserDetails] = useState({
    MUD_USER_NAME: "",
    MUD_USER_TYPE: "",
    MUD_SPECIALIZATION: "",
    MUD_STATUS: "",
    MUD_PHOTO: null,
    MUD_CONTACT: "",
    MUD_EMAIL: "",
    MUD_CREATED_DATE: "",
    MUD_NIC_NO: "",
    MUD_PASSWORD: "",
    MUD_FULL_NAME: "",
  });
  const [imagePreview, setImagePreview] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    MUD_CONTACT: "",
    MUD_EMAIL: "",
    MUD_NIC_NO: "",
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const id = localStorage.getItem("id");

  useEffect(() => {
    if (!id) {
      console.error("User ID is missing");
      return;
    }

    const fetchUserDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/User/${id}`,
        );
        const data = response.data;

        // Update user type for display
        if (data.MUD_USER_TYPE === "Doc") {
          data.MUD_USER_TYPE = "Doctor";
        }
        if (data.MUD_USER_TYPE === "Phuser") {
          data.MUD_USER_TYPE = "Pharmacy User";
        }

        setUserDetails(data);

        if (data.MUD_PHOTO) {
          setImagePreview(`data:image/png;base64,${data.MUD_PHOTO}`);
        } else {
          setImagePreview(""); // Will show default avatar
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        showSnackbar("Failed to load profile data", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [id]);

  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevDetails) => ({ ...prevDetails, [name]: value }));

    // Validation
    if (name === "MUD_CONTACT") {
      const isValidContact = /^[0-9]{10}$/.test(value);
      setErrors((prevErrors) => ({
        ...prevErrors,
        MUD_CONTACT: isValidContact ? "" : "Contact number must be 10 digits",
      }));
    } else if (name === "MUD_EMAIL") {
      const isValidEmail =
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i.test(value);
      setErrors((prevErrors) => ({
        ...prevErrors,
        MUD_EMAIL: isValidEmail ? "" : "Please enter a valid email address",
      }));
    } else if (name === "MUD_NIC_NO") {
      const isValidNIC = /^[0-9]{9}[vV]$|^[0-9]{12}$/.test(value);
      setErrors((prevErrors) => ({
        ...prevErrors,
        MUD_NIC_NO: isValidNIC ? "" : "Please enter a valid NIC number",
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showSnackbar("Image size should be less than 2MB", "error");
        return;
      }
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const updateUserProfile = async () => {
    if (errors.MUD_CONTACT || errors.MUD_EMAIL || errors.MUD_NIC_NO) {
      showSnackbar("Please fix validation errors before saving", "error");
      return;
    }

    const formData = new FormData();
    formData.append("MUD_USER_ID", id);
    formData.append("MUD_USER_NAME", userDetails.MUD_USER_NAME);

    // Convert display type back to API type
    let userType = userDetails.MUD_USER_TYPE;
    if (userType === "Doctor") {
      userType = "Doc";
    } else if (userType === "Pharmacy User") {
      userType = "Phuser";
    }
    formData.append("MUD_USER_TYPE", userType);

    formData.append("MUD_SPECIALIZATION", userDetails.MUD_SPECIALIZATION);
    formData.append("MUD_FULL_NAME", userDetails.MUD_FULL_NAME);
    formData.append("MUD_STATUS", userDetails.MUD_STATUS);
    formData.append("MUD_NIC_NO", userDetails.MUD_NIC_NO);
    formData.append("MUD_CONTACT", userDetails.MUD_CONTACT);
    formData.append("MUD_EMAIL", userDetails.MUD_EMAIL);
    formData.append("MUD_PASSWORD", userDetails.MUD_PASSWORD);

    if (selectedFile) {
      formData.append("MUD_PHOTO", selectedFile);
    }

    try {
      setLoading(true);
      await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/User/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      showSnackbar("Profile updated successfully!", "success");
    } catch (error) {
      if (error.response && error.response.status === 409) {
        showSnackbar(error.response.data, "error");
      } else {
        console.error("Error:", error);
        showSnackbar("Failed to update profile", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              alignItems: "center",
              mb: 4,
              gap: 3,
            }}
          >
            <Box sx={{ position: "relative" }}>
              <Avatar
                src={imagePreview}
                sx={{
                  width: 120,
                  height: 120,
                  fontSize: 60,
                  bgcolor: theme.palette.primary.main,
                }}
              >
                {!imagePreview &&
                  (userDetails.MUD_FULL_NAME
                    ? userDetails.MUD_FULL_NAME.charAt(0).toUpperCase()
                    : "U")}
              </Avatar>
              <IconButton
                component="label"
                sx={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  bgcolor: theme.palette.background.paper,
                  "&:hover": {
                    bgcolor: theme.palette.grey[200],
                  },
                }}
              >
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <EditIcon fontSize="small" />
              </IconButton>
            </Box>

            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h4" component="h1">
                {userDetails.MUD_FULL_NAME || "Your Profile"}
              </Typography>
              <Typography
                variant="subtitle1"
                color="textSecondary"
                sx={{ display: "flex", alignItems: "center", mt: 1 }}
              >
                <CategoryIcon
                  fontSize="small"
                  sx={{ mr: 1, color: "primary.main" }}
                />
                {userDetails.MUD_USER_TYPE || "User"}
              </Typography>
              <Typography
                variant="subtitle2"
                color="textSecondary"
                sx={{ display: "flex", alignItems: "center", mt: 1 }}
              >
                <CalendarIcon
                  fontSize="small"
                  sx={{ mr: 1, color: "primary.main" }}
                />
                Member since: {formatDate(userDetails.MUD_CREATED_DATE)}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Username"
                name="MUD_USER_NAME"
                value={userDetails.MUD_USER_NAME || ""}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: "primary.main" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel htmlFor="password">Password</InputLabel>
                <OutlinedInput
                  id="password"
                  type="password"
                  name="MUD_PASSWORD"
                  value={userDetails.MUD_PASSWORD || ""}
                  onChange={handleInputChange}
                  label="Password"
                  startAdornment={
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: "primary.main" }} />
                    </InputAdornment>
                  }
                />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                name="MUD_FULL_NAME"
                value={userDetails.MUD_FULL_NAME || ""}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: "primary.main" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="NIC Number"
                name="MUD_NIC_NO"
                value={userDetails.MUD_NIC_NO || ""}
                onChange={handleInputChange}
                error={!!errors.MUD_NIC_NO}
                helperText={errors.MUD_NIC_NO}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BadgeIcon sx={{ color: "primary.main" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="User Type"
                name="MUD_USER_TYPE"
                value={userDetails.MUD_USER_TYPE || ""}
                onChange={handleInputChange}
                InputProps={{
                  readOnly: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <CategoryIcon sx={{ color: "primary.main" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="MUD_EMAIL"
                type="email"
                value={userDetails.MUD_EMAIL || ""}
                onChange={handleInputChange}
                error={!!errors.MUD_EMAIL}
                helperText={errors.MUD_EMAIL}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: "primary.main" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Contact Number"
                name="MUD_CONTACT"
                value={userDetails.MUD_CONTACT || ""}
                onChange={handleInputChange}
                error={!!errors.MUD_CONTACT}
                helperText={errors.MUD_CONTACT}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon sx={{ color: "primary.main" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Registration Date"
                name="MUD_CREATED_DATE"
                value={formatDate(userDetails.MUD_CREATED_DATE) || ""}
                InputProps={{
                  readOnly: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarIcon sx={{ color: "primary.main" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 6 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={updateUserProfile}
              disabled={loading}
              startIcon={
                loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <SaveIcon />
                )
              }
              size="large"
            >
              {loading ? "Saving..." : "Save Profile"}
            </Button>
          </Box>
        </CardContent>
      </Paper>

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
            minWidth: "460px",
            fontSize: "1.18rem",
            fontWeight: 600,
            py: 1.7,
            px: 2.4,
            borderRadius: "14px",
            boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
            "& .MuiAlert-icon": {
              fontSize: "36px",
              alignItems: "center",
            },
            "& .MuiAlert-message": {
              fontSize: "1.12rem",
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
