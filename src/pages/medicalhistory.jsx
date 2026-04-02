// //Admin Part of Medical History Page

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "../styles/addPatient.css";
// import "../styles/medicalhistory.css";
// import Addpatient from "../components/addPatients";
// import { useNavigate } from "react-router-dom";
// import Footer from "../components/footer";
// import "@fortawesome/fontawesome-free/css/all.min.css";

// export default function MedicalHistory() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [patients, setPatients] = useState([]);
//   const [filteredPatients, setFilteredPatients] = useState([]);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [popup, setPopup] = useState(null);
//   const [treatmentPopup, setTreatmentPopup] = useState(null);
//   const navigate = useNavigate();
//   const [patientPopup, setPatientPopup] = useState(null);
//   const [personaldetails, setPersonaldetails] = useState(null);

//   const [remarkpopup, setremarkPopup] = useState(null);

//   const role = localStorage.getItem("Role");

//   // Define the fetchAllPatients function
//   const fetchAllPatients = async () => {
//     setIsLoading(true);
//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API_BASE_URL}/Patient`
//       );
//       setPatients(response.data);
//       setFilteredPatients(response.data); // Initially, set filteredPatients to all patients
//       setErrorMessage("");
//     } catch (error) {
//       setErrorMessage("Failed to load patient data.");
//       setPatients([]);
//       setFilteredPatients([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Fetch all patients when the component mounts
//   useEffect(() => {
//     fetchAllPatients();
//   }, []);

//   // Filter patients by search term (real-time filtering) - Search button
//   useEffect(() => {
//     if (searchTerm) {
//       const filtered = patients.filter(
//         (patient) =>
//           patient.MPD_MOBILE_NO.toLowerCase().includes(
//             searchTerm.toLowerCase()
//           ) ||
//           patient.MPD_PATIENT_NAME.toLowerCase().includes(
//             searchTerm.toLowerCase()
//           )
//       );
//       setFilteredPatients(filtered);
//       setErrorMessage(
//         filtered.length === 0 ? "No matching patients found." : ""
//       );
//     } else {
//       setFilteredPatients(patients); // Reset to all patients if searchTerm is empty
//     }
//   }, [searchTerm, patients]);

