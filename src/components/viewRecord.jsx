// //This page allows to vie the medical hoistory details after select atreatment

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useParams, useNavigate, useLocation } from "react-router-dom";
// import "../styles/viewRecord.css"; // Import the custom CSS
// import { Spinner } from "react-bootstrap";

// export default function ViewRecord() {
//   const { patientId, serial_no } = useParams();
//   const [details, setDetails] = useState(null);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();
//   const [patientdetails, setPatientdetails] = useState(null);
//   const [patientError, setPatientError] = useState("");
//   const [treatmentpopup1, setTreatmentpopup1] = useState("");
//   const [updatedtreatmentpopup, setUpdatedtreatmentpopup] = useState("");
//   const [treatmentnumber, setTreatmentnumber] = useState("");
//   const role = localStorage.getItem("Role");
//   const location = useLocation();

//   const message = location.state?.message || "Treatment Details";

//   const handleContinue = () => {
//     navigate(`/dashboard/remark/${patientId}/${serial_no}`);
//   };

//   const handleinvoice = (patientId, serial_no) => {
//     navigate(`/dashboard/invoice/${patientId}/${serial_no}`);
//   };

//   const handleprescription = (patientId, serial_no) => {
//     navigate(`/dashboard/prescription/${patientId}/${serial_no}`);
//   };

//   const handleRemarks = () => {
//     navigate(`/dashboard/remark/${patientId}/${serial_no}`);
//   };

//   useEffect(() => {
//     const fetchRecords = async () => {
//       try {
//         const response = await axios.get(
//           `${process.env.REACT_APP_API_BASE_URL}/Treatment/patient/record/${patientId}/${serial_no}`
//         );
//         setDetails(response.data);
//       } catch (error) {
//         console.error("Error fetching records:", error);
//         setError("Failed to fetch patient records.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRecords();

//     const fetchPatientDetails = async () => {
//       try {
//         const response = await axios.get(
//           `${process.env.REACT_APP_API_BASE_URL}/Patient/${patientId}`
//         );
//         setPatientdetails(response.data);
//       } catch (error) {
//         console.error("Error fetching patient details:", error);
//         setPatientError("Failed to fetch patient details.");
//       }
//     };

//     fetchPatientDetails();
//   }, [patientId, serial_no]);

//   const handleupdate = (serialNumber) => {
//     navigate(`/dashboard/addrecord/${patientId}`, { state: { serialNumber } });
//   };

//   if (loading) {
//     return (
//       <div className="loading-container">
//         <Spinner animation="border" />
//       </div>
//     );
//   }

//   if (error) {
//     return <div className="error-notification">{error}</div>;
//   }

//   return (
//     <div className="view-record-container">
//       <div className="header">
//         <button
//           className="back-button"
//           onClick={() => navigate(-1)}
//           title="Go Back"
//         >
//           Back
//         </button>
//       </div>
//       <div className="main">
//         <div className="health-record">
//           <h2>{message}</h2>
//           {/* <p style={{textAlign:"center"}}>( {details ? details.MTD_TYPE : 'Loading...'})</p> */}

//           {/* <p style={{textAlign:"center", fontWeight:"bold"}}>Treatment number: {details.Treatmentnumber}</p> */}

//           {details.MTD_CHANNEL_NO && (
//             <p style={{ textAlign: "center", fontWeight: "bold" }}>
//               Channel number: {details.MTD_CHANNEL_NO}
//             </p>
//           )}

//           <div className="details-header">
//             <p>
//               <strong>Date:</strong>{" "}
//               {new Date(details.MTD_DATE).toISOString().split("T")[0]}
//               {/* <p>Treatment-date: {new Date(treatment.MTD_CREATED_DATE).toISOString().split("T")[0]}</p> */}
//             </p>

