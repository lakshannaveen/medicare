// import { useEffect, useState } from "react";
// import { useParams, useLocation } from "react-router-dom";
// import axios from "axios";
// import "../styles/Invoice.css";
// import logo from "../assets/medicare_logo.png";
// import html2pdf from "html2pdf.js";
// import { useNavigate } from "react-router-dom";
// import "../styles/prescription.css";

// export default function Prescription() {
//   const { patientId, serial_no } = useParams();
//   const [patients, setPatients] = useState(null);
//   const [invoicedetails, setInvoicedetails] = useState(null);
//   const [treatmentamount, setTreatmentamount] = useState(0);
//   const [discount, setDiscount] = useState(0);
//   const location = useLocation();
//   const [discountType, setDiscountType] = useState("percentage");
//   const navigate = useNavigate("");
//   const [medicinedetails, setMedicinedetails] = useState();

//   useEffect(() => {
//     const fetchRecords = async () => {
//       try {
//         const response = await axios.get(
//           `${process.env.REACT_APP_API_BASE_URL}/Treatment/patient/record/${patientId}/${serial_no}`
//         );
//         setInvoicedetails(response.data);
//         setTreatmentamount(response.data.MTD_AMOUNT || 0);
//       } catch (error) {
//         console.error("Error fetching records:", error);
//       }
//     };

//     const fetchPatientDetails = async () => {
//       try {
//         const response = await axios.get(
//           `${process.env.REACT_APP_API_BASE_URL}/Patient/${patientId}`
//         );
//         setPatients(response.data);
//       } catch (error) {
//         console.error("Error fetching patients:", error);
//       }
//     };

//     fetchRecords();
//     fetchPatientDetails();
//   }, [patientId, serial_no]);

//   const handleShare = async () => {
//     try {
//       const response = await axios.post(
//         `${process.env.REACT_APP_API_BASE_URL}/Treatment/send-prescription-message/${patientId}/${serial_no}`
//       );
//       alert(response.data.message);
//     } catch (error) {
//       console.error("Error sharing prescription:", error);
//       alert("Failed to share prescription.");
//     }
//   };

//   return (
//     <div className="prescription-container">
//       {/* <button className="back-button" onClick={() => navigate(-1)}>Back</button> */}
//       <header className="prescription-header">
//         <h1>Dr.{invoicedetails?.MTD_DOCTOR}</h1>
//       </header>
//       <div className="caduceus-icon"></div>
//       <section className="patient-details">
//         <p>
//           Patient Name:<u>{patients?.MPD_PATIENT_NAME}</u>
//         </p>
//         <p>
//           Address:<u>{patients?.MPD_ADDRESS}</u>
//         </p>
//         <p>Age: _________ Date: __________________</p>
//         <p>
//           Gender<u>{patients?.MPD_GENDER}</u>
//         </p>
//         <p>
//           Diagnosis:<u>{invoicedetails?.MTD_DIAGNOSIS}</u>
//         </p>
//       </section>
//       <div className="rx">Medicines</div>

//       {invoicedetails &&
//       invoicedetails.Drugs &&
//       invoicedetails.Drugs.length > 0 ? (
//         <div className="medicine-prescription-list">
//           {invoicedetails.Drugs.map((medicinedetail, index) => (
//             <p key={index} className="prescription-line">
//               {medicinedetail.DrugName} - {medicinedetail.MDD_TAKES} - Qty:{" "}
//               {medicinedetail.MDD_QUANTITY}
//             </p>
//           ))}
//         </div>
//       ) : (
//         <p>No medicines found</p>
//       )}

//       <div className="caduceus-large"></div>
//       <div className="signature">SIGNATURE</div>
//       <footer className="prescription-footer">
//         <p>
//           <strong>HOSPITAL</strong> | Medicare
//         </p>
//         <p>📞 76 67 06 95 1 | 55 47 79 94 18</p>
//       </footer>

//       <div className="btn-container1">
//         <button className="btn-share" onClick={handleShare}>
//           Share
//         </button>
//       </div>
//     </div>
//   );
// }

// import { useEffect, useState } from "react";
// import { useParams, useLocation } from "react-router-dom";
// import axios from "axios";
// import "../styles/Invoice.css";
// import logo from "../assets/medicare_logo.png";
// import html2pdf from "html2pdf.js";
// import { useNavigate } from "react-router-dom";
// import "../styles/prescription.css";

// export default function Prescription() {
//   const { patientId, serial_no } = useParams();
//   const [patients, setPatients] = useState(null);
//   const [invoicedetails, setInvoicedetails] = useState(null);
//   const [treatmentamount, setTreatmentamount] = useState(0);
//   const [discount, setDiscount] = useState(0);
//   const location = useLocation();
//   const [discountType, setDiscountType] = useState("percentage");
//   const navigate = useNavigate("");
//   const [medicinedetails, setMedicinedetails] = useState();
//   const [isSharing, setIsSharing] = useState(false);

