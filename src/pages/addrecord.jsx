// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useParams, useNavigate, useLocation } from "react-router-dom";
// import {
//   Grid,
//   Container,
//   Typography,
//   TextField,
//   Button,
//   Paper,
//   Box,
//   MenuItem,
//   Select,
//   FormControl,
//   InputLabel,
//   IconButton,
//   List,
//   ListItem,
//   ListItemText,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   CircularProgress,
//   Divider,
//   Chip,
//   Avatar,
//   Snackbar,
//   Alert,
//   Card,
//   CardContent,
//   Tooltip,
//   Accordion,
//   AccordionSummary,
//   AccordionDetails,
// } from "@mui/material";
// import {
//   ArrowBack,
//   Add,
//   Delete,
//   MedicalServices,
//   Healing,
//   Description,
//   MonetizationOn,
//   Warning,
//   Inventory,
//   Biotech,
//   ExpandMore,
//   History,
//   CalendarToday,
//   Person,
//   Note,
//   Info,
// } from "@mui/icons-material";
// import { styled } from "@mui/material/styles";

// const StyledPaper = styled(Paper)(({ theme }) => ({
//   padding: theme.spacing(3),
//   marginTop: theme.spacing(2),
//   borderRadius: theme.shape.borderRadius * 2,
//   boxShadow: theme.shadows[3],
// }));

// const PrescriptionCard = styled(Card)(({ theme }) => ({
//   marginBottom: theme.spacing(2),
//   backgroundColor: theme.palette.grey[50],
//   border: `1px solid ${theme.palette.divider}`,
//   '&:hover': {
//     borderColor: theme.palette.primary.main,
//   },
// }));

// const ServiceCard = styled(Card)(({ theme }) => ({
//   marginBottom: theme.spacing(2),
//   backgroundColor: theme.palette.info.light + '20',
//   border: `1px solid ${theme.palette.info.main}`,
//   '&:hover': {
//     borderColor: theme.palette.info.dark,
//   },
// }));

// const StockWarningChip = styled(Chip)(({ theme }) => ({
//   backgroundColor: theme.palette.warning.light,
//   color: theme.palette.warning.contrastText,
//   fontWeight: 500,
// }));

// const SectionHeader = styled(Box)(({ theme }) => ({
//   display: 'flex',
//   alignItems: 'center',
//   gap: theme.spacing(1),
//   marginBottom: theme.spacing(2),
//   padding: theme.spacing(1),
//   backgroundColor: theme.palette.primary.light + '20',
//   borderRadius: theme.shape.borderRadius,
// }));

// const HistoryCard = styled(Card)(({ theme }) => ({
//   marginBottom: theme.spacing(2),
//   borderLeft: `4px solid ${theme.palette.primary.main}`,
//   transition: 'all 0.3s ease',
//   '&:hover': {
//     transform: 'translateX(4px)',
//     boxShadow: theme.shadows[4],
//   },
// }));

// const AddRecord = () => {
//   const { patientId } = useParams();
//   const Name = localStorage.getItem("Name");
//   const location = useLocation();
//   const { appoinmentid } = location.state || {};
//   const { channelnumber } = location.state || {};
//   const { MTD_APPOINMENT_ID } = location.state || {};
//   const [searchResults, setSearchResults] = useState([]);
//   const [patientError, setPatientError] = useState("");
//   const [patientdetails, setPatientdetails] = useState(null);
//   const serialNumber = location.state?.serialNumber || null;
//   const [isEditMode, setIsEditMode] = useState(false);
//   const role = localStorage.getItem("Role");
//   const [activePrescriptionIndex, setActivePrescriptionIndex] = useState(null);
//   const [activeServiceIndex, setActiveServiceIndex] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [modalContent, setModalContent] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [treatmentHistory, setTreatmentHistory] = useState([]);
//   const [historyLoading, setHistoryLoading] = useState(false);
//   const navigate = useNavigate();
//   const [snackbarOpen, setSnackbarOpen] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState("");
//   const [snackbarSeverity, setSnackbarSeverity] = useState("success");
//   const [stockWarning, setStockWarning] = useState("");
//   const [searchLoading, setSearchLoading] = useState(false);
//   const [currentSearchType, setCurrentSearchType] = useState("drug");

//   // Function to get numeric value for how to take selection
//   const getHowToTakeValue = (takesText, customValue) => {
//     if (takesText === "other") {
//       return parseFloat(customValue) || 0;
//     }
    
//     switch (takesText) {
//       case "Twice a Day before food":
//       case "Twice a Day after food":
//         return 2;
//       case "Three times per day before food":
//       case "Three times per day after food":
//         return 3;
//       default:
//         return 1;
//     }
//   };

//   // Function to calculate quantity
//   const calculateQuantity = (prescription) => {
//     const howToTakeValue = getHowToTakeValue(
//       prescription.MDD_TAKES,
//       prescription.MDD_TAKES_CUSTOM
//     );
//     const dailyDose = parseFloat(prescription.MDD_DAILY_DOSE) || 0;
//     const days = parseFloat(prescription.MDD_DAYS) || 0;
    
//     return (howToTakeValue * dailyDose * days).toString();
//   };

//   // Function to check stock availability
//   const checkStockAvailability = (prescription) => {
//     if (prescription.MMC_CURRENT_STOCK && prescription.MDD_QUANTITY) {
//       const requiredQty = parseFloat(prescription.MDD_QUANTITY) || 0;
//       const currentStock = parseFloat(prescription.MMC_CURRENT_STOCK) || 0;
      
//       if (requiredQty > currentStock) {
//         return {
//           isAvailable: false,
//           message: `Insufficient stock! Available: ${currentStock} units, Required: ${requiredQty} units`
//         };
//       }
//       return {
//         isAvailable: true,
//         message: `Stock available: ${currentStock} units`
//       };
//     }
//     return null;
//   };

//   const [prescriptions, setPrescriptions] = useState([
//     {
//       MDD_MATERIAL_CODE: "",
//       MDD_MATERIAL_NAME: "",
//       MDD_DOSAGE: "",
//       MDD_DAILY_DOSE: "",
//       MDD_DAYS: "",
//       MDD_TAKES: "",
//       MDD_TAKES_CUSTOM: "",
//       MDD_QUANTITY: "",
//       MMC_RATE: 0,
//       MMC_CURRENT_STOCK: 0,
//       type: "drug",
//     },
//   ]);

//   const [services, setServices] = useState([
//     {
//       serviceCode: "",
//       serviceName: "",
//       serviceDescription: "",
//       serviceRate: 0,
//       quantity: 1,
//       type: "service",
//     },
//   ]);

//   const [formData, setFormData] = useState({
//     MTD_PATIENT_CODE: patientId,
//     MTD_DATE: new Date().toISOString(),
//     MTD_TYPE: "",
//     MTD_DOCTOR: Name || "",
//     MTD_COMPLAIN: "",
//     MTD_DIAGNOSTICS: "",
//     MTD_REMARKS: "",
//     MTD_AMOUNT: "",
//     MTD_PAYMENT_STATUS: "",
//     MTD_TREATMENT_STATUS: "C",
//     MTD_SMS_STATUS: "",
//     MTD_SMS: "",
//     MTD_MEDICAL_STATUS: "",
//     MTD_STATUS: "",
//     MTD_CREATED_BY: Name || "",
//     MTD_CREATED_DATE: new Date().toISOString(),
//     MTD_UPDATED_BY: "",
//     MTD_CHANNEL_NO: channelnumber || null,
//     MTD_UPDATED_DATE: null,
//     MTD_APPOINMENT_ID: MTD_APPOINMENT_ID || appoinmentid || null,
//   });

//   // Fetch patient's treatment history
//   const fetchTreatmentHistory = async () => {
//     if (!patientId) return;
    
//     setHistoryLoading(true);
//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API_BASE_URL}/Treatment/patient/${patientId}`
//       );
      
//       if (Array.isArray(response.data)) {
//         const sortedTreatments = response.data
//           .filter(treatment => !serialNumber || treatment.MTD_SERIAL_NO !== parseInt(serialNumber))
//           .sort((a, b) => new Date(b.MTD_CREATED_DATE || b.MTD_DATE) - new Date(a.MTD_CREATED_DATE || a.MTD_DATE));
        
//         setTreatmentHistory(sortedTreatments);
//       } else {
//         setTreatmentHistory([]);
//       }
//     } catch (error) {
//       console.error("Error fetching treatment history:", error);
//       if (error.response && error.response.status !== 404) {
//         setSnackbarMessage("Error loading treatment history");
//         setSnackbarSeverity("error");
//         setSnackbarOpen(true);
//       }
//       setTreatmentHistory([]);
//     } finally {
//       setHistoryLoading(false);
//     }
//   };

//   const handleFormChange = (e) => {
//     const { name, value, id } = e.target;
//     const fieldName = name || id;

//     setFormData((prevData) => ({
//       ...prevData,
//       [fieldName]: value,
//     }));
//   };

//   // Drug related handlers
//   const handlePrescriptionChange = (index, event) => {
//     const { name, value } = event.target;
//     const values = [...prescriptions];

//     if (name === "MDD_TAKES") {
//       values[index][name] = value;
//       if (value !== "other") {
//         values[index].MDD_TAKES_CUSTOM = "";
//       }
//     } else if (name === "MDD_TAKES_CUSTOM") {
//       values[index][name] = value;
//     } else {
//       values[index][name] = value;
//     }

//     if (["MDD_TAKES", "MDD_TAKES_CUSTOM", "MDD_DAILY_DOSE", "MDD_DAYS"].includes(name)) {
//       if (
//         values[index].MDD_TAKES && 
//         values[index].MDD_DAILY_DOSE && 
//         values[index].MDD_DAYS &&
//         (values[index].MDD_TAKES !== "other" || values[index].MDD_TAKES_CUSTOM)
//       ) {
//         values[index].MDD_QUANTITY = calculateQuantity(values[index]);
        
//         const stockCheck = checkStockAvailability(values[index]);
//         if (stockCheck && !stockCheck.isAvailable) {
//           setStockWarning(stockCheck.message);
//           setSnackbarMessage(stockCheck.message);
//           setSnackbarSeverity("warning");
//           setSnackbarOpen(true);
//         } else {
//           setStockWarning("");
//         }
//       }
//     }

//     setPrescriptions(values);
//   };

//   const handleAddPrescription = () => {
//     const currentIndex = prescriptions.length - 1;
//     const currentPrescription = prescriptions[currentIndex];
    
//     const stockCheck = checkStockAvailability(currentPrescription);
//     if (stockCheck && !stockCheck.isAvailable) {
//       setSnackbarMessage(`Cannot add: ${stockCheck.message}`);
//       setSnackbarSeverity("error");
//       setSnackbarOpen(true);
//       return;
//     }

//     if (
//       currentPrescription.MDD_MATERIAL_NAME &&
//       currentPrescription.MDD_TAKES &&
//       (currentPrescription.MDD_TAKES !== "other" || currentPrescription.MDD_TAKES_CUSTOM) &&
//       currentPrescription.MDD_DAILY_DOSE &&
//       currentPrescription.MDD_DAYS
//     ) {
//       setPrescriptions([
//         ...prescriptions,
//         {
//           MDD_MATERIAL_CODE: "",
//           MDD_MATERIAL_NAME: "",
//           MDD_DOSAGE: "",
//           MDD_DAILY_DOSE: "",
//           MDD_DAYS: "",
//           MDD_TAKES: "",
//           MDD_TAKES_CUSTOM: "",
//           MDD_QUANTITY: "",
//           MMC_RATE: 0,
//           MMC_CURRENT_STOCK: 0,
//           type: "drug",
//         },
//       ]);
//       setStockWarning("");
//       setSnackbarMessage("Drug added successfully!");
//       setSnackbarSeverity("success");
//       setSnackbarOpen(true);
//     } else {
//       setSnackbarMessage("Please fill in all required fields for the current prescription");
//       setSnackbarSeverity("warning");
//       setSnackbarOpen(true);
//     }
//   };

//   const handleRemovePrescription = (index) => {
//     const values = [...prescriptions];
//     values.splice(index, 1);
//     setPrescriptions(values);
//   };

//   // Service related handlers
//   const handleServiceChange = (index, event) => {
//     const { name, value } = event.target;
//     const values = [...services];
//     values[index][name] = value;
//     setServices(values);
//   };

//   const handleAddService = () => {
//     const currentIndex = services.length - 1;
//     const currentService = services[currentIndex];

//     if (
//       currentService.serviceName &&
//       currentService.serviceRate > 0
//     ) {
//       setServices([
//         ...services,
//         {
//           serviceCode: "",
//           serviceName: "",
//           serviceDescription: "",
//           serviceRate: 0,
//           quantity: 1,
//           type: "service",
//         },
//       ]);
//       setSnackbarMessage("Service added successfully!");
//       setSnackbarSeverity("success");
//       setSnackbarOpen(true);
//     } else {
//       setSnackbarMessage("Please fill in service name and rate");
//       setSnackbarSeverity("warning");
//       setSnackbarOpen(true);
//     }
//   };

//   const handleRemoveService = (index) => {
//     const values = [...services];
//     values.splice(index, 1);
//     setServices(values);
//   };

//   // UNIFIED SEARCH FUNCTION - Uses Material API for BOTH drugs and services
//   const handleUnifiedSearch = async (query, type) => {
//     if (!query || query.length < 2) {
//       setSearchResults([]);
//       return;
//     }

