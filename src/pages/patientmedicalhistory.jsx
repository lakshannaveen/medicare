// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import '../styles/patientmedicalhistory.css';
// import { useNavigate } from "react-router-dom";

// export default function Pmedicalhistory() {
//   const [records, setRecords] = useState([]);
//   const [details, setDetails] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const patientid = localStorage.getItem("PatientCode");
//   const navigate = useNavigate();

//   useEffect(() => {

//     //I used this method to fetch number of records
//     const fetchnumberofrecords = async () => {
//       try {
//         const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/Treatment/patient/${patientid}`);
//         setRecords(response.data);
//       } catch (error) {
//         console.error("Error fetching medical records:", error);
//       }
//     };

//     fetchnumberofrecords();

//   }, [patientid]);

//   const viewdetails = async (patientId, serial_no) => {
//     try {
//       const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/Treatment/patient/record/${patientId}/${serial_no}`);
//       setDetails(response.data);
//       setIsModalOpen(true); // Show the modal with details
//     } catch (error) {
//       console.error("Error fetching record details:", error);
//     }
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setDetails(null); // Clear details when closing the modal
//   };

//   return (
//     <div>

//       <button className="go-back-button" onClick={() => navigate(-1)}> {/* Back button */}
//         Go Back
//       </button>

//       <h1 style={{ textAlign: 'center' }}>Medical History</h1>

//       <div className="medical-container">
//       {records.length > 0 ? (
//         records.map((record, index) => (
//             <div key={index} className="record">
//                 <h3>Treatment {records.length - index}</h3> {/* Reverse numbering */}
//                 <p>Treatment Date: {new Date(record.MTD_CREATED_DATE).toISOString().split("T")[0]}</p>
//                 <p>Doctor: {record.MTD_DOCTOR}</p>
//                 <p>Status: {record.MTD_TREATMENT_STATUS === 'C'
//                     ? 'Complete'
//                     : record.MTD_TREATMENT_STATUS === 'P'
//                         ? 'Preparation complete'
//                         : 'Unknown'}</p>
//                 <button onClick={() => viewdetails(record.MTD_PATIENT_CODE, record.MTD_SERIAL_NO)}>View Details</button>
//             </div>
//         ))
//     ) : (
//         <p>No medical history records available.</p>
//     )}

//         {isModalOpen && details && (
//           <div className="modal-overlay">
//             <div className="modal-content">
//               <h2>Medical History Details</h2>
//               <div className="form-groupd">
//                 <label><strong>Complain:</strong></label>
//                 <textarea value={details.MTD_COMPLAIN} readOnly rows="7" />
//               </div>

//               <div className="form-groupd">
//                 <label><strong>Diagnostics:</strong></label>
//                 <textarea value={details.MTD_DIAGNOSTICS} readOnly rows="7" />
//               </div>

//               <div className="prescription-table-container">

//                         <label style={{marginBottom:"10px"}}><strong>Allocated drugs</strong></label>
//                         <table className="prescription-table1">
//                             <thead>
//                                 <tr>
//                                     <th style={{textAlign:"left"}}>Drug Name</th>
//                                     <th style={{textAlign:"left"}}>Quantity</th>
//                                     <th style={{textAlign:"left"}}>Number of takes</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {details.Drugs.map((drug, index) => (
//                                     <tr key={index}>
//                                        <td style={{ textAlign: "left" }}> {drug.DrugName}</td>
//                                         <td style={{ textAlign: "right" }}>{drug.MDD_QUANTITY}</td>
//                                         <td style={{ textAlign: "left" }}>{drug.MDD_TAKES}</td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>

//               <div className="form-groupd">
//                 <label><strong>Doctor Remarks:</strong></label>
//                 <textarea value={details.MTD_REMARKS} readOnly rows="7" />
//               </div>
//               <button className="close-button" onClick={closeModal}>X</button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// Patient Medical History Page
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import '../styles/patientmedicalhistory.css';
// import { useNavigate } from "react-router-dom";

// export default function Pmedicalhistory() {
//   const [records, setRecords] = useState([]);
//   const [details, setDetails] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const patientid = localStorage.getItem("PatientCode");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchnumberofrecords = async () => {
//       try {
//         const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/Treatment/patient/${patientid}`);
//         setRecords(response.data);
//       } catch (error) {
//         console.error("Error fetching medical records:", error);
//       }
//     };
//     fetchnumberofrecords();
//   }, [patientid]);

//   const viewdetails = async (patientId, serial_no) => {
//     try {
//       const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/Treatment/patient/record/${patientId}/${serial_no}`);
//       setDetails(response.data);
//       setIsModalOpen(true);
//     } catch (error) {
//       console.error("Error fetching record details:", error);
//     }
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setDetails(null);
//   };

//   return (
//     <div>
//       <button className="go-back-button" onClick={() => navigate(-1)}>
//         Go Back
//       </button>

//       <h1 style={{ textAlign: 'center' }}>Medical History</h1>

