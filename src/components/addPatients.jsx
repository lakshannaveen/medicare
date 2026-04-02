// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const Addpatient = ({ patientCode }) => {
//   const Name = localStorage.getItem("Name");
//   const [formData, setFormData] = useState({
//     MPD_PATIENT_NAME: "",
//     MPD_MOBILE_NO: "",
//     MPD_NIC_NO: "",
//     MPD_PATIENT_REMARKS: "",
//     MPD_ADDRESS: "",
//     MPD_CITY: "",
//     MPD_REMARKS: "",
//     MPD_GUARDIAN: "",
//     MPD_GUARDIAN_CONTACT_NO: "",
//     MPD_PATIENT_CODE: "",
//     MPD_EMAIL: "",
//     MPD_PATIENT_TYPE: "",
//     MPD_STATUS: "",
//     MPD_CREATED_BY: Name,
//     MPD_UPDATED_BY: "",
//     MPD_BIRTHDAY: null,
//     MPD_GENDER: "",
//     MPD_CREATED_DATE: new Date().toISOString(),
//     MPD_UPDATED_DATE: null,
//   });
//   const role = localStorage.getItem("Role");

//   const [errorMessage, setErrorMessage] = useState("");
//   const [formErrors, setFormErrors] = useState({
//     email: "",
//     contact: "",
//     nic: "",
//     guardianContact: "",
//   });

//   const [isEditMode, setIsEditMode] = useState(false);

//   useEffect(() => {
//     if (patientCode) {
//       setIsEditMode(true);
//       fetchPatientDetails(patientCode);
//     }
//   }, [patientCode]);

//   const fetchPatientDetails = async (patientCode) => {
//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API_BASE_URL}/Patient/${patientCode}`
//       );
//       let patientData = response.data;

//       // Convert datetime format to YYYY-MM-DD
//       if (patientData.MPD_BIRTHDAY) {
//         patientData.MPD_BIRTHDAY = patientData.MPD_BIRTHDAY.split("T")[0]; // Extract YYYY-MM-DD
//       }

//       setFormData(patientData);
//     } catch (error) {
//       console.error("Error fetching patient details:", error);
//     }
//   };

//   const validateGuardianContact = (contact) => {
//     const contactPattern = /^[0-9]{10}$/; // Validates 10-digit contact number
//     return contactPattern.test(contact);
//   };

//   const validateNIC = (nic) => {
//     // Check if it's 10 characters long and matches the pattern
//     const tenCharNIC = /^[0-9]{9}[VXvx]$/;
//     // Check if it's 12 digits long
//     const twelveCharNIC = /^[0-9]{12}$/;
//     return tenCharNIC.test(nic) || twelveCharNIC.test(nic);
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     let errors = { ...formErrors };

//     // let formattedValue = value;

//     // if (name === "MPD_BIRTHDAY" && value) {
//     //     const date = new Date(value);
//     //     const year = date.getFullYear().toString().slice(-2); // Last 2 digits of the year
//     //     const month = String(date.getMonth() + 1).padStart(2, "0"); // Ensure 2-digit month
//     //     const day = String(date.getDate()).padStart(2, "0"); // Ensure 2-digit day
//     //     formattedValue = `${year}-${month}-${day}`;
//     // }

//     // if (name === "MPD_BIRTHDAY") {
//     //     const datePattern = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD format

//     //     if (value && !datePattern.test(value)) {
//     //         errors.birthday = "Invalid date format. Use YYYY-MM-DD.";
//     //     } else {
//     //         errors.birthday = ""; // Clear error if valid
//     //     }
//     // }

//     // Allow empty email without error
//     if (name === "MPD_EMAIL") {
//       errors.email =
//         value.trim() === "" || validateEmail(value)
//           ? ""
//           : "Invalid email format";
//     }
//     if (name === "MPD_MOBILE_NO") {
//       errors.contact =
//         value.trim() === "" || validateContactNumber(value)
//           ? ""
//           : "Contact number should be 10 digits";
//     }
//     if (name === "MPD_GUARDIAN_CONTACT_NO") {
//       errors.guardianContact =
//         value.trim() === "" || validateContactNumber(value)
//           ? ""
//           : "Guardian contact number should be 10 digits";
//     }
//     if (name === "MPD_NIC_NO") {
//       errors.nic =
//         value.trim() === "" || validateNIC(value) ? "" : "Invalid NIC format";
//     }