//             <p>
//               <strong>Prescribed doctor: </strong>
//               {details.MTD_DOCTOR}
//             </p>
//             {/* <p>
//                             <strong>Doctor:</strong>
//                         </p> */}
//           </div>

//           <div className="details-header1">
//             <p>
//               <strong>Name of patient: </strong>
//               {patientdetails ? patientdetails.MPD_PATIENT_NAME : "Loading..."}
//             </p>
//           </div>

//           <div className="form-group">
//             <label>
//               <strong>Complain:</strong>
//             </label>
//             <textarea value={details.MTD_COMPLAIN} readOnly />
//           </div>
//           <div className="form-group">
//             <label>
//               <strong>Diagnostics:</strong>
//             </label>
//             <textarea value={details.MTD_DIAGNOSTICS} readOnly />
//           </div>

//           <label>Prescribed Medicines</label>
//           <div className="prescription-table-container">
//             <table className="prescription-table">
//               <thead>
//                 <tr>
//                   <th style={{ textAlign: "left" }}>Drug Name</th>
//                   <th style={{ textAlign: "left" }}>Quantity</th>
//                   <th style={{ textAlign: "left" }}>Takes</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {details.Drugs.map((drug, index) => (
//                   <tr key={index}>
//                     <td style={{ textAlign: "left" }}> {drug.DrugName}</td>
//                     <td style={{ textAlign: "right" }}>{drug.MDD_QUANTITY}</td>
//                     <td style={{ textAlign: "left" }}>{drug.MDD_TAKES}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           <div className="form-group">
//             <label>
//               <strong>Doctor Remarks:</strong>
//             </label>
//             <textarea value={details.MTD_REMARKS} readOnly />
//           </div>

//           {/* <div className='details-header1'>

//                         <p>

//                             <strong>Record type:</strong>{details ? details.MTD_TYPE : 'Loading...'}
//                         </p>

//                     </div> */}

//           <p>
//             <strong>Treatment condition:</strong>{" "}
//             {details.MTD_TREATMENT_STATUS === "C"
//               ? "Complete"
//               : details.MTD_TREATMENT_STATUS === "P"
//               ? "Preparation Complete"
//               : details.MTD_TREATMENT_STATUS === "N"
//               ? "Not Completed"
//               : "Unknown Status"}
//           </p>

//           <div className="btn-container1">
//             <button
//               className="edit-btn"
//               onClick={() => handleupdate(details.MTD_SERIAL_NO)}
//               disabled={!(role === "Admin" || role === "Doc")}
//               style={{
//                 cursor: !(role === "Admin" || role === "Doc")
//                   ? "not-allowed"
//                   : "pointer",
//                 backgroundColor: !(role === "Admin" || role === "Doc")
//                   ? "#ccc"
//                   : "#007bff",
//                 color: !(role === "Admin" || role === "Doc") ? "#666" : "#fff",
//                 border: "none",
//                 padding: "10px 20px",
//                 borderRadius: "5px",
//                 transition: "0.3s",
//               }}
//             >
//               Edit details
//             </button>

//             <button
//               className="continue-button"
//               onClick={() =>
//                 handleRemarks(details.MTD_PATIENT_CODE, details.MTD_SERIAL_NO)
//               }
//             >
//               Remarks
//             </button>

//             <button
//               className="continue-button"
//               onClick={() =>
//                 handleprescription(
//                   details.MTD_PATIENT_CODE,
//                   details.MTD_SERIAL_NO
//                 )
//               }
//             >
//               Prescription
//             </button>

//             <button
//               className="continue-button"
//               onClick={() =>
//                 handleinvoice(details.MTD_PATIENT_CODE, details.MTD_SERIAL_NO)
//               }
//             >
//               Invoice
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Render treatmentpopup1 */}
//       {treatmentpopup1 && (
//         <div className="popup-container">{treatmentpopup1}</div>
//       )}
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Divider,
  Chip,
  Avatar,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Grid,
  Stack,
} from "@mui/material";
import {
  ArrowBack,
  Edit,
  NoteAdd,
  Receipt,
  LocalHospital,
  Healing,
  MedicalInformation,
  CheckCircle,
  Pending,
  Cancel,
  Assignment,
  MonetizationOn,
  CalendarToday,
  Person,
  MedicalServices,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[3],
}));