//       <div className="medical-container"
//       style={{
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         flexDirection: 'column',
//         maxWidth: '70%',
//         margin: '20px auto',
//         padding: '10px' }}>
//         {records.length > 0 ? (
//           <table className="medical-table">
//             <thead>
//               <tr>
//                 <th>Treatment No.</th>
//                 <th>Treatment Date</th>
//                 <th>Doctor</th>
//                 <th>Status</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {records.map((record, index) => (
//                 <tr key={index}>
//                   <td>Treatment {records.length - index}</td>
//                   <td>{new Date(record.MTD_CREATED_DATE).toISOString().split("T")[0]}</td>
//                   <td>{record.MTD_DOCTOR}</td>
//                   <td>
//                     {record.MTD_TREATMENT_STATUS === 'C'
//                       ? 'Complete'
//                       : record.MTD_TREATMENT_STATUS === 'P'
//                         ? 'Preparation complete'
//                         : 'Unknown'}
//                   </td>
//                   <td>
//                     <button className="view-details-btn" onClick={() => viewdetails(record.MTD_PATIENT_CODE, record.MTD_SERIAL_NO)}>View Details</button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         ) : (
//           <p>No medical history records available.</p>
//         )}

//         {isModalOpen && details && (
//           <div className="modal-overlay">
//             <div className="modal-content">
//               <h2>Medical History Details</h2>
//               <div className="form-groupd">
//                 <label><strong>Complain:</strong></label>
//                 <textarea value={details.MTD_COMPLAIN} readOnly rows="7" />
//               </div>

//               <div className="form-groupd">
//                 <label><strong>Diagnostics:</strong></label>
//                 <textarea value={details.MTD_DIAGNOSTICS} readOnly rows="7" />
//               </div>

//               <div className="prescription-table-container">
//                 <label style={{ marginBottom: "10px" }}><strong>Allocated drugs</strong></label>
//                 <table className="prescription-table1">
//                   <thead>
//                     <tr>
//                       <th style={{ textAlign: "left" }}>Drug Name</th>
//                       <th style={{ textAlign: "left" }}>Quantity</th>
//                       <th style={{ textAlign: "left" }}>Number of takes</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {details.Drugs.map((drug, index) => (
//                       <tr key={index}>
//                         <td style={{ textAlign: "left" }}> {drug.DrugName}</td>
//                         <td style={{ textAlign: "right" }}>{drug.MDD_QUANTITY}</td>
//                         <td style={{ textAlign: "left" }}>{drug.MDD_TAKES}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>

//               <div className="form-groupd">
//                 <label><strong>Doctor Remarks:</strong></label>
//                 <textarea value={details.MTD_REMARKS} readOnly rows="7" />
//               </div>
//               <button className="close-button" onClick={closeModal}>X</button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  CircularProgress,
  useMediaQuery,
  useTheme,
  Chip,
  Divider,
  Grid,
} from "@mui/material";
import {
  ArrowBack,
  Close,
  Visibility,
  MedicalInformation,
  LocalHospital,
  Medication,
  Notes,
} from "@mui/icons-material";