//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//     setFormErrors(errors);
//   };

//   const validateEmail = (email) => {
//     if (email.trim() === "") {
//       return true; // Allow empty values
//     }
//     const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//     return emailPattern.test(email);
//   };

//   const validateContactNumber = (contact) => {
//     const contactPattern = /^[0-9]{10}$/;
//     return contactPattern.test(contact);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setErrorMessage("");

//     // Check if there are any errors before submitting
//     if (formErrors.email || formErrors.contact || formErrors.nic) {
//       setErrorMessage("Please correct the errors before submitting the form.");
//       return;
//     }

//     try {
//       if (isEditMode) {
//         // Update patient data
//         await axios.patch(
//           `${process.env.REACT_APP_API_BASE_URL}/Patient/update/${formData.MPD_PATIENT_CODE}`,
//           formData,
//           {
//             headers: {
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         alert("Patient details updated successfully");
//       } else {
//         // Register new patient
//         await axios.post(
//           `${process.env.REACT_APP_API_BASE_URL}/Patient/patient-registration`,
//           formData,
//           {
//             headers: {
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         alert("Patient registered successfully");
//         console.log(formData);
//       }
//       window.location.reload();
//     } catch (error) {
//       console.error(
//         "Failed to save patient details",
//         error.response?.data || error.message
//       );
//       setErrorMessage(
//         `Failed to save patient details: ${
//           error.response?.data?.error || "Unknown error"
//         }`
//       );
//     }
//   };

//   return (
//     <div>
//       <div className="add-patient-form-container">
//         <h2 className="form-title">
//           {isEditMode ? "Patient details" : "Patient Registration Form"}
//         </h2>
//         {errorMessage && <div className="error-message">{errorMessage}</div>}

//         {/* When user clicks View Details it navigate to this section */}
//         <form className="patient-form" onSubmit={handleSubmit}>
//           <div className="form-section1">
//             <div className="form-grid1">
//               <div className="form-group">
//                 <label>
//                   Full Name<span className="required">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   name="MPD_PATIENT_NAME"
//                   value={formData.MPD_PATIENT_NAME}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//               <div className="form-group">
//                 <label>NIC Number</label>
//                 <input
//                   type="text"
//                   name="MPD_NIC_NO"
//                   value={formData.MPD_NIC_NO}
//                   onChange={handleChange}
//                 />
//                 {formErrors.nic && (
//                   <div className="error-message">{formErrors.nic}</div>
//                 )}
//               </div>
//               <div className="form-group">
//                 <label>
//                   Contact Number<span className="required">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   name="MPD_MOBILE_NO"
//                   value={formData.MPD_MOBILE_NO}
//                   onChange={handleChange}
//                   required
//                 />
//                 {formErrors.contact && (
//                   <div className="error-message">{formErrors.contact}</div>
//                 )}
//               </div>
//               <div className="form-group">
//                 <label>Address</label>
//                 <input
//                   type="text"
//                   name="MPD_ADDRESS"
//                   value={formData.MPD_ADDRESS}
//                   onChange={handleChange}
//                 />
//               </div>
//               <div className="form-group">
//                 {/* <label>City <span className="required">*</span></label> */}
//                 <label>City</label>
//                 <input
//                   type="text"
//                   name="MPD_CITY"
//                   value={formData.MPD_CITY}
//                   onChange={handleChange}
//                 />
//               </div>
//               <div className="form-group">
//                 <label>Guardian </label>
//                 <input
//                   type="text"
//                   name="MPD_GUARDIAN"
//                   value={formData.MPD_GUARDIAN}
//                   onChange={handleChange}
//                 />
//               </div>
//               <div className="form-group">
//                 <label>Guardian Contact No </label>
//                 <input
//                   type="text"
//                   name="MPD_GUARDIAN_CONTACT_NO"
//                   value={formData.MPD_GUARDIAN_CONTACT_NO}
//                   onChange={handleChange}
//                 />
//                 {formErrors.guardianContact && (
//                   <div className="error-message">
//                     {formErrors.guardianContact}
//                   </div>
//                 )}
//               </div>
//               <div className="form-group">
//                 <label>Enter Your Birthday</label>
//                 <input
//                   type="date"
//                   placeholder="YYYY-MM-DD"
//                   name="MPD_BIRTHDAY"
//                   value={formData.MPD_BIRTHDAY}
//                   onChage={handleChange}
//                 />
//                 {formErrors.birthday && (
//                   <div className="error-message">{formErrors.birthday}</div>
//                 )}
//               </div>