//   useEffect(() => {
//     const fetchRecords = async () => {
//       try {
//         const response = await axios.get(
//           `${process.env.REACT_APP_API_BASE_URL}/Treatment/patient/record/${patientId}/${serial_no}`
//         );
//         setInvoicedetails(response.data);
//         setTreatmentamount(response.data.MTD_AMOUNT || 0);
//       } catch (error) {
//         console.error("Error fetching records:", error);
//       }
//     };

//     const fetchPatientDetails = async () => {
//       try {
//         const response = await axios.get(
//           `${process.env.REACT_APP_API_BASE_URL}/Patient/${patientId}`
//         );
//         setPatients(response.data);
//       } catch (error) {
//         console.error("Error fetching patients:", error);
//       }
//     };

//     fetchRecords();
//     fetchPatientDetails();
//   }, [patientId, serial_no]);

//   const handleShare = async () => {
//     setIsSharing(true);
//     try {
//       const response = await axios.post(
//         `${process.env.REACT_APP_API_BASE_URL}/Treatment/send-prescription-message/${patientId}/${serial_no}`
//       );
//       alert(response.data.message);
//     } catch (error) {
//       console.error("Error sharing prescription:", error);
//       alert("Failed to share prescription: " + (error.response?.data?.message || error.message));
//     } finally {
//       setIsSharing(false);
//     }
//   };

//   // Filter active drugs from the invoicedetails.Drugs
//   const activeDrugs = invoicedetails?.Drugs?.filter(drug => drug.MDD_STATUS !== "I") || [];

//   return (
//     <div className="prescription-container">
//       <header className="prescription-header">
//         <h1>Dr.{invoicedetails?.MTD_DOCTOR}</h1>
//       </header>
//       <div className="caduceus-icon"></div>
//       <section className="patient-details">
//         <p>
//           Patient Name:<u>{patients?.MPD_PATIENT_NAME}</u>
//         </p>
//         <p>
//           Address:<u>{patients?.MPD_ADDRESS}</u>
//         </p>
//         <p>Age: _________ Date: {new Date().toLocaleDateString()}</p>
//         <p>
//           Gender:<u>{patients?.MPD_GENDER}</u>
//         </p>
//         <p>
//           Diagnosis:<u>{invoicedetails?.MTD_DIAGNOSTICS}</u>
//         </p>
//       </section>
//       <div className="rx">Medicines</div>

//       {activeDrugs.length > 0 ? (
//         <div className="medicine-prescription-list">
//           {activeDrugs.map((medicinedetail, index) => (
//             <p key={index} className="prescription-line">
//               {medicinedetail.DrugName} - {medicinedetail.MDD_TAKES} - Qty:{" "}
//               {medicinedetail.MDD_QUANTITY}
//             </p>
//           ))}
//         </div>
//       ) : (
//         <p>No active medicines found</p>
//       )}

//       <div className="caduceus-large"></div>
//       <div className="signature">SIGNATURE</div>
//       <footer className="prescription-footer">
//         <p>
//           <strong>HOSPITAL</strong> | Medicare
//         </p>
//         <p>📞 76 67 06 95 1 | 55 47 79 94 18</p>
//       </footer>

//       <div className="btn-container1">
//         <button
//           className="btn-share"
//           onClick={handleShare}
//           disabled={isSharing}
//         >
//           {isSharing ? "Sharing..." : "Share"}
//         </button>
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Box,
  Typography,
  Paper,
  Divider,
  Button,
  Avatar,
  CircularProgress,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Share,
  LocalHospital,
  Person,
  Home,
  CalendarToday,
  Male,
  Female,
  Healing,
  MedicalServices,
  Phone,
  Assignment,
  ArrowBack
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import logo from "../assets/logo192.png";
import html2pdf from "html2pdf.js";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[3],
  position: "relative",
  overflow: "hidden",
  maxWidth: 1500,
  margin: "0 auto",
  "@media print": {
    boxShadow: "none",
    padding: theme.spacing(3),
    border: "1px solid #ddd",
  },
}));

const HeaderBox = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing(4),
  "@media (max-width: 600px)": {
    flexDirection: "column",
    gap: theme.spacing(2),
    alignItems: "flex-start",
  },
  "@media print": {
    flexDirection: "row",
    alignItems: "center",
  },
}));

const RxSymbol = styled(Box)(({ theme }) => ({
  fontSize: "2.5rem",
  fontWeight: "bold",
  color: theme.palette.primary.main,
  textAlign: "center",
  margin: theme.spacing(3, 0),
  "&:before": {
    content: '"℞"',
    display: "block",
  },
}));

