// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import {
//   Box,
//   Button,
//   Container,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   TextField,
//   Typography,
//   CircularProgress,
//   Snackbar,
//   Alert,
//   useTheme,
//   IconButton,
//   MenuItem,
// } from "@mui/material";
// import {
//   Search as SearchIcon,
//   MedicalServices as MedicalServicesIcon,
//   Visibility as VisibilityIcon,
// } from "@mui/icons-material";

// export default function Laboratory() {
//   const theme = useTheme();
//   const navigate = useNavigate();

//   const [patients, setPatients] = useState([]);
//   const [filteredPatients, setFilteredPatients] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const [labInputs, setLabInputs] = useState({});
//   const [labList, setLabList] = useState([]);

//   // 🔥 Logged user doctor ID
//   const [doctorId, setDoctorId] = useState("");

//   // Snackbar
//   const [snackbarOpen, setSnackbarOpen] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState("");
//   const [snackbarSeverity, setSnackbarSeverity] = useState("success");

//   // ✅ Get logged user
//   useEffect(() => {
//   const doctorIdFromStorage = localStorage.getItem("id");
//   if (doctorIdFromStorage) {
//     setDoctorId(doctorIdFromStorage);
//   }
// }, []);

//   // Fetch Patients
//   const fetchAllPatients = async () => {
//     setIsLoading(true);
//     try {
//       const res = await axios.get(
//         `${process.env.REACT_APP_API_BASE_URL}/Patient`
//       );
//       setPatients(res.data);
//       setFilteredPatients(res.data);
//     } catch {
//       setPatients([]);
//       setFilteredPatients([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Fetch Labs
//   const fetchLabs = async () => {
//     try {
//       const res = await axios.get(
//         `${process.env.REACT_APP_API_BASE_URL}/LabMaster`
//       );
//       setLabList(res.data);
//     } catch {
//       setLabList([]);
//     }
//   };

//   useEffect(() => {
//     fetchAllPatients();
//     fetchLabs();
//   }, []);

//   // Filter
//   useEffect(() => {
//     const filtered = patients.filter(
//       (p) =>
//         p.MPD_PATIENT_NAME.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         p.MPD_MOBILE_NO.includes(searchTerm)
//     );
//     setFilteredPatients(filtered);
//   }, [searchTerm, patients]);

//   // Handle input
//   const handleLabChange = (code, field, value) => {
//     setLabInputs((prev) => ({
//       ...prev,
//       [code]: {
//         ...prev[code],
//         [field]: value,
//       },
//     }));
//   };

//   const showMsg = (msg, type) => {
//     setSnackbarMessage(msg);
//     setSnackbarSeverity(type);
//     setSnackbarOpen(true);
//   };

//   const clearRow = (code) => {
//     setLabInputs((prev) => {
//       const updated = { ...prev };
//       delete updated[code];
//       return updated;
//     });
//   };

//   // Save
//   const handleLabSubmit = async (patient) => {
//     const code = patient.MPD_PATIENT_CODE;
//     const data = labInputs[code];

//     if (!data) {
//       showMsg("Enter lab details first", "warning");
//       return;
//     }

//     const formData = new FormData();

//     formData.append("MLT_PATIENT_CODE", code);
//     formData.append("MLT_DOCTOR_ID", doctorId); // 🔥 auto doctor id
//     formData.append("MLT_SERIAL_NO", 1);
//     formData.append("MLT_LAB_ID", data.MLT_LAB_ID || "");
//     formData.append("MLT_TEST_NAME", data.MLT_TEST_NAME || "");
//     formData.append("MLT_STATUS", "");
//     formData.append("MLT_REPORT_RESULT", "Requested");

//     try {
//       await axios.post(
//         `${process.env.REACT_APP_API_BASE_URL}/LabTransaction/upload`,
//         formData
//       );

//       showMsg("Lab request saved successfully", "success");
//       clearRow(code);
//     } catch (err) {
//       console.error(err);
//       showMsg("Save failed", "error");
//     }
//   };

//   return (
//     <Container maxWidth="xl" sx={{ py: 3 }}>
//       <Paper sx={{ p: 3 }}>
//         <Typography
//           variant="h4"
//           color="primary"
//           fontWeight={600}
//           align="center"
//           mb={3}
//         >
//           Laboratory
//         </Typography>

//         {/* SEARCH */}
//         <TextField
//           fullWidth
//           placeholder="Search patient..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           sx={{ mb: 3 }}
//           InputProps={{
//             startAdornment: <SearchIcon sx={{ mr: 1 }} />,
//           }}
//         />