//               <div className="form-group">
//                 <label>
//                   Enter Your Email<span className="required">*</span>
//                 </label>
//                 <input
//                   type="email"
//                   name="MPD_EMAIL"
//                   value={formData.MPD_EMAIL}
//                   onChange={handleChange}
//                 />
//                 {formErrors.email && (
//                   <div className="error-message">{formErrors.email}</div>
//                 )}
//               </div>

//               <div className="form-group">
//                 <label>Gender</label>
//                 <select
//                   name="MPD_GENDER"
//                   value={formData.MPD_GENDER}
//                   onChange={handleChange}
//                   style={{ width: '95%',border: '1px solid #a5a4a4' }}
//                 >
//                   <option value="">Select Gender</option>
//                   <option value="Male">Male</option>
//                   <option value="Female">Female</option>
//                 </select>
//               </div>
//             </div>
//           </div>

//           <div className="form-group">
//             <label>Patient Remarks</label>
//             <textarea
//               name="MPD_PATIENT_REMARKS"
//               value={formData.MPD_PATIENT_REMARKS}
//               onChange={handleChange}
//               style={{ height: "50px", border: '1px solid #a5a4a4',  width: '95%'}}
//             />
//           </div>
//           <button
//             type="submit"
//             style={{ marginTop:"10px" }}
//             className="submit-button"
//             onClick={(e) => {
//               if (role !== "Doc" && role !== "Admin") {
//                 e.preventDefault(); // Prevent form submission
//                 alert("Sorry you dont have permission to edit details.");
//               }
//             }}
//           >
//             {isEditMode ? "Update details" : "Register"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Addpatient;

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Grid,
  Divider,
  FormHelperText,
  Tooltip,
  useTheme,
  IconButton,
} from "@mui/material";
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  Cake as CakeIcon,
  People as PeopleIcon,
  Notes as NotesIcon,
  Badge as BadgeIcon,
  LocationCity as LocationCityIcon,
} from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";