//   const handleSearch = async () => {
//     if (!searchTerm) {
//       // If search term is empty, fetch all patients
//       await fetchAllPatients();
//       setErrorMessage(""); // Clear any error message
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API_BASE_URL}/Patient/SearchBy/${searchTerm}`
//       );
//       setPatients(response.data);
//       setErrorMessage("");
//       setPopup(null);
//       setTreatmentPopup(null);
//     } catch (error) {
//       setPatients([]);
//       if (error.response && error.response.status === 404) {
//         setErrorMessage("No patient found with the provided search term.");
//         setPopup(<Addpatient />);
//       } else {
//         setErrorMessage("An error occurred while searching for the patient.");
//         setPopup(null);
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleAddRecord = (patientId) => {
//     setTreatmentPopup(null);
//     navigate(`/dashboard/addrecord/${patientId}`);
//   };

//   // When User clicks View Treatments it navigate to this modal
//   const handleViewRecord = async (patientId) => {
//     try {
//       setErrorMessage("");
//       const response = await axios.get(
//         `${process.env.REACT_APP_API_BASE_URL}/Treatment/patient/${patientId}`
//       );
//       setTreatmentPopup(
//         <div className="treatment-popup">
//           <button
//             className="close-popup-button"
//             onClick={() => setTreatmentPopup(null)}
//           >
//             X
//           </button>
//           <h2>Treatment Details</h2>
//           <div className="treatment-list">
//             {response.data.map((treatment, index) => (
//               <div className="treatment-card" key={index}>
//                 <h3>{response.data.length - index}</h3>{" "}
//                 {/* Reverse index numbering */}
//                 <p>
//                   Treatment-date:{" "}
//                   {
//                     new Date(treatment.MTD_CREATED_DATE)
//                       .toISOString()
//                       .split("T")[0]
//                   }
//                 </p>
//                 <b>
//                   <p className="complain-text">
//                     Complain: {treatment.MTD_COMPLAIN}
//                   </p>
//                 </b>
//                 <button
//                   onClick={() => {
//                     navigate(
//                       `/dashboard/view-record/${patientId}/${treatment.MTD_SERIAL_NO}`,
//                       {
//                         state: { message: "Medical History" },
//                       }
//                     );
//                   }}
//                 >
//                   View info
//                 </button>
//               </div>
//             ))}
//           </div>
//           {/* <button className="close-popup-button" onClick={() => setTreatmentPopup(null)}>Close</button> */}
//         </div>
//       );
//     } catch (error) {
//       console.error("Error fetching treatment details:", error);
//       alert("Still there are no treatments available for this patient");
//     }
//   };

//   const handleNoPatient = () => {
//     setPopup(<Addpatient />);
//   };

//   const closePopup = () => {
//     setPopup(null);
//   };

//   // viewPatient function
//   const viewPatient = (patientCode) => {
//     setPopup(<Addpatient patientCode={patientCode} />); // Pass patientCode as a prop to Addpatient
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete the patient?")) {
//       try {
//         // Check if the patient has treatments
//         const response = await axios.get(
//           `${process.env.REACT_APP_API_BASE_URL}/Patient/${id}`
//         );

//         if (response.data && response.data.length > 0) {
//           alert(
//             "This patient cannot be deleted as they have treatments associated."
//           );
//           return;
//         }

//         // Proceed with deletion if no treatments are found
//         await axios.delete(
//           `${process.env.REACT_APP_API_BASE_URL}/Patient/${id}`
//         );
//         alert("Patient deleted successfully!");

//         // Reload or update the UI after deletion
//         window.location.reload();
//       } catch (error) {
//         console.error("Error deleting patient:", error);
//         alert(
//           error.response?.data?.message ||
//             "Failed to delete the patient. Please try again."
//         );
//       }
//     }
//   };
//   const calculateAge = (birthdate) => {
//     if (!birthdate) return "N/A";
//     const birthDateObj = new Date(birthdate);
//     const today = new Date();
//     let age = today.getFullYear() - birthDateObj.getFullYear();
//     const monthDiff = today.getMonth() - birthDateObj.getMonth();
//     if (
//       monthDiff < 0 ||
//       (monthDiff === 0 && today.getDate() < birthDateObj.getDate())
//     ) {
//       age--;
//     }
//     return age;
//   };

//   const patientdetails = (patientid) => {
//     navigate(`/dashboard/patientdetails/${patientid}`);
//   };

//   return (
//     <div className="medical-history-container">
//       <h1 className="title">Search Patient Records</h1>
//       <div className="search-container">
//         <input
//           type="search"
//           placeholder="Enter patient name or contact number"
//           className="search-input"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />

//         <div className="button-container">
//           {/* Add Search Button */}
//           <button
//             className="search-button"
//             onClick={handleSearch}
//             disabled={isLoading}
//           >
//             {isLoading ? "Searching..." : "Search"}
//           </button>
//           {/* Add Patient Button */}
//           <button className="no-patient-button" onClick={handleNoPatient}>
//             Add Patient
//           </button>
//         </div>
//       </div>

//       {errorMessage && <p className="error-message">{errorMessage}</p>}

//       {/* Search Results and All results */}
//       {filteredPatients.length > 0 && (
//         <div className="patient-details">
//           <table className="records-table">
//             <thead>
//               <tr>
//                 <th>Patient Code</th>
//                 <th>Name</th>
//                 <th>Contact</th>
//                 <th>NIC</th>

//                 <th>Age</th>

//                 <th colSpan={2}>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredPatients.map((patient) => (
//                 <tr key={patient.MPD_PATIENT_CODE}>
//                   <td>{patient.MPD_PATIENT_CODE}</td>
//                   <td>{patient.MPD_PATIENT_NAME}</td>
//                   <td>{patient.MPD_MOBILE_NO}</td>

//                   <td>{patient.MPD_NIC_NO}</td>
//                   <td>{calculateAge(patient.MPD_BIRTHDAY)}</td>

//                   <td colSpan={4}>
//                     <div className="actions-container ">
//                       <button
//                         className="action-button"
//                         onClick={() => viewPatient(patient.MPD_PATIENT_CODE)}
//                       >
//                         View Details
//                       </button>

//                       <button
//                         className="action-button"
//                         onClick={() =>
//                           handleAddRecord(patient.MPD_PATIENT_CODE)
//                         }

//                         // disabled={!(role === "Admin" || role === "Doc")}
//                       >
//                         <i className="fas fa-plus"></i> Add Treatment
//                       </button>

//                       <button
//                         className="action-button"
//                         onClick={() => {
//                           // if (role === "Admin" || role === "Doc") {
//                           //     handleViewRecord(patient.MPD_PATIENT_CODE);
//                           // } else {
//                           //     alert("You do not have permission to view this.");
//                           // }
//                           handleViewRecord(patient.MPD_PATIENT_CODE);
//                         }}
//                         // disabled={!(role === "Admin" || role === "Doc")}
//                       >
//                         <i className="fas fa-eye"></i> View Treatments
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {popup && (
//         <div className="popup-overlay">
//           <div className="popup-content">
//             <button className="close-popup-button" onClick={closePopup}>
//               X
//             </button>
//             {popup}
//           </div>
//         </div>
//       )}

//       {treatmentPopup && (
//         <div className="popup-overlay">
//           <div className="">{treatmentPopup}</div>
//         </div>
//       )}

//       {patientPopup && (
//         <div className="popup-overlay">
//           <div className="">{patientPopup}</div>
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
  CircularProgress,
  Snackbar,
  Alert,
  Tooltip,
  useTheme,
  Grid,
  Card,
  CardContent,
  Divider,
  Chip,
} from "@mui/material";
import {
  Search as SearchIcon,
  Add as AddIcon,
  Visibility as VisibilityIcon,
  MedicalServices as MedicalServicesIcon,
  PersonAdd as PersonAddIcon,
  Close as CloseIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Info as InfoIcon,
  Favorite as FavoriteIcon,
  MonitorHeart as MonitorHeartIcon,
  Biotech as BiotechIcon,
  Speed as SpeedIcon,
  Opacity as OpacityIcon,
  Air as AirIcon,
  Height as HeightIcon,
  LineWeight as LineWeightIcon,
  Timeline as TimelineIcon,
} from "@mui/icons-material";
import Addpatient from "../components/addPatients";
import AddVitalSigns from "../components/AddVitalSigns";

const API_BASE_URL = "https://testnew.dockyardsoftware.com/api";

export default function MedicalHistory() {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [openAddPatient, setOpenAddPatient] = useState(false);
  const [openTreatmentDialog, setOpenTreatmentDialog] = useState(false);
  const [openVitalSignsDialog, setOpenVitalSignsDialog] = useState(false);
  const [openAddVitalSignsDialog, setOpenAddVitalSignsDialog] = useState(false);
  const [treatments, setTreatments] = useState([]);
  const [vitalSigns, setVitalSigns] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const navigate = useNavigate();
  const role = localStorage.getItem("Role");

  const fetchAllPatients = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/Patient`
      );
      setPatients(response.data);
      setFilteredPatients(response.data);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage("Failed to load patient data.");
      setPatients([]);
      setFilteredPatients([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllPatients();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = patients.filter(
        (patient) =>
          patient.MPD_MOBILE_NO?.toLowerCase().includes(
            searchTerm.toLowerCase()
          ) ||
          patient.MPD_PATIENT_NAME?.toLowerCase().includes(
            searchTerm.toLowerCase()
          )
      );
      setFilteredPatients(filtered);
      setErrorMessage(
        filtered.length === 0 ? "No matching patients found." : ""
      );
    } else {
      setFilteredPatients(patients);
    }
  }, [searchTerm, patients]);

  const handleSearch = async () => {
    if (!searchTerm) {
      await fetchAllPatients();
      setErrorMessage("");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/Patient/SearchBy/${searchTerm}`
      );
      setPatients(response.data);
      setErrorMessage("");
      setOpenAddPatient(false);
      setOpenTreatmentDialog(false);
    } catch (error) {
      setPatients([]);
      if (error.response && error.response.status === 404) {
        setErrorMessage("No patient found with the provided search term.");
        setOpenAddPatient(true);
      } else {
        setErrorMessage("An error occurred while searching for the patient.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddRecord = (patientId) => {
    navigate(`/dashboard/addrecord/${patientId}`);
  };

  const handleAddVitalSigns = (patient) => {
    setSelectedPatient(patient);
    setOpenAddVitalSignsDialog(true);
  };

  const handleViewRecord = async (patient) => {
    setSelectedPatient(patient);
    try {
      setErrorMessage("");
      const response = await axios.get(
        `${API_BASE_URL}/Treatment/patient/${patient.MPD_PATIENT_CODE}`
      );
      setTreatments(response.data);
      setOpenTreatmentDialog(true);
    } catch (error) {
      console.error("Error fetching treatment details:", error);
      setSnackbarMessage("No treatments available for this patient");
      setSnackbarSeverity("info");
      setSnackbarOpen(true);
    }
  };

  const handleViewVitalSigns = async (patient) => {
    setSelectedPatient(patient);
    try {
      setIsLoading(true);
      setErrorMessage("");
      const response = await axios.get(
        `${API_BASE_URL}/PatientVitalSigns/patient/${patient.MPD_PATIENT_CODE}`
      );
      
      // Transform the API response to match your component's expected format
      const transformedVitalSigns = response.data.map(vital => ({
        id: vital.MPVS_ID,
        patientCode: vital.MPVS_PATIENT_CODE,
        bloodPressureSystolic: vital.MPVS_SYSTOLIC_BP,
        bloodPressureDiastolic: vital.MPVS_DIASTOLIC_BP,
        heartRate: vital.MPVS_HEART_RATE,
        temperature: vital.MPVS_TEMPERATURE,
        respiratoryRate: vital.MPVS_RESPIRATORY_RATE,
        oxygenSaturation: vital.MPVS_OXYGEN_SATURATION,
        height: vital.MPVS_HEIGHT,
        weight: vital.MPVS_WEIGHT,
        bmi: vital.MPVS_BMI,
        notes: vital.MPVS_NOTES,
        recordedDate: vital.MPVS_RECORDED_AT || new Date().toISOString(),
        recordedBy: vital.MPVS_CREATED_BY || "System",
        lastUpdated: vital.MPVS_UPDATED_DATE || vital.MPVS_CREATED_DATE,
        status: vital.MPVS_STATUS
      }));
      
      setVitalSigns(transformedVitalSigns);
      setOpenVitalSignsDialog(true);
    } catch (error) {
      console.error("Error fetching vital signs:", error);
      if (error.response && error.response.status === 404) {
        setVitalSigns([]);
        setOpenVitalSignsDialog(true);
      } else {
        setSnackbarMessage("Error fetching vital signs");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete the patient?")) {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/Patient/${id}`
        );

        if (response.data && response.data.length > 0) {
          setSnackbarMessage("Cannot delete patient with treatments");
          setSnackbarSeverity("warning");
          setSnackbarOpen(true);
          return;
        }

        await axios.delete(
          `${API_BASE_URL}/Patient/${id}`
        );
        setSnackbarMessage("Patient deleted successfully");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        fetchAllPatients();
      } catch (error) {
        console.error("Error deleting patient:", error);
        setSnackbarMessage(
          error.response?.data?.message || "Failed to delete patient"
        );
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    }
  };

  const calculateAge = (birthdate) => {
    if (!birthdate) return "N/A";
    const birthDateObj = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDateObj.getDate())
    ) {
      age--;
    }
    return age;
  };

  const viewPatient = (patientCode) => {
    setSelectedPatient(
      patients.find((p) => p.MPD_PATIENT_CODE === patientCode)
    );
    setOpenAddPatient(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // Format vital signs for display
  const formatVitalSign = (value, unit, decimals = 1) => {
    if (value === null || value === undefined) return "N/A";
    if (typeof value === 'number') {
      return `${value.toFixed(decimals)} ${unit}`;
    }
    return `${value} ${unit}`;
  };

  // Calculate BMI
  const calculateBMI = (weight, height) => {
    if (!weight || !height) return null;
    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
  };

  // Get BMI category
  const getBMICategory = (bmi) => {
    if (!bmi) return "N/A";
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Normal weight";
    if (bmi < 30) return "Overweight";
    return "Obese";
  };

  // Get BMI color
  const getBMIColor = (bmi) => {
    if (!bmi) return "default";
    if (bmi < 18.5) return "warning";
    if (bmi < 25) return "success";
    if (bmi < 30) return "warning";
    return "error";
  };

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          color="primary"
          fontWeight={600}
          align="center"
        >
          Search Patient Records
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            mb: 4,
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Enter patient name or contact number"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <SearchIcon sx={{ mr: 1, color: "action.active" }} />
              ),
            }}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />
          
          {/* Add New Patient Button with Role-based Access */}
          <Tooltip
            title={
              role === "Phuser"
                ? "Sorry, you don't have permission to add patients."
                : "Add a new patient"
            }
            placement="top"
          >
            <span>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<PersonAddIcon />}
                onClick={() => {
                  if (role !== "Phuser") {
                    setOpenAddPatient(true);
                  }
                }}
                disabled={role === "Phuser"}
                sx={{
                  ...(role === "Phuser" && {
                    cursor: "not-allowed",
                    pointerEvents: "auto",
                    "&:hover": {
                      backgroundColor: "transparent",
                    },
                  }),
                }}
              >
                Add New Patient
              </Button>
            </span>
          </Tooltip>
        </Box>

        {errorMessage && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {errorMessage}
          </Alert>
        )}

        {isLoading && filteredPatients.length === 0 ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : filteredPatients.length > 0 ? (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="patient records table">
              <TableHead sx={{ backgroundColor: theme.palette.primary.light }}>
                <TableRow>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Patient Code
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Name
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Contact
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    NIC
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Age
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ color: "white", fontWeight: "bold" }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow
                    key={patient.MPD_PATIENT_CODE}
                    hover
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>{patient.MPD_PATIENT_CODE}</TableCell>
                    <TableCell sx={{ fontWeight: "medium" }}>
                      {patient.MPD_PATIENT_NAME}
                    </TableCell>
                    <TableCell>{patient.MPD_MOBILE_NO}</TableCell>
                    <TableCell>{patient.MPD_NIC_NO || "N/A"}</TableCell>
                    <TableCell>{calculateAge(patient.MPD_BIRTHDAY)}</TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          justifyContent: "center",
                          flexWrap: "wrap",
                        }}
                      >
                        <Tooltip title="View Details">
                          <IconButton
                            color="info"
                            onClick={() =>
                              viewPatient(patient.MPD_PATIENT_CODE)
                            }
                          >
                            <InfoIcon />
                          </IconButton>
                        </Tooltip>
                        
                        {/* Add Treatment Button with Role-based Access */}
                        <Tooltip
                          title={
                            role === "Phuser"
                              ? "You don't have permission to add treatments"
                              : "Add Treatment"
                          }
                        >
                          <span>
                            <IconButton
                              color="primary"
                              onClick={(e) => {
                                if (role === "Phuser") {
                                  e.preventDefault();
                                  setErrorMessage(
                                    "Sorry, you don't have permission to add treatments."
                                  );
                                } else {
                                  handleAddRecord(patient.MPD_PATIENT_CODE);
                                }
                              }}
                              disabled={role === "Phuser"}
                              sx={{
                                ...(role === "Phuser" && {
                                  cursor: "not-allowed",
                                  pointerEvents: "auto",
                                  color: theme.palette.action.disabled,
                                }),
                              }}
                            >
                              <MedicalServicesIcon />
                            </IconButton>
                          </span>
                        </Tooltip>

                        {/* Add Vital Signs Button with Role-based Access */}
                        <Tooltip
                          title={
                            role === "Phuser"
                              ? "You don't have permission to add vital signs"
                              : "Add Vital Signs"
                          }
                        >
                          <span>
                            <IconButton
                              color="success"
                              onClick={(e) => {
                                if (role === "Phuser") {
                                  e.preventDefault();
                                  setErrorMessage(
                                    "Sorry, you don't have permission to add vital signs."
                                  );
                                } else {
                                  handleAddVitalSigns(patient);
                                }
                              }}
                              disabled={role === "Phuser"}
                              sx={{
                                ...(role === "Phuser" && {
                                  cursor: "not-allowed",
                                  pointerEvents: "auto",
                                  color: theme.palette.action.disabled,
                                }),
                              }}
                            >
                              <FavoriteIcon />
                            </IconButton>
                          </span>
                        </Tooltip>

                        <Tooltip title="View Treatments">
                          <IconButton
                            color="secondary"
                            onClick={() => handleViewRecord(patient)}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>

                        {/* View Vital Signs Button */}
                        <Tooltip title="View Vital Signs">
                          <IconButton
                            color="warning"
                            onClick={() => handleViewVitalSigns(patient)}
                          >
                            <MonitorHeartIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Paper sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h6" color="textSecondary">
              No patient records found
            </Typography>
          </Paper>
        )}
      </Paper>

      {/* Add/View Patient Dialog */}
      <Dialog
        open={openAddPatient}
        onClose={() => {
          setOpenAddPatient(false);
          setSelectedPatient(null);
        }}
        fullWidth
        maxWidth="md"
      >
        <DialogContent dividers>
          <Addpatient
            patientCode={selectedPatient?.MPD_PATIENT_CODE}
            onSuccess={() => {
              setOpenAddPatient(false);
              setSelectedPatient(null);
              fetchAllPatients();
              setSnackbarMessage(
                selectedPatient
                  ? "Patient updated successfully"
                  : "Patient added successfully"
              );
              setSnackbarSeverity("success");
              setSnackbarOpen(true);
            }}
            handleClose={() => {
              setOpenAddPatient(false);
              setSelectedPatient(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Add Vital Signs Dialog */}
      <Dialog
        open={openAddVitalSignsDialog}
        onClose={() => {
          setOpenAddVitalSignsDialog(false);
          setSelectedPatient(null);
        }}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              Add Vital Signs - {selectedPatient?.MPD_PATIENT_NAME}
            </Typography>
            <IconButton 
              onClick={() => {
                setOpenAddVitalSignsDialog(false);
                setSelectedPatient(null);
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <AddVitalSigns
            patientCode={selectedPatient?.MPD_PATIENT_CODE}
            patientName={selectedPatient?.MPD_PATIENT_NAME}
            onSuccess={() => {
              setOpenAddVitalSignsDialog(false);
              setSelectedPatient(null);
              setSnackbarMessage("Vital signs added successfully");
              setSnackbarSeverity("success");
              setSnackbarOpen(true);
              // Refresh the list if the view dialog is open
              if (selectedPatient) {
                handleViewVitalSigns(selectedPatient);
              }
            }}
            onClose={() => {
              setOpenAddVitalSignsDialog(false);
              setSelectedPatient(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* View Treatments Dialog */}
      <Dialog
        open={openTreatmentDialog}
        onClose={() => setOpenTreatmentDialog(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">
              Treatment Details - {selectedPatient?.MPD_PATIENT_NAME}
            </Typography>
            <IconButton onClick={() => setOpenTreatmentDialog(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          <Box sx={{ maxHeight: "60vh", overflow: "auto" }}>
            {treatments.length > 0 ? (
              [...treatments]
                .sort(
                  (a, b) =>
                    new Date(b.MTD_CREATED_DATE) - new Date(a.MTD_CREATED_DATE)
                )
                .map((treatment, index) => (
                  <Paper key={index} sx={{ p: 2, mb: 2 }}>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="subtitle1" fontWeight="bold">
                        Visit #{treatments.length - index}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(
                          treatment.MTD_CREATED_DATE
                        ).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ mt: 1, mb: 2 }}>
                      <strong>Complain:</strong> {treatment.MTD_COMPLAIN}
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => {
                        navigate(
                          `/dashboard/view-record/${selectedPatient.MPD_PATIENT_CODE}/${treatment.MTD_SERIAL_NO}`,
                          {
                            state: { message: "Medical History" },
                          }
                        );
                      }}
                      startIcon={<VisibilityIcon />}
                    >
                      View Info
                    </Button>
                  </Paper>
                ))
            ) : (
              <Typography variant="body1" align="center" color="text.secondary">
                No treatments available for this patient
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenTreatmentDialog(false)}
            variant="outlined"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Vital Signs Dialog */}
      <Dialog
        open={openVitalSignsDialog}
        onClose={() => setOpenVitalSignsDialog(false)}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography variant="h6">
                Vital Signs History - {selectedPatient?.MPD_PATIENT_NAME}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Patient Code: {selectedPatient?.MPD_PATIENT_CODE}
              </Typography>
            </Box>
            <IconButton onClick={() => setOpenVitalSignsDialog(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          <Box sx={{ maxHeight: "70vh", overflow: "auto" }}>
            {vitalSigns.length > 0 ? (
              [...vitalSigns]
                .sort(
                  (a, b) =>
                    new Date(b.recordedDate) - new Date(a.recordedDate)
                )
                .map((vital, index) => {
                  const bmi = calculateBMI(vital.weight, vital.height);
                  const bmiCategory = getBMICategory(bmi);
                  const bmiColor = getBMIColor(bmi);
                  
                  return (
                    <Card key={index} sx={{ mb: 3 }}>
                      <CardContent>
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          sx={{ mb: 2 }}
                        >
                          <Box display="flex" alignItems="center" gap={1}>
                            <MonitorHeartIcon color="primary" />
                            <Typography variant="h6">
                              Vital Signs Record #{vitalSigns.length - index}
                            </Typography>
                          </Box>
                          <Chip
                            icon={<TimelineIcon />}
                            label={new Date(vital.recordedDate).toLocaleString()}
                            variant="outlined"
                            size="small"
                          />
                        </Box>

                        <Divider sx={{ mb: 2 }} />

                        <Grid container spacing={2}>
                          {/* Blood Pressure */}
                          <Grid item xs={12} sm={6} md={4}>
                            <Paper
                              elevation={0}
                              sx={{
                                p: 2,
                                bgcolor: theme.palette.grey[50],
                                borderRadius: 2,
                              }}
                            >
                              <Box display="flex" alignItems="center" gap={1} mb={1}>
                                <OpacityIcon color="error" />
                                <Typography variant="subtitle2" color="text.secondary">
                                  Blood Pressure
                                </Typography>
                              </Box>
                              <Typography variant="h6">
                                {vital.bloodPressureSystolic && vital.bloodPressureDiastolic
                                  ? `${vital.bloodPressureSystolic}/${vital.bloodPressureDiastolic} mmHg`
                                  : "N/A"}
                              </Typography>
                              {vital.bloodPressureSystolic && vital.bloodPressureDiastolic && (
                                <Box mt={1}>
                                  <Chip
                                    size="small"
                                    label={vital.bloodPressureSystolic > 140 || vital.bloodPressureDiastolic > 90 
                                      ? "High" : vital.bloodPressureSystolic < 90 || vital.bloodPressureDiastolic < 60 
                                      ? "Low" : "Normal"}
                                    color={vital.bloodPressureSystolic > 140 || vital.bloodPressureDiastolic > 90 
                                      ? "error" : vital.bloodPressureSystolic < 90 || vital.bloodPressureDiastolic < 60 
                                      ? "warning" : "success"}
                                  />
                                </Box>
                              )}
                            </Paper>
                          </Grid>

                          {/* Heart Rate */}
                          <Grid item xs={12} sm={6} md={4}>
                            <Paper
                              elevation={0}
                              sx={{
                                p: 2,
                                bgcolor: theme.palette.grey[50],
                                borderRadius: 2,
                              }}
                            >
                              <Box display="flex" alignItems="center" gap={1} mb={1}>
                                <FavoriteIcon color="error" />
                                <Typography variant="subtitle2" color="text.secondary">
                                  Heart Rate
                                </Typography>
                              </Box>
                              <Typography variant="h6">
                                {formatVitalSign(vital.heartRate, 'bpm', 0)}
                              </Typography>
                              {vital.heartRate && (
                                <Box mt={1}>
                                  <Chip
                                    size="small"
                                    label={vital.heartRate > 100 ? "High" : vital.heartRate < 60 ? "Low" : "Normal"}
                                    color={vital.heartRate > 100 ? "error" : vital.heartRate < 60 ? "warning" : "success"}
                                  />
                                </Box>
                              )}
                            </Paper>
                          </Grid>

                          {/* Temperature */}
                          <Grid item xs={12} sm={6} md={4}>
                            <Paper
                              elevation={0}
                              sx={{
                                p: 2,
                                bgcolor: theme.palette.grey[50],
                                borderRadius: 2,
                              }}
                            >
                              <Box display="flex" alignItems="center" gap={1} mb={1}>
                                <BiotechIcon color="warning" />
                                <Typography variant="subtitle2" color="text.secondary">
                                  Temperature
                                </Typography>
                              </Box>
                              <Typography variant="h6">
                                {formatVitalSign(vital.temperature, '°C')}
                              </Typography>
                              {vital.temperature && (
                                <Box mt={1}>
                                  <Chip
                                    size="small"
                                    label={vital.temperature > 37.2 ? "Fever" : vital.temperature < 36.1 ? "Low" : "Normal"}
                                    color={vital.temperature > 37.2 ? "error" : vital.temperature < 36.1 ? "warning" : "success"}
                                  />
                                </Box>
                              )}
                            </Paper>
                          </Grid>

                          {/* Respiratory Rate */}
                          <Grid item xs={12} sm={6} md={4}>
                            <Paper
                              elevation={0}
                              sx={{
                                p: 2,
                                bgcolor: theme.palette.grey[50],
                                borderRadius: 2,
                              }}
                            >
                              <Box display="flex" alignItems="center" gap={1} mb={1}>
                                <AirIcon color="info" />
                                <Typography variant="subtitle2" color="text.secondary">
                                  Respiratory Rate
                                </Typography>
                              </Box>
                              <Typography variant="h6">
                                {formatVitalSign(vital.respiratoryRate, '/min', 0)}
                              </Typography>
                            </Paper>
                          </Grid>

                          {/* O2 Saturation */}
                          <Grid item xs={12} sm={6} md={4}>
                            <Paper
                              elevation={0}
                              sx={{
                                p: 2,
                                bgcolor: theme.palette.grey[50],
                                borderRadius: 2,
                              }}
                            >
                              <Box display="flex" alignItems="center" gap={1} mb={1}>
                                <SpeedIcon color="primary" />
                                <Typography variant="subtitle2" color="text.secondary">
                                  O2 Saturation
                                </Typography>
                              </Box>
                              <Typography variant="h6">
                                {formatVitalSign(vital.oxygenSaturation, '%', 0)}
                              </Typography>
                              {vital.oxygenSaturation && (
                                <Box mt={1}>
                                  <Chip
                                    size="small"
                                    label={vital.oxygenSaturation < 95 ? "Low" : "Normal"}
                                    color={vital.oxygenSaturation < 95 ? "error" : "success"}
                                  />
                                </Box>
                              )}
                            </Paper>
                          </Grid>

                          {/* Height */}
                          <Grid item xs={12} sm={6} md={4}>
                            <Paper
                              elevation={0}
                              sx={{
                                p: 2,
                                bgcolor: theme.palette.grey[50],
                                borderRadius: 2,
                              }}
                            >
                              <Box display="flex" alignItems="center" gap={1} mb={1}>
                                <HeightIcon color="action" />
                                <Typography variant="subtitle2" color="text.secondary">
                                  Height
                                </Typography>
                              </Box>
                              <Typography variant="h6">
                                {formatVitalSign(vital.height, 'cm', 0)}
                              </Typography>
                            </Paper>
                          </Grid>

                          {/* Weight */}
                          <Grid item xs={12} sm={6} md={4}>
                            <Paper
                              elevation={0}
                              sx={{
                                p: 2,
                                bgcolor: theme.palette.grey[50],
                                borderRadius: 2,
                              }}
                            >
                              <Box display="flex" alignItems="center" gap={1} mb={1}>
                                <LineWeightIcon color="action" />
                                <Typography variant="subtitle2" color="text.secondary">
                                  Weight
                                </Typography>
                              </Box>
                              <Typography variant="h6">
                                {formatVitalSign(vital.weight, 'kg', 1)}
                              </Typography>
                            </Paper>
                          </Grid>

                          {/* BMI */}
                          <Grid item xs={12} sm={6} md={4}>
                            <Paper
                              elevation={0}
                              sx={{
                                p: 2,
                                bgcolor: theme.palette.grey[50],
                                borderRadius: 2,
                              }}
                            >
                              <Box display="flex" alignItems="center" gap={1} mb={1}>
                                <MonitorHeartIcon color={bmiColor === "success" ? "success" : "action"} />
                                <Typography variant="subtitle2" color="text.secondary">
                                  BMI
                                </Typography>
                              </Box>
                              <Typography variant="h6">
                                {bmi ? bmi.toFixed(1) : "N/A"}
                              </Typography>
                              {bmi && (
                                <Box mt={1}>
                                  <Chip
                                    size="small"
                                    label={bmiCategory}
                                    color={bmiColor}
                                  />
                                </Box>
                              )}
                            </Paper>
                          </Grid>
                        </Grid>

                        {/* Notes */}
                        {vital.notes && (
                          <Box mt={2}>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                              Notes:
                            </Typography>
                            <Paper
                              elevation={0}
                              sx={{
                                p: 2,
                                bgcolor: theme.palette.grey[50],
                                borderRadius: 2,
                              }}
                            >
                              <Typography variant="body2">
                                {vital.notes}
                              </Typography>
                            </Paper>
                          </Box>
                        )}

                        {/* Recorded By */}
                        <Box mt={2} display="flex" justifyContent="flex-end">
                          <Typography variant="caption" color="text.secondary">
                            Recorded by: {vital.recordedBy || "Unknown"} • Last updated: {new Date(vital.lastUpdated || vital.recordedDate).toLocaleString()}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  );
                })
            ) : (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <MonitorHeartIcon sx={{ fontSize: 60, color: theme.palette.grey[400], mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No vital signs available for this patient
                </Typography>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<FavoriteIcon />}
                  onClick={() => {
                    setOpenVitalSignsDialog(false);
                    handleAddVitalSigns(selectedPatient);
                  }}
                  disabled={role === "Phuser"}
                  sx={{ mt: 2 }}
                >
                  Add First Vital Signs
                </Button>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenVitalSignsDialog(false);
              handleAddVitalSigns(selectedPatient);
            }}
            variant="contained"
            color="success"
            startIcon={<FavoriteIcon />}
            disabled={role === "Phuser"}
          >
            Add New Vital Signs
          </Button>
          <Button
            onClick={() => setOpenVitalSignsDialog(false)}
            variant="outlined"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}