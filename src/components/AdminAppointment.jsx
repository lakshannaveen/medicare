import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserMd,
  faArrowLeft,
  faSearch,
  faCalendarAlt,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  Paper,
  TextField,
  Typography,
  Avatar,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery,
  Stepper,
  Step,
  StepLabel,
  Container,
  CardActionArea,
  Fade,
  Grow,
  Zoom,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { green, blue, red, orange, purple } from "@mui/material/colors";
import { motion } from "framer-motion";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const StyledCard = styled(Card)(({ theme }) => ({
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  borderRadius: 16,
  boxShadow: theme.shadows[4],
  overflow: "hidden",
  backgroundColor: theme.palette.background.paper,
}));

const DoctorCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: 12,
  transition: "transform 0.3s, box-shadow 0.3s",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: theme.shadows[8],
  },
}));

const BookButton = styled(Button)(({ theme }) => ({
  backgroundColor: green[600],
  color: "white",
  fontWeight: 600,
  padding: theme.spacing(1, 3),
  borderRadius: 8,
  "&:hover": {
    backgroundColor: green[800],
    boxShadow: theme.shadows[4],
  },
}));

const BackButton = styled(Button)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: 8,
  padding: theme.spacing(1, 2),
}));

const SpecializationChip = styled(Chip)(({ theme }) => ({
  marginRight: theme.spacing(1),
  marginBottom: theme.spacing(1),
  backgroundColor: purple[100],
  color: purple[800],
  fontWeight: 500,
}));

// For admin we conceptually have 3 steps, but we keep
// the original labels so the UI matches existing design.
const steps = ["Login", "Find Doctor", "Select Time", "Confirm"];

