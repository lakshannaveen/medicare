// import { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import {
//   Box,
//   Button,
//   Container,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   IconButton,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   TextField,
//   Typography,
//   Select,
//   MenuItem,
//   InputAdornment,
//   FormControl,
//   InputLabel,
//   CircularProgress,
//   Snackbar,
//   Alert,
//   Tooltip,
//   useMediaQuery,
//   useTheme,
//   Stack,
//   Chip,
// } from "@mui/material";
// import {
//   Search as SearchIcon,
//   Add as AddIcon,
//   Edit as EditIcon,
//   Delete as DeleteIcon,
//   Close as CloseIcon,
//   Refresh as RefreshIcon,
//   Inventory as StockInIcon,
//   Outbound as StockOutIcon,
//   Warning as WarningIcon,
// } from "@mui/icons-material";
// import { NumericFormat } from 'react-number-format';

// // Unit mapping object to convert unit codes to display names
// const UNIT_MAP = {
//   "BOX": "Box",
//   "MGM": "Milligrams (mg)",
//   "MLT": "Millilitres (ml)",
//   "MCG": "Micro grams (mcg)",
//   "BTL": "Bottle (Solid Oral)",
//   "BLP": "Blister Pack",
//   "BLC": "Blister Card",
//   "STP": "Strip Pack",
//   "PCH": "Pouch",
//   "STB": "Stock Bottle",
//   "DSP": "Dispenser Pack",
//   "SCT": "Sachet",
//   "SOL": "Vial (Solid Oral)",
//   "AMB": "Bottle (Amber)",
//   "PLB": "Bottle (Plastic)",
//   "GLB": "Bottle (Glass)",
//   "LIQ": "Vial (Liquid Oral)",
//   "AMP": "Ampoule (Liquid Oral)",
//   "SLO": "Sachet (Liquid Oral)",
//   "STK": "Stick Pack",
//   "DRP": "Dropper Bottle",
//   "ALM": "Tube (Aluminum)",
//   "PLT": "Tube (Plastic)",
//   "JAR": "Jar",
//   "PMP": "Bottle (Pump)",
//   "SSS": "Sachet (Semi-Solid)",
//   "STC": "Stick",
//   "PEN": "Pen",
//   "VSD": "Vial (Single-Dose)",
//   "VMD": "Vial (Multi-Dose)",
//   "PFS": "Pre-filled Syringe",
//   "CRT": "Cartridge",
//   "IVB": "IV Bag (Flexible)",
//   "IVR": "IV Bottle (Rigid)",
//   "AIN": "Auto-injector",
//   "PTD": "Patch (Transdermal)",
//   "MDI": "Inhaler (Metered-Dose - MDI)",
//   "DPI": "Inhaler (Dry Powder - DPI)",
//   "ANB": "Ampoule (Nebulizer)",
//   "VNB": "Vial (Nebulizer)",
//   "DPB": "Bottle (Dropper)",
//   "VSO": "Vial (Single-Dose - Ophthalmic)",
//   "TOM": "Tube (Ointment)",
//   "NSP": "Nasal Spray Pump",
//   "SRV": "Strip Pack (Rectal/Vaginal)",
//   "APP": "Applicator",
//   "ENM": "Bottle (Enema)",
//   "FPC": "Pouch (Foil)",
//   "CYL": "Cylinder",
// };

// // Helper function to get unit display name
// const getUnitDisplayName = (unitCode) => {
//   if (!unitCode) return "N/A";
//   return UNIT_MAP[unitCode] || unitCode;
// };

// export default function RegisterMedicine() {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
//   const [form, setForm] = useState({
//     MMC_MATERIAL_CODE: "",
//     MMC_DESCRIPTION: "",
//     MMC_REORDER_LEVEL: "",
//     MMC_MATERIAL_SPEC: "",
//     MMC_UNIT: "",
//     MMC_STATUS: "A",
//     MMC_CREATED_BY: "",
//     MMC_UPDATED_BY: "",
//     MMC_RATE: "",
//   });

//   const [stockDialog, setStockDialog] = useState({
//     open: false,
//     type: null, // 'in' or 'out'
//     materialCode: "",
//     materialDescription: "",
//     quantity: "",
//   });

//   const [openDialog, setOpenDialog] = useState(false);
//   const [medicines, setMedicines] = useState([]);
//   const [lowStockItems, setLowStockItems] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [error, setError] = useState("");
//   const [editMode, setEditMode] = useState(false);
//   const [highlightedRow, setHighlightedRow] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [lowStockLoading, setLowStockLoading] = useState(false);
//   const [stockLoading, setStockLoading] = useState(false);
//   const [snackbarOpen, setSnackbarOpen] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState("");
//   const [snackbarSeverity, setSnackbarSeverity] = useState("success");
//   const rowRefs = useRef({});

//   const handleSnackbarClose = () => {
//     setSnackbarOpen(false);
//   };

//   const showSnackbar = (message, severity = "success") => {
//     setSnackbarMessage(message);
//     setSnackbarSeverity(severity);
//     setSnackbarOpen(true);
//   };

//   // Fetch low stock materials
//   const fetchLowStock = async () => {
//     setLowStockLoading(true);
//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API_BASE_URL}/Material/low-stock`
//       );
//       setLowStockItems(response.data);

//       // Show warning if there are low stock items
//       if (response.data.length > 0) {
//         showSnackbar(`${response.data.length} item(s) are low in stock`, "warning");
//       }
//     } catch (error) {
//       console.error("Error fetching low stock items:", error);
//       // Don't show error to user as this is a secondary feature
//     } finally {
//       setLowStockLoading(false);
//     }
//   };

//   useEffect(() => {
//     const fetchMedicines = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.get(
//           `${process.env.REACT_APP_API_BASE_URL}/Material`
//         );
//         // Use MMC_CURRENT_STOCK from the API response
//         const sortedMedicines = response.data.sort((a, b) => b.isNew - a.isNew);
//         setMedicines(sortedMedicines);

//         // Fetch low stock items after medicines are loaded
//         await fetchLowStock();
//       } catch (error) {
//         console.error("Error fetching medicines:", error);
//         showSnackbar("Failed to fetch medicines", "error");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMedicines();
//   }, []);

