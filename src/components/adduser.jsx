// //Admin Side Add Users button clicked it navigate to this

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import "../styles/addUser.css";
// import { MdDelete } from "react-icons/md";
// import { Bar } from "react-chartjs-2"; // Import Bar chart from react-chartjs-2
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
// } from "chart.js";

// ChartJS.register(CategoryScale, LinearScale, BarElement, Title); // Register required chart components

// const Adduser = () => {
//   const [error, setError] = useState("");
//   const [searchQuery, setSearchQuery] = useState("");
//   const Name = localStorage.getItem("Name");
//   const navigate = useNavigate();
//   const [popup, setPopup] = useState(false);
//   const [users, setUsers] = useState([]);

//   const [uerror, setUerror] = useState(""); //error state to display the username already exists

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const fetchUsers = async () => {
//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API_BASE_URL}/User`
//       );
//       setUsers(response.data);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     // Validate email format
//     if (name === "MUD_EMAIL") {
//       const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//       if (!emailRegex.test(value)) {
//         setError("Please enter a valid email address.");
//       } else {
//         setError(""); // Clear error if email is valid
//       }
//     }

//     setFormData((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }));
//   };

//   const [formData, setFormData] = useState({
//     MUD_USER_NAME: "",
//     MUD_PASSWORD: "",
//     MUD_USER_TYPE: "Doc",
//     MUD_STATUS: "A",
//     MUD_CREATED_DATE: new Date().toISOString(),
//     MUD_UPDATE_DATE: new Date().toISOString(),
//     MUD_USER_ID: "",
//     MUD_UPDATED_BY: "",
//     MUD_CREATED_BY: "",
//     MUD_SPECIALIZATION: "",
//     MUD_EMAIL: "",
//     MUD_FULL_NAME: "",
//   });

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Email format validation
//     const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//     if (!emailRegex.test(formData.MUD_EMAIL)) {
//       setError("Please enter a valid email address.");
//       return;
//     }

//     const formDataToSend = new FormData();
//     Object.keys(formData).forEach((key) => {
//       formDataToSend.append(key, formData[key]);
//     });

//     try {
//       const response = await axios.post(
//         `${process.env.REACT_APP_API_BASE_URL}/User`,
//         formDataToSend,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );
//       alert("User registered successfully");
//       setUsers([...users, response.data]); // Dynamically update the user list
//       setFormData({
//         MUD_USER_NAME: "",
//         MUD_PASSWORD: "",
//         MUD_USER_TYPE: "Doc",
//         MUD_STATUS: "A",
//         MUD_CREATED_DATE: new Date().toISOString(),
//         MUD_UPDATE_DATE: new Date().toISOString(),
//         MUD_USER_ID: "",
//         MUD_UPDATED_BY: Name,
//         MUD_CREATED_BY: "",
//         MUD_SPECIALIZATION: "",
//         MUD_FULL_NAME: "",
//         MUD_EMAIL: "",
//       });
//       setPopup(false);
//       setError("");
//     } catch (error) {
//       if (error.response?.data?.error === "Email already exists.") {
//         setError(
//           "This email is already registered. Please use a different email."
//         );
//       } else if (error.response?.data?.error === "Username already exists.") {
//         setUerror("Username already exists.");
//       } else if (error.response?.data?.errors) {
//         const errorMessages = Object.values(error.response.data.errors)
//           .flat()
//           .join(", ");
//         setError(errorMessages);
//       } else {
//         setError("An unexpected error occurred.");
//       }
//     }
//   };

//   const Deleteuser = async (id) => {
//     if (window.confirm("Are you sure you want to delete this user?")) {
//       try {
//         await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/User/${id}`);
//         alert("User deleted successfully");
//         setUsers(users.filter((user) => user.MUD_USER_ID !== id)); // Update users state
//       } catch (error) {
//         console.error(
//           "Error deleting user:",
//           error.response?.data || error.message
//         );
//         alert("Failed to delete user.");
//       }
//     }
//   };

//   const mapUserCategory = (userType) => {
//     switch (userType) {
//       case "Doc":
//         return "Doctor";
//       case "Phuser":
//         return "Pharmacy User";
//       case "Admin":
//         return "Administrator";
//       case "staff":
//         return "Staff";
//       default:
//         return userType;
//     }
//   };

//   // Filter users based on search query
//   const filteredUsers = users.filter(
//     (user) =>
//       user.MUD_FULL_NAME.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       user.MUD_USER_NAME.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   // Prepare data for the chart
//   const userCounts = filteredUsers.reduce((acc, user) => {
//     const category = mapUserCategory(user.MUD_USER_TYPE);
//     acc[category] = (acc[category] || 0) + 1;
//     return acc;
//   }, {});

//   const chartData = {
//     labels: Object.keys(userCounts),
//     datasets: [
//       {
//         label: "Number of Users",
//         data: Object.values(userCounts),
//         backgroundColor: "rgba(75, 192, 192, 0.6)",
//       },
//     ],
//   };

//   return (
//     <div className="add-user-container">
//       <h2>Healthcare providers</h2>
//       <div className="search-container1">
//         <input
//           type="text"
//           placeholder="Search users by name"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//         />
//         <button onClick={() => setPopup(true)} className="open-popup-btn">
//           Add User
//         </button>
//       </div>

//       <div className="user-table-container">
//         <table className="users-table">
//           <thead>
//             <tr>
//               <th>User ID</th>
//               <th>User name</th>
//               <th> Email</th>
//               <th>User Category</th>
//               <th>Name</th>
//               <th>Specialization</th>

//               <th>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredUsers.map((user) => (
//               <tr key={user.MUD_USER_ID}>
//                 <td>{user.MUD_USER_ID || "Not valid"}</td>
//                 <td>{user.MUD_USER_NAME || "Not valid"}</td>
//                 <td>{user.MUD_EMAIL || "Not valid"}</td>
//                 <td>{mapUserCategory(user.MUD_USER_TYPE) || "Not valid"}</td>
//                 <td>{user.MUD_FULL_NAME}</td>
//                 <td>{user.MUD_SPECIALIZATION || "Not valid"}</td>
//                 <td>
//                   <button
//                     className="btn-delete"
//                     onClick={() => Deleteuser(user.MUD_USER_ID)}
//                   >
//                     <MdDelete />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* When user clicks Add User button it opens this modal */}
//       {popup && (
//         <div className="popup-container">
//           <div className="popup-content4">
//             <button className="close-popup-btn" onClick={() => setPopup(false)}>
//               X
//             </button>
//             <h1 className="register-header">Add a New User</h1>

//             <form className="register-form" onSubmit={handleSubmit}>
//               <div className="input-group">
//                 <label>Username</label>
//                 <input
//                   type="text"
//                   placeholder="Enter username"
//                   name="MUD_USER_NAME"
//                   value={formData.MUD_USER_NAME}
//                   onChange={handleChange}
//                   required
//                 />

//                 {uerror && <p className="error-message1">{uerror}</p>}
//               </div>

//               <div className="input-group">
//                 <label>Email</label>

//                 <input
//                   type="email"
//                   placeholder="enter email"
//                   name="MUD_EMAIL"
//                   value={formData.MUD_EMAIL}
//                   onChange={handleChange}
//                   required
//                 />
//                 {error && <p className="error-message1">{error}</p>}
//               </div>
//               <div className="input-group">
//                 <label>Password</label>
//                 <input
//                   type="password"
//                   placeholder="Enter password"
//                   name="MUD_PASSWORD"
//                   value={formData.MUD_PASSWORD}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               <div className="input-group">
//                 <label>Name</label>
//                 <input
//                   type="text"
//                   placeholder="Enter your  name"
//                   name="MUD_FULL_NAME"
//                   value={formData.MUD_FULL_NAME}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               <div className="input-group">
//                 <label>User Type</label>
//                 <select
//                   name="MUD_USER_TYPE"
//                   value={formData.MUD_USER_TYPE}
//                   onChange={handleChange}
//                 >
//                   <option value="">Select</option>
//                   <option value="Admin">Admin</option>
//                   <option value="Doc">Doctor</option>
//                   <option value="staff">Staff</option>
//                   <option value="Phuser">Pharmacy user</option>
//                 </select>
//               </div>
//               <div className="input-group">
//                 <label>Specialization</label>
//                 <select
//                   name="MUD_SPECIALIZATION"
//                   value={formData.MUD_SPECIALIZATION}
//                   onChange={handleChange}
//                 >
//                   <option>Select specializaton for doctors only</option>

//                   <option value="psychiatrist">Psychiatrist</option>
//                   <option value="cardiologist">Cardiologist</option>
//                   <option value="neurologist">Neurologist</option>
//                   <option value="gynecologist">Gynecologist</option>
//                   <option value="pediatrician">Pediatrician</option>
//                   <option value="immunologist">Immunologist</option>
//                   <option value="general_practitioner">
//                     General Practitioner
//                   </option>
//                 </select>
//               </div>
//               <button type="submit" className="register-btn">
//                 Register
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Adduser;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import {
//   Box,
//   Button,
//   Card,
//   CardContent,
//   CircularProgress,
//   Container,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   Divider,
//   Grid,
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
//   useTheme,
//   useMediaQuery,
//   Snackbar,
//   Alert,
//   Chip,
//   Avatar,
//   InputAdornment,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
// } from "@mui/material";
// import {
//   Add as AddIcon,
//   Delete as DeleteIcon,
//   Search as SearchIcon,
//   Person as PersonIcon,
//   Email as EmailIcon,
//   Category as CategoryIcon,
//   MedicalServices as MedicalIcon,
//   Close as CloseIcon,
//   CheckCircle as CheckCircleIcon,
//   Lock as LockIcon,
// } from "@mui/icons-material";

// const AddUser = () => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
//   const navigate = useNavigate();
//   const [error, setError] = useState("");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [openDialog, setOpenDialog] = useState(false);
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [snackbarOpen, setSnackbarOpen] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState("");
//   const [snackbarSeverity, setSnackbarSeverity] = useState("success");
//   const Name = localStorage.getItem("Name");
//   const [usernameError, setUsernameError] = useState("");
//   const [emailError, setEmailError] = useState("");
//   // const [formData, setFormData] = useState({
//   //   MUD_USER_NAME: "",
//   //   MUD_PASSWORD: "",
//   //   MUD_USER_TYPE: "Doc",
//   //   MUD_STATUS: "A",
//   //   MUD_CREATED_DATE: new Date().toISOString(),
//   //   MUD_UPDATE_DATE: new Date().toISOString(),
//   //   MUD_USER_ID: "",
//   //   MUD_UPDATED_BY: Name,
//   //   MUD_CREATED_BY: Name,
//   //   MUD_SPECIALIZATION: "",
//   //   MUD_EMAIL: "",
//   //   MUD_FULL_NAME: "",
//   // });
//   const [formData, setFormData] = useState({
//     MUD_USER_NAME: "",
//     MUD_PASSWORD: "",
//     MUD_USER_TYPE: "Doc",
//     MUD_STATUS: "A",
//     MUD_CREATED_DATE: new Date().toISOString(),
//     MUD_UPDATE_DATE: new Date().toISOString(),
//     MUD_USER_ID: "",
//     MUD_UPDATED_BY: Name ? Name.substring(0, 7) : "",
//     MUD_CREATED_BY: Name ? Name.substring(0, 7) : "",
//     MUD_SPECIALIZATION: "",
//     MUD_EMAIL: "",
//     MUD_FULL_NAME: "",
//   });

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const fetchUsers = async () => {
//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API_BASE_URL}/User`
//       );
//       setUsers(response.data);
//     } catch (error) {
//       console.error(error);
//       showSnackbar("Failed to fetch users", "error");
//     }
//   };

//   // const handleChange = (e) => {
//   //   const { name, value } = e.target;
//   //   setFormData((prevState) => ({
//   //     ...prevState,
//   //     [name]: value,
//   //   }));

//   //   // Validate email format
//   //   if (name === "MUD_EMAIL") {
//   //     const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//   //     if (!emailRegex.test(value)) {
//   //       setError("Please enter a valid email address.");
//   //     } else {
//   //       setError("");
//   //     }
//   //   }
//   // };
//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     let processedValue = value;
//     if (name === "MUD_UPDATED_BY" || name === "MUD_CREATED_BY") {
//       processedValue = value.substring(0, 7);
//     }

//     setFormData((prevState) => ({
//       ...prevState,
//       [name]: processedValue,
//     }));

//     if (name === "MUD_EMAIL") {
//       const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//       if (!emailRegex.test(value)) {
//         setError("Please enter a valid email address.");
//       } else {
//         setError("");
//       }
//     }
//   };

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();
//   //   setLoading(true);

//   //   const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//   //   if (!emailRegex.test(formData.MUD_EMAIL)) {
//   //     setError("Please enter a valid email address.");
//   //     setLoading(false);
//   //     return;
//   //   }

//   //   const formDataToSend = new FormData();
//   //   Object.keys(formData).forEach((key) => {
//   //     formDataToSend.append(key, formData[key]);
//   //   });

//   //   try {
//   //     const response = await axios.post(
//   //       `${process.env.REACT_APP_API_BASE_URL}/User`,
//   //       formDataToSend,
//   //       {
//   //         headers: {
//   //           "Content-Type": "multipart/form-data",
//   //         },
//   //       }
//   //     );
//   //     showSnackbar("User registered successfully", "success");
//   //     setUsers([...users, response.data]);
//   //     resetForm();
//   //     setOpenDialog(false);
//   //   } catch (error) {
//   //     if (error.response?.data?.error === "Email already exists.") {
//   //       setError(
//   //         "This email is already registered. Please use a different email."
//   //       );
//   //     } else if (error.response?.data?.error === "Username already exists.") {
//   //       setError("Username already exists.");
//   //     } else if (error.response?.data?.errors) {
//   //       const errorMessages = Object.values(error.response.data.errors)
//   //         .flat()
//   //         .join(", ");
//   //       setError(errorMessages);
//   //     } else {
//   //       setError("An unexpected error occurred.");
//   //     }
//   //     showSnackbar("Failed to register user", "error");
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   // const resetForm = () => {
//   //   setFormData({
//   //     MUD_USER_NAME: "",
//   //     MUD_PASSWORD: "",
//   //     MUD_USER_TYPE: "Doc",
//   //     MUD_STATUS: "A",
//   //     MUD_CREATED_DATE: new Date().toISOString(),
//   //     MUD_UPDATE_DATE: new Date().toISOString(),
//   //     MUD_USER_ID: "",
//   //     MUD_UPDATED_BY: Name,
//   //     MUD_CREATED_BY: Name,
//   //     MUD_SPECIALIZATION: "",
//   //     MUD_FULL_NAME: "",
//   //     MUD_EMAIL: "",
//   //   });
//   //   setError("");
//   // };
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     setUsernameError("");
//     setEmailError("");
//     setError("");

//     const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//     if (!emailRegex.test(formData.MUD_EMAIL)) {
//       setEmailError("Please enter a valid email address.");
//       setLoading(false);
//       return;
//     }

//     const formDataToSend = new FormData();
//     Object.keys(formData).forEach((key) => {
//       formDataToSend.append(key, formData[key]);
//     });

//     try {
//       const response = await axios.post(
//         `${process.env.REACT_APP_API_BASE_URL}/User`,
//         formDataToSend,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );
//       showSnackbar("User registered successfully", "success");
//       setUsers([...users, response.data]);
//       resetForm();
//       setOpenDialog(false);
//     } catch (error) {
//       if (error.response?.data?.error === "Email already exists.") {
//         setEmailError("This email is already registered. Please use a different email.");
//       } else if (error.response?.data?.error === "Username already exists.") {
//         setUsernameError("Username already exists.");
//       } else if (error.response?.data?.errors) {
//         const errorMessages = Object.values(error.response.data.errors)
//           .flat()
//           .join(", ");
//         setError(errorMessages);
//       } else {
//         setError("An unexpected error occurred.");
//       }
//       showSnackbar("Failed to register user", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       MUD_USER_NAME: "",
//       MUD_PASSWORD: "",
//       MUD_USER_TYPE: "Doc",
//       MUD_STATUS: "A",
//       MUD_CREATED_DATE: new Date().toISOString(),
//       MUD_UPDATE_DATE: new Date().toISOString(),
//       MUD_USER_ID: "",
//       MUD_UPDATED_BY: Name ? Name.substring(0, 7) : "",
//       MUD_CREATED_BY: Name ? Name.substring(0, 7) : "",
//       MUD_SPECIALIZATION: "",
//       MUD_FULL_NAME: "",
//       MUD_EMAIL: "",
//     });
//     setError("");
//     setUsernameError("");
//     setEmailError("");
//   };

//   const deleteUser = async (id) => {
//     if (window.confirm("Are you sure you want to delete this user?")) {
//       try {
//         await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/User/${id}`);
//         showSnackbar("User deleted successfully", "success");
//         setUsers(users.filter((user) => user.MUD_USER_ID !== id));
//       } catch (error) {
//         console.error(
//           "Error deleting user:",
//           error.response?.data || error.message
//         );
//         showSnackbar("Failed to delete user", "error");
//       }
//     }
//   };

//   const mapUserCategory = (userType) => {
//     switch (userType) {
//       case "Doc":
//         return "Doctor";
//       case "Phuser":
//         return "Pharmacy";
//       case "Admin":
//         return "Admin";
//       case "staff":
//         return "Staff";
//       default:
//         return userType;
//     }
//   };

//   const getUserColor = (userType) => {
//     switch (userType) {
//       case "Doc":
//         return "primary";
//       case "Phuser":
//         return "secondary";
//       case "Admin":
//         return "error";
//       case "staff":
//         return "warning";
//       default:
//         return "default";
//     }
//   };

//   const filteredUsers = users.filter(
//     (user) =>
//       user.MUD_FULL_NAME?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       user.MUD_USER_NAME?.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const userCounts = filteredUsers.reduce((acc, user) => {
//     const category = mapUserCategory(user.MUD_USER_TYPE);
//     acc[category] = (acc[category] || 0) + 1;
//     return acc;
//   }, {});

//   const chartData = {
//     labels: Object.keys(userCounts),
//     datasets: [
//       {
//         label: "Number of Users",
//         data: Object.values(userCounts),
//         backgroundColor: [
//           theme.palette.primary.main,
//           theme.palette.secondary.main,
//           theme.palette.error.main,
//           theme.palette.warning.main,
//         ],
//         borderColor: [
//           theme.palette.primary.dark,
//           theme.palette.secondary.dark,
//           theme.palette.error.dark,
//           theme.palette.warning.dark,
//         ],
//         borderWidth: 1,
//       },
//     ],
//   };

//   const showSnackbar = (message, severity = "success") => {
//     setSnackbarMessage(message);
//     setSnackbarSeverity(severity);
//     setSnackbarOpen(true);
//   };

//   const handleSnackbarClose = () => {
//     setSnackbarOpen(false);
//   };

//   return (
//     <Container maxWidth="xl" sx={{ py: 2 }}>
//       <Paper elevation={3} sx={{ p: 4 }}>
//         <Typography
//           variant="h4"
//           component="h1"
//           gutterBottom
//           color="primary"
//           fontWeight={600}
//           align="center"
//         >
//           User Management
//         </Typography>

//         <Box
//           sx={{
//             display: "flex",
//             flexDirection: isMobile ? "column" : "row",
//             gap: 2,
//             mb: 2,
//             alignItems: isMobile ? "stretch" : "center",
//           }}
//         >
//           <TextField
//             variant="outlined"
//             placeholder="Search users by name or username"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             fullWidth={isMobile}
//             sx={{
//               width: isMobile ? "100%" : "auto",
//               flexGrow: isMobile ? 0 : 1,
//               maxWidth: isMobile ? "none" : "1250px",
//               minWidth: isMobile ? "auto" : "400px",
//             }}
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <SearchIcon />
//                 </InputAdornment>
//               ),
//             }}
//           />

//           <Box
//             sx={{
//               display: "flex",
//               gap: 2,
//               width: isMobile ? "100%" : "auto",
//               flexShrink: 0,
//             }}
//           >
//             <Button
//               variant="contained"
//               startIcon={<AddIcon />}
//               onClick={() => setOpenDialog(true)}
//               fullWidth={isMobile}
//               sx={{
//                 height: isMobile ? "auto" : "56px",
//                 minWidth: isMobile ? "auto" : "140px",
//                 whiteSpace: "nowrap",
//               }}
//             >
//               Add User
//             </Button>
//           </Box>
//         </Box>

//         <Box
//           sx={{
//             width: "100%",
//             overflowX: "auto",
//             mt: 1,
//           }}
//         >
//           <Card>
//             <CardContent>
//               <Typography
//                 variant="h6"
//                 component="h2"
//                 gutterBottom
//                 sx={{ mb: 2 }}
//                 color="primary"
//                 fontWeight={600}
//               >
//                 User List
//               </Typography>
//               <TableContainer sx={{ maxHeight: 580 }}>
//                 <Table
//                   size={isMobile ? "small" : "medium"}
//                   sx={{
//                     minWidth: isMobile ? "auto" : 650,
//                     "& .MuiTableCell-root": {
//                       whiteSpace: "nowrap",
//                       overflow: "hidden",
//                       textOverflow: "ellipsis",
//                       maxWidth: isMobile ? "150px" : "none",
//                     },
//                   }}
//                 >
//                   <TableHead
//                     sx={{ backgroundColor: theme.palette.primary.light }}
//                   >
//                     <TableRow>
//                       <TableCell
//                         sx={{
//                           color: "white",
//                           fontWeight: "bold",
//                           minWidth: 200,
//                         }}
//                       >
//                         User
//                       </TableCell>
//                       <TableCell
//                         sx={{
//                           color: "white",
//                           fontWeight: "bold",
//                           minWidth: 200,
//                         }}
//                       >
//                         Email
//                       </TableCell>
//                       <TableCell
//                         sx={{
//                           color: "white",
//                           fontWeight: "bold",
//                           minWidth: 120,
//                         }}
//                       >
//                         Category
//                       </TableCell>
//                       <TableCell
//                         sx={{
//                           color: "white",
//                           fontWeight: "bold",
//                           minWidth: 150,
//                         }}
//                       >
//                         Specialization
//                       </TableCell>
//                       <TableCell
//                         align="center"
//                         sx={{
//                           color: "white",
//                           fontWeight: "bold",
//                           minWidth: 100,
//                         }}
//                       >
//                         Actions
//                       </TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {filteredUsers.length > 0 ? (
//                       filteredUsers.map((user) => (
//                         <TableRow key={user.MUD_USER_ID} hover>
//                           <TableCell>
//                             <Box sx={{ display: "flex", alignItems: "center" }}>
//                               <Avatar
//                                 sx={{
//                                   mr: 2,
//                                   bgcolor: theme.palette.primary.main,
//                                 }}
//                               >
//                                 {user.MUD_FULL_NAME?.charAt(0) || "U"}
//                               </Avatar>
//                               <Box sx={{ minWidth: 0 }}>
//                                 <Typography variant="subtitle2" noWrap>
//                                   {user.MUD_FULL_NAME || "N/A"}
//                                 </Typography>
//                                 <Typography
//                                   variant="caption"
//                                   color="text.secondary"
//                                   noWrap
//                                 >
//                                   @{user.MUD_USER_NAME}
//                                 </Typography>
//                               </Box>
//                             </Box>
//                           </TableCell>
//                           <TableCell>
//                             <Typography variant="body2" noWrap>
//                               {user.MUD_EMAIL || "N/A"}
//                             </Typography>
//                           </TableCell>
//                           <TableCell>
//                             <Chip
//                               label={mapUserCategory(user.MUD_USER_TYPE)}
//                               color={getUserColor(user.MUD_USER_TYPE)}
//                               size="small"
//                             />
//                           </TableCell>
//                           <TableCell noWrap>
//                             {user.MUD_SPECIALIZATION || "N/A"}
//                           </TableCell>
//                           <TableCell align="center">
//                             <IconButton
//                               color="error"
//                               onClick={() => deleteUser(user.MUD_USER_ID)}
//                               aria-label="delete"
//                             >
//                               <DeleteIcon />
//                             </IconButton>
//                           </TableCell>
//                         </TableRow>
//                       ))
//                     ) : (
//                       <TableRow>
//                         <TableCell colSpan={5} align="center">
//                           <Typography variant="body1" color="text.secondary">
//                             No users found
//                           </Typography>
//                         </TableCell>
//                       </TableRow>
//                     )}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             </CardContent>
//           </Card>
//         </Box>

//         <Dialog
//           open={openDialog}
//           onClose={() => setOpenDialog(false)}
//           fullWidth
//           maxWidth="sm"
//         >
//           <DialogTitle>
//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 position: "relative",
//               }}
//             >
//               <Typography
//                 variant="h4"
//                 fontWeight={600}
//                 sx={{ color: "primary.main", textAlign: "center" }}
//               >
//                 Add New User
//               </Typography>

//               <IconButton
//                 onClick={() => setOpenDialog(false)}
//                 sx={{
//                   position: "absolute",
//                   right: 0,
//                 }}
//               >
//                 <CloseIcon />
//               </IconButton>
//             </Box>
//           </DialogTitle>
//           <DialogContent dividers>
//             <form onSubmit={handleSubmit}>
//               <Grid container spacing={2}>
//                 <Grid item xs={12}>
//                   <TextField
//                     fullWidth
//                     label="Full Name"
//                     name="MUD_FULL_NAME"
//                     value={formData.MUD_FULL_NAME}
//                     onChange={handleChange}
//                     required
//                     InputProps={{
//                       startAdornment: (
//                         <InputAdornment position="start">
//                           <PersonIcon sx={{ color: "primary.main" }} />
//                         </InputAdornment>
//                       ),
//                     }}
//                   />
//                 </Grid>

//                 {/* <Grid item xs={12}>
//                   <TextField
//                     fullWidth
//                     label="Username"
//                     name="MUD_USER_NAME"
//                     value={formData.MUD_USER_NAME}
//                     onChange={handleChange}
//                     required
//                     InputProps={{
//                       startAdornment: (
//                         <InputAdornment>
//                           <PersonIcon sx={{ color: "primary.main" }} />
//                         </InputAdornment>
//                       ),
//                     }}
//                   />
//                 </Grid> */}

//                 <Grid item xs={12}>
//                   <TextField
//                     fullWidth
//                     label="Username"
//                     name="MUD_USER_NAME"
//                     value={formData.MUD_USER_NAME}
//                     onChange={handleChange}
//                     required
//                     error={!!usernameError}
//                     helperText={usernameError}
//                     InputProps={{
//                       startAdornment: (
//                         <InputAdornment>
//                           <PersonIcon sx={{ color: "primary.main" }} />
//                         </InputAdornment>
//                       ),
//                     }}
//                   />
//                 </Grid>

//                 {/* <Grid item xs={12}>
//                   <TextField
//                     fullWidth
//                     label="Email"
//                     name="MUD_EMAIL"
//                     type="email"
//                     value={formData.MUD_EMAIL}
//                     onChange={handleChange}
//                     required
//                     error={!!error}
//                     helperText={error}
//                     InputProps={{
//                       startAdornment: (
//                         <InputAdornment position="start">
//                           <EmailIcon sx={{ color: "primary.main" }} />
//                         </InputAdornment>
//                       ),
//                     }}
//                   />
//                 </Grid> */}
//                 <Grid item xs={12}>
//                   <TextField
//                     fullWidth
//                     label="Email"
//                     name="MUD_EMAIL"
//                     type="email"
//                     value={formData.MUD_EMAIL}
//                     onChange={handleChange}
//                     required
//                     error={!!emailError}
//                     helperText={emailError}
//                     InputProps={{
//                       startAdornment: (
//                         <InputAdornment position="start">
//                           <EmailIcon sx={{ color: "primary.main" }} />
//                         </InputAdornment>
//                       ),
//                     }}
//                   />
//                 </Grid>

//                 <Grid item xs={12}>
//                   <TextField
//                     fullWidth
//                     label="Password"
//                     name="MUD_PASSWORD"
//                     type="password"
//                     value={formData.MUD_PASSWORD}
//                     onChange={handleChange}
//                     required
//                     InputProps={{
//                       startAdornment: (
//                         <InputAdornment>
//                           <LockIcon sx={{ color: "primary.main" }} />
//                         </InputAdornment>
//                       ),
//                     }}
//                   />
//                 </Grid>

//                 <Grid item xs={12}>
//                   <Box
//                     sx={{
//                       display: "flex",
//                       flexDirection: { xs: "column", md: "row" },
//                       gap: 2,
//                       justifyContent: "space-between",
//                     }}
//                   >
//                     <FormControl
//                       fullWidth
//                       sx={{
//                         flex: 1,
//                         minWidth: { md: "270px" },
//                       }}
//                     >
//                       <InputLabel>User Type</InputLabel>
//                       <Select
//                         name="MUD_USER_TYPE"
//                         value={formData.MUD_USER_TYPE}
//                         onChange={handleChange}
//                         label="User Type"
//                         required
//                       >
//                         <MenuItem value="Admin">Admin</MenuItem>
//                         <MenuItem value="Doc">Doctor</MenuItem>
//                         <MenuItem value="staff">Staff</MenuItem>
//                         <MenuItem value="Phuser">Pharmacy</MenuItem>
//                       </Select>
//                     </FormControl>

//                     <FormControl
//                       fullWidth
//                       sx={{
//                         flex: 1,
//                         minWidth: { md: "265px" },
//                       }}
//                     >
//                       <InputLabel>Specialization</InputLabel>
//                       <Select
//                         name="MUD_SPECIALIZATION"
//                         value={formData.MUD_SPECIALIZATION}
//                         onChange={handleChange}
//                         label="Specialization"
//                         disabled={formData.MUD_USER_TYPE !== "Doc"}
//                       >
//                         <MenuItem value="">None</MenuItem>
//                         <MenuItem value="psychiatrist">Psychiatrist</MenuItem>
//                         <MenuItem value="cardiologist">Cardiologist</MenuItem>
//                         <MenuItem value="neurologist">Neurologist</MenuItem>
//                         <MenuItem value="gynecologist">Gynecologist</MenuItem>
//                         <MenuItem value="pediatrician">Pediatrician</MenuItem>
//                         <MenuItem value="immunologist">Immunologist</MenuItem>
//                         <MenuItem value="general_practitioner">
//                           General Practitioner
//                         </MenuItem>
//                       </Select>
//                     </FormControl>
//                   </Box>
//                 </Grid>
//               </Grid>
//             </form>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
//             <Button
//               variant="contained"
//               onClick={handleSubmit}
//               disabled={loading}
//               startIcon={
//                 loading ? (
//                   <CircularProgress size={20} color="inherit" />
//                 ) : (
//                   <CheckCircleIcon />
//                 )
//               }
//             >
//               {loading ? "Registering..." : "Register"}
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
// };

// export default AddUser;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
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
  useTheme,
  useMediaQuery,
  Snackbar,
  Alert,
  Chip,
  Avatar,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Autocomplete,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Category as CategoryIcon,
  MedicalServices as MedicalIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Lock as LockIcon,
  AddCircle as AddCircleIcon,
} from "@mui/icons-material";

const AddUser = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [openSpecializationDialog, setOpenSpecializationDialog] =
    useState(false);
  const [users, setUsers] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [newSpecialization, setNewSpecialization] = useState("");
  const [loadingSpecializations, setLoadingSpecializations] = useState(false);
  const [addingSpecialization, setAddingSpecialization] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const Name = localStorage.getItem("Name");
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [formData, setFormData] = useState({
    MUD_USER_NAME: "",
    MUD_PASSWORD: "",
    MUD_USER_TYPE: "Doc",
    MUD_STATUS: "A",
    MUD_CREATED_DATE: new Date().toISOString(),
    MUD_UPDATE_DATE: new Date().toISOString(),
    MUD_USER_ID: "",
    MUD_UPDATED_BY: Name ? Name.substring(0, 7) : "",
    MUD_CREATED_BY: Name ? Name.substring(0, 7) : "",
    MUD_SPECIALIZATION: "",
    MUD_EMAIL: "",
    MUD_FULL_NAME: "",
  });

  useEffect(() => {
    fetchUsers();
    fetchSpecializations();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/User`,
      );
      setUsers(response.data);
    } catch (error) {
      console.error(error);
      showSnackbar("Failed to fetch users", "error");
    }
  };

  const fetchSpecializations = async () => {
    setLoadingSpecializations(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/User/specializations`,
      );
      // Assuming the response is an array of strings
      setSpecializations(response.data);
    } catch (error) {
      console.error("Error fetching specializations:", error);
      showSnackbar("Failed to fetch specializations", "error");
    } finally {
      setLoadingSpecializations(false);
    }
  };

  const handleAddSpecialization = async () => {
    if (!newSpecialization.trim()) {
      showSnackbar("Please enter a specialization name", "warning");
      return;
    }

    setAddingSpecialization(true);
    try {
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/User/specializations`,
        newSpecialization.trim(),
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      showSnackbar("Specialization added successfully", "success");
      setNewSpecialization("");
      setOpenSpecializationDialog(false);
      // Refresh the specializations list
      await fetchSpecializations();
    } catch (error) {
      console.error("Error adding specialization:", error);
      showSnackbar("Failed to add specialization", "error");
    } finally {
      setAddingSpecialization(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    let processedValue = value;
    if (name === "MUD_UPDATED_BY" || name === "MUD_CREATED_BY") {
      processedValue = value.substring(0, 7);
    }

    setFormData((prevState) => ({
      ...prevState,
      [name]: processedValue,
    }));

    if (name === "MUD_EMAIL") {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(value)) {
        setError("Please enter a valid email address.");
      } else {
        setError("");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    setUsernameError("");
    setEmailError("");
    setError("");

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.MUD_EMAIL)) {
      setEmailError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/User`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      showSnackbar("User registered successfully", "success");
      setUsers([...users, response.data]);
      resetForm();
      setOpenDialog(false);
    } catch (error) {
      if (error.response?.data?.error === "Email already exists.") {
        setEmailError(
          "This email is already registered. Please use a different email.",
        );
      } else if (error.response?.data?.error === "Username already exists.") {
        setUsernameError("Username already exists.");
      } else if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors)
          .flat()
          .join(", ");
        setError(errorMessages);
      } else {
        setError("An unexpected error occurred.");
      }
      showSnackbar("Failed to register user", "error");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      MUD_USER_NAME: "",
      MUD_PASSWORD: "",
      MUD_USER_TYPE: "Doc",
      MUD_STATUS: "A",
      MUD_CREATED_DATE: new Date().toISOString(),
      MUD_UPDATE_DATE: new Date().toISOString(),
      MUD_USER_ID: "",
      MUD_UPDATED_BY: Name ? Name.substring(0, 7) : "",
      MUD_CREATED_BY: Name ? Name.substring(0, 7) : "",
      MUD_SPECIALIZATION: "",
      MUD_FULL_NAME: "",
      MUD_EMAIL: "",
    });
    setError("");
    setUsernameError("");
    setEmailError("");
  };

  const deleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/User/${id}`);
        showSnackbar("User deleted successfully", "success");
        setUsers(users.filter((user) => user.MUD_USER_ID !== id));
      } catch (error) {
        console.error(
          "Error deleting user:",
          error.response?.data || error.message,
        );
        showSnackbar("Failed to delete user", "error");
      }
    }
  };

  const mapUserCategory = (userType) => {
    switch (userType) {
      case "Doc":
        return "Doctor";
      case "Phuser":
        return "Pharmacy";
      case "Admin":
        return "Admin";
      case "staff":
        return "Staff";
      case "Laboratory":
        return "Laboratory";
      default:
        return userType;
    }
  };

  const getUserColor = (userType) => {
    switch (userType) {
      case "Doc":
        return "primary";
      case "Phuser":
        return "secondary";
      case "Admin":
        return "error";
      case "staff":
        return "warning";
      case "Laboratory":
        return "info";
      default:
        return "default";
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.MUD_FULL_NAME?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.MUD_USER_NAME?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const userCounts = filteredUsers.reduce((acc, user) => {
    const category = mapUserCategory(user.MUD_USER_TYPE);
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(userCounts),
    datasets: [
      {
        label: "Number of Users",
        data: Object.values(userCounts),
        backgroundColor: [
          theme.palette.primary.main,
          theme.palette.secondary.main,
          theme.palette.error.main,
          theme.palette.warning.main,
        ],
        borderColor: [
          theme.palette.primary.dark,
          theme.palette.secondary.dark,
          theme.palette.error.dark,
          theme.palette.warning.dark,
        ],
        borderWidth: 1,
      },
    ],
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
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
          User Management
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: 2,
            mb: 2,
            alignItems: isMobile ? "stretch" : "center",
          }}
        >
          <TextField
            variant="outlined"
            placeholder="Search users by name or username"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            fullWidth={isMobile}
            sx={{
              width: isMobile ? "100%" : "auto",
              flexGrow: isMobile ? 0 : 1,
              maxWidth: isMobile ? "none" : "1250px",
              minWidth: isMobile ? "auto" : "400px",
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
            sx={{
              display: "flex",
              gap: 2,
              width: isMobile ? "100%" : "auto",
              flexShrink: 0,
            }}
          >
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenDialog(true)}
              fullWidth={isMobile}
              sx={{
                height: isMobile ? "auto" : "56px",
                minWidth: isMobile ? "auto" : "140px",
                whiteSpace: "nowrap",
              }}
            >
              Add User
            </Button>
          </Box>
        </Box>

        <Box
          sx={{
            width: "100%",
            overflowX: "auto",
            mt: 1,
          }}
        >
          <Card>
            <CardContent>
              <Typography
                variant="h6"
                component="h2"
                gutterBottom
                sx={{ mb: 2 }}
                color="primary"
                fontWeight={600}
              >
                User List
              </Typography>
              <TableContainer sx={{ maxHeight: 580 }}>
                <Table
                  size={isMobile ? "small" : "medium"}
                  sx={{
                    minWidth: isMobile ? "auto" : 650,
                    "& .MuiTableCell-root": {
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: isMobile ? "150px" : "none",
                    },
                  }}
                >
                  <TableHead
                    sx={{ backgroundColor: theme.palette.primary.light }}
                  >
                    <TableRow>
                      <TableCell
                        sx={{
                          color: "white",
                          fontWeight: "bold",
                          minWidth: 200,
                        }}
                      >
                        User
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "white",
                          fontWeight: "bold",
                          minWidth: 200,
                        }}
                      >
                        Email
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "white",
                          fontWeight: "bold",
                          minWidth: 120,
                        }}
                      >
                        Category
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "white",
                          fontWeight: "bold",
                          minWidth: 150,
                        }}
                      >
                        Specialization
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          color: "white",
                          fontWeight: "bold",
                          minWidth: 100,
                        }}
                      >
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <TableRow key={user.MUD_USER_ID} hover>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Avatar
                                sx={{
                                  mr: 2,
                                  bgcolor: theme.palette.primary.main,
                                }}
                              >
                                {user.MUD_FULL_NAME?.charAt(0) || "U"}
                              </Avatar>
                              <Box sx={{ minWidth: 0 }}>
                                <Typography variant="subtitle2" noWrap>
                                  {user.MUD_FULL_NAME || "N/A"}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  noWrap
                                >
                                  @{user.MUD_USER_NAME}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" noWrap>
                              {user.MUD_EMAIL || "N/A"}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={mapUserCategory(user.MUD_USER_TYPE)}
                              color={getUserColor(user.MUD_USER_TYPE)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell noWrap>
                            {user.MUD_SPECIALIZATION || "N/A"}
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              color="error"
                              onClick={() => deleteUser(user.MUD_USER_ID)}
                              aria-label="delete"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          <Typography variant="body1" color="text.secondary">
                            No users found
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Box>

        {/* Add User Dialog */}
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <Typography
                variant="h4"
                fontWeight={600}
                sx={{ color: "primary.main", textAlign: "center" }}
              >
                Add New User
              </Typography>

              <IconButton
                onClick={() => setOpenDialog(false)}
                sx={{
                  position: "absolute",
                  right: 0,
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent dividers>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="MUD_FULL_NAME"
                    value={formData.MUD_FULL_NAME}
                    onChange={handleChange}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon sx={{ color: "primary.main" }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Username"
                    name="MUD_USER_NAME"
                    value={formData.MUD_USER_NAME}
                    onChange={handleChange}
                    required
                    error={!!usernameError}
                    helperText={usernameError}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment>
                          <PersonIcon sx={{ color: "primary.main" }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="MUD_EMAIL"
                    type="email"
                    value={formData.MUD_EMAIL}
                    onChange={handleChange}
                    required
                    error={!!emailError}
                    helperText={emailError}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon sx={{ color: "primary.main" }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Password"
                    name="MUD_PASSWORD"
                    type="password"
                    value={formData.MUD_PASSWORD}
                    onChange={handleChange}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment>
                          <LockIcon sx={{ color: "primary.main" }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", md: "row" },
                      gap: 2,
                      justifyContent: "space-between",
                    }}
                  >
                    <FormControl
                      fullWidth
                      sx={{
                        flex: 1,
                        minWidth: { md: "270px" },
                      }}
                    >
                      <InputLabel>User Type</InputLabel>
                      <Select
                        name="MUD_USER_TYPE"
                        value={formData.MUD_USER_TYPE}
                        onChange={handleChange}
                        label="User Type"
                        required
                      >
                        <MenuItem value="Admin">Admin</MenuItem>
                        <MenuItem value="Doc">Doctor</MenuItem>
                        <MenuItem value="staff">Staff</MenuItem>
                        <MenuItem value="Phuser">Pharmacy</MenuItem>
                        <MenuItem value="Lab">Laboratory</MenuItem>
                      </Select>
                    </FormControl>

                    <FormControl
                      fullWidth
                      sx={{
                        flex: 1,
                        minWidth: { md: "265px" },
                      }}
                    >
                      <Box
                        sx={{ display: "flex", gap: 1, alignItems: "center" }}
                      >
                        <Select
                          name="MUD_SPECIALIZATION"
                          value={formData.MUD_SPECIALIZATION}
                          onChange={handleChange}
                          label="Specialization"
                          disabled={formData.MUD_USER_TYPE !== "Doc"}
                          fullWidth
                          displayEmpty
                          sx={{ flex: 1 }}
                        >
                          <MenuItem value="">None</MenuItem>
                          {loadingSpecializations ? (
                            <MenuItem disabled>
                              <CircularProgress size={20} /> Loading...
                            </MenuItem>
                          ) : (
                            specializations.map((spec, index) => (
                              <MenuItem key={index} value={spec}>
                                {spec}
                              </MenuItem>
                            ))
                          )}
                        </Select>
                        <IconButton
                          color="primary"
                          onClick={() => setOpenSpecializationDialog(true)}
                          title="Add New Specialization"
                          size="small"
                          sx={{
                            bgcolor: theme.palette.primary.light,
                            color: "white",
                            "&:hover": {
                              bgcolor: theme.palette.primary.main,
                            },
                          }}
                        >
                          <AddCircleIcon />
                        </IconButton>
                      </Box>
                    </FormControl>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
              startIcon={
                loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <CheckCircleIcon />
                )
              }
            >
              {loading ? "Registering..." : "Register"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add Specialization Dialog */}
        <Dialog
          open={openSpecializationDialog}
          onClose={() => setOpenSpecializationDialog(false)}
          fullWidth
          maxWidth="xs"
        >
          <DialogTitle>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <Typography
                variant="h5"
                fontWeight={600}
                sx={{ color: "primary.main", textAlign: "center" }}
              >
                Add New Specialization
              </Typography>

              <IconButton
                onClick={() => setOpenSpecializationDialog(false)}
                sx={{
                  position: "absolute",
                  right: 0,
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent dividers>
            <Box sx={{ mt: 1 }}>
              <TextField
                fullWidth
                label="Specialization Name"
                value={newSpecialization}
                onChange={(e) => setNewSpecialization(e.target.value)}
                placeholder="e.g., Cardiologist"
                helperText="Enter the name of the new specialization"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MedicalIcon sx={{ color: "primary.main" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenSpecializationDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleAddSpecialization}
              disabled={addingSpecialization}
              startIcon={
                addingSpecialization ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <AddIcon />
                )
              }
            >
              {addingSpecialization ? "Adding..." : "Add Specialization"}
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
};

export default AddUser;
