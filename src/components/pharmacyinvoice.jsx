// import { useEffect, useState } from "react";
// import { useParams, useLocation } from "react-router-dom";
// import axios from "axios";
// import "../styles/Invoice.css";
// import logo from "../assets/medicare_logo.png";
// import html2pdf from "html2pdf.js";
// import { useNavigate } from "react-router-dom";

// export default function Pharmacyinvoice() {
//   const { patientId, serial_no } = useParams();
//   const location = useLocation();
//   const navigate = useNavigate("");
//   const { selectedMedicines, totaldrugfee } = location.state || {
//     selectedMedicines: [],
//     totaldrugfee: 0,
//   };
//   const [patients, setPatients] = useState(null);
//   const [invoicedetails, setInvoicedetails] = useState(null);
//   const [treatmentamount, setTreatmentamount] = useState(0);
//   const [discount, setDiscount] = useState(0);
//   const [discountType, setDiscountType] = useState("percentage"); // Default to percentage

//   const printInvoice = () => {
//     window.print();
//   };

//   useEffect(() => {
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

//     fetchRecords();
//     fetchPatientDetails();
//   }, [patientId]);

//   console.log(selectedMedicines);

//   const totalAmount = treatmentamount + totaldrugfee;

//   // Discount calculation based on the selected discount type (number or percentage)
//   const calculateFinalAmount = () => {
//     let discountAmount = 0;

//     if (discountType === "percentage") {
//       discountAmount = totalAmount * (discount / 100);
//     } else if (discountType === "fixed") {
//       discountAmount = discount;
//     }

//     return totalAmount - discountAmount;
//   };

//   const generatePDF = () => {
//     const element = document.getElementById("invoice-content");
//     const opt = {
//       margin: 1,
//       filename: `invoice_${patientId}.pdf`,
//       image: { type: "jpeg", quality: 0.98 },
//       html2canvas: { scale: 2 },
//       jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
//     };

//     html2pdf().from(element).set(opt).save();
//   };

//   return (
//     <div className="invoice-container" id="invoice-content">
//       <button className="back-button" onClick={() => navigate(-1)}>
//         Back
//       </button>
//       <header className="header2">
//         <div className="logo-container">
//           <img src={logo} alt="Medilink Logo" className="logo" />
//         </div>
//         <p>
//           85/1, Horana Road, Bandaragama.
//           <br />
//           Tel: 0771068887
//           <br />
//           Email: Medilink@gmail.com
//           <br />
//           Web: www.medilink.lk
//         </p>
//       </header>

//       <h1>Payment Receipt</h1>
//       <h3>Medilink Hospitals - Bandaragama</h3>

//       <div className="client-info">
//         <p>
//           <strong>Patient Name:</strong>{" "}
//           {patients ? patients.MPD_PATIENT_NAME : "N/A"}
//         </p>
//         <p>
//           <strong>Invoice Number:</strong>{" "}
//           {invoicedetails ? invoicedetails.MTD_SERIAL_NO : "N/A"}
//         </p>
//         <p>
//           <strong>Date:</strong> {new Date().toLocaleDateString()}
//         </p>
//       </div>

//       <div className="payment-info">
//         {selectedMedicines.length > 0 ? (
//           <div>
//             <table className="medicine-invoice-table">
//               <thead>
//                 <tr>
//                   <th>Drug Description</th>
//                   <th>Rate (Rs)</th>
//                   <th>Quantity</th>
//                   <th>Amount (Rs) </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {selectedMedicines.map((medicinedetail, index) => (
//                   <tr key={index}>
//                     <td>{medicinedetail.DrugName}</td>
//                     <td>{parseFloat(medicinedetail.MDD_RATE).toFixed(2)}</td>
//                     <td>{medicinedetail.MDD_GIVEN_QUANTITY}</td>
//                     <td>{(medicinedetail.MDD_GIVEN_QUANTITY * medicinedetail.MDD_RATE).toFixed(2)}</td>
//                   </tr>
//                 ))}
//               </tbody>