const StatusChip = ({ status }) => {
  switch (status) {
    case "C":
      return (
        <Chip
          icon={<CheckCircle fontSize="small" />}
          label="Completed"
          color="success"
          variant="outlined"
          size="small"
        />
      );
    case "P":
      return (
        <Chip
          icon={<Pending fontSize="small" />}
          label="Preparation Complete"
          color="info"
          variant="outlined"
          size="small"
        />
      );
    case "N":
      return (
        <Chip
          icon={<Cancel fontSize="small" />}
          label="Not Completed"
          color="error"
          variant="outlined"
          size="small"
        />
      );
    default:
      return (
        <Chip
          icon={<Pending fontSize="small" />}
          label="Unknown Status"
          color="warning"
          variant="outlined"
          size="small"
        />
      );
  }
};

export default function ViewRecord() {
  const { patientId, serial_no } = useParams();
  const [details, setDetails] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [patientdetails, setPatientdetails] = useState(null);
  const [patientError, setPatientError] = useState("");
  const role = localStorage.getItem("Role");
  const location = useLocation();
  const message = location.state?.message || "Treatment Details";

  const handleContinue = () => {
    navigate(`/dashboard/remark/${patientId}/${serial_no}`);
  };

  const handleInvoice = () => {
    navigate(`/dashboard/invoice/${patientId}/${serial_no}`);
  };

  const handlePrescription = () => {
    navigate(`/dashboard/prescription/${patientId}/${serial_no}`);
  };

  const handleRemarks = () => {
    navigate(`/dashboard/remark/${patientId}/${serial_no}`);
  };

  const handleUpdate = (serialNumber) => {
    navigate(`/dashboard/addrecord/${patientId}`, { state: { serialNumber } });
  };

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/Treatment/patient/record/${patientId}/${serial_no}`
        );
        setDetails(response.data);
      } catch (error) {
        console.error("Error fetching records:", error);
        setError("Failed to fetch patient records.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();

    const fetchPatientDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/Patient/${patientId}`
        );
        setPatientdetails(response.data);
      } catch (error) {
        console.error("Error fetching patient details:", error);
        setPatientError("Failed to fetch patient details.");
      }
    };

    fetchPatientDetails();
  }, [patientId, serial_no]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="h6" color="error">
            {error}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          variant="outlined"
        >
          Back
        </Button>
      </Box>

      <StyledPaper elevation={3}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 4,
          }}
        >
          <MedicalInformation color="primary" sx={{ fontSize: 50, mb: 1 }} />
          <Typography variant="h4" color="primary" fontWeight={600}>
            {message}
          </Typography>
          {details.MTD_CHANNEL_NO && (
            <Chip
              label={`Channel #${details.MTD_CHANNEL_NO}`}
              color="primary"
              variant="outlined"
              sx={{ mt: 1 }}
              avatar={<Avatar>#</Avatar>}
            />
          )}
        </Box>

        {/* Treatment Information - Single Row */}
        <Paper elevation={2} sx={{ p: 2, mb: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ color: "black" }}>
            <LocalHospital sx={{ verticalAlign: "middle", mr: 1,color:"primary.main" }} />
            Treatment Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 1, sm: 2 }}
            divider={<Divider orientation="vertical" flexItem />}
            justifyContent="space-between"
            alignItems="center"
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Person color="primary" />
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Patient Name
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {patientdetails
                    ? patientdetails.MPD_PATIENT_NAME
                    : "Loading..."}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CalendarToday color="primary" />
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Treatment Date
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {new Date(details.MTD_DATE).toLocaleDateString()}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <MedicalServices color="primary" />
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Prescribed Doctor
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {details.MTD_DOCTOR}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Healing color="primary" />
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Treatment Status
                </Typography>
                <Box sx={{ mt: 0.5 }}>
                  <StatusChip status={details.MTD_TREATMENT_STATUS} />
                </Box>
              </Box>
            </Box>
          </Stack>
        </Paper>

        {/* Medical Details - Full width sections one after another */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ color: "black" }}>
            <LocalHospital sx={{ verticalAlign: "middle", mr: 1 ,color: "primary.main"}} />
            Medical Details
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Complaint"
              value={details.MTD_COMPLAIN}
              multiline
              rows={4}
              variant="outlined"
              InputProps={{
                readOnly: true,
              }}
            />
          </Box>

          <Box>
            <TextField
              fullWidth
              label="Diagnostics"
              value={details.MTD_DIAGNOSTICS}
              multiline
              rows={4}
              variant="outlined"
              InputProps={{
                readOnly: true,
              }}
            />
          </Box>
        </Box>

        {/* Prescribed Medicines */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ color: "black" }}>
            <Healing sx={{ verticalAlign: "middle", mr: 1 ,color: "primary.main"}} />
            Prescribed Medicines
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <TableContainer component={Paper} elevation={2}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "primary.light" }}>
                  <TableCell sx={{ fontWeight: 600, color: "common.white" }}>
                    Drug Name
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontWeight: 600, color: "common.white" }}
                  >
                    Quantity
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "common.white" }}>
                    Dosage Instructions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {details.Drugs.map((drug, index) => (
                  <TableRow key={index} hover>
                    <TableCell>{drug.DrugName}</TableCell>
                    <TableCell align="right">{drug.MDD_QUANTITY}</TableCell>
                    <TableCell>{drug.MDD_TAKES}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Doctor Remarks */}
        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            label="Doctor Remarks"
            value={details.MTD_REMARKS}
            multiline
            rows={3}
            variant="outlined"
            InputProps={{
              readOnly: true,
            }}
          />
        </Box>

        {/* Quick Actions - Moved to bottom */}
        <Box >
          {/* <Typography variant="h6" gutterBottom sx={{ color: "primary.main" }}>
            <Healing sx={{ verticalAlign: "middle", mr: 1 }} />
            Quick Actions
          </Typography>
          <Divider sx={{ mb: 3 }} /> */}

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Tooltip title="Edit treatment details">
                <Button
                  fullWidth
                  variant="outlined"
                  color="primary"
                  startIcon={<Edit />}
                  onClick={() => handleUpdate(details.MTD_SERIAL_NO)}
                  disabled={!(role === "Admin" || role === "Doc")}
                  sx={{ height: "100%", py: 1.5 }}
                >
                  Edit
                </Button>
              </Tooltip>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Tooltip title="View or add remarks">
                <Button
                  fullWidth
                  variant="outlined"
                  color="primary"
                  startIcon={<NoteAdd />}
                  onClick={handleRemarks}
                  sx={{ height: "100%", py: 1.5 }}
                >
                  Remarks
                </Button>
              </Tooltip>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Tooltip title="Generate prescription">
                <Button
                  fullWidth
                  variant="outlined"
                  color="primary"
                  startIcon={<Assignment />}
                  onClick={handlePrescription}
                  sx={{ height: "100%", py: 1.5 }}
                >
                  Prescription
                </Button>
              </Tooltip>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Tooltip title="Generate invoice">
                <Button
                  fullWidth
                  variant="outlined"
                  color="primary"
                  startIcon={<Receipt />}
                  onClick={handleInvoice}
                  sx={{ height: "100%", py: 1.5 }}
                >
                  Invoice
                </Button>
              </Tooltip>
            </Grid>
          </Grid>
        </Box>
      </StyledPaper>
    </Container>
  );
}