//         {/* TABLE */}
//         {isLoading ? (
//           <CircularProgress />
//         ) : (
//           <TableContainer>
//             <Table>
//               <TableHead sx={{ background: theme.palette.primary.main }}>
//                 <TableRow>
//                   <TableCell sx={{ color: "#fff" }}>Patient</TableCell>
//                   <TableCell sx={{ color: "#fff" }}>Contact</TableCell>
//                   <TableCell sx={{ color: "#fff" }}>Lab Details</TableCell>
//                   <TableCell sx={{ color: "#fff" }}>Actions</TableCell>
//                 </TableRow>
//               </TableHead>

//               <TableBody>
//                 {filteredPatients.map((p) => {
//                   const code = p.MPD_PATIENT_CODE;

//                   return (
//                     <TableRow key={code}>
//                       <TableCell>
//                         {p.MPD_PATIENT_NAME}
//                         <br />
//                         <small>{code}</small>
//                       </TableCell>

//                       <TableCell>{p.MPD_MOBILE_NO}</TableCell>

//                       <TableCell>
//                         <Box display="flex" flexDirection="column" gap={1}>
//                           {/* 🔥 AUTO DOCTOR ID */}
//                           <TextField
//                             size="small"
//                             label="Doctor ID"
//                             value={doctorId}
//                             disabled
//                           />

//                           {/* 🔥 FIXED DROPDOWN */}
//                           <TextField
//                             select
//                             size="small"
//                             label="Lab"
//                             value={labInputs[code]?.MLT_LAB_ID || ""}
//                             onChange={(e) =>
//                               handleLabChange(
//                                 code,
//                                 "MLT_LAB_ID",
//                                 e.target.value
//                               )
//                             }
//                           >
//                             <MenuItem value="">Select Lab</MenuItem>

//                             {labList.map((lab) => (
//                               <MenuItem
//                                 key={lab.MLM_LAB_ID}
//                                 value={lab.MLM_LAB_ID}
//                               >
//                                 {lab.MLM_LAB_NAME}
//                               </MenuItem>
//                             ))}
//                           </TextField>

//                           <TextField
//                             size="small"
//                             label="Test Name"
//                             value={labInputs[code]?.MLT_TEST_NAME || ""}
//                             onChange={(e) =>
//                               handleLabChange(
//                                 code,
//                                 "MLT_TEST_NAME",
//                                 e.target.value
//                               )
//                             }
//                           />

//                           <Button
//                             variant="contained"
//                             size="small"
//                             onClick={() => handleLabSubmit(p)}
//                           >
//                             Save
//                           </Button>
//                         </Box>
//                       </TableCell>

//                       <TableCell>
//                         <IconButton
//                           color="primary"
//                           onClick={() =>
//                             navigate(`/dashboard/addrecord/${code}`)
//                           }
//                         >
//                           <MedicalServicesIcon />
//                         </IconButton>

//                         <IconButton
//                           color="secondary"
//                           onClick={() =>
//                             navigate(`/dashboard/view-report/${code}`)
//                           }
//                         >
//                           <VisibilityIcon />
//                         </IconButton>
//                       </TableCell>
//                     </TableRow>
//                   );
//                 })}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         )}
//       </Paper>

//       <Snackbar
//         open={snackbarOpen}
//         autoHideDuration={4000}
//         onClose={() => setSnackbarOpen(false)}
//       >
//         <Alert severity={snackbarSeverity}>{snackbarMessage}</Alert>
//       </Snackbar>
//     </Container>
//   );
// }