//               <tr className="total-separator">
//                 <td colSpan="2"></td>
//                 <td>Total drug Fee:</td>
//                 <td> Rs. {totaldrugfee.toFixed(2)}</td>
//               </tr>
//               <tr>
//                 <td colSpan="2"></td>
//                 <td>
//                   <strong>Treatment fee</strong>
//                 </td>
//                 <td>
//                   <strong>Rs. {treatmentamount.toFixed(2)}</strong>
//                 </td>
//               </tr>

//               <tr>
//                 <td colSpan="2"></td>

//                 <td>Total amount</td>

//                 <td>Rs. {totalAmount.toFixed(2)}</td>
//               </tr>

//               <tr className="discount-row">
//                 <td colSpan={1}></td>
//                 <td>
//                   <strong>Discount</strong>
//                 </td>
//                 <td
//                   style={{
//                     display: "flex",
//                     flexDirection: "column",
//                     gap: "8px",
//                   }}
//                 >
//                   <label
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: "5px",
//                     }}
//                   >
//                     <input
//                       type="radio"
//                       value="percentage"
//                       checked={discountType === "percentage"}
//                       onChange={() => setDiscountType("percentage")}
//                     />
//                     Percentage
//                   </label>

//                   <label
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: "5px",
//                     }}
//                   >
//                     <input
//                       type="radio"
//                       value="fixed"
//                       checked={discountType === "fixed"}
//                       onChange={() => setDiscountType("fixed")}
//                     />
//                     Fixed Amount
//                   </label>
//                 </td>

//                 <td>
//                   <input
//                     type="number"
//                     value={discount}
//                     onChange={(e) => setDiscount(e.target.value)}
//                     min="0"
//                     max={discountType === "percentage" ? "100" : totalAmount}
//                   />
//                 </td>
//               </tr>

//               <tr>
//                 <td colSpan="2"></td>
//                 <td>
//                   <strong>Final amount</strong>
//                 </td>
//                 <td> Rs. {calculateFinalAmount().toFixed(2)}</td>
//               </tr>
//             </table>
//           </div>
//         ) : (
//           <p>No medicines</p>
//         )}

//         {/* <p><strong>Total Drug Fee:</strong> Rs. {totaldrugfee.toFixed(2)}</p>
//         <p><strong>Treatment Fee:</strong> Rs. {treatmentamount.toFixed(2)}</p>
//         <p><strong>Total Amount:</strong> Rs. {totalAmount.toFixed(2)}</p>

//         <p>
//           <strong>Discount:</strong>
          
          
//           <label>
//             <input 
//               type="radio" 
//               value="percentage" 
//               checked={discountType === 'percentage'} 
//               onChange={() => setDiscountType('percentage')} 
//             /> Percentage
//           </label>
//           <label>
//             <input 
//               type="radio" 
//               value="fixed" 
//               checked={discountType === 'fixed'} 
//               onChange={() => setDiscountType('fixed')} 
//             /> Number (Fixed Amount)
//           </label>

//           <input 
//             type="number" 
//             value={discount} 
//             onChange={(e) => setDiscount(e.target.value)} 
//             min="0" 
//             max={discountType === 'percentage' ? "100" : totalAmount} 
//           />
//         </p>
        


//         <p><strong>Final Amount:</strong> Rs. {calculateFinalAmount().toFixed(2)}</p> */}
//       </div>

//       <div className="btn-container1">
//         <button className="btn print" onClick={printInvoice}>
//           Print
//         </button>
//         <button className="btn download" onClick={generatePDF}>
//           Download
//         </button>
//         {/* <button className="btn send">Send</button> */}
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Box,
  Typography,
  Paper,
  Divider,
  Button,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  Tooltip,
  CircularProgress,
  Chip,
} from "@mui/material";
import {
  ArrowBack,
  Print,
  Download,
  LocalHospital,
  Person,
  Receipt,
  Phone,
  Email,
  Language,
  Home,
  CalendarToday,
  Male,
  Female,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import logo from "../assets/logo192.png";
import html2pdf from "html2pdf.js";
import { NumericFormat } from 'react-number-format';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[3],
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

const TotalRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  "& td": {
    fontWeight: "bold",
    fontSize: "1.1rem",
  },
}));

const DiscountRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: theme.palette.grey[50],
  "& td": {
    padding: theme.spacing(2),
  },
}));

const InvoiceNumberBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  color: 'white',
  padding: '6px 12px',
  borderRadius: '16px',
  display: 'inline-block',
  marginTop: theme.spacing(1),
  fontSize: '0.875rem',
  fontWeight: 500,
  '-webkit-print-color-adjust': 'exact',
  'color-adjust': 'exact',
  'print-color-adjust': 'exact',
}));

export default function Pharmacyinvoice() {
  const { patientId, serial_no } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedMedicines = [], totaldrugfee = 0 } = location.state || {};
  const [patients, setPatients] = useState(null);
  const [invoicedetails, setInvoicedetails] = useState(null);
  const [treatmentamount, setTreatmentamount] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState("percentage");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setTreatmentamount(treatmentRes.data.MTD_AMOUNT || 0);
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

  const calculateSubtotal = () => {
    return totaldrugfee;
  };

  const calculateTotalAmount = () => {
    const subtotal = parseFloat(calculateSubtotal()) + parseFloat(treatmentamount);
    let totalAmount = subtotal;

    if (discountType === "percentage") {
      totalAmount -= (subtotal * discount) / 100;
    } else {
      totalAmount -= discount;
    }

    return totalAmount.toFixed(2);
  };

  const printInvoice = () => {
    const noPrintElements = document.querySelectorAll('.no-print');
    noPrintElements.forEach(element => {
      element.style.display = 'none';
    });

    const printStyles = document.createElement('style');
    printStyles.innerHTML = `
      @media print {
        body * {
          visibility: hidden;
        }
        
        #invoice-content, #invoice-content * {
          visibility: visible;
        }
        
        #invoice-content {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
        }
        
        .MuiContainer-root {
          max-width: none !important;
          padding: 0 !important;
          margin: 0 !important;
        }
        
        .MuiPaper-root {
          box-shadow: none !important;
          border: none !important;
          margin: 0 !important;
          padding: 20px !important;
        }
        
        @page {
          size: A4;
          margin: 15mm;
        }
      }
    `;

    document.head.appendChild(printStyles);
    window.print();

    setTimeout(() => {
      document.head.removeChild(printStyles);
      noPrintElements.forEach(element => {
        element.style.display = '';
      });
    }, 100);
  };

  const downloadInvoice = () => {
    const element = document.getElementById("invoice-content");
    const opt = {
      margin: [10, 10, 10, 10],
      filename: `pharmacy_invoice_${patientId}_${serial_no}.pdf`,
      image: {
        type: "jpeg",
        quality: 0.98
      },
      html2canvas: {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        ignoreElements: function (element) {
          return element.classList.contains('no-print');
        }
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
        putOnlyUsedFonts: true,
        floatPrecision: 16
      },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };
    const tempStyles = document.createElement('style');
    tempStyles.innerHTML = `
      .invoice-number-pdf {
        backgroundColor: theme.palette.secondary.main;
        color: white !important;
        -webkit-print-color-adjust: exact !important;
        color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
    `;
    document.head.appendChild(tempStyles);

    html2pdf().set(opt).from(element).save().then(() => {
      document.head.removeChild(tempStyles);
    });
  };

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

      <StyledPaper elevation={3} id="invoice-content">
        <HeaderBox>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              src={logo}
              alt="Medicare Logo"
              variant="rounded"
              sx={{ width: 80, height: 80, '@media print': { width: 60, height: 60 } }}
            />
            <Box>
              <Typography variant="h5" fontWeight="bold" color="primary" sx={{ '@media print': { fontSize: '1.5rem' } }}>
                Medicare Healthcare
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ '@media print': { fontSize: '0.8rem' } }}>
                85/1, Horana Road, Bandaragama
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ '@media print': { fontSize: '0.8rem' } }}>
                Tel: 0771068887 | Email: Medicare@gmail.com
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ '@media print': { fontSize: '0.8rem' } }}>
                Web: www.medicare.lk
              </Typography>
            </Box>
          </Box>

          <Box sx={{ textAlign: "right" }}>
            <Typography variant="h5" color="primary" fontWeight="bold" sx={{ '@media print': { fontSize: '1.5rem' } }}>
              Pharmacy Invoice
            </Typography>
            <InvoiceNumberBox className="invoice-number-pdf">
              Invoice - {invoicedetails?.MTD_SERIAL_NO || "N/A"}
            </InvoiceNumberBox>
          </Box>
        </HeaderBox>

        <Divider sx={{ my: 3 }} />

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

        <TableContainer
          component={Paper}
          elevation={0}
          sx={{ border: "1px solid #eee", mb: 4 }}
        >
          <Table>
            <TableHead sx={{ backgroundColor: "primary.main" }}>
              <TableRow>
                <TableCell sx={{ color: "common.white", fontWeight: "bold", '@media print': { fontSize: '0.9rem' } }}>
                  Drug Description
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ color: "common.white", fontWeight: "bold", '@media print': { fontSize: '0.9rem' } }}
                >
                  Rate (Rs)
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ color: "common.white", fontWeight: "bold", '@media print': { fontSize: '0.9rem' } }}
                >
                  Quantity
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ color: "common.white", fontWeight: "bold", '@media print': { fontSize: '0.9rem' } }}
                >
                  Amount (Rs)
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedMedicines?.map((medicinedetail, index) => (
                <TableRow key={index} hover>
                  <TableCell sx={{ '@media print': { fontSize: '0.9rem' } }}>{medicinedetail.DrugName}</TableCell>
                  <TableCell align="right" sx={{ '@media print': { fontSize: '0.9rem' } }}>
                    {medicinedetail.MDD_RATE
                      ? new Intl.NumberFormat('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(Number(medicinedetail.MDD_RATE))
                      : "0.00"}
                  </TableCell>
                  <TableCell align="right" sx={{ '@media print': { fontSize: '0.9rem' } }}>
                    {medicinedetail.MDD_GIVEN_QUANTITY
                      ? new Intl.NumberFormat('en-US').format(Number(medicinedetail.MDD_GIVEN_QUANTITY))
                      : "0"}
                  </TableCell>
                  <TableCell align="right" sx={{ '@media print': { fontSize: '0.9rem' } }}>
                    {(medicinedetail.MDD_GIVEN_QUANTITY * medicinedetail.MDD_RATE)
                      ? new Intl.NumberFormat('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(Number(medicinedetail.MDD_GIVEN_QUANTITY * medicinedetail.MDD_RATE))
                      : "0.00"}
                  </TableCell>
                </TableRow>
              ))}

              <TotalRow>
                <TableCell colSpan={2}></TableCell>
                <TableCell align="right" sx={{ '@media print': { fontSize: '1rem' } }}>
                  Total Drug Fee:
                </TableCell>
                <TableCell align="right" sx={{ '@media print': { fontSize: '1rem' } }}>
                  Rs: {new Intl.NumberFormat('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  }).format(Number(calculateSubtotal()))}
                </TableCell>
              </TotalRow>

              <TotalRow>
                <TableCell colSpan={2}></TableCell>
                <TableCell align="right" sx={{ '@media print': { fontSize: '1rem' } }}>
                  Treatment Fee:
                </TableCell>
                <TableCell align="right" sx={{ '@media print': { fontSize: '1rem' } }}>
                  Rs: {new Intl.NumberFormat('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  }).format(Number(treatmentamount))}
                </TableCell>
              </TotalRow>

              <TotalRow>
                <TableCell colSpan={2}></TableCell>
                <TableCell align="right" sx={{ '@media print': { fontSize: '1rem' } }}>
                  Subtotal:
                </TableCell>
                <TableCell align="right" sx={{ '@media print': { fontSize: '1rem' } }}>
                  Rs: {new Intl.NumberFormat('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  }).format(
                    Number(calculateSubtotal()) + Number(treatmentamount)
                  )}
                </TableCell>
              </TotalRow>

              <DiscountRow>
                <TableCell colSpan={1}></TableCell>
                <TableCell>
                  <Typography fontWeight="bold" sx={{ '@media print': { fontSize: '1rem' } }}>Discount</Typography>
                  <RadioGroup
                    row
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value)}
                    sx={{ mt: 1 }}
                  >
                    <FormControlLabel
                      value="percentage"
                      control={<Radio size="small" />}
                      label={<Typography sx={{ '@media print': { fontSize: '0.9rem' } }}>Percentage</Typography>}
                    />
                    <FormControlLabel
                      value="fixed"
                      control={<Radio size="small" />}
                      label={<Typography sx={{ '@media print': { fontSize: '0.9rem' } }}>Fixed Amount</Typography>}
                    />
                  </RadioGroup>
                </TableCell>
                <TableCell align="right">
                  <TextField
                    type="number"
                    size="small"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    inputProps={{
                      min: "0",
                      max:
                        discountType === "percentage"
                          ? "100"
                          : parseFloat(calculateSubtotal()) +
                          parseFloat(treatmentamount),
                    }}
                    sx={{ width: 120 }}
                  />
                </TableCell>
                <TableCell align="right" sx={{ '@media print': { fontSize: '1rem' } }}>
                  {discountType === "percentage"
                    ? `${discount}%`
                    : `Rs: ${new Intl.NumberFormat('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    }).format(Number(discount))}`}
                </TableCell>
              </DiscountRow>

              <TotalRow sx={{ backgroundColor: "primary.light" }}>
                <TableCell colSpan={2}></TableCell>
                <TableCell align="right" sx={{ color: "common.white", '@media print': { fontSize: '1.1rem' } }}>
                  <Typography variant="h6">Final Amount:</Typography>
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ color: "common.white", '@media print': { fontSize: '1.1rem' } }}
                >
                  <Typography variant="h6">
                    Rs: {new Intl.NumberFormat('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    }).format(Number(calculateTotalAmount()))}
                  </Typography>
                </TableCell>
              </TotalRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Box
          sx={{
            mt: 6,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
          }}
        >
          <Box
            sx={{
              width: 300,
              textAlign: "center",
              p: 2,
            }}
          >
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body1" color="text.secondary" sx={{ '@media print': { fontSize: '0.9rem' } }}>
              Authorized Signature
            </Typography>
            <Typography variant="h6" fontWeight="bold" sx={{ mt: 2, '@media print': { fontSize: '1.1rem' } }}>
              Medicare Healthcare
            </Typography>
          </Box>
        </Box>
      </StyledPaper>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 3,
          mt: 4,
          "@media print": {
            display: "none",
          },
        }}
        className="no-print"
      >
        <Tooltip title="Print invoice">
          <Button
            variant="contained"
            color="primary"
            startIcon={<Print />}
            onClick={printInvoice}
            sx={{ px: 4, py: 1.5 }}
          >
            Print Invoice
          </Button>
        </Tooltip>

        <Tooltip title="Download as PDF">
          <Button
            variant="outlined"
            color="primary"
            startIcon={<Download />}
            onClick={downloadInvoice}
            sx={{ px: 4, py: 1.5 }}
          >
            Download PDF
          </Button>
        </Tooltip>
      </Box>
    </Container>
  );
}