export default function Pmedicalhistory() {
  const [records, setRecords] = useState([]);
  const [details, setDetails] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const patientid = localStorage.getItem("PatientCode");
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // useEffect(() => {
  //   const fetchnumberofrecords = async () => {
  //     try {
  //       setLoading(true);
  //       const response = await axios.get(
  //         `${process.env.REACT_APP_API_BASE_URL}/Treatment/patient/${patientid}`
  //       );
  //       setRecords(response.data);
  //       setError(null);
  //     } catch (error) {
  //       console.error("Error fetching medical records:", error);
  //       setError("Failed to load medical records. Please try again later.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchnumberofrecords();
  // }, [patientid]);
  useEffect(() => {
    const fetchnumberofrecords = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/Treatment/patient/${patientid}`
        );
        const sortedRecords = response.data.sort(
          (a, b) => new Date(b.MTD_CREATED_DATE) - new Date(a.MTD_CREATED_DATE)
        );
        setRecords(sortedRecords);
        setError(null);
      } catch (error) {
        console.error("Error fetching medical records:", error);
        setError("There is No Past Medical History");
      } finally {
        setLoading(false);
      }
    };
    fetchnumberofrecords();
  }, [patientid]);

  const viewdetails = async (patientId, serial_no) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/Treatment/patient/record/${patientId}/${serial_no}`
      );
      setDetails(response.data);
      setIsModalOpen(true);
      setError(null);
    } catch (error) {
      console.error("Error fetching record details:", error);
      setError("Failed to load record details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setDetails(null);
  };

  const getStatusChip = (status) => {
    switch (status) {
      case "C":
        return <Chip label="Completed" color="success" size="small" />;
      case "P":
        return (
          <Chip label="Preparation Complete" color="warning" size="small" />
        );
      default:
        return <Chip label="Unknown" color="default" size="small" />;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          variant="outlined"
          color="primary"
          sx={{ mb: 2 }}
        >
          Back
        </Button>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: "bold",
            color: theme.palette.primary.main,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <MedicalInformation fontSize="large" />
          Medical History
        </Typography>
        <Divider sx={{ my: 2 }} />
      </Box>

      {loading && !records.length ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "200px",
          }}
        >
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "200px",
            color: theme.palette.error.main,
          }}
        >
          <Typography color="error">{error}</Typography>
        </Box>
      ) : records.length > 0 ? (
        <TableContainer component={Paper} elevation={3}>
          <Table sx={{ minWidth: 650 }} aria-label="medical history table">
            <TableHead sx={{ backgroundColor: theme.palette.primary.light }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", color: "white" }}>
                  Treatment No.
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "white" }}>
                  Date
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "white" }}>
                  Doctor
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "white" }}>
                  Status
                </TableCell>
                <TableCell
                  sx={{ fontWeight: "bold", color: "white" }}
                  align="center"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            {/* <TableBody>
              {records.map((record, index) => (
                <TableRow
                  key={index}
                  hover
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    "&:hover": { backgroundColor: theme.palette.action.hover },
                  }}
                >
                  <TableCell>
                    <Typography fontWeight="medium">
                      Treatment {records.length - index}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {new Date(record.MTD_CREATED_DATE).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{record.MTD_DOCTOR}</TableCell>
                  <TableCell>
                    {getStatusChip(record.MTD_TREATMENT_STATUS)}
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="outlined"
                      startIcon={<Visibility />}
                      onClick={() =>
                        viewdetails(
                          record.MTD_PATIENT_CODE,
                          record.MTD_SERIAL_NO
                        )
                      }
                      size="small"
                    >
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody> */}
            <TableBody>
              {records.map((record, index) => (
                <TableRow
                  key={index}
                  hover
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    "&:hover": { backgroundColor: theme.palette.action.hover },
                  }}
                >
                  <TableCell>
                    <Typography fontWeight="medium">
                      Treatment {records.length - index}{" "}
                      {/* This will make newest = highest number */}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {new Date(record.MTD_CREATED_DATE).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{record.MTD_DOCTOR}</TableCell>
                  <TableCell>
                    {getStatusChip(record.MTD_TREATMENT_STATUS)}
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="outlined"
                      startIcon={<Visibility />}
                      onClick={() =>
                        viewdetails(
                          record.MTD_PATIENT_CODE,
                          record.MTD_SERIAL_NO
                        )
                      }
                      size="small"
                    >
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "200px",
          }}
        >
          <Typography variant="h6" color="textSecondary">
            No medical history records available.
          </Typography>
        </Box>
      )}

      <Dialog
        open={isModalOpen}
        onClose={closeModal}
        fullWidth
        maxWidth="md"
        fullScreen={isMobile}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: theme.palette.common.black,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <LocalHospital sx={{ color: "primary.main" }} />
            <Typography variant="h6" fontWeight="bold">
              Treatment Details
            </Typography>
          </Box>
          <IconButton
            edge="end"
            color="inherit"
            onClick={closeModal}
            aria-label="close"
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ py: 3 }}>
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "200px",
              }}
            >
              <CircularProgress />
            </Box>
          ) : details ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <Box sx={{ width: "100%" }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 1,
                    color: theme.palette.primary.black,
                  }}
                >
                  <Notes sx={{ color: "primary.main" }} />
                  <strong>Complaint</strong>
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  value={details.MTD_COMPLAIN}
                  variant="outlined"
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                />
              </Box>
              <Box sx={{ width: "100%" }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 1,
                    color: theme.palette.primary.black,
                  }}
                >
                  <MedicalInformation sx={{ color: "primary.main" }} />
                  <strong>Diagnostics</strong>
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  value={details.MTD_DIAGNOSTICS}
                  variant="outlined"
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                />
              </Box>
              <Box sx={{ width: "100%" }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 2,
                    color: theme.palette.primary.black,
                  }}
                >
                  <Medication sx={{ color: "primary.main" }} />
                  <strong>Prescribed Medications</strong>
                </Typography>
                <TableContainer component={Paper} elevation={2}>
                  <Table size="small">
                    <TableHead
                      sx={{ backgroundColor: theme.palette.primary.main }}
                    >
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold", color: "white" }}>
                          Drug Name
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: "bold", color: "white" }}
                          align="right"
                        >
                          Quantity
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: "bold", color: "white" }}
                          align="left"
                        >
                          Dosage
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {details.Drugs.map((drug, index) => (
                        <TableRow key={index}>
                          <TableCell>{drug.DrugName}</TableCell>
                          <TableCell align="right">
                            {drug.MDD_QUANTITY}
                          </TableCell>
                          <TableCell align="left">{drug.MDD_TAKES}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
              <Box sx={{ width: "100%" }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 1,
                    color: theme.palette.primary.black,
                  }}
                >
                  <Notes sx={{ color: "primary.main" }} />
                  <strong>Doctor's Remarks</strong>
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  value={details.MTD_REMARKS}
                  variant="outlined"
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                />
              </Box>
            </Box>
          ) : (
            <Typography color="error">
              Failed to load treatment details.
            </Typography>
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
}
