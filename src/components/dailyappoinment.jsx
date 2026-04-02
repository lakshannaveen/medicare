// import { useEffect, useState } from "react";
// import axios from "axios";
// import "../styles/DailyAppoinment.css";
// import { useLocation, useNavigate } from "react-router-dom";
// import Addtimeslot from "./addTimeslot";

// export default function DailyAppointment() {
//   const [timeslots, setTimeslots] = useState([]);
//   const [selectedDate, setSelectedDate] = useState(
//     new Date().toISOString().split("T")[0]
//   ); // Default to today's date
//   const [error, setError] = useState(null); // Track errors
//   const [appointments, setAppointments] = useState([]); // To store appointments
//   const [selectedSlotId, setSelectedSlotId] = useState(null); // Track selected timeslot ID
//   const [isLoading, setIsLoading] = useState(false); // New loading state
//   const Name = localStorage.getItem("Name");
//   const location = useLocation();
//   const navigate = useNavigate();

//   const [error1, setError1] = useState(null);

//   // Fetch timeslots based on selected date
//   useEffect(() => {
//     const fetchTimeslotsByDate = async () => {
//       setIsLoading(true);
//       try {
//         const response = await axios.get(
//           `${process.env.REACT_APP_API_BASE_URL}/Timeslot/timeslotcard/${selectedDate}/${Name}`
//         );
//         setTimeslots(response.data);
//         setError(null); // Clear any previous errors
//         setError1(null);
//       } catch (error) {
//         setTimeslots([]); // Clear timeslots if an error occurs
//         setError("No timeslots available for the selected date.");
//         console.error("Error fetching timeslots:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     // Fetch timeslots whenever selectedDate changes
//     if (selectedDate) {
//       fetchTimeslotsByDate();
//     }
//   }, [selectedDate]);

