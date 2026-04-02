// //Admin Side Add Timeslots page

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "../styles/addtimeslot.css";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faTrash } from "@fortawesome/free-solid-svg-icons";

// const Addtimeslot = () => {
//   const [selectedDoctor, setSelectedDoctor] = useState("");
//   const [query, setQuery] = useState("");
//   const [suggestions, setSuggestions] = useState([]);
//   const [formData, setFormData] = useState({
//     MT_SLOT_DATE: "",
//     MT_TIMESLOT: "",
//     MT_START_TIME: "",
//     MT_PATIENT_NO: 0,
//     MT_END_TIME: "",
//     MT_MAXIMUM_PATIENTS: "",
//     MT_DOCTOR: "",
//     MT_ALLOCATED_TIME: "",
//     MT_USER_ID: "",
//   });
//   const [errorMessage, setErrorMessage] = useState("");
//   const [timeslotData, setTimeslotData] = useState([]);
//   const [validDoctorNames, setValidDoctorNames] = useState([]); // To store valid doctor names

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevFormData) => ({
//       ...prevFormData,
//       [name]: value,
//     }));
//   };

//   const handleSuggestionClick = (doctor) => {
//     setSelectedDoctor(doctor.UserName); // Use the username
//     setQuery(doctor.UserName); // Display the username in the input
//     setFormData((prevFormData) => ({
//       ...prevFormData,
//       MT_DOCTOR: doctor.UserName,
//       MT_USER_ID: doctor.UserId, // Store the user ID in the form data
//     }));
//     setSuggestions([]);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Validate if doctor is selected from suggestions
//     const isValidDoctor = validDoctorNames.some(
//       (doctor) => doctor.UserName === formData.MT_DOCTOR
//     );

//     if (!isValidDoctor) {
//       setErrorMessage("Please select a doctor from the suggestions.");
//       return;
//     }

//     const adjustedFormData = {
//       ...formData,
//       MT_TIMESLOT: formData.MT_TIMESLOT + ":00",
//       MT_START_TIME: formData.MT_START_TIME + ":00",
//       MT_END_TIME: formData.MT_END_TIME + ":00",
//       MT_ALLOCATED_TIME: formData.MT_START_TIME + ":00",
//     };

//     try {
//       await axios.post(
//         `${process.env.REACT_APP_API_BASE_URL}/Timeslot`,
//         adjustedFormData
//       );
//       alert("Timeslot added successfully!");
//       // Clear the form data after successful submission
//       setFormData({
//         MT_SLOT_DATE: "",
//         MT_TIMESLOT: "",
//         MT_START_TIME: "",
//         MT_PATIENT_NO: 0,
//         MT_END_TIME: "",
//         MT_MAXIMUM_PATIENTS: "",
//         MT_DOCTOR: "",
//         MT_ALLOCATED_TIME: "",
//         MT_USER_ID: "",
//       });
//       setQuery("");
//       fetchTimeslots(); // Fetch timeslots again without reloading the page
//     } catch (error) {
//       console.error(
//         "Failed to add timeslot",
//         error.response?.data || error.message
//       );
//       setErrorMessage("Failed to add timeslot.");
//     }
//   };

//   const handleSearch = async (e) => {
//     const searchValue = e.target.value;
//     setQuery(searchValue);

//     if (searchValue.length > 2) {
//       try {
//         const response = await axios.get(
//           `${process.env.REACT_APP_API_BASE_URL}/User/suggest?query=${searchValue}`
//         );
//         if (response.data.length === 0) {
//           setSuggestions([]);
//           setErrorMessage("No doctor registered with this name.");
//           setValidDoctorNames([]); // Clear valid doctor names
//         } else {
//           setSuggestions(response.data);
//           setValidDoctorNames(response.data); // Store valid doctor names
//           setErrorMessage(""); // Clear previous error
//         }
//       } catch (error) {
//         console.error("Error fetching suggestions:", error);
//         setSuggestions([]);
//         setValidDoctorNames([]); // Clear valid doctor names
//         setErrorMessage("Error fetching doctor suggestions.");
//       }
//     } else {
//       setSuggestions([]);
//       setValidDoctorNames([]); // Clear valid doctor names
//       setErrorMessage(""); // Clear error when input is too short
//     }
//   };

//   const fetchTimeslots = async () => {
//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API_BASE_URL}/Timeslot/active-timeslots`
//       );
//       // Reverse the timeslot data so that the latest comes first
//       const reversedTimeslots = response.data.reverse();
//       setTimeslotData(reversedTimeslots);
//     } catch (error) {
//       console.error("Error fetching timeslots:", error);
//       setErrorMessage("Failed to load timeslots. Please try again later.");
//     }
//   };

//   const Deletetime = async (id) => {
//     if (window.confirm("Are you sure you want to inactive timeslot?")) {
//       try {
//         await axios.put(
//           `${process.env.REACT_APP_API_BASE_URL}/Timeslot/update-status/${id}`
//         );
//         alert("Timeslot Inactivated");
//         window.location.reload();

//         // Update timeslot data after deletion
//         // setTimeslotData(timeslotData.filter((timeslot) => timeslot.MT_SLOT_ID !== id));
//       } catch (error) {
//         console.error(
//           "Error deleting timeslot:",
//           error.response?.data || error.message
//         );
//         alert("Failed to delete timeslot.");
//       }
//     }
//   };

//   useEffect(() => {
//     fetchTimeslots();
//     const interval = setInterval(() => {
//       fetchTimeslots();
//     }, 60000); // Fetch every 60 seconds

//     return () => clearInterval(interval); // Cleanup the interval on component unmount
//   }, []);

//   return (
//     <div>
//       <div className="addtimeslot-container">
//         <h1>Add Available Timeslot</h1>
//         <form className="form-timeslot" onSubmit={handleSubmit}>
//           <div className="form-group-timeslot">
//             <label>Date</label>
//             <input
//               type="date"
//               name="MT_SLOT_DATE"
//               value={formData.MT_SLOT_DATE}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <div className="form-group-timeslot">
//             <label>Start Time</label>
//             <input
//               type="time"
//               name="MT_START_TIME"
//               value={formData.MT_START_TIME}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <div className="form-group-timeslot">
//             <label>End Time</label>
//             <input
//               type="time"
//               name="MT_END_TIME"
//               value={formData.MT_END_TIME}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <div className="form-group-timeslot">
//             <label>Maximum Patients</label>
//             <input
//               type="number"
//               name="MT_MAXIMUM_PATIENTS"
//               value={formData.MT_MAXIMUM_PATIENTS}
//               onChange={handleChange}
//               required
//               min="0"
//             />
//           </div>

//           <div className="form-group-timeslot">
//             <label>Doctor</label>
//             <input
//               type="search"
//               placeholder="search doctor by username "
//               value={query}
//               onChange={handleSearch}
//               required
//             />

//             {errorMessage && <p className="error-message">{errorMessage}</p>}

//             {suggestions.length > 0 ? (
//               <ul className="doctor-suggestions">
//                 {suggestions.map((doctor, index) => (
//                   <li
//                     key={doctor.UserId} // Use UserId as the unique key internally
//                     onClick={() => handleSuggestionClick(doctor)} // Pass the entire doctor object
//                   >
//                     {doctor.UserName} {/* Display only the name */}
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               query.length > 2 &&
//               !errorMessage && <p className="no-doctors"></p>
//             )}
//           </div>

//           <button className="submit-button" type="submit">
//             Add Timeslot
//           </button>
//           {errorMessage && <p className="error-message">{errorMessage}</p>}
//         </form>

//         <div className="view-timeslot">
//           {timeslotData.length > 0 ? (
//             <div className="timeslot-container">
//               {timeslotData.map((timeslot) => (
//                 <div key={timeslot.MT_SLOT_ID} className="timeslot-card">
//                   <button
//                     className="delete-btn2"
//                     onClick={() => Deletetime(timeslot.MT_SLOT_ID)}
//                   >
//                     <FontAwesomeIcon icon={faTrash} />
//                   </button>
//                   <div className="timeslot-time">
//                     {/* <p>Treatment-date: {new Date(treatment.MTD_CREATED_DATE).toISOString().split("T")[0]}</p> */}
//                     <p>
//                       <strong>Date:</strong>{" "}
//                       {timeslot.MT_SLOT_DATE.split("T")[0]}
//                     </p>

//                     <p>
//                       <strong>Time:</strong>
//                       {new Date(
//                         `1970-01-01T${timeslot.MT_START_TIME}`
//                       ).toLocaleTimeString("en-LK", {
//                         timeZone: "Asia/Colombo",
//                         hour: "numeric",
//                         minute: "numeric",
//                         hour12: true,
//                       })}
//                       -
//                       {new Date(
//                         `1970-01-01T${timeslot.MT_END_TIME}`
//                       ).toLocaleTimeString("en-LK", {
//                         timeZone: "Asia/Colombo",
//                         hour: "numeric",
//                         minute: "numeric",
//                         hour12: true,
//                       })}
//                     </p>
//                     <p>
//                       <strong>Doctor Name:</strong> {timeslot.MT_DOCTOR}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <p className="no-appointments">No available timeslots</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Addtimeslot;

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
  Typography,
  useTheme,
  useMediaQuery,
  Snackbar,
  Alert,
  Chip,
  Avatar,
  InputAdornment,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  AccessTime as TimeIcon,
  CalendarToday as CalendarIcon,
  Group as GroupIcon,
  Add as AddIcon,
  CheckCircle as CheckCircleIcon,
  Close as CloseIcon,
} from "@mui/icons-material";

const Addtimeslot = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [formData, setFormData] = useState({
    MT_SLOT_DATE: "",
    MT_TIMESLOT: "",
    MT_START_TIME: "",
    MT_PATIENT_NO: 0,
    MT_END_TIME: "",
    MT_MAXIMUM_PATIENTS: "",
    MT_DOCTOR: "",
    MT_ALLOCATED_TIME: "",
    MT_USER_ID: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [timeslotData, setTimeslotData] = useState([]);
  const [validDoctorNames, setValidDoctorNames] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTimeslots, setFilteredTimeslots] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);

  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSuggestionClick = (doctor) => {
    setSelectedDoctor(doctor.UserName);
    setQuery(doctor.UserName);
    setFormData((prevFormData) => ({
      ...prevFormData,
      MT_DOCTOR: doctor.UserName,
      MT_USER_ID: doctor.UserId,
    }));
    setSuggestions([]);
    showSnackbar(`Doctor ${doctor.UserName} selected`, "success");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const isValidDoctor = validDoctorNames.some(
      (doctor) => doctor.UserName === formData.MT_DOCTOR
    );

    if (!isValidDoctor) {
      setErrorMessage("Please select a doctor from the suggestions.");
      showSnackbar("Please select a valid doctor", "error");
      setLoading(false);
      return;
    }

    const adjustedFormData = {
      ...formData,
      MT_TIMESLOT: formData.MT_START_TIME + ":00",
      MT_START_TIME: formData.MT_START_TIME + ":00",
      MT_END_TIME: formData.MT_END_TIME + ":00",
      MT_ALLOCATED_TIME: formData.MT_START_TIME + ":00",
    };

    try {
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/Timeslot`,
        adjustedFormData
      );
      showSnackbar("Timeslot added successfully!", "success");
      setFormData({
        MT_SLOT_DATE: "",
        MT_TIMESLOT: "",
        MT_START_TIME: "",
        MT_PATIENT_NO: 0,
        MT_END_TIME: "",
        MT_MAXIMUM_PATIENTS: "",
        MT_DOCTOR: "",
        MT_ALLOCATED_TIME: "",
        MT_USER_ID: "",
      });
      setQuery("");
      fetchTimeslots();
    } catch (error) {
      console.error(
        "Failed to add timeslot",
        error.response?.data || error.message
      );
      showSnackbar("Failed to add timeslot", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    const searchValue = e.target.value;
    setQuery(searchValue);

    if (searchValue.length > 2) {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/User/suggest?query=${searchValue}`
        );
        if (response.data.length === 0) {
          setSuggestions([]);
          setErrorMessage("No doctor registered with this name.");
          setValidDoctorNames([]);
        } else {
          setSuggestions(response.data);
          setValidDoctorNames(response.data);
          setErrorMessage("");
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
        setValidDoctorNames([]);
        setErrorMessage("Error fetching doctor suggestions.");
      }
    } else {
      setSuggestions([]);
      setValidDoctorNames([]);
      setErrorMessage("");
    }
  };

  const fetchTimeslots = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/Timeslot/active-timeslots`
      );
      setTimeslotData(response.data.reverse());
      setFilteredTimeslots(response.data.reverse());
    } catch (error) {
      console.error("Error fetching timeslots:", error);
      showSnackbar("Failed to load timeslots", "error");
    }
  };

  const handleTimeslotSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsSearchActive(value.length > 0);

    if (value.length === 0) {
      setFilteredTimeslots(timeslotData);
      return;
    }

    const filtered = timeslotData.filter((timeslot) => {
      const searchLower = value.toLowerCase();
      return (
        timeslot.MT_DOCTOR.toLowerCase().includes(searchLower) ||
        timeslot.MT_SLOT_DATE.toLowerCase().includes(searchLower)
      );
    });

    setFilteredTimeslots(filtered);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setIsSearchActive(false);
    setFilteredTimeslots(timeslotData);
  };

  const Deletetime = async (id) => {
    if (window.confirm("Are you sure you want to inactivate this timeslot?")) {
      try {
        await axios.put(
          `${process.env.REACT_APP_API_BASE_URL}/Timeslot/update-status/${id}`
        );
        showSnackbar("Timeslot inactivated successfully", "success");
        fetchTimeslots();
      } catch (error) {
        console.error(
          "Error deleting timeslot:",
          error.response?.data || error.message
        );
        showSnackbar("Failed to inactivate timeslot", "error");
      }
    }
  };

  const formatTime = (timeString) => {
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString("en-LK", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  useEffect(() => {
    fetchTimeslots();
    const interval = setInterval(fetchTimeslots, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          color="primary"
          fontWeight={600}
          align="center"
        >
          Timeslot Management
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6} sx={{ ml: -2 }}>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                color="primary"
                fontWeight={600}
              >
                Add New Timeslot
              </Typography>

              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={2.4}>
                    <TextField
                      fullWidth
                      label="Date"
                      type="date"
                      name="MT_SLOT_DATE"
                      value={formData.MT_SLOT_DATE}
                      onChange={handleChange}
                      required
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CalendarIcon sx={{ color: "primary.main" }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={2.4}>
                    <TextField
                      fullWidth
                      label="Start Time"
                      type="time"
                      name="MT_START_TIME"
                      value={formData.MT_START_TIME}
                      onChange={handleChange}
                      required
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <TimeIcon sx={{ color: "primary.main" }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={2.4}>
                    <TextField
                      fullWidth
                      label="End Time"
                      type="time"
                      name="MT_END_TIME"
                      value={formData.MT_END_TIME}
                      onChange={handleChange}
                      required
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <TimeIcon sx={{ color: "primary.main" }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={2.4}>
                    <TextField
                      fullWidth
                      label="Max Patients"
                      type="number"
                      name="MT_MAXIMUM_PATIENTS"
                      value={formData.MT_MAXIMUM_PATIENTS}
                      onChange={handleChange}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <GroupIcon sx={{ color: "primary.main" }} />
                          </InputAdornment>
                        ),
                        inputProps: { min: 1 },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={2.4}>
                    <Box sx={{ width: "95%" }}>
                      <TextField
                        fullWidth
                        label="Search Doctor"
                        placeholder="Search doctor by username"
                        value={query}
                        onChange={handleSearch}
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon sx={{ color: "primary.main" }} />
                            </InputAdornment>
                          ),
                        }}
                      />
                      {errorMessage && (
                        <Typography color="error" variant="caption">
                          {errorMessage}
                        </Typography>
                      )}
                      {suggestions.length > 0 && (
                        <Paper
                          elevation={3}
                          sx={{ mt: 1, maxHeight: 200, overflow: "auto" }}
                        >
                          <List dense>
                            {suggestions.map((doctor) => (
                              <ListItem
                                key={doctor.UserId}
                                button
                                onClick={() => handleSuggestionClick(doctor)}
                                sx={{
                                  "&:hover": {
                                    backgroundColor: theme.palette.action.hover,
                                  },
                                }}
                              >
                                <Avatar sx={{ mr: 2, bgcolor: "primary.main" }}>
                                  <PersonIcon />
                                </Avatar>
                                <ListItemText
                                  primary={doctor.UserName}
                                  secondary={`ID: ${doctor.UserId}`}
                                />
                              </ListItem>
                            ))}
                          </List>
                        </Paper>
                      )}
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Box display="flex" justifyContent="center">
                      <Button
                        variant="contained"
                        type="submit"
                        startIcon={<AddIcon />}
                        disabled={loading}
                        sx={{ py: 1.5, px: 4 }}
                      >
                        {loading ? (
                          <CircularProgress size={24} color="inherit" />
                        ) : (
                          "Add Timeslot"
                        )}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Grid>

          <Grid item xs={12} md={6} sx={{ ml: -2 ,mt:-3}}>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                color="primary"
                fontWeight={600}
              >
                Available Timeslots
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, mb: 3, position: 'relative', width: '92%' }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Search by doctor name or date (YYYY-MM-DD)"
                  value={searchTerm}
                  onChange={handleTimeslotSearchChange}
                  InputProps={{
                    startAdornment: (
                      <SearchIcon sx={{ mr: 1, color: "primary.main" }} />
                    ),
                    endAdornment: isSearchActive && (
                      <IconButton
                        onClick={clearSearch}
                        size="small"
                        sx={{ visibility: searchTerm ? 'visible' : 'hidden' }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    ),
                  }}
                />
              </Box>

              {isSearchActive && (
                <Typography
                  variant="h6"
                  gutterBottom
                  color="primary"
                  fontWeight={600}
                  sx={{ mb: 2 }}
                >
                  Search Results
                </Typography>
              )}

              {filteredTimeslots.length > 0 ? (
                <Grid container spacing={2}>
                  {filteredTimeslots.map((timeslot) => (
                    <Grid item xs={12} key={timeslot.MT_SLOT_ID}>
                      <Card
                        variant="outlined"
                        sx={{
                          "&:hover": {
                            boxShadow: 2,
                            borderColor: theme.palette.primary.main,
                          },
                        }}
                      >
                        <CardContent>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                            }}
                          >
                            <Box>
                              <Typography variant="subtitle1" gutterBottom>
                                <TimeIcon
                                  fontSize="small"
                                  sx={{
                                    mr: 1,
                                    verticalAlign: "middle",
                                    color: "primary.main",
                                  }}
                                />
                                {formatTime(timeslot.MT_START_TIME)} -{" "}
                                {formatTime(timeslot.MT_END_TIME)}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                <CalendarIcon
                                  fontSize="small"
                                  sx={{
                                    mr: 1,
                                    verticalAlign: "middle",
                                    color: "primary.main",
                                  }}
                                />
                                {timeslot.MT_SLOT_DATE.split("T")[0]}
                              </Typography>
                              <Typography variant="body2" sx={{ mt: 1 }}>
                                <PersonIcon
                                  fontSize="small"
                                  sx={{
                                    mr: 1,
                                    verticalAlign: "middle",
                                    color: "primary.main",
                                  }}
                                />
                                Dr. {timeslot.MT_DOCTOR}
                              </Typography>
                              <Chip
                                label={`Max Patients: ${timeslot.MT_MAXIMUM_PATIENTS}`}
                                size="small"
                                sx={{ mt: 1 }}
                              />
                            </Box>
                            <IconButton
                              color="error"
                              onClick={() => Deletetime(timeslot.MT_SLOT_ID)}
                              aria-label="delete"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    textAlign: "center",
                    backgroundColor: theme.palette.grey[100],
                  }}
                >
                  <Typography variant="body1" color="text.secondary">
                    {isSearchActive
                      ? "No matching timeslots found"
                      : "No available timeslots found"}
                  </Typography>
                </Paper>
              )}
            </CardContent>
          </Grid>
        </Grid>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
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
      </Paper>
    </Container>
  );
};

export default Addtimeslot;