// Admin-side appointment booking form.
// Uses the same APIs and layout as the patient form,
// but does NOT touch patient-side localStorage state.
export default function AdminAppointment({ onClose, patient }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [query, setQuery] = useState("");
  const [userid, setUserid] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selecteduserid, setSelectedUserid] = useState("");
  const [doctor, setDoctor] = useState([]);
  const [specialization, setSpecialization] = useState("OPD");
  const [currentScreen, setCurrentScreen] = useState(1); // Start at Find Doctor
  const [appointmentDetails, setAppointmentDetails] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [patientName, setPatientName] = useState("");
  const [patientContact, setPatientContact] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [activeStep, setActiveStep] = useState(1); // Corresponds to "Find Doctor"

  // Initialize patient details from props when admin opens the dialog
  useEffect(() => {
    if (patient) {
      setPatientName(patient.MPD_PATIENT_NAME || "");
      setPatientContact(patient.MPD_MOBILE_NO || "");
    }
  }, [patient]);

  const handleSearch = async (e) => {
    const searchValue = e.target.value;
    setQuery(searchValue);

    if (searchValue.length > 2) {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/User/suggest/doctor?query=${searchValue}`
        );
        setSuggestions(response.data);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      if (userid) {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/Timeslot/Doctorid/${userid}`
          );
          setAppointmentDetails(response.data);
        } catch (error) {
          console.error("Error fetching appointments:", error);
          setAppointmentDetails([]);
        }
      }
    };

    fetchAppointments();
  }, [userid]);

  const handleSuggestionClick = (doctorName, userId) => {
    setSelectedDoctor(doctorName);
    setSelectedUserid(userId);
    setQuery(doctorName);
    setSuggestions([]);
  };

  const handleSearchClick = async () => {
    try {
      if (query && selecteduserid) {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/Timeslot/Doctorid/${selecteduserid}`
        );
        setAppointmentDetails(response.data);
        setCurrentScreen(3);
        setActiveStep(2);
      } else if (specialization && specialization !== "OPD") {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/User/doctorid/specialization`,
          {
            params: {
              specialization: specialization,
            },
          }
        );

        const filteredDoctors = (response.data || []).filter((doc) =>
          (doc.MUD_SPECIALIZATION || "")
            .toLowerCase()
            .includes(specialization.toLowerCase())
        );

        if (filteredDoctors.length > 0) {
          setDoctor(filteredDoctors);
          setCurrentScreen(2);
          setActiveStep(2);
          setErrorMessage("");
        } else {
          setDoctor([]);
          setErrorMessage("No doctors found with the selected specialization.");
        }
      } else {
        setErrorMessage("Please select a doctor or specialization");
      }
    } catch (error) {
      console.error("Search error:", error);
      setErrorMessage("Failed to search. Please try again.");
    }
  };

  const handleBackClick = () => {
    if (currentScreen === 3) {
      if (query && selecteduserid) {
        setCurrentScreen(1);
        setActiveStep(1);
      } else {
        setCurrentScreen(2);
        setActiveStep(2);
      }
    } else if (currentScreen === 2) {
      setCurrentScreen(1);
      setActiveStep(1);
    } else if (currentScreen > 1) {
      setCurrentScreen(currentScreen - 1);
      setActiveStep((prev) => Math.max(prev - 1, 1));
    }
  };

  const handleChannelClick = (selectedDoc) => {
    setSelectedDoctor(selectedDoc.MUD_USER_NAME);
    setUserid(selectedDoc.MUD_USER_ID);
    setCurrentScreen(3);
    setActiveStep(2);
  };

  const handleBookNowClick = (appointment) => {
    setSelectedAppointment(appointment);
    setCurrentScreen(4);
  };

  const handleUpdate = async () => {
    try {
      if (selectedAppointment) {
        await axios.patch(
          `${process.env.REACT_APP_API_BASE_URL}/Timeslot/${selectedAppointment.MT_SLOT_ID}/incrementSeat`
        );
      }
    } catch (error) {
      console.error(
        "Failed to update time slot",
        error.response?.data || error.message
      );
    }
  };

  const submitAppointment = async () => {
    try {
      if (!selectedAppointment) {
        setErrorMessage("No appointment selected. Please choose a time slot.");
        return;
      }

      const appointmentData = {
        MAD_FULL_NAME: patientName,
        MAD_CONTACT: patientContact,
        MAD_PATIENT_NO: selectedAppointment.MT_PATIENT_NO + 1,
        MAD_APPOINMENT_DATE: selectedAppointment.MT_SLOT_DATE,
        MAD_START_TIME: selectedAppointment.MT_START_TIME,
        MAD_END_TIME: selectedAppointment.MT_END_TIME,
        MAD_DOCTOR: selectedAppointment.MT_DOCTOR,
        MAD_ALLOCATED_TIME: selectedAppointment.MT_ALLOCATED_TIME,
        MAD_EMAIL: "", // Admin flow does not use patient email
        MAD_PATIENT_CODE: patient?.MPD_PATIENT_CODE,
        MAD_SLOT_ID: selectedAppointment.MT_SLOT_ID,
        MAD_USER_ID: selectedAppointment.MT_USER_ID,
      };

      setLoading(true);
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/Appointment`,
        appointmentData
      );

      setCurrentScreen(5);
      setActiveStep(3);
      setOpenSuccess(true);
    } catch (error) {
      console.error("Error booking appointment:", error);
      setErrorMessage("Failed to submit the appointment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    await submitAppointment();
    await handleUpdate();
  };

  const handleCloseSnackbar = () => {
    setOpenSuccess(false);
    setErrorMessage("");
  };

  const renderScreen1 = () => (
    <Grow in={true} timeout={500}>
      <Container maxWidth="xl">
        <Box sx={{ mt: -2 }}>
          <CardContent>
            <Box textAlign="center" mb={4}>
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                color="primary"
                fontWeight="bold"
              >
                Find Your Doctor
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Search by name or specialization to book an appointment
              </Typography>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  sx={{ width: 350 }}
                  label="Search Doctor by Name"
                  variant="outlined"
                  margin="normal"
                  placeholder="E.g. Dr. Rosa"
                  value={query}
                  onChange={handleSearch}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FontAwesomeIcon icon={faSearch} />
                      </InputAdornment>
                    ),
                  }}
                />
                {suggestions.length > 0 && (
                  <Paper
                    elevation={3}
                    sx={{ maxHeight: 200, overflow: "auto", mt: 1 }}
                  >
                    <List>
                      {suggestions.map((doctor, index) => (
                        <ListItem
                          key={index}
                          button
                          onClick={() =>
                            handleSuggestionClick(
                              doctor.UserName,
                              doctor.UserId
                            )
                          }
                          sx={{
                            "&:hover": {
                              backgroundColor: "action.hover",
                            },
                          }}
                        >
                          <ListItemAvatar>
                            <Avatar
                              sx={{ bgcolor: blue[100], color: blue[600] }}
                            >
                              {doctor.UserName.charAt(0)}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={doctor.UserName}
                            secondary={
                              doctor.Specialization || "General Practitioner"
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  sx={{ width: 350 }}
                  select
                  label="Search by Specialization"
                  variant="outlined"
                  margin="normal"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FontAwesomeIcon icon={faUserMd} />
                      </InputAdornment>
                    ),
                  }}
                >
                  <MenuItem value="OPD">Search by Specialization</MenuItem>
                  <MenuItem value="psychiatrist">Psychiatrist</MenuItem>
                  <MenuItem value="Dentist">Dentist</MenuItem>
                  <MenuItem value="cardiologist">Cardiologist</MenuItem>
                  <MenuItem value="gynecologist">Gynecologist</MenuItem>
                  <MenuItem value="pediatrician">Pediatrician</MenuItem>
                  <MenuItem value="immunologist">Immunologist</MenuItem>
                </TextField>
              </Grid>
            </Grid>

            <Box textAlign="center" mt={4}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                sx={{
                  px: 6,
                  py: 1.5,
                  borderRadius: 2,
                  fontSize: "1rem",
                }}
                onClick={handleSearchClick}
                disabled={!query && specialization === "OPD"}
              >
                Search
              </Button>
            </Box>

            {errorMessage && (
              <Alert severity="error" sx={{ mt: 3 }}>
                {errorMessage}
              </Alert>
            )}
          </CardContent>
        </Box>
      </Container>
    </Grow>
  );

  const renderScreen2 = () => (
    <Zoom in={true} timeout={500}>
      <Container maxWidth="xl">
        <Box sx={{ mt: -2 }}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <BackButton
                startIcon={<FontAwesomeIcon icon={faArrowLeft} />}
                onClick={handleBackClick}
                variant="outlined"
                sx={{ mr: 2 }}
              >
                Back
              </BackButton>
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                color="primary"
                fontWeight="bold"
                sx={{ textAlign: "center", width: "100%", mb: 2 }}
              >
                Available Doctors
              </Typography>
            </Box>

            {doctor.length > 0 ? (
              <Grid container spacing={3}>
                {doctor.map((doc, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <DoctorCard>
                      <CardActionArea onClick={() => handleChannelClick(doc)}>
                        <CardContent>
                          <Box display="flex" alignItems="center" mb={2}>
                            <Avatar
                              sx={{
                                bgcolor: blue[500],
                                width: 56,
                                height: 56,
                                mr: 2,
                              }}
                            >
                              {doc.MUD_USER_NAME.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography variant="h6" fontWeight="bold">
                                {doc.MUD_USER_NAME}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {doc.MUD_SPECIALIZATION}
                              </Typography>
                            </Box>
                          </Box>
                          <Box mt={1}>
                            {doc.MUD_SPECIALIZATION && (
                              <SpecializationChip
                                label={doc.MUD_SPECIALIZATION}
                                size="small"
                              />
                            )}
                          </Box>
                          <Box mt={2} display="flex" justifyContent="flex-end">
                            <Button
                              endIcon={<FontAwesomeIcon icon={faUserMd} />}
                              color="primary"
                              size="small"
                            >
                              View Availability
                            </Button>
                          </Box>
                        </CardContent>
                      </CardActionArea>
                    </DoctorCard>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                minHeight="200px"
              >
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No doctors available
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Try adjusting your search criteria
                </Typography>
              </Box>
            )}
          </CardContent>
        </Box>
      </Container>
    </Zoom>
  );

  const renderScreen3 = () => {
    const groupedAppointments = appointmentDetails.reduce((groups, appointment) => {
      const date = appointment.MT_SLOT_DATE;
      if (!groups[date]) groups[date] = [];
      groups[date].push(appointment);
      return groups;
    }, {});

    const sortedDates = Object.keys(groupedAppointments).sort(
      (a, b) => new Date(a) - new Date(b)
    );

    return (
      <Slide direction="up" in={true} mountOnEnter unmountOnExit>
        <Container maxWidth="xl">
          <Box sx={{ mt: -2 }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={4}>
                <BackButton
                  startIcon={<FontAwesomeIcon icon={faArrowLeft} />}
                  onClick={handleBackClick}
                  variant="outlined"
                  sx={{ mr: 2 }}
                >
                  Back
                </BackButton>
                <Typography
                  variant="h4"
                  component="h1"
                  gutterBottom
                  color="primary"
                  fontWeight="bold"
                  sx={{ textAlign: "center", width: "100%", mb: 2 }}
                >
                  Available Time Slots
                </Typography>
              </Box>

              {appointmentDetails.length > 0 ? (
                <Grid container spacing={2}>
                  {sortedDates.flatMap((date) =>
                    groupedAppointments[date].map((appointment, index) => {
                      const appointmentDate = new Date(appointment.MT_SLOT_DATE);
                      const formattedDate = appointmentDate.toLocaleDateString(
                        "en-US",
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      );
                      const startTime = new Date(
                        `1970-01-01T${appointment.MT_START_TIME}`
                      ).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                      });
                      const endTime = new Date(
                        `1970-01-01T${appointment.MT_END_TIME}`
                      ).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                      });

                      const endDate = new Date(`${formattedDate} ${endTime}`);
                      const currentTime = new Date();

                      const isPastDate =
                        appointmentDate < new Date().setHours(0, 0, 0, 0);
                      const isBookingClosed = currentTime > endDate;
                      const isFullyBooked =
                        appointment.MT_PATIENT_NO >=
                        appointment.MT_MAXIMUM_PATIENTS;

                      return (
                        <Grid item xs={12} sm={6} key={`${date}-${index}`}>
                          <Card
                            variant="outlined"
                            sx={{
                              height: "100%",
                              borderLeft: `4px solid ${
                                isPastDate || isBookingClosed || isFullyBooked
                                  ? red[500]
                                  : green[500]
                              }`,
                            }}
                          >
                            <CardContent>
                              <Box display="flex" flexDirection="column" height="100%">
                                <Box mb={1}>
                                  <Box display="flex" alignItems="center">
                                    <FontAwesomeIcon
                                      icon={faCalendarAlt}
                                      style={{
                                        color: blue[500],
                                        marginRight: 8,
                                      }}
                                    />
                                    <Typography variant="subtitle1">
                                      {formattedDate}
                                    </Typography>
                                  </Box>
                                </Box>
                                <Box mb={2}>
                                  <Box display="flex" alignItems="center">
                                    <FontAwesomeIcon
                                      icon={faClock}
                                      style={{
                                        color: orange[500],
                                        marginRight: 8,
                                      }}
                                    />
                                    <Typography variant="body1">
                                      {startTime} - {endTime}
                                    </Typography>
                                  </Box>
                                </Box>
                                <Box mt="auto">
                                  <Box display="flex" justifyContent="flex-start">
                                    {isPastDate ? (
                                      <Chip
                                        label="Expired"
                                        color="error"
                                        size="small"
                                        sx={{ px: 1 }}
                                      />
                                    ) : isBookingClosed ? (
                                      <Chip
                                        label="Closed"
                                        color="error"
                                        size="small"
                                        sx={{ px: 1 }}
                                      />
                                    ) : isFullyBooked ? (
                                      <Chip
                                        label="Fully Booked"
                                        color="error"
                                        size="small"
                                        sx={{ px: 1 }}
                                      />
                                    ) : (
                                      <BookButton
                                        variant="contained"
                                        size="small"
                                        onClick={() => handleBookNowClick(appointment)}
                                      >
                                        Book Now
                                      </BookButton>
                                    )}
                                  </Box>
                                  {!isPastDate &&
                                    !isBookingClosed &&
                                    !isFullyBooked && (
                                      <Box mt={1}>
                                        <Typography
                                          variant="caption"
                                          color="text.secondary"
                                        >
                                          {appointment.MT_MAXIMUM_PATIENTS -
                                            appointment.MT_PATIENT_NO}{" "}
                                          slots remaining
                                        </Typography>
                                      </Box>
                                    )}
                                </Box>
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      );
                    })
                  )}
                </Grid>
              ) : (
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  minHeight="200px"
                >
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No appointments available
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Please check back later or try another doctor
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Box>
        </Container>
      </Slide>
    );
  };

  const renderScreen4 = () => {
    if (!selectedAppointment) return null;

    const startTime = new Date(
      `1970-01-01T${selectedAppointment.MT_START_TIME}`
    ).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    const endTime = new Date(
      `1970-01-01T${selectedAppointment.MT_END_TIME}`
    ).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    const allocatedTime = new Date(
      `1970-01-01T${selectedAppointment.MT_ALLOCATED_TIME}`
    ).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    const appointmentDate = new Date(selectedAppointment.MT_SLOT_DATE);
    const formattedDate = appointmentDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return (
      <Dialog
        open={true}
        TransitionComponent={Transition}
        keepMounted
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: isMobile ? 0 : 2,
            p: 2,
          },
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: "white",
            py: 2,
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Confirm Appointment
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              color="primary"
              gutterBottom
            >
              Appointment Summary
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" color="text.secondary">
                  Patient Name:
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {patientName}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" color="text.secondary">
                  Contact Number:
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {patientContact}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" color="text.secondary">
                  Doctor:
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {selectedAppointment.MT_DOCTOR}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" color="text.secondary">
                  Date:
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {formattedDate}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" color="text.secondary">
                  Patient Time:
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {allocatedTime}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" color="text.secondary">
                  Doctor's Availability:
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {startTime} - {endTime}
                </Typography>
              </Grid>
            </Grid>
          </Box>
          <Alert severity="info" sx={{ mb: 2 }}>
            Please ask the patient to arrive 10 minutes before the scheduled
            appointment time.
          </Alert>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={handleBackClick}
            variant="outlined"
            sx={{ mr: 2, borderRadius: 1 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleConfirm}
            sx={{ borderRadius: 1 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : "Confirm Booking"}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const renderScreen5 = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <StyledCard>
          <CardContent
            sx={{
              p: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                backgroundColor: green[100],
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 3,
              }}
            >
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                  stroke={green[600]}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Box>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              color="primary"
              fontWeight="bold"
            >
              Appointment Confirmed!
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              The appointment for {patientName} has been successfully booked.
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              You can now close this window or book another appointment.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => {
                if (onClose) {
                  onClose();
                }
              }}
              sx={{ mt: 3, px: 4, py: 1.5, borderRadius: 2 }}
            >
              Close
            </Button>
          </CardContent>
        </StyledCard>
      </Container>
    </motion.div>
  );

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "60vh",
        backgroundColor: theme.palette.background.default,
      }}
    >
      {currentScreen > 0 && currentScreen < 4 && (
        <Container maxWidth="lg" sx={{ py: 2 }}>
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Container>
      )}

      {currentScreen === 1 && renderScreen1()}
      {currentScreen === 2 && renderScreen2()}
      {currentScreen === 3 && renderScreen3()}
      {currentScreen === 4 && renderScreen4()}
      {currentScreen === 5 && renderScreen5()}

      <Snackbar
        open={openSuccess}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        TransitionComponent={Fade}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Appointment booked successfully.
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        TransitionComponent={Fade}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