//   // Fetch appointments based on selected timeslot ID
//   const handleViewAppointments = async (slotId) => {
//     setIsLoading(true);
//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API_BASE_URL}/Appointment/appointments/${slotId}`
//       );
//       setAppointments(response.data);
//       setSelectedSlotId(slotId); // Set the selected slot ID
//       setError1(false);
//     } catch (error) {
//       console.error("Error fetching appointments:", error);
//       setError1("No appointments available for timeslot");
//       setAppointments([]); // Clear appointments if an error occurs
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleAddRecord = (patientId, appoinmentID, patientno) => {
//     navigate(`/dashboard/addrecord/${patientId}`, {
//       state: { appoinmentid: appoinmentID, channelnumber: patientno },
//     });
//   };

//   const handleDateChange = (e) => {
//     setSelectedDate(e.target.value); // Update the date on change
//     setAppointments([]); // Clear the appointments when the date changes
//     setSelectedSlotId(null); // Reset the selected timeslot ID
//   };

//   return (
//     <div className="daily-appointment-container">
//       <h1 className="title">Appointments</h1>

//       <div className="date-picker">
//         <label htmlFor="date">Select Date: </label>
//         <input
//           type="date"
//           id="date"
//           value={selectedDate}
//           onChange={handleDateChange} // Trigger date change
//         />
//       </div>

//       {isLoading ? (
//         <p>Loading...</p>
//       ) : error ? (
//         <p className="error-message">{error}</p> // Show error message if no timeslots
//       ) : (
//         <div className="timeslot-cards">
//           {timeslots.map((timeslot) => (
//             <div key={timeslot.MT_SLOT_ID} className="timeslot-card3">
//               <p>Doctor: {timeslot.MT_DOCTOR}</p>
//               <p>
//                 Timeslot:{" "}
//                 {new Date(
//                   `1970-01-01T${timeslot.MT_START_TIME}`
//                 ).toLocaleTimeString("en-LK", {
//                   timeZone: "Asia/Colombo",
//                   hour: "numeric",
//                   minute: "numeric",
//                   hour12: true,
//                 })}{" "}
//                 -{" "}
//                 {new Date(
//                   `1970-01-01T${timeslot.MT_END_TIME}`
//                 ).toLocaleTimeString("en-LK", {
//                   timeZone: "Asia/Colombo",
//                   hour: "numeric",
//                   minute: "numeric",
//                   hour12: true,
//                 })}
//               </p>
//               <button
//                 onClick={() => handleViewAppointments(timeslot.MT_SLOT_ID)}
//               >
//                 View Appointments
//               </button>
//             </div>
//           ))}
//         </div>
//       )}

//       {selectedSlotId && (
//         <div className="appointment-table-container">
//           <h2>Appointments available for this timeslot</h2>

//           {/* <input type="search" placeholder="search using the patient name"/> */}
//           <table className="appointments-table">
//             <thead>
//               <tr>
//                 <th>Patient Name</th>
//                 <th>Contact</th>
//                 <th>Allocated time</th>
//                 <th>Patient number</th>
//                 <th>Action</th>
//                 <th>Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {appointments.length === 0 ? (
//                 <tr>
//                   <td colSpan="5">
//                     No appointments available for this timeslot
//                   </td>
//                 </tr>
//               ) : (
//                 appointments.map((appointment) => (
//                   <tr key={appointment.MAD_APPOINMENT_ID}>
//                     <td>{appointment.MAD_FULL_NAME}</td>
//                     <td>{appointment.MAD_CONTACT}</td>
//                     <td>
//                       {new Date(
//                         `1970-01-01T${appointment.MAD_ALLOCATED_TIME}`
//                       ).toLocaleTimeString("en-LK", {
//                         timeZone: "Asia/Colombo",
//                         hour: "numeric",
//                         minute: "numeric",
//                         hour12: true,
//                       })}
//                     </td>
//                     <td style={{ textAlign: "right" }}>
//                       {appointment.MAD_PATIENT_NO}
//                     </td>
//                     <td>
//                       <button
//                         className="action-button"
//                         onClick={() =>
//                           handleAddRecord(
//                             appointment.MAD_PATIENT_CODE,
//                             appointment.MAD_APPOINMENT_ID,
//                             appointment.MAD_PATIENT_NO
//                           )
//                         }
//                       >
//                         Add Treatment
//                       </button>
//                     </td>

//                     <td>
//                       {appointment.IsCompleted ? (
//                         <span className="completed-label">Completed</span>
//                       ) : (
//                         <span className="completed-label">Pending</span>
//                       )}
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       )}
//       <p className="error-message">{error1}</p>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
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
  Chip,
  useTheme,
  useMediaQuery,
  Avatar,
  Snackbar,
  Alert,
  InputAdornment,
  Tooltip,
  LinearProgress,
  Card,
  CardContent,
  Grid,
  Divider,
  Fade,
  Zoom,
  Badge,
  Stack,
  alpha,
} from "@mui/material";
import {
  AccessTime as TimeIcon,
  Add as AddIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  CalendarMonth as CalendarIcon,
  EventNote as EventNoteIcon,
  People as PeopleIcon,
  Today as TodayIcon,
  ArrowBack as ArrowBackIcon,
  PersonOff as PersonOffIcon,
  HourglassEmpty as HourglassIcon,
  Phone as PhoneIcon,
  WatchLater as WatchLaterIcon,
  DateRange as DateRangeIcon,
  EventAvailable as EventAvailableIcon,
  EventBusy as EventBusyIcon,
  Schedule as ScheduleIcon,
  MedicalServices as MedicalIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  CalendarToday as CalendarTodayIcon,
  ViewWeek as ViewWeekIcon,
  ViewModule as ViewModuleIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";

/* ─────────────────────────────────────────────
   CONSTANTS & HELPERS
───────────────────────────────────────────── */
const BRAND = {
  main: "#1976d2",
  dark: "#115293",
  light: "#42a5f5",
  bg: "#e3f2fd",
};

const toISO = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;

const formatTime = (t) =>
  new Date(`1970-01-01T${t}`).toLocaleTimeString("en-LK", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const getWeekDays = (date) => {
  const start = new Date(date);
  start.setDate(date.getDate() - date.getDay());
  const days = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(start);
    day.setDate(start.getDate() + i);
    days.push(day);
  }
  return days;
};

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function DailyAppointment() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isMd = useMediaQuery(theme.breakpoints.down("md"));

  const navigate = useNavigate();
  const Name = localStorage.getItem("Name") || "Doctor";
  const role = localStorage.getItem("Role");

  /* ── state ── */
  const [viewMode, setViewMode] = useState("week"); // "week" or "month"
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(toISO(new Date()));
  const [timeslots, setTimeslots] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [loadingAppts, setLoadingAppts] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [slotStats, setSlotStats] = useState({});
  const [expandedSlot, setExpandedSlot] = useState(null);
  const [dateStats, setDateStats] = useState({});
  const [snack, setSnack] = useState({ open: false, msg: "", sev: "info" });

  const showSnack = (msg, sev = "info") => setSnack({ open: true, msg, sev });

  /* ── fetch timeslots ── */
  useEffect(() => {
    const run = async () => {
      setLoadingSlots(true);
      setTimeslots([]);
      setAppointments([]);
      setSelectedSlot(null);
      setExpandedSlot(null);
      try {
        let slotsResponse;

        // Admin should see all doctors' timeslots for the selected date
        if (role === "Admin") {
          slotsResponse = await axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/Timeslot`
          );

          const allSlots = slotsResponse.data || [];
          const filteredSlots = allSlots.filter(
            (slot) =>
              slot.MT_SLOT_DATE &&
              slot.MT_SLOT_DATE.toString().substring(0, 10) === selectedDate
          );
          setTimeslots(filteredSlots);
        } else {
          slotsResponse = await axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/Timeslot/timeslotcard/${selectedDate}/${Name}`
          );
          setTimeslots(slotsResponse.data);
        }
        
        // Fetch appointments for each slot to get stats
        const stats = {};
        const slotsForStats =
          role === "Admin"
            ? // for admin use the filtered slots we just computed
              (role === "Admin" && slotsResponse.data
                ? (slotsResponse.data || []).filter(
                    (slot) =>
                      slot.MT_SLOT_DATE &&
                      slot.MT_SLOT_DATE.toString().substring(0, 10) ===
                        selectedDate
                  )
                : [])
            : slotsResponse.data || [];

        for (const slot of slotsForStats) {
          try {
            const apptRes = await axios.get(
              `${process.env.REACT_APP_API_BASE_URL}/Appointment/appointments/${slot.MT_SLOT_ID}`
            );
            const appts = apptRes.data;
            stats[slot.MT_SLOT_ID] = {
              total: appts.length,
              pending: appts.filter(a => a.MAD_STATUS !== "I" && !a.TreatmentStatus).length,
              completed: appts.filter(a => a.TreatmentStatus === "C").length,
              cancelled: appts.filter(a => a.MAD_STATUS === "I").length,
              appointments: appts,
            };
          } catch {
            stats[slot.MT_SLOT_ID] = { total: 0, pending: 0, completed: 0, cancelled: 0, appointments: [] };
          }
        }
        setSlotStats(stats);
      } catch {
        showSnack("No timeslots found for selected date", "info");
      } finally {
        setLoadingSlots(false);
      }
    };
    if (selectedDate) run();
  }, [selectedDate, Name, role]);

  /* ── fetch date stats for calendar view ── */
  useEffect(() => {
    const fetchDateStats = async () => {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const stats = {};

      // Admin: base stats on all timeslots across doctors
      if (role === "Admin") {
        try {
          const allSlotsResponse = await axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/Timeslot`
          );
          const allSlots = allSlotsResponse.data || [];

          for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day)
              .padStart(2, "0")}`;

            const slotsForDate = allSlots.filter(
              (slot) =>
                slot.MT_SLOT_DATE &&
                slot.MT_SLOT_DATE.toString().substring(0, 10) === dateStr
            );

            let totalBookings = 0;
            for (const slot of slotsForDate) {
              try {
                const apptRes = await axios.get(
                  `${process.env.REACT_APP_API_BASE_URL}/Appointment/appointments/${slot.MT_SLOT_ID}`
                );
                totalBookings += apptRes.data.length;
              } catch {
                // ignore errors per slot
              }
            }

            stats[dateStr] = {
              slots: slotsForDate.length,
              bookings: totalBookings,
            };
          }
        } catch {
          for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day)
              .padStart(2, "0")}`;
            stats[dateStr] = { slots: 0, bookings: 0 };
          }
        }
      } else {
        // Doctor / Pharmacy user: stats per doctor as before
        for (let day = 1; day <= daysInMonth; day++) {
          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day)
            .padStart(2, "0")}`;
          try {
            const res = await axios.get(
              `${process.env.REACT_APP_API_BASE_URL}/Timeslot/timeslotcard/${dateStr}/${Name}`
            );
            let totalBookings = 0;
            for (const slot of res.data) {
              try {
                const apptRes = await axios.get(
                  `${process.env.REACT_APP_API_BASE_URL}/Appointment/appointments/${slot.MT_SLOT_ID}`
                );
                totalBookings += apptRes.data.length;
              } catch {
                // No appointments
              }
            }
            stats[dateStr] = {
              slots: res.data.length,
              bookings: totalBookings,
            };
          } catch {
            stats[dateStr] = { slots: 0, bookings: 0 };
          }
        }
      }
      setDateStats(stats);
    };
    
    fetchDateStats();
  }, [currentDate, Name, role]);

  /* ── fetch appointments for selected slot ── */
  const handleViewSlot = async (slot) => {
    if (expandedSlot === slot.MT_SLOT_ID) {
      setExpandedSlot(null);
      setSelectedSlot(null);
      setAppointments([]);
      return;
    }

    setLoadingAppts(true);
    setSelectedSlot(slot);
    setSearchTerm("");
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/Appointment/appointments/${slot.MT_SLOT_ID}`
      );
      setAppointments(res.data);
      setExpandedSlot(slot.MT_SLOT_ID);
    } catch {
      showSnack("No appointments available for this timeslot", "info");
      setAppointments([]);
    } finally {
      setLoadingAppts(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/Appointment/cancel-appointment/${appointmentId}`
      );
      setAppointments((prev) =>
        prev.map((a) =>
          a.MAD_APPOINMENT_ID === appointmentId
            ? { ...a, MAD_STATUS: "I" }
            : a
        )
      );
      showSnack("Appointment cancelled successfully", "success");
    } catch {
      showSnack("Failed to cancel appointment", "error");
    }
  };

  const handleAddRecord = (patientId, appointmentID, patientNo) => {
    navigate(`/dashboard/addrecord/${patientId}`, {
      state: {
        appointmentid: appointmentID,
        channelnumber: patientNo,
        MTD_APPOINMENT_ID: appointmentID,
      },
    });
  };

  /* ── calendar generation ── */
  const weekDays = getWeekDays(currentDate);
  const monthDays = [];
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  for (let i = 1; i <= daysInMonth; i++) {
    monthDays.push(new Date(year, month, i));
  }

  /* ── gradient ── */
  const grad = `linear-gradient(135deg, ${BRAND.dark} 0%, ${BRAND.main} 55%, ${BRAND.light} 100%)`;

  /* ── calculate totals for cards ── */
  const totalSlots = timeslots.length;
  const totalBookings = Object.values(slotStats).reduce((sum, stat) => sum + stat.total, 0);
  const totalPending = Object.values(slotStats).reduce((sum, stat) => sum + stat.pending, 0);
  const totalCompleted = Object.values(slotStats).reduce((sum, stat) => sum + stat.completed, 0);
  const totalCancelled = Object.values(slotStats).reduce((sum, stat) => sum + stat.cancelled, 0);

  /* ─────────────────────── RENDER ─────────────────────── */
  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        bgcolor: "#f8fafc",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          background: grad,
          px: { xs: 2, sm: 3, md: 4 },
          py: 2.5,
          borderBottom: `1px solid ${alpha('#fff', 0.1)}`,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              sx={{
                width: 48,
                height: 48,
                bgcolor: alpha('#fff', 0.2),
                color: '#fff',
              }}
            >
              <CalendarTodayIcon />
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight={700} color="white">
                Appointment Schedule
              </Typography>
              <Typography variant="body2" sx={{ color: alpha('#fff', 0.8) }}>
                Dr. {Name} · {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant={viewMode === "week" ? "contained" : "outlined"}
              onClick={() => setViewMode("week")}
              startIcon={<ViewWeekIcon />}
              sx={{
                bgcolor: viewMode === "week" ? '#fff' : 'transparent',
                color: viewMode === "week" ? BRAND.main : '#fff',
                borderColor: alpha('#fff', 0.3),
                '&:hover': {
                  bgcolor: viewMode === "week" ? '#fff' : alpha('#fff', 0.1),
                },
              }}
            >
              Week
            </Button>
            <Button
              variant={viewMode === "month" ? "contained" : "outlined"}
              onClick={() => setViewMode("month")}
              startIcon={<ViewModuleIcon />}
              sx={{
                bgcolor: viewMode === "month" ? '#fff' : 'transparent',
                color: viewMode === "month" ? BRAND.main : '#fff',
                borderColor: alpha('#fff', 0.3),
                '&:hover': {
                  bgcolor: viewMode === "month" ? '#fff' : alpha('#fff', 0.1),
                },
              }}
            >
              Month
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ p: { xs: 2, sm: 3 } }}>
        {/* Summary Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6} sm={3}>
            <Zoom in={true} style={{ transitionDelay: "100ms" }}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: "16px",
                  border: `1px solid ${BRAND.bg}`,
                  background: "#fff",
                  position: "relative",
                  overflow: "hidden",
                  '&:hover': {
                    boxShadow: `0 8px 24px ${alpha(BRAND.main, 0.15)}`,
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: "12px",
                        background: `linear-gradient(135deg, ${BRAND.main}20, ${BRAND.light}10)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <ScheduleIcon sx={{ color: BRAND.main, fontSize: 28 }} />
                    </Box>
                    <Box>
                      <Typography variant="h4" fontWeight={800} color={BRAND.dark}>
                        {totalSlots}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" fontWeight={500}>
                        Total Slots
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Zoom>
          </Grid>

          <Grid item xs={6} sm={3}>
            <Zoom in={true} style={{ transitionDelay: "200ms" }}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: "16px",
                  border: `1px solid ${BRAND.bg}`,
                  background: "#fff",
                  position: "relative",
                  overflow: "hidden",
                  '&:hover': {
                    boxShadow: `0 8px 24px ${alpha('#f59e0b', 0.15)}`,
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: "12px",
                        background: "linear-gradient(135deg, #f59e0b20, #fbbf2410)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <HourglassIcon sx={{ color: "#f59e0b", fontSize: 28 }} />
                    </Box>
                    <Box>
                      <Typography variant="h4" fontWeight={800} color="#f59e0b">
                        {totalPending}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" fontWeight={500}>
                        Pending
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Zoom>
          </Grid>

          <Grid item xs={6} sm={3}>
            <Zoom in={true} style={{ transitionDelay: "300ms" }}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: "16px",
                  border: `1px solid ${BRAND.bg}`,
                  background: "#fff",
                  position: "relative",
                  overflow: "hidden",
                  '&:hover': {
                    boxShadow: `0 8px 24px ${alpha('#16a34a', 0.15)}`,
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: "12px",
                        background: "linear-gradient(135deg, #16a34a20, #4ade8010)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <CheckCircleIcon sx={{ color: "#16a34a", fontSize: 28 }} />
                    </Box>
                    <Box>
                      <Typography variant="h4" fontWeight={800} color="#16a34a">
                        {totalCompleted}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" fontWeight={500}>
                        Completed
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Zoom>
          </Grid>

          <Grid item xs={6} sm={3}>
            <Zoom in={true} style={{ transitionDelay: "400ms" }}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: "16px",
                  border: `1px solid ${BRAND.bg}`,
                  background: "#fff",
                  position: "relative",
                  overflow: "hidden",
                  '&:hover': {
                    boxShadow: `0 8px 24px ${alpha('#dc2626', 0.15)}`,
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: "12px",
                        background: "linear-gradient(135deg, #dc262620, #ef444410)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <PersonOffIcon sx={{ color: "#dc2626", fontSize: 28 }} />
                    </Box>
                    <Box>
                      <Typography variant="h4" fontWeight={800} color="#dc2626">
                        {totalCancelled}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" fontWeight={500}>
                        Cancelled
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Zoom>
          </Grid>
        </Grid>

        {/* Calendar View */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: "20px",
            border: `1px solid ${BRAND.bg}`,
            overflow: "hidden",
            mb: 3,
            bgcolor: "#fff",
          }}
        >
          {/* Calendar Navigation */}
          <Box
            sx={{
              p: 2,
              borderBottom: `1px solid ${BRAND.bg}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              bgcolor: BRAND.bg,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <IconButton
                onClick={() => {
                  const newDate = new Date(currentDate);
                  if (viewMode === "week") {
                    newDate.setDate(currentDate.getDate() - 7);
                  } else {
                    newDate.setMonth(currentDate.getMonth() - 1);
                  }
                  setCurrentDate(newDate);
                }}
                sx={{ bgcolor: '#fff', '&:hover': { bgcolor: '#fff' } }}
              >
                <ChevronLeftIcon />
              </IconButton>
              <Typography variant="h6" fontWeight={700} color={BRAND.dark}>
                {viewMode === "week" 
                  ? `${weekDays[0].toLocaleDateString()} - ${weekDays[6].toLocaleDateString()}`
                  : `${MONTHS[currentDate.getMonth()]} ${currentDate.getFullYear()}`
                }
              </Typography>
              <IconButton
                onClick={() => {
                  const newDate = new Date(currentDate);
                  if (viewMode === "week") {
                    newDate.setDate(currentDate.getDate() + 7);
                  } else {
                    newDate.setMonth(currentDate.getMonth() + 1);
                  }
                  setCurrentDate(newDate);
                }}
                sx={{ bgcolor: '#fff', '&:hover': { bgcolor: '#fff' } }}
              >
                <ChevronRightIcon />
              </IconButton>
            </Box>
            <Button
              variant="contained"
              startIcon={<TodayIcon />}
              onClick={() => setCurrentDate(new Date())}
              sx={{
                bgcolor: BRAND.main,
                '&:hover': { bgcolor: BRAND.dark },
              }}
            >
              Today
            </Button>
          </Box>

          {/* Calendar Grid */}
          <Box sx={{ p: 2 }}>
            {viewMode === "week" ? (
              // Week View - Horizontal Timeline
              <Box sx={{ display: "flex", gap: 1, overflowX: "auto", pb: 1 }}>
                {weekDays.map((day, index) => {
                  const dateStr = toISO(day);
                  const isToday = dateStr === toISO(new Date());
                  const isSelected = dateStr === selectedDate;
                  const stats = dateStats[dateStr] || { slots: 0, bookings: 0 };
                  
                  return (
                    <Card
                      key={index}
                      onClick={() => setSelectedDate(dateStr)}
                      sx={{
                        minWidth: 140,
                        cursor: "pointer",
                        borderRadius: "16px",
                        border: `2px solid ${isSelected ? BRAND.main : 'transparent'}`,
                        bgcolor: isToday ? alpha(BRAND.main, 0.05) : '#fff',
                        transition: "all 0.2s",
                        '&:hover': {
                          transform: "translateY(-4px)",
                          boxShadow: `0 8px 24px ${alpha(BRAND.main, 0.15)}`,
                        },
                      }}
                    >
                      <CardContent>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          {day.toLocaleDateString('en-US', { weekday: 'short' })}
                        </Typography>
                        <Typography variant="h4" fontWeight={700} color={isSelected ? BRAND.main : BRAND.dark}>
                          {day.getDate()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block">
                          {day.toLocaleDateString('en-US', { month: 'short' })}
                        </Typography>
                        
                        <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
                          {stats.slots > 0 && (
                            <Chip
                              size="small"
                              label={`${stats.slots} slots`}
                              sx={{ bgcolor: BRAND.bg, color: BRAND.main, fontSize: '0.65rem' }}
                            />
                          )}
                          {stats.bookings > 0 && (
                            <Chip
                              size="small"
                              label={`${stats.bookings} bookings`}
                              sx={{ bgcolor: alpha(BRAND.main, 0.1), color: BRAND.main, fontSize: '0.65rem' }}
                            />
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  );
                })}
              </Box>
            ) : (
              // Month View - Calendar Grid
              <Box>
                {/* Weekday headers */}
                <Grid container spacing={1} sx={{ mb: 1 }}>
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <Grid item xs key={day}>
                      <Typography align="center" variant="subtitle2" fontWeight={600} color="text.secondary">
                        {day}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>
                
                {/* Calendar days */}
                <Grid container spacing={1}>
                  {Array.from({ length: new Date(year, month, 1).getDay() }).map((_, i) => (
                    <Grid item xs key={`empty-${i}`}>
                      <Box sx={{ height: 100 }} />
                    </Grid>
                  ))}
                  
                  {monthDays.map((day) => {
                    const dateStr = toISO(day);
                    const isToday = dateStr === toISO(new Date());
                    const isSelected = dateStr === selectedDate;
                    const stats = dateStats[dateStr] || { slots: 0, bookings: 0 };
                    
                    return (
                      <Grid item xs key={dateStr}>
                        <Paper
                          onClick={() => setSelectedDate(dateStr)}
                          elevation={0}
                          sx={{
                            height: 100,
                            p: 1,
                            cursor: "pointer",
                            borderRadius: "12px",
                            border: `2px solid ${isSelected ? BRAND.main : 'transparent'}`,
                            bgcolor: isToday ? alpha(BRAND.main, 0.05) : '#fff',
                            transition: "all 0.2s",
                            '&:hover': {
                              bgcolor: alpha(BRAND.main, 0.02),
                              transform: "scale(0.98)",
                            },
                          }}
                        >
                          <Typography 
                            variant="h6" 
                            fontWeight={isToday ? 700 : 500}
                            color={isSelected ? BRAND.main : isToday ? BRAND.main : 'text.primary'}
                          >
                            {day.getDate()}
                          </Typography>
                          
                          {stats.slots > 0 && (
                            <Box sx={{ mt: 1 }}>
                              <Chip
                                size="small"
                                label={`${stats.slots}`}
                                sx={{ 
                                  height: 20, 
                                  fontSize: '0.6rem',
                                  bgcolor: BRAND.main,
                                  color: '#fff',
                                  fontWeight: 600,
                                }}
                              />
                            </Box>
                          )}
                          
                          {stats.bookings > 0 && (
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                              {stats.bookings} booking{stats.bookings !== 1 ? 's' : ''}
                            </Typography>
                          )}
                        </Paper>
                      </Grid>
                    );
                  })}
                </Grid>
              </Box>
            )}
          </Box>
        </Paper>

        {/* Selected Date Info Bar */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 3,
            borderRadius: "16px",
            background: grad,
            color: '#fff',
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <CalendarTodayIcon />
            <Box>
              <Typography variant="h6" fontWeight={700}>
                {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-LK", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {totalSlots} timeslot{totalSlots !== 1 ? 's' : ''} available · {totalBookings} total booking{totalBookings !== 1 ? 's' : ''}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: "flex", gap: 2 }}>
            <Chip
              icon={<HourglassIcon />}
              label={`${totalPending} Pending`}
              sx={{
                bgcolor: alpha('#fff', 0.2),
                color: '#fff',
                fontWeight: 600,
                pointerEvents: "none", // purely visual indicator
              }}
            />
            <Chip
              icon={<CheckCircleIcon />}
              label={`${totalCompleted} Completed`}
              sx={{
                bgcolor: alpha('#fff', 0.2),
                color: '#fff',
                fontWeight: 600,
                pointerEvents: "none", // purely visual indicator
              }}
            />
            {totalCancelled > 0 && (
              <Chip
                icon={<PersonOffIcon />}
                label={`${totalCancelled} Cancelled`}
                sx={{
                  bgcolor: alpha('#fff', 0.2),
                  color: '#fff',
                  fontWeight: 600,
                  pointerEvents: "none", // purely visual indicator
                }}
              />
            )}
          </Box>
        </Paper>

        {/* Timeslots Section */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: "20px",
            border: `1px solid ${BRAND.bg}`,
            overflow: "hidden",
            bgcolor: "#fff",
          }}
        >
          {/* Section Header */}
          <Box
            sx={{
              px: 3,
              py: 2.5,
              borderBottom: `1px solid ${BRAND.bg}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              bgcolor: '#fafbfc',
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <EventNoteIcon sx={{ color: BRAND.main }} />
              <Typography variant="h6" fontWeight={700} color={BRAND.dark}>
                Today's Schedule
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {timeslots.length} timeslot{timeslots.length !== 1 ? 's' : ''} available
            </Typography>
          </Box>

          {/* Timeslots List */}
          <Box sx={{ p: 3 }}>
            {loadingSlots ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                <CircularProgress sx={{ color: BRAND.main }} />
              </Box>
            ) : timeslots.length === 0 ? (
              <Box
                sx={{
                  textAlign: "center",
                  py: 8,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <EventBusyIcon sx={{ fontSize: 64, color: `${BRAND.main}30` }} />
                <Typography variant="h6" sx={{ color: "#64748b" }}>
                  No Timeslots Available
                </Typography>
                <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                  Select a different date from the calendar
                </Typography>
              </Box>
            ) : (
              <Stack spacing={2}>
                {timeslots.map((slot) => {
                  const stats = slotStats[slot.MT_SLOT_ID] || { total: 0, pending: 0, completed: 0, cancelled: 0 };
                  const isExpanded = expandedSlot === slot.MT_SLOT_ID;
                  
                  return (
                    <Paper
                      key={slot.MT_SLOT_ID}
                      elevation={0}
                      sx={{
                        border: `1px solid ${isExpanded ? BRAND.main : BRAND.bg}`,
                        borderRadius: "16px",
                        overflow: "hidden",
                        transition: "all 0.3s ease",
                        bgcolor: '#fff',
                      }}
                    >
                      {/* Slot Header */}
                      <Box
                        onClick={() => handleViewSlot(slot)}
                        sx={{
                          p: 2.5,
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          cursor: "pointer",
                          bgcolor: isExpanded ? alpha(BRAND.main, 0.02) : '#fff',
                          '&:hover': {
                            bgcolor: alpha(BRAND.main, 0.02),
                          },
                        }}
                      >
                        <Avatar
                          sx={{
                            width: 56,
                            height: 56,
                            bgcolor: isExpanded ? BRAND.main : BRAND.bg,
                            color: isExpanded ? '#fff' : BRAND.main,
                            fontWeight: 800,
                          }}
                        >
                          {slot.MT_DOCTOR?.charAt(0).toUpperCase()}
                        </Avatar>

                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" fontWeight={700} color="#1e293b">
                            {slot.MT_DOCTOR}
                          </Typography>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap", mt: 0.5 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                              <TimeIcon sx={{ fontSize: 16, color: BRAND.main }} />
                              <Typography variant="body2" color="text.secondary">
                                {formatTime(slot.MT_START_TIME)} - {formatTime(slot.MT_END_TIME)}
                              </Typography>
                            </Box>
                            
                            <Box sx={{ display: "flex", gap: 1 }}>
                              {stats.pending > 0 && (
                                <Chip
                                  size="small"
                                  label={`${stats.pending} Pending`}
                                  sx={{
                                    bgcolor: "#fef3c7",
                                    color: "#b45309",
                                    fontWeight: 600,
                                    pointerEvents: "none", // purely visual indicator
                                  }}
                                />
                              )}
                              {stats.completed > 0 && (
                                <Chip
                                  size="small"
                                  label={`${stats.completed} Completed`}
                                  sx={{
                                    bgcolor: "#dcfce7",
                                    color: "#15803d",
                                    fontWeight: 600,
                                    pointerEvents: "none", // purely visual indicator
                                  }}
                                />
                              )}
                            </Box>
                          </Box>
                        </Box>

                        <Box
                          sx={{
                            px: 2,
                            py: 1,
                            borderRadius: "8px",
                            bgcolor: isExpanded ? BRAND.main : BRAND.bg,
                            color: isExpanded ? '#fff' : BRAND.main,
                            fontWeight: 700,
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <PeopleIcon sx={{ fontSize: 18 }} />
                          <Typography variant="body2" fontWeight={700}>
                            {stats.total}
                          </Typography>
                          {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </Box>
                      </Box>

                      {/* Expanded Appointments */}
                      {isExpanded && (
                        <Fade in={true}>
                          <Box sx={{ borderTop: `1px solid ${BRAND.bg}`, p: 2.5, bgcolor: "#fafbfc" }}>
                            {loadingAppts ? (
                              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                                <CircularProgress size={32} sx={{ color: BRAND.main }} />
                              </Box>
                            ) : appointments.length === 0 ? (
                              <Box sx={{ textAlign: "center", py: 4 }}>
                                <EventAvailableIcon sx={{ fontSize: 48, color: `${BRAND.main}30`, mb: 1 }} />
                                <Typography color="text.secondary">No appointments in this slot</Typography>
                              </Box>
                            ) : (
                              <>
                                {/* Search */}
                                <TextField
                                  size="small"
                                  fullWidth
                                  placeholder="Search patients..."
                                  value={searchTerm}
                                  onChange={(e) => setSearchTerm(e.target.value)}
                                  sx={{ mb: 2.5 }}
                                  InputProps={{
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <SearchIcon sx={{ color: BRAND.main }} />
                                      </InputAdornment>
                                    ),
                                  }}
                                />

                                {/* Appointments Table */}
                                <TableContainer>
                                  <Table size={isMobile ? "small" : "medium"}>
                                    <TableHead>
                                      <TableRow sx={{ bgcolor: BRAND.bg }}>
                                        <TableCell sx={{ fontWeight: 700, color: BRAND.main }}>Patient</TableCell>
                                        {!isMobile && <TableCell sx={{ fontWeight: 700, color: BRAND.main }}>Contact</TableCell>}
                                        <TableCell sx={{ fontWeight: 700, color: BRAND.main }}>Time</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: BRAND.main }}>No.</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: BRAND.main }}>Status</TableCell>
                                        <TableCell align="center" sx={{ fontWeight: 700, color: BRAND.main }}>Actions</TableCell>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      {appointments
                                        .filter(a => 
                                          searchTerm ? 
                                          a.MAD_FULL_NAME.toLowerCase().includes(searchTerm.toLowerCase()) : 
                                          true
                                        )
                                        .map((appt) => {
                                          const isCancelled = appt.MAD_STATUS === "I";
                                          const isCompleted = appt.TreatmentStatus === "C";
                                          const disabled = isCancelled || isCompleted;

                                          return (
                                            <TableRow
                                              key={appt.MAD_APPOINMENT_ID}
                                              sx={{
                                                opacity: isCancelled ? 0.65 : 1,
                                                bgcolor: isCancelled ? "#fff5f5" : "inherit",
                                              }}
                                            >
                                              <TableCell>
                                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                  <Avatar
                                                    sx={{
                                                      width: 32,
                                                      height: 32,
                                                      bgcolor: isCancelled ? "#fee2e2" : BRAND.bg,
                                                      color: isCancelled ? "#dc2626" : BRAND.main,
                                                      fontSize: 14,
                                                    }}
                                                  >
                                                    {appt.MAD_FULL_NAME.charAt(0)}
                                                  </Avatar>
                                                  <Typography variant="body2" fontWeight={600}>
                                                    {appt.MAD_FULL_NAME}
                                                  </Typography>
                                                </Box>
                                              </TableCell>
                                              
                                              {!isMobile && (
                                                <TableCell>
                                                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                                    <PhoneIcon sx={{ fontSize: 14, color: BRAND.main }} />
                                                    <Typography variant="body2">{appt.MAD_CONTACT}</Typography>
                                                  </Box>
                                                </TableCell>
                                              )}
                                              
                                              <TableCell>
                                                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                                  <WatchLaterIcon sx={{ fontSize: 14, color: BRAND.main }} />
                                                  <Typography variant="body2">
                                                    {formatTime(appt.MAD_ALLOCATED_TIME)}
                                                  </Typography>
                                                </Box>
                                              </TableCell>
                                              
                                              <TableCell>
                                                <Box
                                                  sx={{
                                                    display: "inline-block",
                                                    px: 1.5,
                                                    py: 0.3,
                                                    borderRadius: "6px",
                                                    border: `1px solid ${BRAND.main}`,
                                                    color: BRAND.main,
                                                    fontWeight: 700,
                                                    fontSize: "0.75rem",
                                                  }}
                                                >
                                                  {appt.MAD_PATIENT_NO}
                                                </Box>
                                              </TableCell>
                                              
                                              <TableCell>
                                                {appt.MAD_STATUS === "I" ? (
                                                  <Chip
                                                    label="Cancelled"
                                                    size="small"
                                                    sx={{ bgcolor: "#fee2e2", color: "#b91c1c", fontWeight: 600 }}
                                                  />
                                                ) : appt.TreatmentStatus === "C" ? (
                                                  <Chip
                                                    label="Completed"
                                                    size="small"
                                                    sx={{ bgcolor: "#dcfce7", color: "#15803d", fontWeight: 600 }}
                                                  />
                                                ) : (
                                                  <Chip
                                                    label="Pending"
                                                    size="small"
                                                    sx={{ bgcolor: "#fef3c7", color: "#b45309", fontWeight: 600 }}
                                                  />
                                                )}
                                              </TableCell>
                                              
                                              <TableCell align="center">
                                                <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                                                  <Tooltip title={disabled ? "Cannot add treatment" : "Add Treatment"}>
                                                    <span>
                                                      <IconButton
                                                        size="small"
                                                        onClick={() => handleAddRecord(
                                                          appt.MAD_PATIENT_CODE,
                                                          appt.MAD_APPOINMENT_ID,
                                                          appt.MAD_PATIENT_NO
                                                        )}
                                                        disabled={disabled}
                                                        sx={{
                                                          bgcolor: BRAND.bg,
                                                          color: BRAND.main,
                                                          '&:hover': { bgcolor: BRAND.main, color: '#fff' },
                                                          '&.Mui-disabled': { bgcolor: '#e2e8f0', color: '#94a3b8' },
                                                        }}
                                                      >
                                                        <AddIcon fontSize="small" />
                                                      </IconButton>
                                                    </span>
                                                  </Tooltip>
                                                  
                                                  <Tooltip title={disabled ? "Cannot cancel" : "Cancel"}>
                                                    <span>
                                                      <IconButton
                                                        size="small"
                                                        onClick={() => handleCancelAppointment(appt.MAD_APPOINMENT_ID)}
                                                        disabled={disabled}
                                                        sx={{
                                                          bgcolor: "#fee2e2",
                                                          color: "#dc2626",
                                                          '&:hover': { bgcolor: "#dc2626", color: '#fff' },
                                                          '&.Mui-disabled': { bgcolor: '#e2e8f0', color: '#94a3b8' },
                                                        }}
                                                      >
                                                        <CloseIcon fontSize="small" />
                                                      </IconButton>
                                                    </span>
                                                  </Tooltip>
                                                </Box>
                                              </TableCell>
                                            </TableRow>
                                          );
                                        })}
                                    </TableBody>
                                  </Table>
                                </TableContainer>

                                {/* Stats Footer */}
                                {appointments.length > 0 && (
                                  <Box
                                    sx={{
                                      mt: 2,
                                      pt: 2,
                                      borderTop: `1px solid ${BRAND.bg}`,
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Typography variant="caption" color="text.secondary">
                                      Showing {appointments.filter(a => searchTerm ? a.MAD_FULL_NAME.toLowerCase().includes(searchTerm.toLowerCase()) : true).length} of {appointments.length} appointments
                                    </Typography>
                                    <Box sx={{ display: "flex", gap: 1 }}>
                                      <Chip
                                        size="small"
                                        label={`${stats.pending} Pending`}
                                        sx={{
                                          bgcolor: "#fef3c7",
                                          color: "#b45309",
                                          pointerEvents: "none", // purely visual indicator
                                        }}
                                      />
                                      <Chip
                                        size="small"
                                        label={`${stats.completed} Completed`}
                                        sx={{
                                          bgcolor: "#dcfce7",
                                          color: "#15803d",
                                          pointerEvents: "none", // purely visual indicator
                                        }}
                                      />
                                      {stats.cancelled > 0 && (
                                        <Chip
                                          size="small"
                                          label={`${stats.cancelled} Cancelled`}
                                          sx={{
                                            bgcolor: "#fee2e2",
                                            color: "#b91c1c",
                                            pointerEvents: "none", // purely visual indicator
                                          }}
                                        />
                                      )}
                                    </Box>
                                  </Box>
                                )}
                              </>
                            )}
                          </Box>
                        </Fade>
                      )}
                    </Paper>
                  );
                })}
              </Stack>
            )}
          </Box>
        </Paper>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snack.open}
        autoHideDuration={5000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnack((s) => ({ ...s, open: false }))}
          severity={snack.sev}
          sx={{ width: "100%" }}
        >
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}