//     setSearchLoading(true);
//     try {
//       // Use the SAME Material API for both drugs and services
//       const endpoint = `${process.env.REACT_APP_API_BASE_URL}/Material/search?query=${encodeURIComponent(query)}`;
      
//       console.log(`Searching with query:`, query);
//       const response = await axios.get(endpoint);
//       console.log("Search response:", response.data);
      
//       // Handle different response structures
//       let resultsList = [];
//       if (Array.isArray(response.data)) {
//         resultsList = response.data;
//       } else if (response.data.data && Array.isArray(response.data.data)) {
//         resultsList = response.data.data;
//       } else if (response.data.materials && Array.isArray(response.data.materials)) {
//         resultsList = response.data.materials;
//       }
      
//       // Filter results for services if needed (you can add logic here based on your data structure)
//       // For now, we'll show all results for both
//       setSearchResults(resultsList);
      
//       if (resultsList.length === 0) {
//         console.log(`No ${type} found for query:`, query);
//       }
//     } catch (error) {
//       console.error(`Error fetching data:`, error);
//       setSnackbarMessage(`Error searching. Please try again.`);
//       setSnackbarSeverity("error");
//       setSnackbarOpen(true);
//       setSearchResults([]);
//     } finally {
//       setSearchLoading(false);
//     }
//   };

//   // Handler for drug search - Uses Material API
//   const handleDrugSearchChange = async (index, event) => {
//     const query = event.target.value;
//     const values = [...prescriptions];
//     values[index].MDD_MATERIAL_NAME = query;
//     setPrescriptions(values);
    
//     setCurrentSearchType("drug");
//     await handleUnifiedSearch(query, "drug");
//   };

//   // Handler for service search - ALSO uses Material API
//   const handleServiceSearchChange = async (index, event) => {
//     const query = event.target.value;
//     const values = [...services];
//     values[index].serviceName = query;
//     setServices(values);
    
//     setCurrentSearchType("service");
//     await handleUnifiedSearch(query, "service");
//   };

//   // Handler for selecting medicine from search results
//   const handleSelectMedicine = (index, materialCode, materialName, rate, currentStock) => {
//     const values = [...prescriptions];
//     values[index].MDD_MATERIAL_CODE = materialCode;
//     values[index].MDD_MATERIAL_NAME = materialName;
//     values[index].MMC_RATE = rate;
//     values[index].MMC_CURRENT_STOCK = currentStock;
//     setSearchResults([]);
//     setPrescriptions(values);
//     setActivePrescriptionIndex(null);
    
//     setSnackbarMessage(`Drug "${materialName}" selected successfully!`);
//     setSnackbarSeverity("success");
//     setSnackbarOpen(true);
//   };

//   // Handler for selecting service from search results
//   const handleSelectService = (index, materialCode, serviceName, serviceDescription, serviceRate) => {
//     const values = [...services];
//     values[index].serviceCode = materialCode;
//     values[index].serviceName = serviceName;
//     values[index].serviceDescription = serviceDescription || "";
//     values[index].serviceRate = serviceRate;
//     setSearchResults([]);
//     setServices(values);
//     setActiveServiceIndex(null);
    
//     setSnackbarMessage(`Service "${serviceName}" selected successfully!`);
//     setSnackbarSeverity("success");
//     setSnackbarOpen(true);
//   };

//   // Fetch patient details and treatment history
//   useEffect(() => {
//     window.scrollTo(0, 0);
    
//     fetchTreatmentHistory();
    
//     const fetchExistingData = async () => {
//       if (serialNumber) {
//         setIsEditMode(true);

//         try {
//           const treatmentResponse = await axios.get(
//             `${process.env.REACT_APP_API_BASE_URL}/Treatment/patientdetail/treatmentdetail/${patientId}/${serialNumber}`
//           );
//           const treatmentData = treatmentResponse.data;

//           setFormData((prevData) => ({
//             ...prevData,
//             ...treatmentData,
//             MTD_TREATMENT_STATUS: "C",
//           }));

//           try {
//             const itemsResponse = await axios.get(
//               `${process.env.REACT_APP_API_BASE_URL}/Drug/${serialNumber}`
//             );
//             if (Array.isArray(itemsResponse.data) && itemsResponse.data.length > 0) {
//               const drugs = itemsResponse.data
//                 .filter(item => item.MDD_TYPE === "drug")
//                 .map(item => ({
//                   ...item,
//                   type: "drug"
//                 }));
              
//               const servicesItems = itemsResponse.data
//                 .filter(item => item.MDD_TYPE === "service")
//                 .map(item => ({
//                   serviceCode: item.MDD_MATERIAL_CODE,
//                   serviceName: item.MDD_MATERIAL_CODE,
//                   serviceDescription: item.MDD_DOSAGE,
//                   serviceRate: item.MDD_RATE,
//                   quantity: item.MDD_QUANTITY,
//                   type: "service"
//                 }));
              
//               setPrescriptions([...drugs, {
//                 MDD_MATERIAL_CODE: "",
//                 MDD_MATERIAL_NAME: "",
//                 MDD_DOSAGE: "",
//                 MDD_DAILY_DOSE: "",
//                 MDD_DAYS: "",
//                 MDD_TAKES: "",
//                 MDD_TAKES_CUSTOM: "",
//                 MDD_QUANTITY: "",
//                 MMC_RATE: 0,
//                 MMC_CURRENT_STOCK: 0,
//                 type: "drug",
//               }]);
              
//               setServices([...servicesItems, {
//                 serviceCode: "",
//                 serviceName: "",
//                 serviceDescription: "",
//                 serviceRate: 0,
//                 quantity: 1,
//                 type: "service",
//               }]);
//             }
//           } catch (error) {
//             console.log("No items found for this treatment");
//           }

//           setPatientdetails(treatmentData.patientdetails);
//         } catch (error) {
//           console.error("Error fetching data:", error);
//           setPatientError("Unable to load patient details.");
//         }
//       }
//     };

//     fetchExistingData();
//   }, [serialNumber, patientId]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     // Check stock for all prescriptions before submitting (only for drugs)
//     for (const prescription of prescriptions) {
//       if (prescription.MDD_MATERIAL_CODE && prescription.type === "drug") {
//         const stockCheck = checkStockAvailability(prescription);
//         if (stockCheck && !stockCheck.isAvailable) {
//           setSnackbarMessage(`Stock issue: ${stockCheck.message}`);
//           setSnackbarSeverity("error");
//           setSnackbarOpen(true);
//           setLoading(false);
//           return;
//         }
//       }
//     }

//     // Filter out empty prescriptions (drugs)
//     const validPrescriptions = prescriptions.filter(
//       (prescription) => prescription.MDD_MATERIAL_CODE && prescription.type === "drug"
//     );

//     // Filter out empty services - check for service name instead of service code
//     const validServices = services.filter(
//       (service) => service.serviceName && service.serviceRate > 0 && service.type === "service"
//     );

//     console.log("Valid Drugs:", validPrescriptions);
//     console.log("Valid Services:", validServices);

//     try {
//       if (isEditMode) {
//         // Prepare drugs with MDD_TYPE "drug"
//         const preparedDrugs = validPrescriptions.map((prescription) => ({
//           MDD_MATERIAL_CODE: prescription.MDD_MATERIAL_CODE,
//           MDD_QUANTITY: parseInt(prescription.MDD_QUANTITY) || 0,
//           MDD_RATE: prescription.MMC_RATE || prescription.MDD_RATE || 0,
//           MDD_AMOUNT: (parseFloat(prescription.MMC_RATE || 0) * (parseInt(prescription.MDD_QUANTITY) || 0)),
//           MDD_DOSAGE: prescription.MDD_DOSAGE || "",
//           MDD_DAILY_DOSE: prescription.MDD_DAILY_DOSE,
//           MDD_DAYS: prescription.MDD_DAYS,
//           MDD_TAKES: prescription.MDD_TAKES === "other"
//             ? prescription.MDD_TAKES_CUSTOM
//             : prescription.MDD_TAKES,
//           MDD_GIVEN_QUANTITY: 0,
//           MDD_STATUS: "A",
//           MDD_TYPE: "drug"
//         }));

//         // Prepare services with MDD_TYPE "service" - use service name as material code
//         const preparedServices = validServices.map((service) => ({
//           MDD_MATERIAL_CODE: service.serviceName,
//           MDD_QUANTITY: parseInt(service.quantity) || 1,
//           MDD_RATE: parseFloat(service.serviceRate) || 0,
//           MDD_AMOUNT: (parseFloat(service.serviceRate) || 0) * (parseInt(service.quantity) || 1),
//           MDD_DOSAGE: service.serviceDescription || "",
//           MDD_DAILY_DOSE: 0,
//           MDD_DAYS: 0,
//           MDD_TAKES: "",
//           MDD_GIVEN_QUANTITY: 0,
//           MDD_STATUS: "A",
//           MDD_TYPE: "service"
//         }));

//         const allItems = [...preparedDrugs, ...preparedServices];

//         console.log("All items being sent:", allItems);

//         const updatePayload = {
//           Treatment: {
//             MTD_DOCTOR: formData.MTD_DOCTOR,
//             MTD_TYPE: formData.MTD_TYPE,
//             MTD_COMPLAIN: formData.MTD_COMPLAIN,
//             MTD_DIAGNOSTICS: formData.MTD_DIAGNOSTICS,
//             MTD_REMARKS: formData.MTD_REMARKS,
//             MTD_AMOUNT: formData.MTD_AMOUNT,
//             MTD_UPDATED_BY: Name,
//             MTD_TREATMENT_STATUS: "C",
//           },
//           Drugs: allItems,
//         };

//         const response = await axios.post(
//           `${process.env.REACT_APP_API_BASE_URL}/Treatment/updatingtreatment/${patientId}/${serialNumber}`,
//           updatePayload
//         );

//         if (response.status === 200) {
//           setSnackbarMessage("Treatment updated successfully!");
//           setSnackbarSeverity("success");
//           setSnackbarOpen(true);
//           setTimeout(() => {
//             navigate(-1);
//           }, 1500);
//         } else {
//           setSnackbarMessage("Failed to update treatment.");
//           setSnackbarSeverity("error");
//           setSnackbarOpen(true);
//         }
//       } else {
//         // Create new treatment
//         const treatmentResponse = await axios.post(
//           `${process.env.REACT_APP_API_BASE_URL}/Treatment`,
//           {
//             ...formData,
//             MTD_APPOINMENT_ID: formData.MTD_APPOINMENT_ID || null,
//             MTD_TREATMENT_STATUS: "C"
//           }
//         );
        
//         const serial_no = treatmentResponse.data.MTD_SERIAL_NO || treatmentResponse.data.serialNo;

//         // Prepare drugs with MDD_TYPE "drug"
//         const preparedDrugs = validPrescriptions.map((prescription) => ({
//           MDD_PATIENT_CODE: patientId,
//           MDD_SERIAL_NO: serial_no,
//           MDD_MATERIAL_CODE: prescription.MDD_MATERIAL_CODE,
//           MDD_QUANTITY: parseInt(prescription.MDD_QUANTITY) || 0,
//           MDD_RATE: prescription.MMC_RATE || prescription.MDD_RATE || 0,
//           MDD_AMOUNT: (parseFloat(prescription.MMC_RATE || 0) * (parseInt(prescription.MDD_QUANTITY) || 0)),
//           MDD_DOSAGE: prescription.MDD_DOSAGE || "",
//           MDD_TAKES: prescription.MDD_TAKES === "other"
//             ? prescription.MDD_TAKES_CUSTOM
//             : prescription.MDD_TAKES,
//           MDD_GIVEN_QUANTITY: 0,
//           MDD_STATUS: "A",
//           MDD_CREATED_BY: formData.MTD_CREATED_BY,
//           MDD_CREATED_DATE: new Date().toISOString(),
//           MDD_UPDATED_BY: "",
//           MDD_UPDATED_DATE: null,
//           MDD_DAYS: parseInt(prescription.MDD_DAYS) || 0,
//           MDD_DAILY_DOSE: parseFloat(prescription.MDD_DAILY_DOSE) || 0,
//           MDD_TYPE: "drug"
//         }));

//         // Prepare services with MDD_TYPE "service" - use service name as material code
//         const preparedServices = validServices.map((service) => ({
//           MDD_PATIENT_CODE: patientId,
//           MDD_SERIAL_NO: serial_no,
//           MDD_MATERIAL_CODE: service.serviceName,
//           MDD_QUANTITY: parseInt(service.quantity) || 1,
//           MDD_RATE: parseFloat(service.serviceRate) || 0,
//           MDD_AMOUNT: (parseFloat(service.serviceRate) || 0) * (parseInt(service.quantity) || 1),
//           MDD_DOSAGE: service.serviceDescription || "",
//           MDD_TAKES: "",
//           MDD_GIVEN_QUANTITY: 0,
//           MDD_STATUS: "A",
//           MDD_CREATED_BY: formData.MTD_CREATED_BY,
//           MDD_CREATED_DATE: new Date().toISOString(),
//           MDD_UPDATED_BY: "",
//           MDD_UPDATED_DATE: null,
//           MDD_DAYS: 0,
//           MDD_DAILY_DOSE: 0,
//           MDD_TYPE: "service"
//         }));

//         const allItems = [...preparedDrugs, ...preparedServices];

//         console.log("All items being sent:", allItems);