export default function Prescription() {
  const { patientId, serial_no } = useParams();
  const [patients, setPatients] = useState(null);
  const [invoicedetails, setInvoicedetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSharing, setIsSharing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [treatmentRes, patientRes] = await Promise.all([
          axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/Treatment/patient/record/${patientId}/${serial_no}`
          ),
          axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/Patient/${patientId}`
          ),
        ]);
        setInvoicedetails(treatmentRes.data);
        setPatients(patientRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.response?.data?.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [patientId, serial_no]);

  const handleShare = async () => {
    setIsSharing(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/Treatment/send-prescription-message/${patientId}/${serial_no}`
      );
      alert(response.data.message);
    } catch (error) {
      console.error("Error sharing prescription:", error);
      alert(
        "Failed to share prescription: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setIsSharing(false);
    }
  };

  const activeDrugs =
    invoicedetails?.Drugs?.filter((drug) => drug.MDD_STATUS !== "I") || [];

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
      <Container maxWidth="sm" sx={{ mt: 4 }}>
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
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 3 }} className="no-print">
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          variant="outlined"
        >
          Back to Records
        </Button>
      </Box>

      <StyledPaper elevation={3} id="print-content">
        {/* Header */}
        <HeaderBox>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              src={logo}
              alt="Medicare Logo"
              variant="rounded"
              sx={{
                width: 80,
                height: 80,
                "@media print": { width: 60, height: 60 },
              }}
            />
            <Box>
              <Typography
                variant="h5"
                fontWeight="bold"
                color="primary"
                sx={{ "@media print": { fontSize: "1.5rem" } }}
              >
                Medicare Healthcare
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ "@media print": { fontSize: "0.8rem" } }}
              >
                85/1, Horana Road, Bandaragama
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ "@media print": { fontSize: "0.8rem" } }}
              >
                Tel: 0771068887 | Email: Medilink@gmail.com
              </Typography>
            </Box>
          </Box>

          <Box sx={{ textAlign: "right" }}>
            <Typography
              variant="h5"
              color="primary"
              fontWeight="bold"
              sx={{ "@media print": { fontSize: "1.5rem" } }}
            >
              Dr. {invoicedetails?.MTD_DOCTOR}
            </Typography>
            <Chip
              label={`Prescription #${serial_no}`}
              color="primary"
              size="small"
              sx={{
                mt: 1,
                "@media print": {
                  backgroundColor: "#1976d2 !important",
                  color: "white !important",
                  padding: "4px 8px",
                },
              }}
            />
          </Box>
        </HeaderBox>

        <Divider sx={{ my: 3 }} />

        {/* Patient Details */}
        <Box
  sx={{
    display: "flex",
    flexWrap: "wrap",
    gap: { xs: 2, sm: 3 },
    mb: 4,
    alignItems: "center",
    justifyContent: "space-between",
    '& > *': {
      flex: { xs: '1 1 100%', sm: '1 1 calc(25% - 24px)', md: '1 1 calc(25% - 24px)' },
      minWidth: { xs: '100%', sm: '200px' },
      display: "flex",
      alignItems: "center",
      gap: 1,
    },
    '@media print': {
      gap: 2,
      marginBottom: '16px',
      '& > *': {
        flex: '1 1 calc(25% - 16px)',
        minWidth: 'auto'
      }
    }
  }}
>
  {/* Patient Name */}
  <Box>
    <Person color="primary" />
    <Box>
      <Typography variant="subtitle2" color="text.secondary" sx={{ '@media print': { fontSize: '0.8rem' } }}>
        Patient Name
      </Typography>
      <Typography variant="body1" fontWeight="500" sx={{ '@media print': { fontSize: '1rem' } }}>
        {patients?.MPD_PATIENT_NAME}
      </Typography>
    </Box>
  </Box>

  {/* Address */}
  <Box>
    <Home color="primary" />
    <Box>
      <Typography variant="subtitle2" color="text.secondary" sx={{ '@media print': { fontSize: '0.8rem' } }}>
        Address
      </Typography>
      <Typography variant="body1" fontWeight="500" sx={{ 
        '@media print': { fontSize: '1rem' },
        display: '-webkit-box',
        WebkitLineClamp: 1,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
      }}>
        {patients?.MPD_ADDRESS || "Not specified"}
      </Typography>
    </Box>
  </Box>

  {/* Date */}
  <Box>
    <CalendarToday color="primary" />
    <Box>
      <Typography variant="subtitle2" color="text.secondary" sx={{ '@media print': { fontSize: '0.8rem' } }}>
        Date
      </Typography>
      <Typography variant="body1" fontWeight="500" sx={{ '@media print': { fontSize: '1rem' } }}>
        {new Date().toLocaleDateString()}
      </Typography>
    </Box>
  </Box>

  {/* Gender/Age */}
  <Box>
    {patients?.MPD_GENDER === "Male" ? (
      <Male color="primary" />
    ) : (
      <Female color="primary" />
    )}
    <Box>
      <Typography variant="subtitle2" color="text.secondary" sx={{ '@media print': { fontSize: '0.8rem' } }}>
        Gender / Age
      </Typography>
      <Typography variant="body1" fontWeight="500" sx={{ '@media print': { fontSize: '1rem' } }}>
        {patients?.MPD_GENDER} /{" "}
        {patients?.MPD_BIRTHDAY
          ? new Date().getFullYear() -
            new Date(patients.MPD_BIRTHDAY).getFullYear()
          : "N/A"}
      </Typography>
    </Box>
  </Box>
</Box>

        {/* Diagnosis */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="subtitle1"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: "primary.main",
              mb: 1,
              "@media print": { fontSize: "1.2rem" },
            }}
          >
            <Healing fontSize="small" />
            Diagnosis
          </Typography>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              backgroundColor: "rgba(0, 0, 0, 0.02)",
              borderLeft: "4px solid",
              borderColor: "primary.main",
              "@media print": {
                padding: "12px",
              },
            }}
          >
            <Typography sx={{ "@media print": { fontSize: "1rem" } }}>
              {invoicedetails?.MTD_DIAGNOSTICS || "No diagnosis recorded"}
            </Typography>
          </Paper>
        </Box>

        {/* Rx Symbol */}
        {/* <RxSymbol /> */}

        {/* Medicines */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            sx={{
              textAlign: "center",
              mb: 3,
              color: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              "@media print": { fontSize: "1.2rem" },
            }}
          >
            <MedicalServices />
            Prescribed Medicines
          </Typography>

          {activeDrugs.length > 0 ? (
            <Box
              sx={{
                border: "1px solid #eee",
                borderRadius: 1,
                p: 2,
                "@media print": {
                  border: "1px solid #ddd",
                  padding: "12px",
                },
              }}
            >
              {activeDrugs.map((medicinedetail, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    py: 1.5,
                    borderBottom:
                      index < activeDrugs.length - 1
                        ? "1px dashed #eee"
                        : "none",
                  }}
                >
                  <Typography
                    variant="body1"
                    fontWeight="500"
                    sx={{ "@media print": { fontSize: "1rem" } }}
                  >
                    {medicinedetail.DrugName}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 3 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ "@media print": { fontSize: "0.9rem" } }}
                    >
                      {medicinedetail.MDD_TAKES}
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight="500"
                      sx={{ "@media print": { fontSize: "0.9rem" } }}
                    >
                      Qty: {medicinedetail.MDD_QUANTITY}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          ) : (
            <Paper
              elevation={0}
              sx={{
                p: 2,
                textAlign: "center",
                backgroundColor: "rgba(0, 0, 0, 0.02)",
                "@media print": {
                  padding: "12px",
                },
              }}
            >
              <Typography
                color="text.secondary"
                sx={{ "@media print": { fontSize: "1rem" } }}
              >
                No active medicines prescribed
              </Typography>
            </Paper>
          )}
        </Box>

        {/* Footer */}
        <Box
          sx={{
            mt: 6,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              width: 200,
              height: 1,
              borderBottom: "1px solid",
              borderColor: "divider",
              mb: 2,
              position: "relative",
              "&:after": {
                content: '""',
                position: "absolute",
                bottom: -8,
                left: "50%",
                transform: "translateX(-50%)",
                width: 16,
                height: 16,
                borderRadius: "50%",
                border: "1px solid",
                borderColor: "divider",
              },
            }}
          />
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ "@media print": { fontSize: "0.9rem" } }}
          >
            Doctor's Signature
          </Typography>
        </Box>

        <Box
          sx={{
            mt: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            sx={{ "@media print": { fontSize: "1.1rem" } }}
          >
            Medicare Healthcare
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ "@media print": { fontSize: "0.9rem" } }}
          >
            <Box
              component="span"
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <Phone fontSize="small" /> 76 67 06 95 1 | 55 47 79 94 18
            </Box>
          </Typography>
        </Box>
      </StyledPaper>

      {/* Action Buttons */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 2,
          mt: 3,
          "@media print": {
            display: "none",
          },
        }}
        className="no-print"
      >
        <Tooltip title="Share prescription via message">
          <Button
            variant="contained"
            color="primary"
            startIcon={<Share />}
            onClick={handleShare}
            disabled={isSharing}
            sx={{ px: 4 }}
          >
            {isSharing ? <CircularProgress size={24} /> : "Share"}
          </Button>
        </Tooltip>
      </Box>

      {/* Print-specific styles */}
      <style>
        {`
          @media print {
            body, html {
              margin: 0;
              padding: 0;
              background: white;
            }
            .no-print {
              display: none !important;
            }
            @page {
              size: A4;
              margin: 15mm;
            }
          }
        `}
      </style>
    </Container>
  );
}