// src/components/Laboratory.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
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
  Box,
  Button,
  IconButton,
  MenuItem,
  useTheme,
} from "@mui/material";
import {
  Search as SearchIcon,
  MedicalServices as MedicalServicesIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import ViewReport from "./ViewReport"; // Modal component
import { useNavigate } from "react-router-dom";

export default function Laboratory() {
  const theme = useTheme();
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [labInputs, setLabInputs] = useState({});
  const [labList, setLabList] = useState([]);
  const [doctorId, setDoctorId] = useState("");

  // Snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Popup state
  const [reportOpen, setReportOpen] = useState(false);
  const [selectedPatientCode, setSelectedPatientCode] = useState("");

  // ✅ Get logged user doctor ID
  useEffect(() => {
    const doctorIdFromStorage = localStorage.getItem("id");
    if (doctorIdFromStorage) setDoctorId(doctorIdFromStorage);
  }, []);

  // Fetch Patients
  const fetchAllPatients = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/Patient`,
      );
      setPatients(res.data);
      setFilteredPatients(res.data);
    } catch {
      setPatients([]);
      setFilteredPatients([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch Labs
  const fetchLabs = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/LabMaster`,
      );
      setLabList(res.data);
    } catch {
      setLabList([]);
    }
  };

  useEffect(() => {
    fetchAllPatients();
    fetchLabs();
  }, []);

  // Filter patients
  useEffect(() => {
    const filtered = patients.filter(
      (p) =>
        p.MPD_PATIENT_NAME.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.MPD_MOBILE_NO.includes(searchTerm),
    );
    setFilteredPatients(filtered);
  }, [searchTerm, patients]);

  // Handle Lab Input Change
  const handleLabChange = (code, field, value) => {
    setLabInputs((prev) => ({
      ...prev,
      [code]: { ...prev[code], [field]: value },
    }));
  };

  const showMsg = (msg, type) => {
    setSnackbarMessage(msg);
    setSnackbarSeverity(type);
    setSnackbarOpen(true);
  };

  const clearRow = (code) => {
    setLabInputs((prev) => {
      const updated = { ...prev };
      delete updated[code];
      return updated;
    });
  };

  // Save Lab
  const handleLabSubmit = async (patient) => {
    const code = patient.MPD_PATIENT_CODE;
    const data = labInputs[code];

    if (!data) {
      showMsg("Enter lab details first", "warning");
      return;
    }

    const formData = new FormData();
    formData.append("MLT_PATIENT_CODE", code);
    formData.append("MLT_DOCTOR_ID", doctorId);
    formData.append("MLT_SERIAL_NO", 1);
    formData.append("MLT_LAB_ID", data.MLT_LAB_ID || "");
    formData.append("MLT_TEST_NAME", data.MLT_TEST_NAME || "");
    formData.append("MLT_STATUS", "");
    formData.append("MLT_REPORT_RESULT", "Requested");

    try {
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/LabTransaction/upload`,
        formData,
      );
      showMsg("Lab request saved successfully", "success");
      clearRow(code);
    } catch (err) {
      console.error(err);
      showMsg("Save failed", "error");
    }
  };

  // Open report popup
  const handleOpenReport = (code) => {
    setSelectedPatientCode(code);
    setReportOpen(true);
  };

  const handleCloseReport = () => {
    setReportOpen(false);
    setSelectedPatientCode("");
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography
          variant="h4"
          color="primary"
          fontWeight={600}
          align="center"
          mb={3}
        >
          Laboratory
        </Typography>

        <TextField
          fullWidth
          placeholder="Search patient..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 3 }}
          InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1 }} /> }}
        />

        {isLoading ? (
          <CircularProgress />
        ) : (
          <TableContainer>
            <Table>
              <TableHead sx={{ background: theme.palette.primary.main }}>
                <TableRow>
                  <TableCell sx={{ color: "#fff" }}>Patient</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Contact</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Lab Details</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredPatients.map((p) => {
                  const code = p.MPD_PATIENT_CODE;

                  return (
                    <TableRow key={code}>
                      <TableCell>
                        {p.MPD_PATIENT_NAME}
                        <br />
                        <small>{code}</small>
                      </TableCell>

                      <TableCell>{p.MPD_MOBILE_NO}</TableCell>

                      <TableCell>
                        <Box display="flex" flexDirection="column" gap={1}>
                          <TextField
                            size="small"
                            label="Doctor ID"
                            value={doctorId}
                            disabled
                          />

                          <TextField
                            select
                            size="small"
                            label="Lab"
                            value={labInputs[code]?.MLT_LAB_ID || ""}
                            onChange={(e) =>
                              handleLabChange(
                                code,
                                "MLT_LAB_ID",
                                e.target.value,
                              )
                            }
                          >
                            <MenuItem value="">Select Lab</MenuItem>
                            {labList.map((lab) => (
                              <MenuItem
                                key={lab.MLM_LAB_ID}
                                value={lab.MLM_LAB_ID}
                              >
                                {lab.MLM_LAB_NAME}
                              </MenuItem>
                            ))}
                          </TextField>

                          <TextField
                            size="small"
                            label="Test Name"
                            value={labInputs[code]?.MLT_TEST_NAME || ""}
                            onChange={(e) =>
                              handleLabChange(
                                code,
                                "MLT_TEST_NAME",
                                e.target.value,
                              )
                            }
                          />

                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleLabSubmit(p)}
                          >
                            Save
                          </Button>
                        </Box>
                      </TableCell>

                      <TableCell>
                        <IconButton
                          color="primary"
                          onClick={() =>
                            navigate(`/dashboard/addrecord/${code}`)
                          }
                        >
                          <MedicalServicesIcon />
                        </IconButton>

                        <IconButton
                          color="secondary"
                          onClick={() => handleOpenReport(code)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
      >
        {/* <Alert severity={snackbarSeverity}>{snackbarMessage}</Alert> */}
        <Alert
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

      {/* Report Modal */}
      <ViewReport
        open={reportOpen}
        onClose={handleCloseReport}
        patientCode={selectedPatientCode}
      />
    </Container>
  );
}