//         if (allItems.length > 0) {
//           const submitPromises = allItems.map(item => {
//             console.log(`Submitting ${item.MDD_TYPE}:`, item);
//             return axios.post(
//               `${process.env.REACT_APP_API_BASE_URL}/Drug`,
//               item
//             );
//           });

//           await Promise.all(submitPromises);
//         }

//         navigate(`/dashboard/view-record/${patientId}/${serial_no}`);
//       }
//     } catch (error) {
//       console.error(
//         "Error submitting record:",
//         error.response?.data || error.message
//       );
//       setSnackbarMessage(error.response?.data?.message || "Error submitting treatment and prescription details.");
//       setSnackbarSeverity("error");
//       setSnackbarOpen(true);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//   };

//   const handleSnackbarClose = (event, reason) => {
//     if (reason === "clickaway") {
//       return;
//     }
//     setSnackbarOpen(false);
//   };

//   const completedPrescriptions = prescriptions.slice(0, -1);
//   const currentPrescription = prescriptions[prescriptions.length - 1];
//   const completedServices = services.slice(0, -1);
//   const currentService = services[services.length - 1];
//   const currentStockCheck = currentPrescription ? checkStockAvailability(currentPrescription) : null;

//   const totalDrugsAmount = completedPrescriptions.reduce((sum, drug) => 
//     sum + (parseFloat(drug.MDD_QUANTITY || 0) * parseFloat(drug.MMC_RATE || 0)), 0
//   );
  
//   const totalServicesAmount = completedServices.reduce((sum, service) => 
//     sum + (parseFloat(service.serviceRate || 0) * parseFloat(service.quantity || 1)), 0
//   );
  
//   const totalAmount = totalDrugsAmount + totalServicesAmount + (parseFloat(formData.MTD_AMOUNT) || 0);

//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     try {
//       const date = new Date(dateString);
//       return date.toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit'
//       });
//     } catch (e) {
//       return "Invalid Date";
//     }
//   };

//   return (
//     <Container maxWidth="xl">
//       <Snackbar
//         open={snackbarOpen}
//         autoHideDuration={3000}
//         onClose={handleSnackbarClose}
//         anchorOrigin={{ vertical: "top", horizontal: "right" }}
//       >
//         <Alert
//           onClose={handleSnackbarClose}
//           severity={snackbarSeverity}
//           sx={{ width: "100%" }}
//         >
//           {snackbarMessage}
//         </Alert>
//       </Snackbar>

//       <Box sx={{ my: 2 }}>
//         <Button
//           startIcon={<ArrowBack />}
//           onClick={() => navigate(-1)}
//           variant="outlined"
//           sx={{ mb: 2 }}
//         >
//           Back
//         </Button>

//         {/* Treatment History Section */}
//         <StyledPaper elevation={3} sx={{ mb: 3 }}>
//           <SectionHeader>
//             <History sx={{ color: "primary.main" }} />
//             <Typography variant="h6" color="primary.main">
//               Patient Medical History
//             </Typography>
//           </SectionHeader>

//           {historyLoading ? (
//             <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
//               <CircularProgress size={30} />
//             </Box>
//           ) : treatmentHistory.length > 0 ? (
//             <Box>
//               <Accordion defaultExpanded>
//                 <AccordionSummary expandIcon={<ExpandMore />}>
//                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                     <MedicalServices color="primary" />
//                     <Typography variant="subtitle1" fontWeight={600}>
//                       Previous Treatments ({treatmentHistory.length})
//                     </Typography>
//                   </Box>
//                 </AccordionSummary>
//                 <AccordionDetails>
//                   <Box sx={{ maxHeight: '400px', overflow: 'auto', pr: 1 }}>
//                     {treatmentHistory.map((treatment, index) => (
//                       <HistoryCard key={treatment.MTD_SERIAL_NO || index}>
//                         <CardContent>
//                           <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
//                             <Typography variant="subtitle1" fontWeight={600} color="primary">
//                               Visit #{treatmentHistory.length - index}
//                             </Typography>
//                             <Chip
//                               label={formatDate(treatment.MTD_CREATED_DATE || treatment.MTD_DATE)}
//                               size="small"
//                               icon={<CalendarToday />}
//                               variant="outlined"
//                             />
//                           </Box>
                          
//                           <Grid container spacing={2}>
//                             <Grid item xs={12} md={6}>
//                               <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
//                                 <Note color="action" fontSize="small" />
//                                 <Typography variant="body2">
//                                   <strong>Complaint:</strong> {treatment.MTD_COMPLAIN || 'N/A'}
//                                 </Typography>
//                               </Box>
//                             </Grid>
//                             <Grid item xs={12} md={6}>
//                               <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
//                                 <Info color="action" fontSize="small" />
//                                 <Typography variant="body2">
//                                   <strong>Diagnosis:</strong> {treatment.MTD_DIAGNOSTICS || 'N/A'}
//                                 </Typography>
//                               </Box>
//                             </Grid>
//                           </Grid>

//                           <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
//                             <Person color="action" fontSize="small" />
//                             <Typography variant="body2" color="text.secondary">
//                               <strong>Doctor:</strong> {treatment.MTD_DOCTOR || 'N/A'}
//                             </Typography>
//                           </Box>

//                           {treatment.MTD_REMARKS && (
//                             <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
//                               <Description color="action" fontSize="small" />
//                               <Typography variant="body2" color="text.secondary">
//                                 <strong>Remarks:</strong> {treatment.MTD_REMARKS}
//                               </Typography>
//                             </Box>
//                           )}

//                           <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
//                             <Button
//                               size="small"
//                               variant="outlined"
//                               onClick={() => {
//                                 navigate(
//                                   `/dashboard/view-record/${patientId}/${treatment.MTD_SERIAL_NO}`,
//                                   { state: { fromHistory: true } }
//                                 );
//                               }}
//                             >
//                               View Details
//                             </Button>
//                           </Box>
//                         </CardContent>
//                       </HistoryCard>
//                     ))}
//                   </Box>
//                 </AccordionDetails>
//               </Accordion>
//             </Box>
//           ) : (
//             <Box sx={{ textAlign: 'center', py: 3 }}>
//               <Typography variant="body1" color="text.secondary">
//                 No previous treatment history available for this patient
//               </Typography>
//             </Box>
//           )}
//         </StyledPaper>

//         <StyledPaper elevation={3}>
//           <Box
//             sx={{
//               display: "flex",
//               alignItems: "center",
//               mb: 2,
//               justifyContent: "center",
//             }}
//           >
//             <MedicalServices color="primary" sx={{ fontSize: 40, mr: 2 }} />
//             <Typography
//               variant="h4"
//               color="primary"
//               fontWeight={600}
//               gutterBottom
//             >
//               {isEditMode ? "Edit Treatment Details" : "Add Treatment Details"}
//             </Typography>
//           </Box>

//           {channelnumber && (
//             <Box sx={{ textAlign: "center", mb: 3 }}>
//               <Chip
//                 label={`Channel Number: ${channelnumber}`}
//                 color="primary"
//                 variant="outlined"
//                 avatar={<Avatar>#</Avatar>}
//               />
//             </Box>
//           )}

//           <Typography
//             variant="subtitle1"
//             color="text.secondary"
//             gutterBottom
//             sx={{ mb: 2, textAlign: "center", mt: -2 }}
//           >
//             Fill in the treatment and prescription information below.
//           </Typography>

//           <form onSubmit={handleSubmit}>
//             <Box sx={{ mb: 3 }}>
//               <Typography variant="h6" gutterBottom>
//                 Patient Complaint
//               </Typography>
//               <TextField
//                 fullWidth
//                 id="MTD_COMPLAIN"
//                 name="MTD_COMPLAIN"
//                 value={formData.MTD_COMPLAIN}
//                 onChange={handleFormChange}
//                 placeholder="Enter patient complaint"
//                 required
//                 multiline
//                 rows={3}
//                 variant="outlined"
//               />
//             </Box>

//             <Box sx={{ mb: 3 }}>
//               <Typography variant="h6" gutterBottom>
//                 Diagnosis
//               </Typography>
//               <TextField
//                 fullWidth
//                 id="MTD_DIAGNOSTICS"
//                 name="MTD_DIAGNOSTICS"
//                 value={formData.MTD_DIAGNOSTICS}
//                 onChange={handleFormChange}
//                 placeholder="Enter patient diagnosis details"
//                 required
//                 multiline
//                 rows={3}
//                 variant="outlined"
//               />
//             </Box>

//             {/* Unified Items Section - Drugs */}
//             <Box sx={{ mb: 4 }}>
//               <SectionHeader>
//                 <Healing sx={{ color: "primary.main" }} />
//                 <Typography variant="h6" color="primary.main">
//                   Drug Prescriptions
//                 </Typography>
//               </SectionHeader>
              
//               {/* New Drug Entry Field */}
//               <Box sx={{ mb: 3 }}>
//                 <Typography variant="subtitle2" color="text.secondary" gutterBottom>
//                   Add New Drug
//                 </Typography>
//                 <Paper
//                   elevation={2}
//                   sx={{ p: 2, mb: 2, position: "relative", backgroundColor: 'background.paper' }}
//                 >
//                   <Box
//                     sx={{
//                       display: "grid",
//                       gridTemplateColumns: {
//                         xs: "1fr",
//                         md: "minmax(200px, 2fr) minmax(200px, 1.5fr) minmax(100px, 0.8fr) minmax(100px, 0.8fr) minmax(100px, 0.8fr) auto",
//                       },
//                       gap: 1.5,
//                       alignItems: "flex-start",
//                     }}
//                   >
//                     {/* Search Medicine - Using Material API */}
//                     <Box sx={{ minWidth: 0, position: "relative" }}>
//                       <TextField
//                         fullWidth
//                         size="small"
//                         label="Search Medicine"
//                         name="MDD_MATERIAL_NAME"
//                         value={currentPrescription?.MDD_MATERIAL_NAME || ""}
//                         onChange={(event) => handleDrugSearchChange(prescriptions.length - 1, event)}
//                         onFocus={() => {
//                           setActivePrescriptionIndex(prescriptions.length - 1);
//                           setCurrentSearchType("drug");
//                         }}
//                         required={!isEditMode}
//                         InputProps={{
//                           endAdornment: searchLoading && currentSearchType === "drug" ? (
//                             <CircularProgress size={20} />
//                           ) : null,
//                         }}
//                       />
//                       {activePrescriptionIndex === prescriptions.length - 1 &&
//                         searchResults.length > 0 &&
//                         currentSearchType === "drug" && (
//                           <Paper
//                             elevation={3}
//                             sx={{
//                               position: "absolute",
//                               zIndex: 1,
//                               width: "100%",
//                               maxHeight: 200,
//                               overflow: "auto",
//                               mt: 0.5,
//                             }}
//                           >
//                             <List dense>
//                               {searchResults.map((medicine) => (
//                                 <ListItem
//                                   key={medicine.MMC_MATERIAL_CODE}
//                                   component="li"
//                                   onClick={() =>
//                                     handleSelectMedicine(
//                                       prescriptions.length - 1,
//                                       medicine.MMC_MATERIAL_CODE,
//                                       medicine.MMC_DESCRIPTION,
//                                       medicine.MMC_RATE,
//                                       medicine.MMC_CURRENT_STOCK
//                                     )
//                                   }
//                                   sx={{ cursor: 'pointer' }}
//                                 >
//                                   <ListItemText
//                                     primary={medicine.MMC_DESCRIPTION}
//                                     secondary={
//                                       <>
//                                         <Typography component="span" variant="body2" color="text.primary">
//                                           Code: {medicine.MMC_MATERIAL_CODE}
//                                         </Typography>
//                                         <br />
//                                         <Typography component="span" variant="body2" color={medicine.MMC_CURRENT_STOCK > 0 ? "success.main" : "error.main"}>
//                                           Stock: {medicine.MMC_CURRENT_STOCK} units | Rate: Rs.{medicine.MMC_RATE}
//                                         </Typography>
//                                       </>
//                                     }
//                                   />
//                                 </ListItem>
//                               ))}
//                             </List>
//                           </Paper>
//                         )}
                      
//                       {/* Display current stock if medicine selected */}
//                       {currentPrescription?.MMC_CURRENT_STOCK > 0 && (
//                         <Box sx={{ mt: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
//                           <Inventory fontSize="small" color="primary" />
//                           <Typography variant="caption" color="primary">
//                             Current Stock: {currentPrescription.MMC_CURRENT_STOCK} units
//                           </Typography>
//                         </Box>
//                       )}
//                     </Box>

//                     {/* How to Take */}
//                     <Box>
//                       <FormControl fullWidth size="small">
//                         <InputLabel>How to Take</InputLabel>
//                         <Select
//                           name="MDD_TAKES"
//                           value={currentPrescription?.MDD_TAKES || ""}
//                           onChange={(event) =>
//                             handlePrescriptionChange(prescriptions.length - 1, event)
//                           }
//                           required={!isEditMode}
//                           label="How to Take"
//                         >
//                           <MenuItem value="">
//                             <em>Select</em>
//                           </MenuItem>
//                           <MenuItem value="Daily">Daily</MenuItem>
//                           <MenuItem value="Twice a Day before food">
//                             Twice a Day before food
//                           </MenuItem>
//                           <MenuItem value="Twice a Day after food">
//                             Twice a Day after food
//                           </MenuItem>
//                           <MenuItem value="Three times per day before food">
//                             Three times per day before food
//                           </MenuItem>
//                           <MenuItem value="Three times per day after food">
//                             Three times per day after food
//                           </MenuItem>
//                           <MenuItem value="As Needed">As Needed</MenuItem>
//                           <MenuItem value="other">Other</MenuItem>
//                         </Select>
//                       </FormControl>