const Addpatient = ({ patientCode, onSuccess, handleClose }) => {
  const theme = useTheme();
  const Name = localStorage.getItem("Name");
  const role = localStorage.getItem("Role");
  const emptyForm = {
    MPD_PATIENT_NAME: "",
    MPD_MOBILE_NO: "",
    MPD_NIC_NO: "",
    MPD_PATIENT_REMARKS: "",
    MPD_ADDRESS: "",
    MPD_CITY: "",
    MPD_REMARKS: "",
    MPD_GUARDIAN: "",
    MPD_GUARDIAN_CONTACT_NO: "",
    MPD_PATIENT_CODE: "",
    MPD_EMAIL: "",
    MPD_PATIENT_TYPE: "",
    MPD_STATUS: "",
    MPD_CREATED_BY: Name,
    MPD_UPDATED_BY: "",
    MPD_BIRTHDAY: null,
    MPD_GENDER: "",
    MPD_CREATED_DATE: new Date().toISOString(),
    MPD_UPDATED_DATE: null,
  };

  useEffect(() => {
    // Clear any auto-filled values when creating a new patient
    if (!patientCode) {
      setFormData(emptyForm);
      const formEl = document.querySelector('form');
      if (formEl) {
        try {
          formEl.reset();
          const inputs = formEl.querySelectorAll('input');
          inputs.forEach((i) => {
            i.autocomplete = 'off';
            i.value = '';
          });
        } catch (err) {}
      }
    }
  }, [patientCode]);
  const [formData, setFormData] = useState({
    MPD_PATIENT_NAME: "",
    MPD_MOBILE_NO: "",
    MPD_NIC_NO: "",
    MPD_PATIENT_REMARKS: "",
    MPD_ADDRESS: "",
    MPD_CITY: "",
    MPD_REMARKS: "",
    MPD_GUARDIAN: "",
    MPD_GUARDIAN_CONTACT_NO: "",
    MPD_PATIENT_CODE: "",
    MPD_EMAIL: "",
    MPD_PATIENT_TYPE: "",
    MPD_STATUS: "",
    MPD_CREATED_BY: Name,
    MPD_UPDATED_BY: "",
    MPD_BIRTHDAY: null,
    MPD_GENDER: "",
    MPD_CREATED_DATE: new Date().toISOString(),
    MPD_UPDATED_DATE: null,
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [formErrors, setFormErrors] = useState({
    email: "",
    contact: "",
    nic: "",
    guardianContact: "",
    name: "",
    guardianName: "",
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (patientCode) {
      setIsEditMode(true);
      fetchPatientDetails(patientCode);
    }
  }, [patientCode]);

  const fetchPatientDetails = async (patientCode) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/Patient/${patientCode}`
      );
      let patientData = response.data;

      if (patientData.MPD_BIRTHDAY) {
        patientData.MPD_BIRTHDAY = patientData.MPD_BIRTHDAY.split("T")[0];
      }

      setFormData(patientData);
    } catch (error) {
      console.error("Error fetching patient details:", error);
      setErrorMessage("Failed to load patient data");
    } finally {
      setIsLoading(false);
    }
  };

  const validateGuardianContact = (contact) => {
    const contactPattern = /^[0-9]{10}$/;
    return contactPattern.test(contact);
  };

  const validateNIC = (nic) => {
    const tenCharNIC = /^[0-9]{9}[VXvx]$/;
    const twelveCharNIC = /^[0-9]{12}$/;
    return tenCharNIC.test(nic) || twelveCharNIC.test(nic);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let errors = { ...formErrors };

    // Pre-process input to restrict characters as user types
    let processedValue = value;
    if (name === "MPD_PATIENT_NAME") {
      // Allow letters and spaces only
      processedValue = value.replace(/[^A-Za-z\s]/g, "");
      errors.name = value !== processedValue ? "Only letters and spaces allowed" : "";
    }
    if (name === "MPD_GUARDIAN") {
      processedValue = value.replace(/[^A-Za-z\s]/g, "");
      errors.guardianName = value !== processedValue ? "Only letters and spaces allowed" : "";
    }
    if (name === "MPD_MOBILE_NO" || name === "MPD_GUARDIAN_CONTACT_NO") {
      // Allow digits only and limit to 10 chars
      processedValue = value.replace(/\D/g, "").slice(0, 10);
    }
    if (name === "MPD_NIC_NO") {
      // Allow digits and V/v/X/x characters, limit to 12
      processedValue = value.replace(/[^0-9VvXx]/g, "").slice(0, 12);
    }

    if (name === "MPD_EMAIL") {
      errors.email =
        processedValue.trim() === "" || validateEmail(processedValue)
          ? ""
          : "Invalid email format";
    }
    if (name === "MPD_MOBILE_NO") {
      errors.contact =
        processedValue.trim() === "" || validateContactNumber(processedValue)
          ? ""
          : "Contact number should be 10 digits";
    }
    if (name === "MPD_GUARDIAN_CONTACT_NO") {
      errors.guardianContact =
        processedValue.trim() === "" || validateContactNumber(processedValue)
          ? ""
          : "Guardian contact number should be 10 digits";
    }
    if (name === "MPD_NIC_NO") {
      errors.nic =
        processedValue.trim() === "" || validateNIC(processedValue) ? "" : "Invalid NIC format";
    }

    setFormData({
      ...formData,
      [name]: processedValue,
    });
    setFormErrors(errors);
  };

  const validateEmail = (email) => {
    if (email.trim() === "") return true;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  };

  const validateContactNumber = (contact) => {
    const contactPattern = /^[0-9]{10}$/;
    return contactPattern.test(contact);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (
      formErrors.email ||
      formErrors.contact ||
      formErrors.nic ||
      formErrors.guardianContact ||
      formErrors.name ||
      formErrors.guardianName
    ) {
      setErrorMessage("Please correct the errors before submitting the form.");
      return;
    }

    setIsLoading(true);
    try {
      if (isEditMode) {
        await axios.patch(
          `${process.env.REACT_APP_API_BASE_URL}/Patient/update/${formData.MPD_PATIENT_CODE}`,
          formData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setErrorMessage("");
        if (onSuccess) onSuccess();
      } else {
        await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/Patient/patient-registration`,
          formData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setErrorMessage("");
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      console.error(
        "Failed to save patient details",
        error.response?.data || error.message
      );
      setErrorMessage(
        `Failed to save patient details: ${error.response?.data?.error || "Unknown error"
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // <Box
    //   component="main"
    //   maxWidth="md"
    //   sx={{
    //     py: 2,
    //     p: 2,
    //     borderRadius: 5,
    //     backgroundColor: "background.Box",
    //     boxShadow: 1,
    //   }}
    // >
    //   <Typography
    //     variant="h4"
    //     align="center"
    //     color="primary"
    //     fontWeight={600}
    //     gutterBottom
    //   >
    //     {isEditMode ? "Patient Details" : "Patient Registration"}
    //   </Typography>
    
    <Box
      component="main"
      maxWidth="md"
      sx={{
        py: 2,
        p: 2,
        borderRadius: 5,
        backgroundColor: "background.Box",
        boxShadow: 1,
        position: "relative",
      }}
    >
      <Box display="flex" justifyContent="flex-end">
        <IconButton onClick={handleClose}  sx={{ color: "grey.700" }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Typography
        variant="h4"
        align="center"
        color="primary"
        fontWeight={600}
        gutterBottom
        sx={{ mt: -5 }}
      >
        {isEditMode ? "Patient Details" : "Patient Registration"}
      </Typography>


      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}

      {isLoading ? (
        <Box display="flex" justifyContent="center" py={6}>
          <CircularProgress size={60} />
        </Box>
      ) : (
        <Box component="form" onSubmit={handleSubmit} noValidate>

          <Box elevation={0} sx={{ p: 3, borderRadius: 2 }}>
            <Typography
              variant="h6"
              fontWeight={600}
              gutterBottom
              sx={{ display: "flex", alignItems: "center" }}
            >
              <PersonIcon sx={{ mr: 1 }} />
              Personal Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} sx={{ minHeight: "80px" }}>
                <TextField
                  fullWidth
                  required
                  label="Full Name"
                  name="MPD_PATIENT_NAME"
                  value={formData.MPD_PATIENT_NAME}
                  onChange={handleChange}
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <PersonIcon sx={{ mr: 1, color: "primary.main" }} />
                    ),
                    inputProps: { autoComplete: 'off' }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} sx={{ minHeight: "80px" }}>
                <TextField
                  fullWidth
                  label="NIC Number"
                  name="MPD_NIC_NO"
                  value={formData.MPD_NIC_NO}
                  onChange={handleChange}
                  error={!!formErrors.nic}
                  helperText={formErrors.nic}
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <BadgeIcon sx={{ mr: 1, color: "primary.main" }} />
                    ),
                    inputProps: { autoComplete: 'off' }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} sx={{ minHeight: "80px" }}>
                <Box sx={{ width: "100%" }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Gender</InputLabel>
                    <Select
                      name="MPD_GENDER"
                      value={formData.MPD_GENDER}
                      onChange={handleChange}
                      label="Gender"
                    >
                      <MenuItem value="">
                        <em>Select Gender</em>
                      </MenuItem>
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} sx={{ minHeight: "80px", mt: -5 }}>
                <TextField
                  fullWidth
                  type="date"
                  label="Birthday"
                  name="MPD_BIRTHDAY"
                  value={formData.MPD_BIRTHDAY || ""}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <CakeIcon sx={{ mr: 1, color: "primary.main" }} />
                    ),
                    inputProps: { autoComplete: 'off' }
                  }}
                />
              </Grid>
            </Grid>
          </Box>

          <Box elevation={0} sx={{ p: 3, borderRadius: 2 }}>
            <Typography
              variant="h6"
              fontWeight={600}
              gutterBottom
              sx={{ display: "flex", alignItems: "center", mt: -8 }}
            >
              <PhoneIcon sx={{ mr: 1 }} />
              Contact Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} sx={{ minHeight: "80px" }}>
                <TextField
                  fullWidth
                  required
                  label="Contact Number"
                  name="MPD_MOBILE_NO"
                  value={formData.MPD_MOBILE_NO}
                  onChange={handleChange}
                  error={!!formErrors.contact}
                  helperText={formErrors.contact}
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <PhoneIcon sx={{ mr: 1, color: "primary.main" }} />
                    ),
                    inputProps: { inputMode: 'numeric', pattern: '[0-9]*', autoComplete: 'off' }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} sx={{ minHeight: "80px" }}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  name="MPD_EMAIL"
                  value={formData.MPD_EMAIL}
                  onChange={handleChange}
                  error={!!formErrors.email}
                  helperText={formErrors.email}
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <EmailIcon sx={{ mr: 1, color: "primary.main" }} />
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sx={{ minHeight: "80px", mt: -5 }}>
                <TextField
                  fullWidth
                  label="Address"
                  name="MPD_ADDRESS"
                  value={formData.MPD_ADDRESS}
                  onChange={handleChange}
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <HomeIcon sx={{ mr: 1, color: "primary.main" }} />
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} sx={{ minHeight: "80px", mt: -5 }}>
                <TextField
                  fullWidth
                  label="City"
                  name="MPD_CITY"
                  value={formData.MPD_CITY}
                  onChange={handleChange}
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <LocationCityIcon sx={{ mr: 1, color: "primary.main" }} />
                    ),
                    inputProps: { autoComplete: 'off' }
                  }}
                />
              </Grid>
            </Grid>
          </Box>

          <Box elevation={0} sx={{ p: 3, borderRadius: 2, mt: -8 }}>
            <Typography
              variant="h6"
              fontWeight={600}
              gutterBottom
              sx={{ display: "flex", alignItems: "center" }}
            >
              <PeopleIcon sx={{ mr: 1 }} />
              Guardian Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} sx={{ minHeight: "80px" }}>
                <TextField
                  fullWidth
                  label="Guardian Name"
                  name="MPD_GUARDIAN"
                  value={formData.MPD_GUARDIAN}
                  onChange={handleChange}
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <PersonIcon sx={{ mr: 1, color: "primary.main" }} />
                    ),
                    inputProps: { autoComplete: 'off' }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} sx={{ minHeight: "80px" }}>
                <TextField
                  fullWidth
                  label="Guardian Contact No"
                  name="MPD_GUARDIAN_CONTACT_NO"
                  value={formData.MPD_GUARDIAN_CONTACT_NO}
                  onChange={handleChange}
                  error={!!formErrors.guardianContact}
                  helperText={formErrors.guardianContact}
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <PhoneIcon sx={{ mr: 1, color: "primary.main" }} />
                    ),
                    inputProps: { inputMode: 'numeric', pattern: '[0-9]*', autoComplete: 'off' }
                  }}
                />
              </Grid>
            </Grid>
          </Box>

          <Box elevation={0} sx={{ p: 3, borderRadius: 2, mt: -8 }}>
            <Typography
              variant="h6"
              fontWeight={600}
              gutterBottom
              sx={{ display: "flex", alignItems: "center" }}
            >
              <NotesIcon sx={{ mr: 1 }} />
              Additional Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container>
              <Grid item xs={12} sx={{ minHeight: "120px" }}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Patient Remarks"
                  name="MPD_PATIENT_REMARKS"
                  value={formData.MPD_PATIENT_REMARKS}
                  onChange={handleChange}
                  size="small"
                />
              </Grid>
            </Grid>
          </Box>

          <Box display="flex" justifyContent="center" mt={2}>
            <Tooltip
              title={
                role !== "Doc" && role !== "Admin"
                  ? "Sorry, you don't have permission to edit details."
                  : ""
              }
              placement="top"
            >
              <span>
                {" "}
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={isLoading || (role !== "Doc" && role !== "Admin")}
                  fullWidth
                  sx={{
                    width: { xs: '100%', sm: 420, md: 700 },
                    maxWidth: 700,
                    py: 1.5,
                    fontSize: '1rem',
                    ...(role !== 'Doc' &&
                      role !== 'Admin' && {
                        cursor: 'not-allowed',
                        pointerEvents: 'auto',
                        '&:hover': {
                          backgroundColor: theme.palette.primary.main,
                        },
                      }),
                  }}
                  onClick={(e) => {
                    if (role !== "Doc" && role !== "Admin") {
                      e.preventDefault();
                      setErrorMessage(
                        "Sorry, you don't have permission to edit details."
                      );
                    }
                  }}
                >
                  {isLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : isEditMode ? (
                    "Update Details"
                  ) : (
                    "Register Patient"
                  )}
                </Button>
              </span>
            </Tooltip>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Addpatient;