//   // Check if a medicine is low in stock
//   const isLowStock = (medicine) => {
//     return lowStockItems.some(
//       (item) => item.MMC_MATERIAL_CODE === medicine.MMC_MATERIAL_CODE
//     );
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm({
//       ...form,
//       [name]: value,
//     });
//   };

//   const highlightAndScrollToRow = (materialCode, timeoutDuration = 120000) => {
//     setHighlightedRow(materialCode);
//     const row = rowRefs.current[materialCode];
//     if (row) {
//       row.scrollIntoView({ behavior: "smooth", block: "center" });
//     }

//     setTimeout(() => {
//       setMedicines((prev) =>
//         prev.map((medicine) =>
//           medicine.MMC_MATERIAL_CODE === materialCode
//             ? { ...medicine, isNew: false }
//             : medicine
//         )
//       );
//     }, timeoutDuration);
//   };

//   const refreshMedicines = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API_BASE_URL}/Material`
//       );
//       setMedicines((prev) =>
//         response.data.map((medicine) => ({
//           ...medicine,
//           isNew: prev.some(
//             (m) => m.MMC_MATERIAL_CODE === medicine.MMC_MATERIAL_CODE && m.isNew
//           ),
//         }))
//       );

//       // Refresh low stock data
//       await fetchLowStock();

//       showSnackbar("Medicine list refreshed");
//     } catch (error) {
//       console.error("Error refreshing medicines:", error);
//       showSnackbar("Failed to refresh medicines", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleStockInOut = async () => {
//     if (!stockDialog.quantity || parseFloat(stockDialog.quantity) <= 0) {
//       showSnackbar("Please enter a valid quantity", "error");
//       return;
//     }

//     setStockLoading(true);
//     try {
//       const endpoint = stockDialog.type === 'in' ? 'stock-in' : 'stock-out';
//       await axios.post(
//         `${process.env.REACT_APP_API_BASE_URL}/Material/${endpoint}?materialCode=${stockDialog.materialCode}&quantity=${stockDialog.quantity}`
//       );

//       showSnackbar(`Stock ${stockDialog.type === 'in' ? 'added' : 'removed'} successfully`);

//       // Update the stock quantity in the local state using MMC_CURRENT_STOCK
//       setMedicines(prev => prev.map(medicine => {
//         if (medicine.MMC_MATERIAL_CODE === stockDialog.materialCode) {
//           const currentStock = parseFloat(medicine.MMC_CURRENT_STOCK || 0);
//           const quantity = parseFloat(stockDialog.quantity);
//           const newStock = stockDialog.type === 'in'
//             ? currentStock + quantity
//             : Math.max(0, currentStock - quantity);

//           return {
//             ...medicine,
//             MMC_CURRENT_STOCK: newStock
//           };
//         }
//         return medicine;
//       }));

//       // Refresh low stock data after stock update
//       await fetchLowStock();

//       handleCloseStockDialog();
//     } catch (error) {
//       console.error(`Error in stock ${stockDialog.type}:`, error);
//       showSnackbar(`Failed to ${stockDialog.type === 'in' ? 'add' : 'remove'} stock`, "error");
//     } finally {
//       setStockLoading(false);
//     }
//   };

//   const handleOpenStockDialog = (medicine, type) => {
//     setStockDialog({
//       open: true,
//       type: type,
//       materialCode: medicine.MMC_MATERIAL_CODE,
//       materialDescription: medicine.MMC_DESCRIPTION,
//       quantity: "",
//     });
//   };

//   const handleCloseStockDialog = () => {
//     setStockDialog({
//       open: false,
//       type: null,
//       materialCode: "",
//       materialDescription: "",
//       quantity: "",
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const data = {
//       ...form,
//       MMC_REORDER_LEVEL: parseFloat(form.MMC_REORDER_LEVEL) || 0,
//     };

//     setLoading(true);
//     try {
//       let newMedicine = null;
//       if (editMode) {
//         await axios.patch(
//           `${process.env.REACT_APP_API_BASE_URL}/Material/${form.MMC_MATERIAL_CODE}`,
//           data
//         );
//         showSnackbar("Medicine updated successfully");

//         newMedicine = { ...form, isNew: true };
//         setMedicines((prev) =>
//           prev.map((medicine) =>
//             medicine.MMC_MATERIAL_CODE === newMedicine.MMC_MATERIAL_CODE
//               ? newMedicine
//               : medicine
//           )
//         );
//       } else {
//         const response = await axios.post(
//           `${process.env.REACT_APP_API_BASE_URL}/Material`,
//           data
//         );
//         showSnackbar("Medicine registered successfully");

//         newMedicine = { ...response.data, isNew: true };
//         setMedicines((prev) => [newMedicine, ...prev]);
//       }

//       // Refresh low stock data after adding/updating medicine
//       await fetchLowStock();

//       highlightAndScrollToRow(newMedicine.MMC_MATERIAL_CODE);
//       handleReset();
//       setOpenDialog(false);
//       setError("");
//     } catch (error) {
//       if (error.response && error.response.data && error.response.data.error) {
//         setError(error.response.data.error);
//         showSnackbar(error.response.data.error, "error");
//       } else {
//         setError("An unexpected error occurred. Please try again.");
//         showSnackbar(
//           "An unexpected error occurred. Please try again.",
//           "error"
//         );
//       }
//       console.error("Error submitting the medicine:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const inactivemedicie = async (id) => {
//     if (window.confirm("Are you sure you want to deactivate this medicine?")) {
//       setLoading(true);
//       try {
//         await axios.put(
//           `${process.env.REACT_APP_API_BASE_URL}/Material/updatematerialstatus?materialcode=${id}`
//         );
//         showSnackbar("Medicine deactivated successfully");
//         await refreshMedicines();
//       } catch (error) {
//         console.error("Error removing the medicine:", error);
//         showSnackbar("Failed to deactivate medicine", "error");
//       } finally {
//         setLoading(false);
//       }
//     }
//   };

//   const handleReset = () => {
//     setForm({
//       MMC_MATERIAL_CODE: "",
//       MMC_DESCRIPTION: "",
//       MMC_REORDER_LEVEL: "",
//       MMC_MATERIAL_SPEC: "",
//       MMC_UNIT: "",
//       MMC_STATUS: "A",
//       MMC_CREATED_BY: "",
//       MMC_UPDATED_BY: "",
//       MMC_RATE: "",
//     });
//     setEditMode(false);
//     setError("");
//   };

//   const handleEdit = (medicine) => {
//     setForm(medicine);
//     setEditMode(true);
//     setOpenDialog(true);
//   };

//   const toggleDialog = () => {
//     setOpenDialog(!openDialog);
//     if (!openDialog) handleReset();
//   };

//   const filteredMedicines = medicines.filter((medicine) =>
//     medicine.MMC_DESCRIPTION.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Get row background color based on conditions
//   const getRowBackgroundColor = (medicine) => {
//     if (medicine.MMC_MATERIAL_CODE === highlightedRow) {
//       return theme.palette.action.selected;
//     }
//     if (medicine.isNew) {
//       return theme.palette.action.hover;
//     }
//     if (isLowStock(medicine)) {
//       return theme.palette.error.light + '20'; // Add transparency
//     }
//     return "inherit";
//   };

//   return (
//     <Container maxWidth="xl" sx={{ py: 2 }}>
//       <Paper elevation={3} sx={{ p: 4 }}>
//         <Box sx={{ mb: 4 }}>
//           <Typography
//             variant="h4"
//             component="h1"
//             gutterBottom
//             color="primary"
//             fontWeight={600}
//             align="center"
//           >
//             Drug Registration
//           </Typography>

//           <Box
//             sx={{
//               display: "flex",
//               flexDirection: isMobile ? "column" : "row",
//               gap: 2,
//               mb: 3,
//               alignItems: isMobile ? "stretch" : "center",
//               justifyContent: "space-between",
//             }}
//           >
//             <TextField
//               variant="outlined"
//               placeholder="Search medicines..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               fullWidth={isMobile}
//               sx={{
//                 width: isMobile ? "100%" : "500px",
//               }}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <SearchIcon />
//                   </InputAdornment>
//                 ),
//               }}
//             />

//             <Box
//               sx={{
//                 display: "flex",
//                 gap: 2,
//                 width: isMobile ? "100%" : "auto",
//               }}
//             >
//               {lowStockItems.length > 0 && (
//                 <Chip
//                   icon={<WarningIcon />}
//                   label={`${lowStockItems.length} Low Stock Item(s)`}
//                   color="warning"
//                   variant="outlined"
//                   sx={{ fontWeight: "bold" }}
//                 />
//               )}

//               <Button
//                 variant="contained"
//                 color="primary"
//                 startIcon={<AddIcon />}
//                 onClick={toggleDialog}
//                 fullWidth={isMobile}
//               >
//                 Add Medicine
//               </Button>

//               <Button
//                 variant="outlined"
//                 color="primary"
//                 startIcon={<RefreshIcon />}
//                 onClick={refreshMedicines}
//                 disabled={loading}
//                 fullWidth={isMobile}
//               >
//                 Refresh
//               </Button>
//             </Box>
//           </Box>
//         </Box>

//         <Box>
//           <Typography
//             variant="h6"
//             component="h2"
//             gutterBottom
//             sx={{ mb: 2 }}
//             color="primary"
//             fontWeight={600}
//           >
//             Drug Stock
//           </Typography>

//           {loading ? (
//             <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
//               <CircularProgress />
//             </Box>
//           ) : (
//             <TableContainer sx={{ maxHeight: 550 }}>
//               <Table aria-label="medicine table" stickyHeader>
//                 <TableHead>
//                   <TableRow>
//                     <TableCell sx={{ color: "white", fontWeight: "bold", backgroundColor: theme.palette.primary.light }}>
//                       Name of Drug
//                     </TableCell>
//                     <TableCell
//                       align="center"
//                       sx={{ color: "white", fontWeight: "bold", backgroundColor: theme.palette.primary.light }}
//                     >
//                       Unit
//                     </TableCell>
//                     <TableCell
//                       align="center"
//                       sx={{ color: "white", fontWeight: "bold", backgroundColor: theme.palette.primary.light }}
//                     >
//                       Current Stock
//                     </TableCell>
//                     <TableCell
//                       align="center"
//                       sx={{ color: "white", fontWeight: "bold", backgroundColor: theme.palette.primary.light }}
//                     >
//                       Reorder Level
//                     </TableCell>
//                     <TableCell
//                       align="center"
//                       sx={{ color: "white", fontWeight: "bold", backgroundColor: theme.palette.primary.light }}
//                     >
//                       Status
//                     </TableCell>
//                     <TableCell
//                       align="center"
//                       sx={{ color: "white", fontWeight: "bold", backgroundColor: theme.palette.primary.light }}
//                     >
//                       Rate (Rs)
//                     </TableCell>
//                     <TableCell
//                       align="center"
//                       sx={{ color: "white", fontWeight: "bold", backgroundColor: theme.palette.primary.light }}
//                     >
//                       Actions
//                     </TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {filteredMedicines.length > 0 ? (
//                     filteredMedicines.map((medicine) => (
//                       <TableRow
//                         key={medicine.MMC_MATERIAL_CODE}
//                         ref={(el) =>
//                           (rowRefs.current[medicine.MMC_MATERIAL_CODE] = el)
//                         }
//                         sx={{
//                           backgroundColor: getRowBackgroundColor(medicine),
//                           transition: "background-color 0.3s ease",
//                           '&:hover': {
//                             backgroundColor: isLowStock(medicine)
//                               ? theme.palette.error.light + '40'
//                               : theme.palette.action.hover,
//                           },
//                         }}
//                         hover
//                       >
//                         <TableCell>
//                           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                             {isLowStock(medicine) && (
//                               <Tooltip title="Low Stock">
//                                 <WarningIcon color="error" fontSize="small" />
//                               </Tooltip>
//                             )}
//                             {medicine.MMC_DESCRIPTION}
//                           </Box>
//                         </TableCell>
//                         <TableCell align="center">
//                           <Tooltip title={`Code: ${medicine.MMC_UNIT || 'N/A'}`}>
//                             <span>{getUnitDisplayName(medicine.MMC_UNIT)}</span>
//                           </Tooltip>
//                         </TableCell>
//                         <TableCell align="center">
//                           <Typography
//                             color={isLowStock(medicine) ? "error.main" : "success.main"}
//                             fontWeight="bold"
//                           >
//                             {medicine.MMC_CURRENT_STOCK !== undefined && medicine.MMC_CURRENT_STOCK !== null
//                               ? new Intl.NumberFormat('en-US').format(Number(medicine.MMC_CURRENT_STOCK))
//                               : "0"}
//                           </Typography>
//                         </TableCell>
//                         <TableCell align="center">
//                           {medicine.MMC_REORDER_LEVEL
//                             ? new Intl.NumberFormat('en-US').format(Number(medicine.MMC_REORDER_LEVEL))
//                             : "0"}
//                         </TableCell>
//                         <TableCell align="center">
//                           {medicine.MMC_STATUS === "A" ? (
//                             <Typography color="success.main">Active</Typography>
//                           ) : (
//                             <Typography color="error.main">Inactive</Typography>
//                           )}
//                         </TableCell>
//                         <TableCell align="center">
//                           {medicine.MMC_RATE
//                             ? new Intl.NumberFormat('en-US', {
//                               minimumFractionDigits: 2,
//                               maximumFractionDigits: 2,
//                             }).format(Number(medicine.MMC_RATE))
//                             : "0.00"}
//                         </TableCell>
//                         <TableCell align="center">
//                           <Stack direction="row" spacing={1} justifyContent="center">
//                             <Tooltip title="Stock In">
//                               <IconButton
//                                 color="success"
//                                 onClick={() => handleOpenStockDialog(medicine, 'in')}
//                                 size="small"
//                               >
//                                 <StockInIcon />
//                               </IconButton>
//                             </Tooltip>
//                             <Tooltip title="Stock Out">
//                               <IconButton
//                                 color="warning"
//                                 onClick={() => handleOpenStockDialog(medicine, 'out')}
//                                 size="small"
//                               >
//                                 <StockOutIcon />
//                               </IconButton>
//                             </Tooltip>
//                             <Tooltip title="Edit">
//                               <IconButton
//                                 color="primary"
//                                 onClick={() => handleEdit(medicine)}
//                                 size="small"
//                               >
//                                 <EditIcon />
//                               </IconButton>
//                             </Tooltip>
//                             <Tooltip title="Deactivate">
//                               <IconButton
//                                 color="error"
//                                 onClick={() =>
//                                   inactivemedicie(medicine.MMC_MATERIAL_CODE)
//                                 }
//                                 size="small"
//                               >
//                                 <DeleteIcon />
//                               </IconButton>
//                             </Tooltip>
//                           </Stack>
//                         </TableCell>
//                       </TableRow>
//                     ))
//                   ) : (
//                     <TableRow>
//                       <TableCell colSpan={7} align="center">
//                         No medicines available
//                       </TableCell>
//                     </TableRow>
//                   )}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           )}
//         </Box>

//         {/* Add/Edit Medicine Dialog */}
//         <Dialog
//           open={openDialog}
//           onClose={toggleDialog}
//           fullWidth
//           maxWidth="sm"
//         >
//           <DialogTitle
//             sx={(theme) => ({
//               color: theme.palette.primary.main,
//               position: "relative",
//             })}
//           >
//             <Typography variant="h4" fontWeight={600} sx={{ textAlign: "center" }}>
//               {editMode ? "Edit Medicine" : "Add New Medicine"}
//             </Typography>

//             <IconButton
//               aria-label="close"
//               onClick={toggleDialog}
//               sx={{
//                 position: "absolute",
//                 right: 8,
//                 top: 8,
//                 color: (theme) => theme.palette.grey[500],
//               }}
//             >
//               <CloseIcon />
//             </IconButton>
//           </DialogTitle>

//           <DialogContent>
//             <form onSubmit={handleSubmit}>
//               <Box sx={{ mb: 3 }}>
//                 <TextField
//                   fullWidth
//                   margin="normal"
//                   label="Name of the drug / Service"
//                   name="MMC_DESCRIPTION"
//                   value={form.MMC_DESCRIPTION}
//                   placeholder="Enter description"
//                   onChange={handleChange}
//                   required
//                 />
//               </Box>

//               <Box sx={{ mb: 3 }}>
//                 <FormControl fullWidth margin="normal">
//                   <InputLabel id="unit-label">Unit of medicine</InputLabel>
//                   <Select
//                     labelId="unit-label"
//                     name="MMC_UNIT"
//                     value={form.MMC_UNIT}
//                     onChange={handleChange}
//                     label="Unit of medicine"
//                     required
//                     renderValue={(selected) => getUnitDisplayName(selected)}
//                   >
//                     <MenuItem value="">Select unit</MenuItem>
//                     {Object.entries(UNIT_MAP).map(([code, name]) => (
//                       <MenuItem key={code} value={code}>
//                         {name}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//               </Box>

//               <Box sx={{ mb: 3 }}>
//                 <NumericFormat
//                   customInput={TextField}
//                   fullWidth
//                   margin="normal"
//                   label="Reorder Level"
//                   name="MMC_REORDER_LEVEL"
//                   value={form.MMC_REORDER_LEVEL}
//                   onValueChange={(values) => {
//                     const { value } = values;
//                     handleChange({
//                       target: {
//                         name: "MMC_REORDER_LEVEL",
//                         value: value,
//                       },
//                     });
//                   }}
//                   thousandSeparator
//                   allowNegative={false}
//                   placeholder="Enter reorder level"
//                   required
//                   isNumericString
//                 />
//               </Box>

//               <Box sx={{ mb: 3 }}>
//                 <FormControl fullWidth margin="normal">
//                   <InputLabel id="status-label">Status</InputLabel>
//                   <Select
//                     labelId="status-label"
//                     name="MMC_STATUS"
//                     value={form.MMC_STATUS}
//                     onChange={handleChange}
//                     label="Status"
//                     required
//                   >
//                     <MenuItem value="A">Active</MenuItem>
//                   </Select>
//                 </FormControl>
//               </Box>

//               <Box sx={{ mb: 3 }}>
//                 <NumericFormat
//                   customInput={TextField}
//                   fullWidth
//                   margin="normal"
//                   label="Rate (Rs)"
//                   name="MMC_RATE"
//                   value={form.MMC_RATE}
//                   placeholder="ex: 100.00"
//                   onValueChange={(values) => {
//                     const { value } = values;
//                     handleChange({
//                       target: {
//                         name: "MMC_RATE",
//                         value: value,
//                       },
//                     });
//                   }}
//                   thousandSeparator
//                   allowNegative={false}
//                   decimalScale={2}
//                   fixedDecimalScale
//                   isNumericString
//                   required
//                 />
//               </Box>

//               {error && (
//                 <Alert severity="error" sx={{ mb: 2 }}>
//                   {error}
//                 </Alert>
//               )}

//               <DialogActions>
//                 <Button onClick={toggleDialog}>Cancel</Button>
//                 <Button
//                   type="submit"
//                   variant="contained"
//                   color="primary"
//                   disabled={loading}
//                 >
//                   {loading ? (
//                     <CircularProgress size={24} />
//                   ) : editMode ? (
//                     "Update Medicine"
//                   ) : (
//                     "Register Medicine"
//                   )}
//                 </Button>
//               </DialogActions>
//             </form>
//           </DialogContent>
//         </Dialog>

//         {/* Stock In/Out Dialog */}
//         <Dialog
//           open={stockDialog.open}
//           onClose={handleCloseStockDialog}
//           fullWidth
//           maxWidth="xs"
//         >
//           <DialogTitle
//             sx={(theme) => ({
//               color: stockDialog.type === 'in' ? theme.palette.success.main : theme.palette.warning.main,
//               position: "relative",
//             })}
//           >
//             <Typography variant="h5" fontWeight={600} sx={{ textAlign: "center" }}>
//               {stockDialog.type === 'in' ? 'Stock In' : 'Stock Out'}
//             </Typography>

//             <IconButton
//               aria-label="close"
//               onClick={handleCloseStockDialog}
//               sx={{
//                 position: "absolute",
//                 right: 8,
//                 top: 8,
//                 color: (theme) => theme.palette.grey[500],
//               }}
//             >
//               <CloseIcon />
//             </IconButton>
//           </DialogTitle>

//           <DialogContent>
//             <Box sx={{ mt: 2 }}>
//               <Typography variant="body1" gutterBottom>
//                 <strong>Medicine:</strong> {stockDialog.materialDescription}
//               </Typography>
//               <Typography variant="body2" color="text.secondary" gutterBottom>
//                 <strong>Code:</strong> {stockDialog.materialCode}
//               </Typography>

//               <Box sx={{ mt: 3 }}>
//                 <NumericFormat
//                   customInput={TextField}
//                   fullWidth
//                   label={`Quantity to ${stockDialog.type === 'in' ? 'add' : 'remove'}`}
//                   value={stockDialog.quantity}
//                   onValueChange={(values) => {
//                     const { value } = values;
//                     setStockDialog(prev => ({
//                       ...prev,
//                       quantity: value,
//                     }));
//                   }}
//                   thousandSeparator
//                   allowNegative={false}
//                   placeholder="Enter quantity"
//                   required
//                   isNumericString
//                   autoFocus
//                 />
//               </Box>
//             </Box>
//           </DialogContent>

//           <DialogActions>
//             <Button onClick={handleCloseStockDialog}>Cancel</Button>
//             <Button
//               onClick={handleStockInOut}
//               variant="contained"
//               color={stockDialog.type === 'in' ? 'success' : 'warning'}
//               disabled={stockLoading || !stockDialog.quantity}
//             >
//               {stockLoading ? (
//                 <CircularProgress size={24} />
//               ) : (
//                 `Confirm ${stockDialog.type === 'in' ? 'Stock In' : 'Stock Out'}`
//               )}
//             </Button>
//           </DialogActions>
//         </Dialog>

//         <Snackbar
//           open={snackbarOpen}
//           autoHideDuration={6000}
//           onClose={handleSnackbarClose}
//           anchorOrigin={{ vertical: "top", horizontal: "right" }}
//         >
//           <Alert
//             onClose={handleSnackbarClose}
//             severity={snackbarSeverity}
//             sx={{ width: "100%" }}
//           >
//             {snackbarMessage}
//           </Alert>
//         </Snackbar>
//       </Paper>
//     </Container>
//   );
// }
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
  Select,
  MenuItem,
  InputAdornment,
  FormControl,
  InputLabel,
  CircularProgress,
  Snackbar,
  Alert,
  Tooltip,
  useMediaQuery,
  useTheme,
  Stack,
  Chip,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon,
  Inventory as StockInIcon,
  Outbound as StockOutIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import { NumericFormat } from "react-number-format";

// Unit mapping object to convert unit codes to display names
const UNIT_MAP = {
  BOX: "Box",
  MGM: "Milligrams (mg)",
  MLT: "Millilitres (ml)",
  MCG: "Micro grams (mcg)",
  BTL: "Bottle (Solid Oral)",
  BLP: "Blister Pack",
  BLC: "Blister Card",
  STP: "Strip Pack",
  PCH: "Pouch",
  STB: "Stock Bottle",
  DSP: "Dispenser Pack",
  SCT: "Sachet",
  SOL: "Vial (Solid Oral)",
  AMB: "Bottle (Amber)",
  PLB: "Bottle (Plastic)",
  GLB: "Bottle (Glass)",
  LIQ: "Vial (Liquid Oral)",
  AMP: "Ampoule (Liquid Oral)",
  SLO: "Sachet (Liquid Oral)",
  STK: "Stick Pack",
  DRP: "Dropper Bottle",
  ALM: "Tube (Aluminum)",
  PLT: "Tube (Plastic)",
  JAR: "Jar",
  PMP: "Bottle (Pump)",
  SSS: "Sachet (Semi-Solid)",
  STC: "Stick",
  PEN: "Pen",
  VSD: "Vial (Single-Dose)",
  VMD: "Vial (Multi-Dose)",
  PFS: "Pre-filled Syringe",
  CRT: "Cartridge",
  IVB: "IV Bag (Flexible)",
  IVR: "IV Bottle (Rigid)",
  AIN: "Auto-injector",
  PTD: "Patch (Transdermal)",
  MDI: "Inhaler (Metered-Dose - MDI)",
  DPI: "Inhaler (Dry Powder - DPI)",
  ANB: "Ampoule (Nebulizer)",
  VNB: "Vial (Nebulizer)",
  DPB: "Bottle (Dropper)",
  VSO: "Vial (Single-Dose - Ophthalmic)",
  TOM: "Tube (Ointment)",
  NSP: "Nasal Spray Pump",
  SRV: "Strip Pack (Rectal/Vaginal)",
  APP: "Applicator",
  ENM: "Bottle (Enema)",
  FPC: "Pouch (Foil)",
  CYL: "Cylinder",
};

// Helper function to get unit display name
const getUnitDisplayName = (unitCode) => {
  if (!unitCode) return "";
  return UNIT_MAP[unitCode] || unitCode;
};

export default function RegisterMedicine() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [itemType, setItemType] = useState("DRUG"); // "DRUG" or "SERVICE"
  const [form, setForm] = useState({
    MMC_MATERIAL_CODE: "",
    MMC_DESCRIPTION: "",
    MMC_REORDER_LEVEL: "",
    MMC_MATERIAL_SPEC: "",
    MMC_UNIT: "",
    MMC_STATUS: "A",
    MMC_CREATED_BY: "",
    MMC_UPDATED_BY: "",
    MMC_RATE: "",
    MMC_TYPE: "DRUG",
    MMC_CURRENT_STOCK: "", // Will be set to 0 for services, but can be entered for drugs
  });

  const [stockDialog, setStockDialog] = useState({
    open: false,
    type: null, // 'in' or 'out'
    materialCode: "",
    materialDescription: "",
    quantity: "",
  });

  const [openDialog, setOpenDialog] = useState(false);
  const [medicines, setMedicines] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [highlightedRow, setHighlightedRow] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lowStockLoading, setLowStockLoading] = useState(false);
  const [stockLoading, setStockLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const rowRefs = useRef({});

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // Fetch low stock materials
  const fetchLowStock = async () => {
    setLowStockLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/Material/low-stock`,
      );
      setLowStockItems(response.data);

      // Show warning if there are low stock items
      if (response.data.length > 0) {
        showSnackbar(
          `${response.data.length} item(s) are low in stock`,
          "warning",
        );
      }
    } catch (error) {
      console.error("Error fetching low stock items:", error);
      // Don't show error to user as this is a secondary feature
    } finally {
      setLowStockLoading(false);
    }
  };

  useEffect(() => {
    const fetchMedicines = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/Material`,
        );
        // Use MMC_CURRENT_STOCK from the API response
        const sortedMedicines = response.data.sort((a, b) => b.isNew - a.isNew);
        setMedicines(sortedMedicines);

        // Fetch low stock items after medicines are loaded
        await fetchLowStock();
      } catch (error) {
        console.error("Error fetching medicines:", error);
        showSnackbar("Failed to fetch medicines", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, []);

  // Check if a medicine is low in stock
  const isLowStock = (medicine) => {
    return (
      medicine.MMC_TYPE === "DRUG" &&
      lowStockItems.some(
        (item) => item.MMC_MATERIAL_CODE === medicine.MMC_MATERIAL_CODE,
      )
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleItemTypeChange = (e) => {
    const newType = e.target.value;
    setItemType(newType);
    setForm({
      ...form,
      MMC_TYPE: newType,
      // Reset drug-specific fields when switching to service
      MMC_REORDER_LEVEL: newType === "SERVICE" ? "" : form.MMC_REORDER_LEVEL,
      MMC_UNIT: newType === "SERVICE" ? "" : form.MMC_UNIT,
      MMC_CURRENT_STOCK: newType === "SERVICE" ? "0" : form.MMC_CURRENT_STOCK, // Set stock to "0" for services
    });
  };

  const highlightAndScrollToRow = (materialCode, timeoutDuration = 120000) => {
    setHighlightedRow(materialCode);
    const row = rowRefs.current[materialCode];
    if (row) {
      row.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    setTimeout(() => {
      setMedicines((prev) =>
        prev.map((medicine) =>
          medicine.MMC_MATERIAL_CODE === materialCode
            ? { ...medicine, isNew: false }
            : medicine,
        ),
      );
    }, timeoutDuration);
  };

  const refreshMedicines = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/Material`,
      );
      setMedicines((prev) =>
        response.data.map((medicine) => ({
          ...medicine,
          isNew: prev.some(
            (m) =>
              m.MMC_MATERIAL_CODE === medicine.MMC_MATERIAL_CODE && m.isNew,
          ),
        })),
      );

      // Refresh low stock data
      await fetchLowStock();

      showSnackbar("Medicine list refreshed");
    } catch (error) {
      console.error("Error refreshing medicines:", error);
      showSnackbar("Failed to refresh medicines", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleStockInOut = async () => {
    if (!stockDialog.quantity || parseFloat(stockDialog.quantity) <= 0) {
      showSnackbar("Please enter a valid quantity", "error");
      return;
    }

    setStockLoading(true);
    try {
      const endpoint = stockDialog.type === "in" ? "stock-in" : "stock-out";
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/Material/${endpoint}?materialCode=${stockDialog.materialCode}&quantity=${stockDialog.quantity}`,
      );

      showSnackbar(
        `Stock ${stockDialog.type === "in" ? "added" : "removed"} successfully`,
      );

      // Update the stock quantity in the local state using MMC_CURRENT_STOCK
      setMedicines((prev) =>
        prev.map((medicine) => {
          if (medicine.MMC_MATERIAL_CODE === stockDialog.materialCode) {
            const currentStock = parseFloat(medicine.MMC_CURRENT_STOCK || 0);
            const quantity = parseFloat(stockDialog.quantity);
            const newStock =
              stockDialog.type === "in"
                ? currentStock + quantity
                : Math.max(0, currentStock - quantity);

            return {
              ...medicine,
              MMC_CURRENT_STOCK: newStock,
            };
          }
          return medicine;
        }),
      );

      // Refresh low stock data after stock update
      await fetchLowStock();

      handleCloseStockDialog();
    } catch (error) {
      console.error(`Error in stock ${stockDialog.type}:`, error);
      showSnackbar(
        `Failed to ${stockDialog.type === "in" ? "add" : "remove"} stock`,
        "error",
      );
    } finally {
      setStockLoading(false);
    }
  };

  const handleOpenStockDialog = (medicine, type) => {
    // Only allow stock operations for drugs
    if (medicine.MMC_TYPE !== "DRUG") {
      showSnackbar("Stock operations are only available for drugs", "warning");
      return;
    }

    setStockDialog({
      open: true,
      type: type,
      materialCode: medicine.MMC_MATERIAL_CODE,
      materialDescription: medicine.MMC_DESCRIPTION,
      quantity: "",
    });
  };

  const handleCloseStockDialog = () => {
    setStockDialog({
      open: false,
      type: null,
      materialCode: "",
      materialDescription: "",
      quantity: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate based on item type
    if (itemType === "DRUG") {
      if (!form.MMC_UNIT) {
        setError("Please select a unit for the drug");
        showSnackbar("Please select a unit for the drug", "error");
        return;
      }

      // Validate current stock for drugs (optional, but should be a valid number)
      if (form.MMC_CURRENT_STOCK && parseFloat(form.MMC_CURRENT_STOCK) < 0) {
        setError("Current stock cannot be negative");
        showSnackbar("Current stock cannot be negative", "error");
        return;
      }
    }

    // Prepare data for submission
    let data;
    if (itemType === "DRUG") {
      // For drugs, include all fields
      data = {
        ...form,
        MMC_REORDER_LEVEL: parseFloat(form.MMC_REORDER_LEVEL) || 0,
        MMC_RATE: parseFloat(form.MMC_RATE) || 0,
        MMC_CURRENT_STOCK: parseFloat(form.MMC_CURRENT_STOCK) || 0,
        MMC_TYPE: "DRUG",
      };
    } else {
      // For services, only send necessary fields
      data = {
        MMC_MATERIAL_CODE: form.MMC_MATERIAL_CODE,
        MMC_DESCRIPTION: form.MMC_DESCRIPTION,
        MMC_STATUS: form.MMC_STATUS,
        MMC_RATE: parseFloat(form.MMC_RATE) || 0,
        MMC_TYPE: "SERVICE",
        MMC_CURRENT_STOCK: 0, // Set stock to 0 for services
      };

      // Clean up undefined fields
      Object.keys(data).forEach((key) => {
        if (data[key] === undefined) {
          delete data[key];
        }
      });
    }

    setLoading(true);
    try {
      let newMedicine = null;
      if (editMode) {
        await axios.patch(
          `${process.env.REACT_APP_API_BASE_URL}/Material/${form.MMC_MATERIAL_CODE}`,
          data,
        );
        showSnackbar(
          `${itemType === "DRUG" ? "Medicine" : "Service"} updated successfully`,
        );

        newMedicine = { ...form, isNew: true };
        setMedicines((prev) =>
          prev.map((medicine) =>
            medicine.MMC_MATERIAL_CODE === newMedicine.MMC_MATERIAL_CODE
              ? newMedicine
              : medicine,
          ),
        );
      } else {
        const response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/Material`,
          data,
        );
        showSnackbar(
          `${itemType === "DRUG" ? "Medicine" : "Service"} registered successfully`,
        );

        newMedicine = { ...response.data, isNew: true };
        setMedicines((prev) => [newMedicine, ...prev]);
      }

      // Refresh low stock data after adding/updating medicine
      if (itemType === "DRUG") {
        await fetchLowStock();
      }

      highlightAndScrollToRow(newMedicine.MMC_MATERIAL_CODE);
      handleReset();
      setOpenDialog(false);
      setError("");
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        // Handle validation errors
        const validationErrors = error.response.data.errors;
        const errorMessage = Object.values(validationErrors).flat().join(", ");
        setError(errorMessage);
        showSnackbar(errorMessage, "error");
      } else if (
        error.response &&
        error.response.data &&
        error.response.data.error
      ) {
        setError(error.response.data.error);
        showSnackbar(error.response.data.error, "error");
      } else {
        setError("An unexpected error occurred. Please try again.");
        showSnackbar(
          "An unexpected error occurred. Please try again.",
          "error",
        );
      }
      console.error("Error submitting the form:", error);
    } finally {
      setLoading(false);
    }
  };

  const inactivateItem = async (id) => {
    if (window.confirm("Are you sure you want to deactivate this item?")) {
      setLoading(true);
      try {
        await axios.put(
          `${process.env.REACT_APP_API_BASE_URL}/Material/updatematerialstatus?materialcode=${id}`,
        );
        showSnackbar("Item deactivated successfully");
        await refreshMedicines();
      } catch (error) {
        console.error("Error removing the item:", error);
        showSnackbar("Failed to deactivate item", "error");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleReset = () => {
    setForm({
      MMC_MATERIAL_CODE: "",
      MMC_DESCRIPTION: "",
      MMC_REORDER_LEVEL: "",
      MMC_MATERIAL_SPEC: "",
      MMC_UNIT: "",
      MMC_STATUS: "A",
      MMC_CREATED_BY: "",
      MMC_UPDATED_BY: "",
      MMC_RATE: "",
      MMC_TYPE: "DRUG",
      MMC_CURRENT_STOCK: "",
    });
    setItemType("DRUG");
    setEditMode(false);
    setError("");
  };

  const handleEdit = (medicine) => {
    setForm(medicine);
    setItemType(medicine.MMC_TYPE || "DRUG");
    setEditMode(true);
    setOpenDialog(true);
  };

  const toggleDialog = () => {
    setOpenDialog(!openDialog);
    if (!openDialog) handleReset();
  };

  const filteredMedicines = medicines.filter((medicine) =>
    medicine.MMC_DESCRIPTION.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Get row background color based on conditions
  const getRowBackgroundColor = (medicine) => {
    if (medicine.MMC_MATERIAL_CODE === highlightedRow) {
      return theme.palette.action.selected;
    }
    if (medicine.isNew) {
      return theme.palette.action.hover;
    }
    if (isLowStock(medicine)) {
      return theme.palette.error.light + "20"; // Add transparency
    }
    return "inherit";
  };

  // Get item type chip color
  const getItemTypeChip = (itemTypeValue) => {
    if (itemTypeValue === "DRUG") {
      return <Chip label="Drug" color="primary" size="small" />;
    } else {
      return <Chip label="Service" color="secondary" size="small" />;
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            color="primary"
            fontWeight={600}
            align="center"
          >
            Drug & Service Registration
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: 2,
              mb: 3,
              alignItems: isMobile ? "stretch" : "center",
              justifyContent: "space-between",
            }}
          >
            <TextField
              variant="outlined"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth={isMobile}
              sx={{
                width: isMobile ? "100%" : "500px",
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />

            <Box
              className="search-add-container"
              sx={{
                display: "flex",
                gap: 2,
                width: isMobile ? "100%" : "auto",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: isMobile ? "flex-end" : "flex-start",
              }}
            >
              {lowStockItems.length > 0 && (
                <Chip
                  icon={<WarningIcon />}
                  label={`${lowStockItems.length} Low Stock Item(s)`}
                  color="warning"
                  variant="outlined"
                  sx={{ fontWeight: "bold" }}
                />
              )}

              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={toggleDialog}
                fullWidth={isMobile}
                sx={{ minWidth: 110 }}
              >
                Add Item
              </Button>

              <Button
                variant="outlined"
                color="primary"
                startIcon={<RefreshIcon />}
                onClick={refreshMedicines}
                disabled={loading}
                fullWidth={isMobile}
                sx={{ minWidth: 110 }}
              >
                Refresh
              </Button>
            </Box>
          </Box>
        </Box>

        <Box>
          <Typography
            variant="h6"
            component="h2"
            gutterBottom
            sx={{ mb: 2 }}
            color="primary"
            fontWeight={600}
          >
            Items List
          </Typography>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer sx={{ maxHeight: 550 }}>
              <Table aria-label="items table" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        color: "white",
                        fontWeight: "bold",
                        backgroundColor: theme.palette.primary.light,
                      }}
                    >
                      Type
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "white",
                        fontWeight: "bold",
                        backgroundColor: theme.palette.primary.light,
                      }}
                    >
                      Name
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        color: "white",
                        fontWeight: "bold",
                        backgroundColor: theme.palette.primary.light,
                      }}
                    >
                      Unit
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        color: "white",
                        fontWeight: "bold",
                        backgroundColor: theme.palette.primary.light,
                      }}
                    >
                      Current Stock
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        color: "white",
                        fontWeight: "bold",
                        backgroundColor: theme.palette.primary.light,
                      }}
                    >
                      Reorder Level
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        color: "white",
                        fontWeight: "bold",
                        backgroundColor: theme.palette.primary.light,
                      }}
                    >
                      Status
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        color: "white",
                        fontWeight: "bold",
                        backgroundColor: theme.palette.primary.light,
                      }}
                    >
                      Rate (Rs)
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        color: "white",
                        fontWeight: "bold",
                        backgroundColor: theme.palette.primary.light,
                      }}
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredMedicines.length > 0 ? (
                    filteredMedicines.map((medicine) => (
                      <TableRow
                        key={medicine.MMC_MATERIAL_CODE}
                        ref={(el) =>
                          (rowRefs.current[medicine.MMC_MATERIAL_CODE] = el)
                        }
                        sx={{
                          backgroundColor: getRowBackgroundColor(medicine),
                          transition: "background-color 0.3s ease",
                          "&:hover": {
                            backgroundColor: isLowStock(medicine)
                              ? theme.palette.error.light + "40"
                              : theme.palette.action.hover,
                          },
                        }}
                        hover
                      >
                        <TableCell>
                          {getItemTypeChip(medicine.MMC_TYPE)}
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            {isLowStock(medicine) && (
                              <Tooltip title="Low Stock">
                                <WarningIcon color="error" fontSize="small" />
                              </Tooltip>
                            )}
                            {medicine.MMC_DESCRIPTION}
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          {medicine.MMC_TYPE === "DRUG" ? (
                            <Tooltip title={`Code: ${medicine.MMC_UNIT || ""}`}>
                              <span>
                                {getUnitDisplayName(medicine.MMC_UNIT)}
                              </span>
                            </Tooltip>
                          ) : (
                            ""
                          )}
                        </TableCell>
                        <TableCell align="center">
                          {medicine.MMC_TYPE === "DRUG" ? (
                            <Typography
                              color={
                                isLowStock(medicine)
                                  ? "error.main"
                                  : "success.main"
                              }
                              fontWeight="bold"
                            >
                              {medicine.MMC_CURRENT_STOCK !== undefined &&
                              medicine.MMC_CURRENT_STOCK !== null
                                ? new Intl.NumberFormat("en-US").format(
                                    Number(medicine.MMC_CURRENT_STOCK),
                                  )
                                : "0"}
                            </Typography>
                          ) : (
                            ""
                          )}
                        </TableCell>
                        <TableCell align="center">
                          {medicine.MMC_TYPE === "DRUG" &&
                          medicine.MMC_REORDER_LEVEL
                            ? new Intl.NumberFormat("en-US").format(
                                Number(medicine.MMC_REORDER_LEVEL),
                              )
                            : ""}
                        </TableCell>
                        <TableCell align="center">
                          {medicine.MMC_STATUS === "A" ? (
                            <Typography color="success.main">Active</Typography>
                          ) : (
                            <Typography color="error.main">Inactive</Typography>
                          )}
                        </TableCell>
                        <TableCell align="center">
                          {medicine.MMC_RATE
                            ? new Intl.NumberFormat("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }).format(Number(medicine.MMC_RATE))
                            : "0.00"}
                        </TableCell>
                        <TableCell align="center">
                          <Stack
                            direction="row"
                            spacing={1}
                            justifyContent="center"
                          >
                            {medicine.MMC_TYPE === "DRUG" && (
                              <>
                                <Tooltip title="Stock In">
                                  <IconButton
                                    color="success"
                                    onClick={() =>
                                      handleOpenStockDialog(medicine, "in")
                                    }
                                    size="small"
                                  >
                                    <StockInIcon />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Stock Out">
                                  <IconButton
                                    color="warning"
                                    onClick={() =>
                                      handleOpenStockDialog(medicine, "out")
                                    }
                                    size="small"
                                  >
                                    <StockOutIcon />
                                  </IconButton>
                                </Tooltip>
                              </>
                            )}
                            <Tooltip title="Edit">
                              <IconButton
                                color="primary"
                                onClick={() => handleEdit(medicine)}
                                size="small"
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Deactivate">
                              <IconButton
                                color="error"
                                onClick={() =>
                                  inactivateItem(medicine.MMC_MATERIAL_CODE)
                                }
                                size="small"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        No items available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>

        {/* Add/Edit Item Dialog */}
        <Dialog
          open={openDialog}
          onClose={toggleDialog}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle
            sx={(theme) => ({
              color: theme.palette.primary.main,
              position: "relative",
            })}
          >
            <Typography
              variant="h4"
              fontWeight={600}
              sx={{ textAlign: "center" }}
            >
              {editMode ? "Edit Item" : "Add New Item"}
            </Typography>

            <IconButton
              aria-label="close"
              onClick={toggleDialog}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent>
            <form onSubmit={handleSubmit}>
              {/* Item Type Selection */}
              <Box sx={{ mb: 3, mt: 2 }}>
                <FormControl component="fieldset">
                  <Typography variant="subtitle1" gutterBottom>
                    Item Type
                  </Typography>
                  <RadioGroup
                    row
                    value={itemType}
                    onChange={handleItemTypeChange}
                  >
                    <FormControlLabel
                      value="DRUG"
                      control={<Radio />}
                      label="Drug"
                    />
                    <FormControlLabel
                      value="SERVICE"
                      control={<Radio />}
                      label="Service"
                    />
                  </RadioGroup>
                </FormControl>
              </Box>

              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Name"
                  name="MMC_DESCRIPTION"
                  value={form.MMC_DESCRIPTION}
                  placeholder={
                    itemType === "DRUG"
                      ? "Enter drug name"
                      : "Enter service name"
                  }
                  onChange={handleChange}
                  required
                />
              </Box>

              {itemType === "DRUG" && (
                <>
                  <Box sx={{ mb: 3 }}>
                    <FormControl fullWidth margin="normal">
                      <InputLabel id="unit-label">Unit of medicine</InputLabel>
                      <Select
                        labelId="unit-label"
                        name="MMC_UNIT"
                        value={form.MMC_UNIT}
                        onChange={handleChange}
                        label="Unit of medicine"
                        required
                        renderValue={(selected) => getUnitDisplayName(selected)}
                      >
                        <MenuItem value="">Select unit</MenuItem>
                        {Object.entries(UNIT_MAP).map(([code, name]) => (
                          <MenuItem key={code} value={code}>
                            {name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <NumericFormat
                      customInput={TextField}
                      fullWidth
                      margin="normal"
                      label="Current Stock"
                      name="MMC_CURRENT_STOCK"
                      value={form.MMC_CURRENT_STOCK}
                      onValueChange={(values) => {
                        const { value } = values;
                        handleChange({
                          target: {
                            name: "MMC_CURRENT_STOCK",
                            value: value,
                          },
                        });
                      }}
                      thousandSeparator
                      allowNegative={false}
                      placeholder="Enter current stock quantity"
                      required
                      isNumericString
                    />
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <NumericFormat
                      customInput={TextField}
                      fullWidth
                      margin="normal"
                      label="Reorder Level"
                      name="MMC_REORDER_LEVEL"
                      value={form.MMC_REORDER_LEVEL}
                      onValueChange={(values) => {
                        const { value } = values;
                        handleChange({
                          target: {
                            name: "MMC_REORDER_LEVEL",
                            value: value,
                          },
                        });
                      }}
                      thousandSeparator
                      allowNegative={false}
                      placeholder="Enter reorder level"
                      required
                      isNumericString
                    />
                  </Box>
                </>
              )}

              <Box sx={{ mb: 3 }}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="status-label">Status</InputLabel>
                  <Select
                    labelId="status-label"
                    name="MMC_STATUS"
                    value={form.MMC_STATUS}
                    onChange={handleChange}
                    label="Status"
                    required
                  >
                    <MenuItem value="A">Active</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Box sx={{ mb: 3 }}>
                <NumericFormat
                  customInput={TextField}
                  fullWidth
                  margin="normal"
                  label="Rate (Rs)"
                  name="MMC_RATE"
                  value={form.MMC_RATE}
                  placeholder="ex: 100.00"
                  onValueChange={(values) => {
                    const { value } = values;
                    handleChange({
                      target: {
                        name: "MMC_RATE",
                        value: value,
                      },
                    });
                  }}
                  thousandSeparator
                  allowNegative={false}
                  decimalScale={2}
                  fixedDecimalScale
                  isNumericString
                  required
                />
              </Box>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <DialogActions>
                <Button onClick={toggleDialog}>Cancel</Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={24} />
                  ) : editMode ? (
                    "Update Item"
                  ) : (
                    "Register Item"
                  )}
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>

        {/* Stock In/Out Dialog */}
        <Dialog
          open={stockDialog.open}
          onClose={handleCloseStockDialog}
          fullWidth
          maxWidth="xs"
        >
          <DialogTitle
            sx={(theme) => ({
              color:
                stockDialog.type === "in"
                  ? theme.palette.success.main
                  : theme.palette.warning.main,
              position: "relative",
            })}
          >
            <Typography
              variant="h5"
              fontWeight={600}
              sx={{ textAlign: "center" }}
            >
              {stockDialog.type === "in" ? "Stock In" : "Stock Out"}
            </Typography>

            <IconButton
              aria-label="close"
              onClick={handleCloseStockDialog}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" gutterBottom>
                <strong>Medicine:</strong> {stockDialog.materialDescription}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Code:</strong> {stockDialog.materialCode}
              </Typography>

              <Box sx={{ mt: 3 }}>
                <NumericFormat
                  customInput={TextField}
                  fullWidth
                  label={`Quantity to ${stockDialog.type === "in" ? "add" : "remove"}`}
                  value={stockDialog.quantity}
                  onValueChange={(values) => {
                    const { value } = values;
                    setStockDialog((prev) => ({
                      ...prev,
                      quantity: value,
                    }));
                  }}
                  thousandSeparator
                  allowNegative={false}
                  placeholder="Enter quantity"
                  required
                  isNumericString
                  autoFocus
                />
              </Box>
            </Box>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleCloseStockDialog}>Cancel</Button>
            <Button
              onClick={handleStockInOut}
              variant="contained"
              color={stockDialog.type === "in" ? "success" : "warning"}
              disabled={stockLoading || !stockDialog.quantity}
            >
              {stockLoading ? (
                <CircularProgress size={24} />
              ) : (
                `Confirm ${stockDialog.type === "in" ? "Stock In" : "Stock Out"}`
              )}
            </Button>
          </DialogActions>
        </Dialog>

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
      </Paper>
    </Container>
  );
}