//                       {currentPrescription?.MDD_TAKES === "other" && (
//                         <TextField
//                           fullWidth
//                           size="small"
//                           type="number"
//                           sx={{ mt: 1 }}
//                           name="MDD_TAKES_CUSTOM"
//                           label="Specify Times per Day"
//                           value={currentPrescription?.MDD_TAKES_CUSTOM || ""}
//                           onChange={(event) =>
//                             handlePrescriptionChange(prescriptions.length - 1, event)
//                           }
//                           placeholder="Enter number (e.g., 2, 3, 4)"
//                           inputProps={{ min: "1", step: "1" }}
//                         />
//                       )}
//                     </Box>

//                     {/* Daily Dose */}
//                     <Box>
//                       <TextField
//                         fullWidth
//                         size="small"
//                         type="number"
//                         name="MDD_DAILY_DOSE"
//                         label="Daily Dose"
//                         value={currentPrescription?.MDD_DAILY_DOSE || ""}
//                         onChange={(event) => handlePrescriptionChange(prescriptions.length - 1, event)}
//                         required={!isEditMode}
//                         inputProps={{ min: "0.5", step: "0.5" }}
//                       />
//                     </Box>

//                     {/* Days */}
//                     <Box>
//                       <TextField
//                         fullWidth
//                         size="small"
//                         type="number"
//                         name="MDD_DAYS"
//                         label="Days"
//                         value={currentPrescription?.MDD_DAYS || ""}
//                         onChange={(event) => handlePrescriptionChange(prescriptions.length - 1, event)}
//                         required={!isEditMode}
//                         inputProps={{ min: "1" }}
//                       />
//                     </Box>

//                     {/* Quantity (Calculated) */}
//                     <Box>
//                       <Tooltip title={currentStockCheck?.message || ""}>
//                         <TextField
//                           fullWidth
//                           size="small"
//                           type="number"
//                           name="MDD_QUANTITY"
//                           label="Qty"
//                           value={currentPrescription?.MDD_QUANTITY || ""}
//                           onChange={(event) =>
//                             handlePrescriptionChange(prescriptions.length - 1, event)
//                           }
//                           inputProps={{ min: "1" }}
//                           disabled
//                           error={currentStockCheck && !currentStockCheck.isAvailable}
//                           color={currentStockCheck?.isAvailable ? "success" : "primary"}
//                         />
//                       </Tooltip>
//                     </Box>

//                     {/* Add Button */}
//                     <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
//                       <Button
//                         variant="contained"
//                         color="primary"
//                         onClick={handleAddPrescription}
//                         startIcon={<Add />}
//                         size="small"
//                         sx={{ height: 40 }}
//                         disabled={currentStockCheck && !currentStockCheck.isAvailable}
//                       >
//                         Add Drug
//                       </Button>
//                     </Box>
//                   </Box>

//                   {/* Display simplified calculation with units and price */}
//                   {currentPrescription?.MDD_TAKES && 
//                    currentPrescription?.MDD_DAILY_DOSE && 
//                    currentPrescription?.MDD_DAYS && 
//                    (currentPrescription.MDD_TAKES !== "other" || currentPrescription.MDD_TAKES_CUSTOM) && (
//                     <Box sx={{ 
//                       mt: 2, 
//                       p: 1.5, 
//                       bgcolor: currentStockCheck && !currentStockCheck.isAvailable ? 'warning.light' : 'primary.light', 
//                       borderRadius: 1,
//                       display: 'flex',
//                       alignItems: 'center',
//                       justifyContent: 'space-between'
//                     }}>
//                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//                         <Typography variant="body2" color="white" fontWeight={500}>
//                           Total Units: {currentPrescription.MDD_QUANTITY}
//                         </Typography>
//                         {currentPrescription.MMC_RATE > 0 && (
//                           <>
//                             <Typography variant="body2" color="white" fontWeight={500}>
//                               |
//                             </Typography>
//                             <Typography variant="body2" color="white" fontWeight={500}>
//                               Price: Rs. {(parseFloat(currentPrescription.MDD_QUANTITY || 0) * currentPrescription.MMC_RATE).toFixed(2)}
//                             </Typography>
//                           </>
//                         )}
//                       </Box>
//                       {currentStockCheck && !currentStockCheck.isAvailable && (
//                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
//                           <Warning fontSize="small" sx={{ color: 'white' }} />
//                           <Typography variant="body2" color="white" fontWeight={500}>
//                             Insufficient Stock!
//                           </Typography>
//                         </Box>
//                       )}
//                     </Box>
//                   )}
//                 </Paper>
//               </Box>

//               {/* Display Completed Drugs */}
//               {completedPrescriptions.length > 0 && (
//                 <Box sx={{ mt: 3 }}>
//                   <Typography variant="subtitle2" color="text.secondary" gutterBottom>
//                     Added Drugs ({completedPrescriptions.length})
//                   </Typography>
//                   {completedPrescriptions.map((prescription, index) => {
//                     const stockCheck = checkStockAvailability(prescription);
                    
//                     return (
//                       <PrescriptionCard key={index}>
//                         <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
//                           <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
//                             <Box sx={{ flex: 1 }}>
//                               <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
//                                 <Typography variant="subtitle1" fontWeight={600} color="primary">
//                                   {prescription.MDD_MATERIAL_NAME}
//                                 </Typography>
//                                 <Chip 
//                                   label={`Daily: ${prescription.MDD_DAILY_DOSE}`} 
//                                   size="small" 
//                                   variant="outlined"
//                                 />
//                                 <Chip 
//                                   label={`Days: ${prescription.MDD_DAYS}`} 
//                                   size="small" 
//                                   variant="outlined"
//                                 />
//                                 <Chip 
//                                   label={`Total: ${prescription.MDD_QUANTITY} units`} 
//                                   size="small" 
//                                   color="primary"
//                                   variant="outlined"
//                                 />
//                                 {prescription.MMC_RATE > 0 && (
//                                   <Chip 
//                                     label={`Rs. ${(parseFloat(prescription.MDD_QUANTITY || 0) * prescription.MMC_RATE).toFixed(2)}`}
//                                     size="small" 
//                                     color="secondary"
//                                     variant="outlined"
//                                   />
//                                 )}
//                               </Box>
//                               <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
//                                 <Typography variant="body2" color="text.secondary">
//                                   <strong>How to take:</strong> {prescription.MDD_TAKES === "other" ? `${prescription.MDD_TAKES_CUSTOM} times per day` : prescription.MDD_TAKES}
//                                 </Typography>
//                                 {prescription.MMC_CURRENT_STOCK > 0 && (
//                                   <Typography variant="body2" color={stockCheck?.isAvailable ? "success.main" : "error.main"}>
//                                     <Inventory fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
//                                     Stock: {prescription.MMC_CURRENT_STOCK} units
//                                   </Typography>
//                                 )}
//                               </Box>
//                               {!stockCheck?.isAvailable && (
//                                 <StockWarningChip
//                                   icon={<Warning />}
//                                   label={stockCheck?.message}
//                                   size="small"
//                                   sx={{ mt: 1 }}
//                                 />
//                               )}
//                             </Box>
//                             <IconButton
//                               onClick={() => handleRemovePrescription(index)}
//                               color="error"
//                               size="small"
//                               sx={{ ml: 1 }}
//                             >
//                               <Delete fontSize="small" />
//                             </IconButton>
//                           </Box>
//                         </CardContent>
//                       </PrescriptionCard>
//                     );
//                   })}
                  
//                   {/* Drugs Total */}
//                   {totalDrugsAmount > 0 && (
//                     <Box sx={{ mt: 2, textAlign: 'right' }}>
//                       <Typography variant="subtitle1" color="primary.main" fontWeight={600}>
//                         Drugs Total: Rs. {totalDrugsAmount.toFixed(2)}
//                       </Typography>
//                     </Box>
//                   )}
//                 </Box>
//               )}
//             </Box>

//             {/* Unified Items Section - Services */}
//             <Box sx={{ mb: 4 }}>
//               <SectionHeader>
//                 <Biotech sx={{ color: "info.main" }} />
//                 <Typography variant="h6" color="info.main">
//                   Services
//                 </Typography>
//               </SectionHeader>
              
//               {/* New Service Entry Field */}
//               <Box sx={{ mb: 3 }}>
//                 <Typography variant="subtitle2" color="text.secondary" gutterBottom>
//                   Add New Service
//                 </Typography>
//                 <Paper
//                   elevation={2}
//                   sx={{ p: 2, mb: 2, position: "relative", backgroundColor: 'background.paper' }}
//                 >
//                   <Box
//                     sx={{
//                       display: "grid",
//                       gridTemplateColumns: {
//                         xs: "1fr",
//                         md: "minmax(200px, 2fr) minmax(150px, 1fr) minmax(100px, 0.8fr) auto",
//                       },
//                       gap: 1.5,
//                       alignItems: "flex-start",
//                     }}
//                   >
//                     {/* Search Service - Using SAME Material API */}
//                     <Box sx={{ minWidth: 0, position: "relative" }}>
//                       <TextField
//                         fullWidth
//                         size="small"
//                         label="Search Service"
//                         name="serviceName"
//                         value={currentService?.serviceName || ""}
//                         onChange={(event) => handleServiceSearchChange(services.length - 1, event)}
//                         onFocus={() => {
//                           setActiveServiceIndex(services.length - 1);
//                           setCurrentSearchType("service");
//                         }}
//                         required={!isEditMode}
//                         InputProps={{
//                           endAdornment: searchLoading && currentSearchType === "service" ? (
//                             <CircularProgress size={20} />
//                           ) : null,
//                         }}
//                       />
//                       {activeServiceIndex === services.length - 1 &&
//                         searchResults.length > 0 &&
//                         currentSearchType === "service" && (
//                           <Paper
//                             elevation={3}
//                             sx={{
//                               position: "absolute",
//                               zIndex: 1,
//                               width: "100%",
//                               maxHeight: 200,
//                               overflow: "auto",
//                               mt: 0.5,
//                             }}
//                           >
//                             <List dense>
//                               {searchResults.map((item, idx) => (
//                                 <ListItem
//                                   key={item.MMC_MATERIAL_CODE || idx}
//                                   component="li"
//                                   onClick={() =>
//                                     handleSelectService(
//                                       services.length - 1,
//                                       item.MMC_MATERIAL_CODE,
//                                       item.MMC_DESCRIPTION,
//                                       item.MMC_DOSAGE || "",
//                                       item.MMC_RATE
//                                     )
//                                   }
//                                   sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
//                                 >
//                                   <ListItemText
//                                     primary={item.MMC_DESCRIPTION}
//                                     secondary={
//                                       <>
//                                         <Typography component="span" variant="body2" color="text.primary">
//                                           Code: {item.MMC_MATERIAL_CODE}
//                                         </Typography>
//                                         <br />
//                                         <Typography component="span" variant="body2" color="success.main">
//                                           Rate: Rs.{item.MMC_RATE}
//                                         </Typography>
//                                         {item.MMC_CURRENT_STOCK !== undefined && (
//                                           <>
//                                             <br />
//                                             <Typography component="span" variant="body2" color={item.MMC_CURRENT_STOCK > 0 ? "success.main" : "error.main"}>
//                                               Stock: {item.MMC_CURRENT_STOCK} units
//                                             </Typography>
//                                           </>
//                                         )}
//                                       </>
//                                     }
//                                   />
//                                 </ListItem>
//                               ))}
//                             </List>
//                           </Paper>
//                         )}
                      
//                       {/* Show no results message */}
//                       {activeServiceIndex === services.length - 1 &&
//                         currentService?.serviceName &&
//                         currentService.serviceName.length > 2 &&
//                         searchResults.length === 0 &&
//                         !searchLoading &&
//                         currentSearchType === "service" && (
//                           <Box sx={{ mt: 1 }}>
//                             <Typography variant="caption" color="text.secondary">
//                               No services found. You can still add manually by typing the name and rate.
//                             </Typography>
//                           </Box>
//                         )}
//                     </Box>

//                     {/* Service Rate */}
//                     <Box>
//                       <TextField
//                         fullWidth
//                         size="small"
//                         type="number"
//                         name="serviceRate"
//                         label="Rate (Rs.)"
//                         value={currentService?.serviceRate || ""}
//                         onChange={(event) => handleServiceChange(services.length - 1, event)}
//                         required={!isEditMode}
//                         inputProps={{ min: "0", step: "0.01" }}
//                       />
//                     </Box>

//                     {/* Quantity */}
//                     <Box>
//                       <TextField
//                         fullWidth
//                         size="small"
//                         type="number"
//                         name="quantity"
//                         label="Quantity"
//                         value={currentService?.quantity || 1}
//                         onChange={(event) => handleServiceChange(services.length - 1, event)}
//                         required={!isEditMode}
//                         inputProps={{ min: "1" }}
//                       />
//                     </Box>

//                     {/* Add Button */}
//                     <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
//                       <Button
//                         variant="contained"
//                         color="info"
//                         onClick={handleAddService}
//                         startIcon={<Add />}
//                         size="small"
//                         sx={{ height: 40 }}
//                         disabled={!currentService?.serviceName || !currentService?.serviceRate}
//                       >
//                         Add Service
//                       </Button>
//                     </Box>
//                   </Box>

//                   {/* Display total for current service */}
//                   {currentService?.serviceRate > 0 && currentService?.quantity > 0 && (
//                     <Box sx={{ 
//                       mt: 2, 
//                       p: 1.5, 
//                       bgcolor: 'info.light', 
//                       borderRadius: 1,
//                     }}>
//                       <Typography variant="body2" color="white" fontWeight={500}>
//                         Total: Rs. {(currentService.serviceRate * currentService.quantity).toFixed(2)}
//                       </Typography>
//                     </Box>
//                   )}
//                 </Paper>
//               </Box>

//               {/* Display Completed Services */}
//               {completedServices.length > 0 && (
//                 <Box sx={{ mt: 3 }}>
//                   <Typography variant="subtitle2" color="text.secondary" gutterBottom>
//                     Added Services ({completedServices.length})
//                   </Typography>
//                   {completedServices.map((service, index) => (
//                     <ServiceCard key={index}>
//                       <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
//                         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
//                           <Box sx={{ flex: 1 }}>
//                             <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
//                               <Typography variant="subtitle1" fontWeight={600} color="info.main">
//                                 {service.serviceName}
//                               </Typography>
//                               <Chip 
//                                 label={`Qty: ${service.quantity}`} 
//                                 size="small" 
//                                 variant="outlined"
//                                 color="info"
//                               />
//                               <Chip 
//                                 label={`Rate: Rs. ${service.serviceRate}`} 
//                                 size="small" 
//                                 variant="outlined"
//                               />
//                               <Chip 
//                                 label={`Total: Rs. ${(service.serviceRate * service.quantity).toFixed(2)}`} 
//                                 size="small" 
//                                 color="info"
//                               />
//                             </Box>
//                             {service.serviceDescription && (
//                               <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
//                                 <strong>Description:</strong> {service.serviceDescription}
//                               </Typography>
//                             )}
//                           </Box>
//                           <IconButton
//                             onClick={() => handleRemoveService(index)}
//                             color="error"
//                             size="small"
//                             sx={{ ml: 1 }}
//                           >
//                             <Delete fontSize="small" />
//                           </IconButton>
//                         </Box>
//                       </CardContent>
//                     </ServiceCard>
//                   ))}
                  
//                   {/* Services Total */}
//                   {totalServicesAmount > 0 && (
//                     <Box sx={{ mt: 2, textAlign: 'right' }}>
//                       <Typography variant="subtitle1" color="info.main" fontWeight={600}>
//                         Services Total: Rs. {totalServicesAmount.toFixed(2)}
//                       </Typography>
//                     </Box>
//                   )}
//                 </Box>
//               )}
//             </Box>

//             <Box sx={{ mb: 3 }}>
//               <Typography variant="h6" gutterBottom>
//                 Doctor's Remarks
//               </Typography>
//               <TextField
//                 fullWidth
//                 id="MTD_REMARKS"
//                 name="MTD_REMARKS"
//                 value={formData.MTD_REMARKS}
//                 onChange={handleFormChange}
//                 placeholder="Enter doctor remarks for the patient"
//                 required
//                 multiline
//                 rows={3}
//                 variant="outlined"
//               />
//             </Box>

//             {/* Treatment Amount */}
//             <Box sx={{ mb: 4 }}>
//               <Typography variant="h6" gutterBottom>
//                 Treatment Amount
//               </Typography>
//               <TextField
//                 fullWidth
//                 type="number"
//                 id="MTD_AMOUNT"
//                 name="MTD_AMOUNT"
//                 label="Consultation/Procedure Amount"
//                 value={formData.MTD_AMOUNT}
//                 onChange={handleFormChange}
//                 placeholder="Enter treatment amount"
//                 required
//                 inputProps={{ min: "1" }}
//                 InputProps={{
//                   startAdornment: (
//                     <MonetizationOn color="action" sx={{ mr: 1, color: "primary.main" }} />
//                   ),
//                 }}
//               />
//             </Box>

//             {/* Grand Total */}
//             <Box sx={{ mb: 4, p: 2, bgcolor: 'success.light', borderRadius: 2 }}>
//               <Typography variant="h5" color="white" fontWeight={600} align="right">
//                 Grand Total: Rs. {totalAmount.toFixed(2)}
//               </Typography>
//             </Box>

//             <Box sx={{ display: "flex", justifyContent: "center" }}>
//               <Button
//                 type="submit"
//                 variant="contained"
//                 color="primary"
//                 size="large"
//                 disabled={!(role === "Admin" || role === "Doc") || loading}
//                 startIcon={
//                   loading ? (
//                     <CircularProgress size={20} color="inherit" />
//                   ) : (
//                     <Description />
//                   )
//                 }
//                 sx={{ py: 1.5, px: 4, width: { xs: "100%", sm: 300 } }}
//               >
//                 {isEditMode ? "Update Treatment" : "Submit Treatment"}
//               </Button>
//             </Box>
//           </form>
//         </StyledPaper>
//       </Box>

//       <Dialog open={isModalOpen} onClose={closeModal}>
//         <DialogTitle>
//           {modalContent.includes("Error") ? "Error" : "Success"}
//         </DialogTitle>
//         <DialogContent>
//           <Typography>{modalContent}</Typography>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={closeModal} color="primary">
//             Close
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Container>
//   );
// };

// export default AddRecord;


import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Grid,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Divider,
  Chip,
  Avatar,
  Snackbar,
  Alert,
  Card,
  CardContent,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  ArrowBack,
  Add,
  Delete,
  MedicalServices,
  Healing,
  Description,
  MonetizationOn,
  Warning,
  Inventory,
  Biotech,
  ExpandMore,
  History,
  CalendarToday,
  Person,
  Note,
  Info,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(2),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[3],
}));

const PrescriptionCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.grey[50],
  border: `1px solid ${theme.palette.divider}`,
  '&:hover': {
    borderColor: theme.palette.primary.main,
  },
}));

const ServiceCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.info.light + '20',
  border: `1px solid ${theme.palette.info.main}`,
  '&:hover': {
    borderColor: theme.palette.info.dark,
  },
}));

const StockWarningChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.warning.light,
  color: theme.palette.warning.contrastText,
  fontWeight: 500,
}));

const SectionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(2),
  padding: theme.spacing(1),
  backgroundColor: theme.palette.primary.light + '20',
  borderRadius: theme.shape.borderRadius,
}));

const HistoryCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderLeft: `4px solid ${theme.palette.primary.main}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateX(4px)',
    boxShadow: theme.shadows[4],
  },
}));

const AddRecord = () => {
  const { patientId } = useParams();
  const Name = localStorage.getItem("Name");
  const location = useLocation();
  const { appoinmentid } = location.state || {};
  const { channelnumber } = location.state || {};
  const { MTD_APPOINMENT_ID } = location.state || {};
  const [searchResults, setSearchResults] = useState([]);
  const [patientError, setPatientError] = useState("");
  const [patientdetails, setPatientdetails] = useState(null);
  const serialNumber = location.state?.serialNumber || null;
  const [isEditMode, setIsEditMode] = useState(false);
  const role = localStorage.getItem("Role");
  const [activePrescriptionIndex, setActivePrescriptionIndex] = useState(null);
  const [activeServiceIndex, setActiveServiceIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [treatmentHistory, setTreatmentHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [stockWarning, setStockWarning] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [currentSearchType, setCurrentSearchType] = useState("drug");

  // Function to get numeric value for how to take selection
  const getHowToTakeValue = (takesText, customValue) => {
    if (takesText === "other") {
      return parseFloat(customValue) || 0;
    }
    
    switch (takesText) {
      case "Twice a Day before food":
      case "Twice a Day after food":
        return 2;
      case "Three times per day before food":
      case "Three times per day after food":
        return 3;
      default:
        return 1;
    }
  };

  // Function to calculate quantity
  const calculateQuantity = (prescription) => {
    const howToTakeValue = getHowToTakeValue(
      prescription.MDD_TAKES,
      prescription.MDD_TAKES_CUSTOM
    );
    const dailyDose = parseFloat(prescription.MDD_DAILY_DOSE) || 0;
    const days = parseFloat(prescription.MDD_DAYS) || 0;
    
    return (howToTakeValue * dailyDose * days).toString();
  };

  // Function to check stock availability
  const checkStockAvailability = (prescription) => {
    if (prescription.MMC_CURRENT_STOCK && prescription.MDD_QUANTITY) {
      const requiredQty = parseFloat(prescription.MDD_QUANTITY) || 0;
      const currentStock = parseFloat(prescription.MMC_CURRENT_STOCK) || 0;
      
      if (requiredQty > currentStock) {
        return {
          isAvailable: false,
          message: `Insufficient stock! Available: ${currentStock} units, Required: ${requiredQty} units`
        };
      }
      return {
        isAvailable: true,
        message: `Stock available: ${currentStock} units`
      };
    }
    return null;
  };

  const [prescriptions, setPrescriptions] = useState([
    {
      MDD_MATERIAL_CODE: "",
      MDD_MATERIAL_NAME: "",
      MDD_DOSAGE: "",
      MDD_DAILY_DOSE: "",
      MDD_DAYS: "",
      MDD_TAKES: "",
      MDD_TAKES_CUSTOM: "",
      MDD_QUANTITY: "",
      MMC_RATE: 0,
      MMC_CURRENT_STOCK: 0,
      type: "drug",
    },
  ]);

  const [services, setServices] = useState([
    {
      serviceCode: "",
      serviceName: "",
      serviceDescription: "",
      serviceRate: 0,
      quantity: 1,
      type: "service",
    },
  ]);

  const [formData, setFormData] = useState({
    MTD_PATIENT_CODE: patientId,
    MTD_DATE: new Date().toISOString(),
    MTD_TYPE: "",
    MTD_DOCTOR: Name || "",
    MTD_COMPLAIN: "",
    MTD_DIAGNOSTICS: "",
    MTD_REMARKS: "",
    MTD_AMOUNT: "",
    MTD_PAYMENT_STATUS: "",
    MTD_TREATMENT_STATUS: "C",
    MTD_SMS_STATUS: "",
    MTD_SMS: "",
    MTD_MEDICAL_STATUS: "",
    MTD_STATUS: "",
    MTD_CREATED_BY: Name || "",
    MTD_CREATED_DATE: new Date().toISOString(),
    MTD_UPDATED_BY: "",
    MTD_CHANNEL_NO: channelnumber || null,
    MTD_UPDATED_DATE: null,
    MTD_APPOINMENT_ID: MTD_APPOINMENT_ID || appoinmentid || null,
  });

  // Fetch patient's treatment history
  const fetchTreatmentHistory = async () => {
    if (!patientId) return;
    
    setHistoryLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/Treatment/patient/${patientId}`
      );
      
      if (Array.isArray(response.data)) {
        const sortedTreatments = response.data
          .filter(treatment => !serialNumber || treatment.MTD_SERIAL_NO !== parseInt(serialNumber))
          .sort((a, b) => new Date(b.MTD_CREATED_DATE || b.MTD_DATE) - new Date(a.MTD_CREATED_DATE || a.MTD_DATE));
        
        setTreatmentHistory(sortedTreatments);
      } else {
        setTreatmentHistory([]);
      }
    } catch (error) {
      console.error("Error fetching treatment history:", error);
      if (error.response && error.response.status !== 404) {
        setSnackbarMessage("Error loading treatment history");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
      setTreatmentHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value, id } = e.target;
    const fieldName = name || id;

    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  // Drug related handlers
  const handlePrescriptionChange = (index, event) => {
    const { name, value } = event.target;
    const values = [...prescriptions];

    if (name === "MDD_TAKES") {
      values[index][name] = value;
      if (value !== "other") {
        values[index].MDD_TAKES_CUSTOM = "";
      }
    } else if (name === "MDD_TAKES_CUSTOM") {
      values[index][name] = value;
    } else {
      values[index][name] = value;
    }

    if (["MDD_TAKES", "MDD_TAKES_CUSTOM", "MDD_DAILY_DOSE", "MDD_DAYS"].includes(name)) {
      if (
        values[index].MDD_TAKES && 
        values[index].MDD_DAILY_DOSE && 
        values[index].MDD_DAYS &&
        (values[index].MDD_TAKES !== "other" || values[index].MDD_TAKES_CUSTOM)
      ) {
        values[index].MDD_QUANTITY = calculateQuantity(values[index]);
        
        const stockCheck = checkStockAvailability(values[index]);
        if (stockCheck && !stockCheck.isAvailable) {
          setStockWarning(stockCheck.message);
          setSnackbarMessage(stockCheck.message);
          setSnackbarSeverity("warning");
          setSnackbarOpen(true);
        } else {
          setStockWarning("");
        }
      }
    }

    setPrescriptions(values);
  };

  const handleAddPrescription = () => {
    const currentIndex = prescriptions.length - 1;
    const currentPrescription = prescriptions[currentIndex];
    
    const stockCheck = checkStockAvailability(currentPrescription);
    if (stockCheck && !stockCheck.isAvailable) {
      setSnackbarMessage(`Cannot add: ${stockCheck.message}`);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    if (
      currentPrescription.MDD_MATERIAL_NAME &&
      currentPrescription.MDD_TAKES &&
      (currentPrescription.MDD_TAKES !== "other" || currentPrescription.MDD_TAKES_CUSTOM) &&
      currentPrescription.MDD_DAILY_DOSE &&
      currentPrescription.MDD_DAYS
    ) {
      setPrescriptions([
        ...prescriptions,
        {
          MDD_MATERIAL_CODE: "",
          MDD_MATERIAL_NAME: "",
          MDD_DOSAGE: "",
          MDD_DAILY_DOSE: "",
          MDD_DAYS: "",
          MDD_TAKES: "",
          MDD_TAKES_CUSTOM: "",
          MDD_QUANTITY: "",
          MMC_RATE: 0,
          MMC_CURRENT_STOCK: 0,
          type: "drug",
        },
      ]);
      setStockWarning("");
      setSnackbarMessage("Drug added successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } else {
      setSnackbarMessage("Please fill in all required fields for the current prescription");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
    }
  };

  const handleRemovePrescription = (index) => {
    const values = [...prescriptions];
    values.splice(index, 1);
    setPrescriptions(values);
  };

  // Service related handlers
  const handleServiceChange = (index, event) => {
    const { name, value } = event.target;
    const values = [...services];
    values[index][name] = value;
    
    // When manually typing service name, also set the service code to the same value
    if (name === "serviceName") {
      values[index].serviceCode = value;
    }
    
    setServices(values);
  };

  const handleAddService = () => {
    const currentIndex = services.length - 1;
    const currentService = services[currentIndex];

    if (
      currentService.serviceName &&
      currentService.serviceRate > 0
    ) {
      setServices([
        ...services,
        {
          serviceCode: "",
          serviceName: "",
          serviceDescription: "",
          serviceRate: 0,
          quantity: 1,
          type: "service",
        },
      ]);
      setSnackbarMessage("Service added successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } else {
      setSnackbarMessage("Please fill in service name and rate");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
    }
  };

  const handleRemoveService = (index) => {
    const values = [...services];
    values.splice(index, 1);
    setServices(values);
  };

  // UNIFIED SEARCH FUNCTION - Uses Material API for BOTH drugs and services
  const handleUnifiedSearch = async (query, type) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    try {
      // Use the SAME Material API for both drugs and services
      const endpoint = `${process.env.REACT_APP_API_BASE_URL}/Material/search?query=${encodeURIComponent(query)}`;
      
      console.log(`Searching with query:`, query);
      const response = await axios.get(endpoint);
      console.log("Search response:", response.data);
      
      // Handle different response structures
      let resultsList = [];
      if (Array.isArray(response.data)) {
        resultsList = response.data;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        resultsList = response.data.data;
      } else if (response.data.materials && Array.isArray(response.data.materials)) {
        resultsList = response.data.materials;
      }
      
      // Filter results for services if needed (you can add logic here based on your data structure)
      // For now, we'll show all results for both
      setSearchResults(resultsList);
      
      if (resultsList.length === 0) {
        console.log(`No ${type} found for query:`, query);
      }
    } catch (error) {
      console.error(`Error fetching data:`, error);
      setSnackbarMessage(`Error searching. Please try again.`);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // Handler for drug search - Uses Material API
  const handleDrugSearchChange = async (index, event) => {
    const query = event.target.value;
    const values = [...prescriptions];
    values[index].MDD_MATERIAL_NAME = query;
    setPrescriptions(values);
    
    setCurrentSearchType("drug");
    await handleUnifiedSearch(query, "drug");
  };

  // Handler for service search - ALSO uses Material API
  const handleServiceSearchChange = async (index, event) => {
    const query = event.target.value;
    const values = [...services];
    values[index].serviceName = query;
    values[index].serviceCode = query; // Set service code to the same value as service name
    setServices(values);
    
    setCurrentSearchType("service");
    await handleUnifiedSearch(query, "service");
  };

  // Handler for selecting medicine from search results
  const handleSelectMedicine = (index, materialCode, materialName, rate, currentStock) => {
    const values = [...prescriptions];
    values[index].MDD_MATERIAL_CODE = materialCode;
    values[index].MDD_MATERIAL_NAME = materialName;
    values[index].MMC_RATE = rate;
    values[index].MMC_CURRENT_STOCK = currentStock;
    setSearchResults([]);
    setPrescriptions(values);
    setActivePrescriptionIndex(null);
    
    setSnackbarMessage(`Drug "${materialName}" selected successfully!`);
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  // Handler for selecting service from search results
  const handleSelectService = (index, materialCode, serviceName, serviceDescription, serviceRate) => {
    const values = [...services];
    values[index].serviceCode = materialCode; // Store the actual material code
    values[index].serviceName = serviceName;
    values[index].serviceDescription = serviceDescription || "";
    values[index].serviceRate = serviceRate;
    setSearchResults([]);
    setServices(values);
    setActiveServiceIndex(null);
    
    setSnackbarMessage(`Service "${serviceName}" selected successfully!`);
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  // Fetch patient details and treatment history
  useEffect(() => {
    window.scrollTo(0, 0);
    
    fetchTreatmentHistory();
    
    const fetchExistingData = async () => {
      if (serialNumber) {
        setIsEditMode(true);

        try {
          const treatmentResponse = await axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/Treatment/patientdetail/treatmentdetail/${patientId}/${serialNumber}`
          );
          const treatmentData = treatmentResponse.data;

          setFormData((prevData) => ({
            ...prevData,
            ...treatmentData,
            MTD_TREATMENT_STATUS: "C",
          }));

          try {
            const itemsResponse = await axios.get(
              `${process.env.REACT_APP_API_BASE_URL}/Drug/${serialNumber}`
            );
            if (Array.isArray(itemsResponse.data) && itemsResponse.data.length > 0) {
              const drugs = itemsResponse.data
                .filter(item => item.MDD_TYPE === "drug")
                .map(item => ({
                  ...item,
                  type: "drug"
                }));
              
              const servicesItems = itemsResponse.data
                .filter(item => item.MDD_TYPE === "service")
                .map(item => ({
                  serviceCode: item.MDD_MATERIAL_CODE,
                  serviceName: item.MDD_MATERIAL_CODE,
                  serviceDescription: item.MDD_DOSAGE,
                  serviceRate: item.MDD_RATE,
                  quantity: item.MDD_QUANTITY,
                  type: "service"
                }));
              
              setPrescriptions([...drugs, {
                MDD_MATERIAL_CODE: "",
                MDD_MATERIAL_NAME: "",
                MDD_DOSAGE: "",
                MDD_DAILY_DOSE: "",
                MDD_DAYS: "",
                MDD_TAKES: "",
                MDD_TAKES_CUSTOM: "",
                MDD_QUANTITY: "",
                MMC_RATE: 0,
                MMC_CURRENT_STOCK: 0,
                type: "drug",
              }]);
              
              setServices([...servicesItems, {
                serviceCode: "",
                serviceName: "",
                serviceDescription: "",
                serviceRate: 0,
                quantity: 1,
                type: "service",
              }]);
            }
          } catch (error) {
            console.log("No items found for this treatment");
          }

          setPatientdetails(treatmentData.patientdetails);
        } catch (error) {
          console.error("Error fetching data:", error);
          setPatientError("Unable to load patient details.");
        }
      }
    };

    fetchExistingData();
  }, [serialNumber, patientId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Check if at least one of the required fields is filled
    const hasComplain = formData.MTD_COMPLAIN?.trim();
    const hasDiagnosis = formData.MTD_DIAGNOSTICS?.trim();
    const hasRemarks = formData.MTD_REMARKS?.trim();
    const hasAmount = formData.MTD_AMOUNT?.trim();

    if (!hasComplain && !hasDiagnosis && !hasRemarks && !hasAmount) {
      setSnackbarMessage("Please fill in at least one of: Complaint, Diagnosis, Remarks, or Amount");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      setLoading(false);
      return;
    }

    // Check stock for all prescriptions before submitting (only for drugs)
    for (const prescription of prescriptions) {
      if (prescription.MDD_MATERIAL_CODE && prescription.type === "drug") {
        const stockCheck = checkStockAvailability(prescription);
        if (stockCheck && !stockCheck.isAvailable) {
          setSnackbarMessage(`Stock issue: ${stockCheck.message}`);
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
          setLoading(false);
          return;
        }
      }
    }

    // Filter out empty prescriptions (drugs) - only include if they have material code
    const validPrescriptions = prescriptions.filter(
      (prescription) => prescription.MDD_MATERIAL_CODE && prescription.type === "drug"
    );

    // Filter out empty services - include if they have service name and rate
    const validServices = services.filter(
      (service) => service.serviceName && service.serviceRate > 0 && service.type === "service"
    );

    console.log("Valid Drugs:", validPrescriptions);
    console.log("Valid Services:", validServices);

    // Allow saving even if no drugs or services are present, as long as other fields are filled
    try {
      if (isEditMode) {
        // Prepare drugs with MDD_TYPE "drug"
        const preparedDrugs = validPrescriptions.map((prescription) => ({
          MDD_MATERIAL_CODE: prescription.MDD_MATERIAL_CODE,
          MDD_QUANTITY: parseInt(prescription.MDD_QUANTITY) || 0,
          MDD_RATE: prescription.MMC_RATE || prescription.MDD_RATE || 0,
          MDD_AMOUNT: (parseFloat(prescription.MMC_RATE || 0) * (parseInt(prescription.MDD_QUANTITY) || 0)),
          MDD_DOSAGE: prescription.MDD_DOSAGE || "",
          MDD_DAILY_DOSE: prescription.MDD_DAILY_DOSE,
          MDD_DAYS: prescription.MDD_DAYS,
          MDD_TAKES: prescription.MDD_TAKES === "other"
            ? prescription.MDD_TAKES_CUSTOM
            : prescription.MDD_TAKES,
          MDD_GIVEN_QUANTITY: 0,
          MDD_STATUS: "A",
          MDD_TYPE: "drug"
        }));

        // Prepare services with MDD_TYPE "service" - use service name as material code if serviceCode is empty
        const preparedServices = validServices.map((service) => ({
          MDD_MATERIAL_CODE: service.serviceCode || service.serviceName, // Use serviceCode if available, otherwise use serviceName
          MDD_QUANTITY: parseInt(service.quantity) || 1,
          MDD_RATE: parseFloat(service.serviceRate) || 0,
          MDD_AMOUNT: (parseFloat(service.serviceRate) || 0) * (parseInt(service.quantity) || 1),
          MDD_DOSAGE: service.serviceDescription || "",
          MDD_DAILY_DOSE: 0,
          MDD_DAYS: 0,
          MDD_TAKES: "",
          MDD_GIVEN_QUANTITY: 0,
          MDD_STATUS: "A",
          MDD_TYPE: "service"
        }));

        const allItems = [...preparedDrugs, ...preparedServices];

        console.log("All items being sent:", allItems);

        const updatePayload = {
          Treatment: {
            MTD_DOCTOR: formData.MTD_DOCTOR,
            MTD_TYPE: formData.MTD_TYPE,
            MTD_COMPLAIN: formData.MTD_COMPLAIN,
            MTD_DIAGNOSTICS: formData.MTD_DIAGNOSTICS,
            MTD_REMARKS: formData.MTD_REMARKS,
            MTD_AMOUNT: formData.MTD_AMOUNT,
            MTD_UPDATED_BY: Name,
            MTD_TREATMENT_STATUS: "C",
          },
          Drugs: allItems,
        };

        const response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/Treatment/updatingtreatment/${patientId}/${serialNumber}`,
          updatePayload
        );

        if (response.status === 200) {
          setSnackbarMessage("Treatment updated successfully!");
          setSnackbarSeverity("success");
          setSnackbarOpen(true);
          setTimeout(() => {
            navigate(-1);
          }, 1500);
        } else {
          setSnackbarMessage("Failed to update treatment.");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        }
      } else {
        // Create new treatment
        const treatmentResponse = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/Treatment`,
          {
            ...formData,
            MTD_APPOINMENT_ID: formData.MTD_APPOINMENT_ID || null,
            MTD_TREATMENT_STATUS: "C"
          }
        );
        
        const serial_no = treatmentResponse.data.MTD_SERIAL_NO || treatmentResponse.data.serialNo;

        // Prepare drugs with MDD_TYPE "drug"
        const preparedDrugs = validPrescriptions.map((prescription) => ({
          MDD_PATIENT_CODE: patientId,
          MDD_SERIAL_NO: serial_no,
          MDD_MATERIAL_CODE: prescription.MDD_MATERIAL_CODE,
          MDD_QUANTITY: parseInt(prescription.MDD_QUANTITY) || 0,
          MDD_RATE: prescription.MMC_RATE || prescription.MDD_RATE || 0,
          MDD_AMOUNT: (parseFloat(prescription.MMC_RATE || 0) * (parseInt(prescription.MDD_QUANTITY) || 0)),
          MDD_DOSAGE: prescription.MDD_DOSAGE || "",
          MDD_TAKES: prescription.MDD_TAKES === "other"
            ? prescription.MDD_TAKES_CUSTOM
            : prescription.MDD_TAKES,
          MDD_GIVEN_QUANTITY: 0,
          MDD_STATUS: "A",
          MDD_CREATED_BY: formData.MTD_CREATED_BY,
          MDD_CREATED_DATE: new Date().toISOString(),
          MDD_UPDATED_BY: "",
          MDD_UPDATED_DATE: null,
          MDD_DAYS: parseInt(prescription.MDD_DAYS) || 0,
          MDD_DAILY_DOSE: parseFloat(prescription.MDD_DAILY_DOSE) || 0,
          MDD_TYPE: "drug"
        }));

        // Prepare services with MDD_TYPE "service" - use service name as material code if serviceCode is empty
        const preparedServices = validServices.map((service) => ({
          MDD_PATIENT_CODE: patientId,
          MDD_SERIAL_NO: serial_no,
          MDD_MATERIAL_CODE: service.serviceCode || service.serviceName, // Use serviceCode if available, otherwise use serviceName
          MDD_QUANTITY: parseInt(service.quantity) || 1,
          MDD_RATE: parseFloat(service.serviceRate) || 0,
          MDD_AMOUNT: (parseFloat(service.serviceRate) || 0) * (parseInt(service.quantity) || 1),
          MDD_DOSAGE: service.serviceDescription || "",
          MDD_TAKES: "",
          MDD_GIVEN_QUANTITY: 0,
          MDD_STATUS: "A",
          MDD_CREATED_BY: formData.MTD_CREATED_BY,
          MDD_CREATED_DATE: new Date().toISOString(),
          MDD_UPDATED_BY: "",
          MDD_UPDATED_DATE: null,
          MDD_DAYS: 0,
          MDD_DAILY_DOSE: 0,
          MDD_TYPE: "service"
        }));

        const allItems = [...preparedDrugs, ...preparedServices];

        console.log("All items being sent:", allItems);

        // Submit all items (can be empty array if no drugs/services)
        if (allItems.length > 0) {
          const submitPromises = allItems.map(item => {
            console.log(`Submitting ${item.MDD_TYPE}:`, item);
            return axios.post(
              `${process.env.REACT_APP_API_BASE_URL}/Drug`,
              item
            );
          });

          await Promise.all(submitPromises);
        }

        navigate(`/dashboard/view-record/${patientId}/${serial_no}`);
      }
    } catch (error) {
      console.error(
        "Error submitting record:",
        error.response?.data || error.message
      );
      setSnackbarMessage(error.response?.data?.message || "Error submitting treatment and prescription details.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const completedPrescriptions = prescriptions.slice(0, -1);
  const currentPrescription = prescriptions[prescriptions.length - 1];
  const completedServices = services.slice(0, -1);
  const currentService = services[services.length - 1];
  const currentStockCheck = currentPrescription ? checkStockAvailability(currentPrescription) : null;

  const totalDrugsAmount = completedPrescriptions.reduce((sum, drug) => 
    sum + (parseFloat(drug.MDD_QUANTITY || 0) * parseFloat(drug.MMC_RATE || 0)), 0
  );
  
  const totalServicesAmount = completedServices.reduce((sum, service) => 
    sum + (parseFloat(service.serviceRate || 0) * parseFloat(service.quantity || 1)), 0
  );
  
  const totalAmount = totalDrugsAmount + totalServicesAmount + (parseFloat(formData.MTD_AMOUNT) || 0);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return "Invalid Date";
    }
  };

  return (
    <Container maxWidth="xl">
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Box sx={{ my: 2 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          variant="outlined"
          sx={{ mb: 2 }}
        >
          Back
        </Button>

        {/* Treatment History Section */}
        <StyledPaper elevation={3} sx={{ mb: 3 }}>
          <SectionHeader>
            <History sx={{ color: "primary.main" }} />
            <Typography variant="h6" color="primary.main">
              Patient Medical History
            </Typography>
          </SectionHeader>

          {historyLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
              <CircularProgress size={30} />
            </Box>
          ) : treatmentHistory.length > 0 ? (
            <Box>
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MedicalServices color="primary" />
                    <Typography variant="subtitle1" fontWeight={600}>
                      Previous Treatments ({treatmentHistory.length})
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ maxHeight: '400px', overflow: 'auto', pr: 1 }}>
                    {treatmentHistory.map((treatment, index) => (
                      <HistoryCard key={treatment.MTD_SERIAL_NO || index}>
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                            <Typography variant="subtitle1" fontWeight={600} color="primary">
                              Visit #{treatmentHistory.length - index}
                            </Typography>
                            <Chip
                              label={formatDate(treatment.MTD_CREATED_DATE || treatment.MTD_DATE)}
                              size="small"
                              icon={<CalendarToday />}
                              variant="outlined"
                            />
                          </Box>
                          
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                                <Note color="action" fontSize="small" />
                                <Typography variant="body2">
                                  <strong>Complaint:</strong> {treatment.MTD_COMPLAIN || 'N/A'}
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                                <Info color="action" fontSize="small" />
                                <Typography variant="body2">
                                  <strong>Diagnosis:</strong> {treatment.MTD_DIAGNOSTICS || 'N/A'}
                                </Typography>
                              </Box>
                            </Grid>
                          </Grid>

                          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                            <Person color="action" fontSize="small" />
                            <Typography variant="body2" color="text.secondary">
                              <strong>Doctor:</strong> {treatment.MTD_DOCTOR || 'N/A'}
                            </Typography>
                          </Box>

                          {treatment.MTD_REMARKS && (
                            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                              <Description color="action" fontSize="small" />
                              <Typography variant="body2" color="text.secondary">
                                <strong>Remarks:</strong> {treatment.MTD_REMARKS}
                              </Typography>
                            </Box>
                          )}

                          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => {
                                navigate(
                                  `/dashboard/view-record/${patientId}/${treatment.MTD_SERIAL_NO}`,
                                  { state: { fromHistory: true } }
                                );
                              }}
                            >
                              View Details
                            </Button>
                          </Box>
                        </CardContent>
                      </HistoryCard>
                    ))}
                  </Box>
                </AccordionDetails>
              </Accordion>
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <Typography variant="body1" color="text.secondary">
                No previous treatment history available for this patient
              </Typography>
            </Box>
          )}
        </StyledPaper>

        <StyledPaper elevation={3}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 2,
              justifyContent: "center",
            }}
          >
            <MedicalServices color="primary" sx={{ fontSize: 40, mr: 2 }} />
            <Typography
              variant="h4"
              color="primary"
              fontWeight={600}
              gutterBottom
            >
              {isEditMode ? "Edit Treatment Details" : "Add Treatment Details"}
            </Typography>
          </Box>

          {channelnumber && (
            <Box sx={{ textAlign: "center", mb: 3 }}>
              <Chip
                label={`Channel Number: ${channelnumber}`}
                color="primary"
                variant="outlined"
                avatar={<Avatar>#</Avatar>}
              />
            </Box>
          )}

          <Typography
            variant="subtitle1"
            color="text.secondary"
            gutterBottom
            sx={{ mb: 2, textAlign: "center", mt: -2 }}
          >
            Fill in the treatment and prescription information below.
          </Typography>

          <form onSubmit={handleSubmit}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Patient Complaint
              </Typography>
              <TextField
                fullWidth
                id="MTD_COMPLAIN"
                name="MTD_COMPLAIN"
                value={formData.MTD_COMPLAIN}
                onChange={handleFormChange}
                placeholder="Enter patient complaint"
                multiline
                rows={3}
                variant="outlined"
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Diagnosis
              </Typography>
              <TextField
                fullWidth
                id="MTD_DIAGNOSTICS"
                name="MTD_DIAGNOSTICS"
                value={formData.MTD_DIAGNOSTICS}
                onChange={handleFormChange}
                placeholder="Enter patient diagnosis details"
                multiline
                rows={3}
                variant="outlined"
              />
            </Box>

            {/* Unified Items Section - Drugs */}
            <Box sx={{ mb: 4 }}>
              <SectionHeader>
                <Healing sx={{ color: "primary.main" }} />
                <Typography variant="h6" color="primary.main">
                  Drug Prescriptions
                </Typography>
              </SectionHeader>
              
              {/* New Drug Entry Field */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Add New Drug
                </Typography>
                <Paper
                  elevation={2}
                  sx={{ p: 2, mb: 2, position: "relative", backgroundColor: 'background.paper' }}
                >
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "1fr",
                        md: "minmax(200px, 2fr) minmax(200px, 1.5fr) minmax(100px, 0.8fr) minmax(100px, 0.8fr) minmax(100px, 0.8fr) auto",
                      },
                      gap: 1.5,
                      alignItems: "flex-start",
                    }}
                  >
                    {/* Search Medicine - Using Material API */}
                    <Box sx={{ minWidth: 0, position: "relative" }}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Search Medicine"
                        name="MDD_MATERIAL_NAME"
                        value={currentPrescription?.MDD_MATERIAL_NAME || ""}
                        onChange={(event) => handleDrugSearchChange(prescriptions.length - 1, event)}
                        onFocus={() => {
                          setActivePrescriptionIndex(prescriptions.length - 1);
                          setCurrentSearchType("drug");
                        }}
                        InputProps={{
                          endAdornment: searchLoading && currentSearchType === "drug" ? (
                            <CircularProgress size={20} />
                          ) : null,
                        }}
                      />
                      {activePrescriptionIndex === prescriptions.length - 1 &&
                        searchResults.length > 0 &&
                        currentSearchType === "drug" && (
                          <Paper
                            elevation={3}
                            sx={{
                              position: "absolute",
                              zIndex: 1,
                              width: "100%",
                              maxHeight: 200,
                              overflow: "auto",
                              mt: 0.5,
                            }}
                          >
                            <List dense>
                              {searchResults.map((medicine) => (
                                <ListItem
                                  key={medicine.MMC_MATERIAL_CODE}
                                  component="li"
                                  onClick={() =>
                                    handleSelectMedicine(
                                      prescriptions.length - 1,
                                      medicine.MMC_MATERIAL_CODE,
                                      medicine.MMC_DESCRIPTION,
                                      medicine.MMC_RATE,
                                      medicine.MMC_CURRENT_STOCK
                                    )
                                  }
                                  sx={{ cursor: 'pointer' }}
                                >
                                  <ListItemText
                                    primary={medicine.MMC_DESCRIPTION}
                                    secondary={
                                      <>
                                        <Typography component="span" variant="body2" color="text.primary">
                                          Code: {medicine.MMC_MATERIAL_CODE}
                                        </Typography>
                                        <br />
                                        <Typography component="span" variant="body2" color={medicine.MMC_CURRENT_STOCK > 0 ? "success.main" : "error.main"}>
                                          Stock: {medicine.MMC_CURRENT_STOCK} units | Rate: Rs.{medicine.MMC_RATE}
                                        </Typography>
                                      </>
                                    }
                                  />
                                </ListItem>
                              ))}
                            </List>
                          </Paper>
                        )}
                      
                      {/* Display current stock if medicine selected */}
                      {currentPrescription?.MMC_CURRENT_STOCK > 0 && (
                        <Box sx={{ mt: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Inventory fontSize="small" color="primary" />
                          <Typography variant="caption" color="primary">
                            Current Stock: {currentPrescription.MMC_CURRENT_STOCK} units
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    {/* How to Take */}
                    <Box>
                      <FormControl fullWidth size="small">
                        <InputLabel>How to Take</InputLabel>
                        <Select
                          name="MDD_TAKES"
                          value={currentPrescription?.MDD_TAKES || ""}
                          onChange={(event) =>
                            handlePrescriptionChange(prescriptions.length - 1, event)
                          }
                          label="How to Take"
                        >
                          <MenuItem value="">
                            <em>Select</em>
                          </MenuItem>
                          <MenuItem value="Daily">Daily</MenuItem>
                          <MenuItem value="Twice a Day before food">
                            Twice a Day before food
                          </MenuItem>
                          <MenuItem value="Twice a Day after food">
                            Twice a Day after food
                          </MenuItem>
                          <MenuItem value="Three times per day before food">
                            Three times per day before food
                          </MenuItem>
                          <MenuItem value="Three times per day after food">
                            Three times per day after food
                          </MenuItem>
                          <MenuItem value="As Needed">As Needed</MenuItem>
                          <MenuItem value="other">Other</MenuItem>
                        </Select>
                      </FormControl>

                      {currentPrescription?.MDD_TAKES === "other" && (
                        <TextField
                          fullWidth
                          size="small"
                          type="number"
                          sx={{ mt: 1 }}
                          name="MDD_TAKES_CUSTOM"
                          label="Specify Times per Day"
                          value={currentPrescription?.MDD_TAKES_CUSTOM || ""}
                          onChange={(event) =>
                            handlePrescriptionChange(prescriptions.length - 1, event)
                          }
                          placeholder="Enter number (e.g., 2, 3, 4)"
                          inputProps={{ min: "1", step: "1" }}
                        />
                      )}
                    </Box>

                    {/* Daily Dose */}
                    <Box>
                      <TextField
                        fullWidth
                        size="small"
                        type="number"
                        name="MDD_DAILY_DOSE"
                        label="Daily Dose"
                        value={currentPrescription?.MDD_DAILY_DOSE || ""}
                        onChange={(event) => handlePrescriptionChange(prescriptions.length - 1, event)}
                        inputProps={{ min: "0.5", step: "0.5" }}
                      />
                    </Box>

                    {/* Days */}
                    <Box>
                      <TextField
                        fullWidth
                        size="small"
                        type="number"
                        name="MDD_DAYS"
                        label="Days"
                        value={currentPrescription?.MDD_DAYS || ""}
                        onChange={(event) => handlePrescriptionChange(prescriptions.length - 1, event)}
                        inputProps={{ min: "1" }}
                      />
                    </Box>

                    {/* Quantity (Calculated) */}
                    <Box>
                      <Tooltip title={currentStockCheck?.message || ""}>
                        <TextField
                          fullWidth
                          size="small"
                          type="number"
                          name="MDD_QUANTITY"
                          label="Qty"
                          value={currentPrescription?.MDD_QUANTITY || ""}
                          onChange={(event) =>
                            handlePrescriptionChange(prescriptions.length - 1, event)
                          }
                          inputProps={{ min: "1" }}
                          disabled
                          error={currentStockCheck && !currentStockCheck.isAvailable}
                          color={currentStockCheck?.isAvailable ? "success" : "primary"}
                        />
                      </Tooltip>
                    </Box>

                    {/* Add Button */}
                    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddPrescription}
                        startIcon={<Add />}
                        size="small"
                        sx={{ height: 40 }}
                        disabled={currentStockCheck && !currentStockCheck.isAvailable}
                      >
                        Add Drug
                      </Button>
                    </Box>
                  </Box>

                  {/* Display simplified calculation with units and price */}
                  {currentPrescription?.MDD_TAKES && 
                   currentPrescription?.MDD_DAILY_DOSE && 
                   currentPrescription?.MDD_DAYS && 
                   (currentPrescription.MDD_TAKES !== "other" || currentPrescription.MDD_TAKES_CUSTOM) && (
                    <Box sx={{ 
                      mt: 2, 
                      p: 1.5, 
                      bgcolor: currentStockCheck && !currentStockCheck.isAvailable ? 'warning.light' : 'primary.light', 
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="body2" color="white" fontWeight={500}>
                          Total Units: {currentPrescription.MDD_QUANTITY}
                        </Typography>
                        {currentPrescription.MMC_RATE > 0 && (
                          <>
                            <Typography variant="body2" color="white" fontWeight={500}>
                              |
                            </Typography>
                            <Typography variant="body2" color="white" fontWeight={500}>
                              Price: Rs. {(parseFloat(currentPrescription.MDD_QUANTITY || 0) * currentPrescription.MMC_RATE).toFixed(2)}
                            </Typography>
                          </>
                        )}
                      </Box>
                      {currentStockCheck && !currentStockCheck.isAvailable && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Warning fontSize="small" sx={{ color: 'white' }} />
                          <Typography variant="body2" color="white" fontWeight={500}>
                            Insufficient Stock!
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  )}
                </Paper>
              </Box>

              {/* Display Completed Drugs */}
              {completedPrescriptions.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Added Drugs ({completedPrescriptions.length})
                  </Typography>
                  {completedPrescriptions.map((prescription, index) => {
                    const stockCheck = checkStockAvailability(prescription);
                    
                    return (
                      <PrescriptionCard key={index}>
                        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Box sx={{ flex: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                                <Typography variant="subtitle1" fontWeight={600} color="primary">
                                  {prescription.MDD_MATERIAL_NAME}
                                </Typography>
                                <Chip 
                                  label={`Daily: ${prescription.MDD_DAILY_DOSE}`} 
                                  size="small" 
                                  variant="outlined"
                                />
                                <Chip 
                                  label={`Days: ${prescription.MDD_DAYS}`} 
                                  size="small" 
                                  variant="outlined"
                                />
                                <Chip 
                                  label={`Total: ${prescription.MDD_QUANTITY} units`} 
                                  size="small" 
                                  color="primary"
                                  variant="outlined"
                                />
                                {prescription.MMC_RATE > 0 && (
                                  <Chip 
                                    label={`Rs. ${(parseFloat(prescription.MDD_QUANTITY || 0) * prescription.MMC_RATE).toFixed(2)}`}
                                    size="small" 
                                    color="secondary"
                                    variant="outlined"
                                  />
                                )}
                              </Box>
                              <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                                <Typography variant="body2" color="text.secondary">
                                  <strong>How to take:</strong> {prescription.MDD_TAKES === "other" ? `${prescription.MDD_TAKES_CUSTOM} times per day` : prescription.MDD_TAKES}
                                </Typography>
                                {prescription.MMC_CURRENT_STOCK > 0 && (
                                  <Typography variant="body2" color={stockCheck?.isAvailable ? "success.main" : "error.main"}>
                                    <Inventory fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                                    Stock: {prescription.MMC_CURRENT_STOCK} units
                                  </Typography>
                                )}
                              </Box>
                              {!stockCheck?.isAvailable && (
                                <StockWarningChip
                                  icon={<Warning />}
                                  label={stockCheck?.message}
                                  size="small"
                                  sx={{ mt: 1 }}
                                />
                              )}
                            </Box>
                            <IconButton
                              onClick={() => handleRemovePrescription(index)}
                              color="error"
                              size="small"
                              sx={{ ml: 1 }}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Box>
                        </CardContent>
                      </PrescriptionCard>
                    );
                  })}
                  
                  {/* Drugs Total */}
                  {totalDrugsAmount > 0 && (
                    <Box sx={{ mt: 2, textAlign: 'right' }}>
                      <Typography variant="subtitle1" color="primary.main" fontWeight={600}>
                        Drugs Total: Rs. {totalDrugsAmount.toFixed(2)}
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}
            </Box>

            {/* Unified Items Section - Services */}
            <Box sx={{ mb: 4 }}>
              <SectionHeader>
                <Biotech sx={{ color: "info.main" }} />
                <Typography variant="h6" color="info.main">
                  Services
                </Typography>
              </SectionHeader>
              
              {/* New Service Entry Field */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Add New Service
                </Typography>
                <Paper
                  elevation={2}
                  sx={{ p: 2, mb: 2, position: "relative", backgroundColor: 'background.paper' }}
                >
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "1fr",
                        md: "minmax(200px, 2fr) minmax(150px, 1fr) minmax(100px, 0.8fr) auto",
                      },
                      gap: 1.5,
                      alignItems: "flex-start",
                    }}
                  >
                    {/* Search Service - Using SAME Material API */}
                    <Box sx={{ minWidth: 0, position: "relative" }}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Search Service"
                        name="serviceName"
                        value={currentService?.serviceName || ""}
                        onChange={(event) => handleServiceSearchChange(services.length - 1, event)}
                        onFocus={() => {
                          setActiveServiceIndex(services.length - 1);
                          setCurrentSearchType("service");
                        }}
                        InputProps={{
                          endAdornment: searchLoading && currentSearchType === "service" ? (
                            <CircularProgress size={20} />
                          ) : null,
                        }}
                      />
                      {activeServiceIndex === services.length - 1 &&
                        searchResults.length > 0 &&
                        currentSearchType === "service" && (
                          <Paper
                            elevation={3}
                            sx={{
                              position: "absolute",
                              zIndex: 1,
                              width: "100%",
                              maxHeight: 200,
                              overflow: "auto",
                              mt: 0.5,
                            }}
                          >
                            <List dense>
                              {searchResults.map((item, idx) => (
                                <ListItem
                                  key={item.MMC_MATERIAL_CODE || idx}
                                  component="li"
                                  onClick={() =>
                                    handleSelectService(
                                      services.length - 1,
                                      item.MMC_MATERIAL_CODE,
                                      item.MMC_DESCRIPTION,
                                      item.MMC_DOSAGE || "",
                                      item.MMC_RATE
                                    )
                                  }
                                  sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
                                >
                                  <ListItemText
                                    primary={item.MMC_DESCRIPTION}
                                    secondary={
                                      <>
                                        <Typography component="span" variant="body2" color="text.primary">
                                          Code: {item.MMC_MATERIAL_CODE}
                                        </Typography>
                                        <br />
                                        <Typography component="span" variant="body2" color="success.main">
                                          Rate: Rs.{item.MMC_RATE}
                                        </Typography>
                                        {item.MMC_CURRENT_STOCK !== undefined && (
                                          <>
                                            <br />
                                            <Typography component="span" variant="body2" color={item.MMC_CURRENT_STOCK > 0 ? "success.main" : "error.main"}>
                                              Stock: {item.MMC_CURRENT_STOCK} units
                                            </Typography>
                                          </>
                                        )}
                                      </>
                                    }
                                  />
                                </ListItem>
                              ))}
                            </List>
                          </Paper>
                        )}
                      
                      {/* Show no results message */}
                      {activeServiceIndex === services.length - 1 &&
                        currentService?.serviceName &&
                        currentService.serviceName.length > 2 &&
                        searchResults.length === 0 &&
                        !searchLoading &&
                        currentSearchType === "service" && (
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                              No services found. You can still add manually by typing the name and rate.
                            </Typography>
                          </Box>
                        )}
                    </Box>

                    {/* Service Rate */}
                    <Box>
                      <TextField
                        fullWidth
                        size="small"
                        type="number"
                        name="serviceRate"
                        label="Rate (Rs.)"
                        value={currentService?.serviceRate || ""}
                        onChange={(event) => handleServiceChange(services.length - 1, event)}
                        inputProps={{ min: "0", step: "0.01" }}
                      />
                    </Box>

                    {/* Quantity */}
                    <Box>
                      <TextField
                        fullWidth
                        size="small"
                        type="number"
                        name="quantity"
                        label="Quantity"
                        value={currentService?.quantity || 1}
                        onChange={(event) => handleServiceChange(services.length - 1, event)}
                        inputProps={{ min: "1" }}
                      />
                    </Box>

                    {/* Add Button */}
                    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                      <Button
                        variant="contained"
                        color="info"
                        onClick={handleAddService}
                        startIcon={<Add />}
                        size="small"
                        sx={{ height: 40 }}
                        disabled={!currentService?.serviceName || !currentService?.serviceRate}
                      >
                        Add Service
                      </Button>
                    </Box>
                  </Box>

                  {/* Display total for current service */}
                  {currentService?.serviceRate > 0 && currentService?.quantity > 0 && (
                    <Box sx={{ 
                      mt: 2, 
                      p: 1.5, 
                      bgcolor: 'info.light', 
                      borderRadius: 1,
                    }}>
                      <Typography variant="body2" color="white" fontWeight={500}>
                        Total: Rs. {(currentService.serviceRate * currentService.quantity).toFixed(2)}
                      </Typography>
                    </Box>
                  )}
                </Paper>
              </Box>

              {/* Display Completed Services */}
              {completedServices.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Added Services ({completedServices.length})
                  </Typography>
                  {completedServices.map((service, index) => (
                    <ServiceCard key={index}>
                      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                              <Typography variant="subtitle1" fontWeight={600} color="info.main">
                                {service.serviceName}
                              </Typography>
                              <Chip 
                                label={`Qty: ${service.quantity}`} 
                                size="small" 
                                variant="outlined"
                                color="info"
                              />
                              <Chip 
                                label={`Rate: Rs. ${service.serviceRate}`} 
                                size="small" 
                                variant="outlined"
                              />
                              <Chip 
                                label={`Total: Rs. ${(service.serviceRate * service.quantity).toFixed(2)}`} 
                                size="small" 
                                color="info"
                              />
                            </Box>
                            {service.serviceDescription && (
                              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                <strong>Description:</strong> {service.serviceDescription}
                              </Typography>
                            )}
                          </Box>
                          <IconButton
                            onClick={() => handleRemoveService(index)}
                            color="error"
                            size="small"
                            sx={{ ml: 1 }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </ServiceCard>
                  ))}
                  
                  {/* Services Total */}
                  {totalServicesAmount > 0 && (
                    <Box sx={{ mt: 2, textAlign: 'right' }}>
                      <Typography variant="subtitle1" color="info.main" fontWeight={600}>
                        Services Total: Rs. {totalServicesAmount.toFixed(2)}
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Doctor's Remarks
              </Typography>
              <TextField
                fullWidth
                id="MTD_REMARKS"
                name="MTD_REMARKS"
                value={formData.MTD_REMARKS}
                onChange={handleFormChange}
                placeholder="Enter doctor remarks for the patient"
                multiline
                rows={3}
                variant="outlined"
              />
            </Box>

            {/* Treatment Amount */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Treatment Amount
              </Typography>
              <TextField
                fullWidth
                type="number"
                id="MTD_AMOUNT"
                name="MTD_AMOUNT"
                label="Consultation/Procedure Amount"
                value={formData.MTD_AMOUNT}
                onChange={handleFormChange}
                placeholder="Enter treatment amount"
                inputProps={{ min: "1" }}
                InputProps={{
                  startAdornment: (
                    <MonetizationOn color="action" sx={{ mr: 1, color: "primary.main" }} />
                  ),
                }}
              />
            </Box>

            {/* Grand Total */}
            <Box sx={{ mb: 4, p: 2, bgcolor: 'success.light', borderRadius: 2 }}>
              <Typography variant="h5" color="white" fontWeight={600} align="right">
                Grand Total: Rs. {totalAmount.toFixed(2)}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={!(role === "Admin" || role === "Doc") || loading}
                startIcon={
                  loading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <Description />
                  )
                }
                sx={{ py: 1.5, px: 4, width: { xs: "100%", sm: 300 } }}
              >
                {isEditMode ? "Update Treatment" : "Submit Treatment"}
              </Button>
            </Box>
          </form>
        </StyledPaper>
      </Box>

      <Dialog open={isModalOpen} onClose={closeModal}>
        <DialogTitle>
          {modalContent.includes("Error") ? "Error" : "Success"}
        </DialogTitle>
        <DialogContent>
          <Typography>{modalContent}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AddRecord;