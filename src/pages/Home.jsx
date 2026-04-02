//Home.jsx - patient after completing loggin process and comes to this page(without MUI)

// import { useEffect, useState } from "react";
// import Navbar from "../components/navbar";
// import "../styles/home.css";
// import Footer from "../components/footer";
// import { useNavigate } from "react-router-dom";
// import PatientAppointment from "../components/patientappoinment";
// import { faTimes } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import doctor_consultation from "../assets/hdoctor_consultation.jpeg";

// import image4 from "../assets/online-medical.png";
// import image5 from "../assets/pharmacy_new.png";
// import image6 from "../assets/medical-prescription.png";

// import doctor4 from "../assets/doctorsample.jpeg";
// import doctor3 from "../assets/doctorsample2.jpeg";

// export default function Home() {
//   const images = [doctor_consultation, doctor4, doctor3];
//   const [popup, setPopup] = useState(false);
//   const navigate = useNavigate();
//   const [currentIndex, setCurrentIndex] = useState(0);

//   // Automatically move to the next image every 3 seconds
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
//     }, 8000); // Change image every 3 seconds

//     return () => clearInterval(interval); // Cleanup on component unmount
//   }, [images.length]);

//   const nextImage = () => {
//     setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
//   };

//   const prevImage = () => {
//     setCurrentIndex((prevIndex) =>
//       prevIndex === 0 ? images.length - 1 : prevIndex - 1
//     );
//   };

//   const openup = () => {
//     setPopup(true);
//   };

//   const closeup = () => {
//     setPopup(false);
//   };

//   return (
//     <div className="home-container">
//       <Navbar />
//       {/* <br /> */}

//       <div id="home-section" className="section1">
//         <div className="containers">
//           <div className="left-container1">
//             <div className="image-slider-container">
//               {/* Left arrow */}
//               <div
//                 className="arrow left-arrow"
//                 onClick={prevImage}
//                 style={{ color: "black" }}
//               >
//                 &#10094;
//               </div>

//               {/* Image */}
//               <img
//                 src={images[currentIndex]}
//                 alt={`Image ${currentIndex + 1}`}
//               />

//               {/* Right arrow */}
//               <div
//                 className="arrow right-arrow"
//                 onClick={nextImage}
//                 style={{ color: "black" }}
//               >
//                 &#10095;
//               </div>

//               {/* Dots below the image */}
//               <div className="dots-container">
//                 {images.map((_, index) => (
//                   <div
//                     key={index}
//                     className={`dot ${index === currentIndex ? "active" : ""}`}
//                     onClick={() => setCurrentIndex(index)}
//                   ></div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           <div className="right-container1">
//             {/* <h1>Patient Record Management System</h1> */}

//             <p>
//               The system is enables the patient to view the past medical history
//               and prescriptions of patients.The system provides facility to
//               Schedule online appoinments.The user can select available timeslot
//               of the doctor and book an appoinment .
//             </p>
//             <button onClick={openup} >Book Appointment </button>
//           </div>
//         </div>
//       </div>

//       {popup && (
//         <div className="popup-overlay" onClick={closeup}>
//           <div className="popup" onClick={(e) => e.stopPropagation()}>
//             <button className="close-btn" onClick={closeup}>
//               <FontAwesomeIcon icon={faTimes} />
//             </button>
//             <PatientAppointment />
//           </div>
//         </div>
//       )}

//       <div className="services-container">
//         <h2 style={{ textAlign: "center" }}>Our Services</h2>

//         <div id="services-section" className="services-section">
//           <div className="service-card">
//             <h3>Online appointments</h3>
//             <div className="card-content">
//               <p>
//                 The system allows patients to book an appoinment for doctor.
//               </p>
//               <img src={image4} alt="Online appointments" />
//             </div>
//           </div>

//           <div className="service-card">
//             <h3>Keep Medical History</h3>
//             <div className="card-content">
//               <p>The system keeps the patient's medical history.</p>
//               <img src={image6} alt="Medical history" />
//             </div>
//           </div>

//           <div className="service-card">
//             <h3>Pharmacy Management</h3>
//             <div className="card-content">
//               <p>The system allows pharmacy users to track prescriptions.</p>
//               <img src={image5} alt="Pharmacy management" />
//             </div>
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// }

//With MUI

import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { useNavigate } from "react-router-dom";
import PatientAppointment from "../components/patientappoinment";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import doctor_consultation from "../assets/hdoctor_consultation.jpeg";
import image4 from "../assets/online-medical.png";
import image5 from "../assets/pharmacy_new.png";
import image6 from "../assets/medical-prescription.png";
import doctor4 from "../assets/doctorsample.jpeg";
import doctor3 from "../assets/doctorsample2.jpeg";

// MUI Components
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  IconButton,
  Modal,
  Paper,
  Typography,
  useTheme,
  styled,
  useMediaQuery,
  Fade,
  Backdrop,
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";

const HeroBackground = styled(Box)(({ theme }) => ({
  position: "relative",
  height: "70vh",
  minHeight: "400px",
  width: "100%",
  overflow: "hidden",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.palette.common.white,
  [theme.breakpoints.down("md")]: {
    height: "60vh",
    minHeight: "350px",
  },
  [theme.breakpoints.down("sm")]: {
    height: "50vh",
    minHeight: "300px",
  },
  "&:before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    zIndex: 1,
  },
}));

const HeroContent = styled(Box)(({ theme }) => ({
  position: "relative",
  zIndex: 2,
  textAlign: "center",
  padding: theme.spacing(4),
  maxWidth: "800px",
  margin: "0 auto",
  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(3),
    maxWidth: "600px",
  },
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
    maxWidth: "90%",
  },
}));

const ServiceCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "transform 0.3s ease-in-out",
  "&:hover": {
    transform: "scale(1.03)",
    boxShadow: theme.shadows[8],
  },
  [theme.breakpoints.down("sm")]: {
    "&:hover": {
      transform: "none",
    },
  },
}));

const Dot = styled("div")(({ active, theme }) => ({
  width: 10,
  height: 10,
  borderRadius: "50%",
  backgroundColor: active
    ? theme.palette.primary.main
    : theme.palette.grey[400],
  margin: "0 4px",
  cursor: "pointer",
  transition: "background-color 0.3s",
  [theme.breakpoints.down("sm")]: {
    width: 8,
    height: 8,
    margin: "0 3px",
  },
}));

export default function Home() {
  const images = [doctor_consultation, doctor4, doctor3];
  const [popup, setPopup] = useState(false);
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [images.length]);

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const openup = () => {
    setPopup(true);
  };

  const closeup = () => {
    setPopup(false);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      <Box
        id="home-section"
        sx={{
          position: "relative",
          height: "85vh",
          minHeight: { xs: "70vh", md: "85vh" },
        }}
      >
        <HeroBackground
          sx={{
            height: "100%",
            position: "relative",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            {images.map((img, index) => (
              <Box
                key={index}
                component="img"
                src={img}
                alt={`Slide ${index + 1}`}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  position: "absolute",
                  opacity: index === currentIndex ? 1 : 0,
                  transition: "opacity 1s ease-in-out",
                }}
              />
            ))}
          </Box>

          {!isMobile && (
            <>
              <IconButton
                onClick={prevImage}
                sx={{
                  position: "absolute",
                  left: { xs: 8, md: 16 },
                  top: "50%",
                  transform: "translateY(-50%)",
                  backgroundColor: "rgba(255,255,255,0.3)",
                  color: theme.palette.common.white,
                  zIndex: 2,
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.5)",
                  },
                }}
              >
                <ChevronLeft fontSize="large" />
              </IconButton>

              <IconButton
                onClick={nextImage}
                sx={{
                  position: "absolute",
                  right: { xs: 8, md: 16 },
                  top: "50%",
                  transform: "translateY(-50%)",
                  backgroundColor: "rgba(255,255,255,0.3)",
                  color: theme.palette.common.white,
                  zIndex: 2,
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.5)",
                  },
                }}
              >
                <ChevronRight fontSize="large" />
              </IconButton>
            </>
          )}

          <Box
            sx={{
              position: "absolute",
              bottom: { xs: 20, md: 40 },
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
              zIndex: 2,
            }}
          >
            {images.map((_, index) => (
              <Dot
                key={index}
                active={index === currentIndex}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </Box>

          <HeroContent
            sx={{
              position: "relative",
              zIndex: 3,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              px: 2,
            }}
          >
            <Typography
              variant={isMobile ? "h4" : isTablet ? "h3" : "h3"}
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 700,
                mb: { xs: 2, md: 3 },
                textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                fontSize: {
                  xs: "1.8rem",
                  sm: "2.2rem",
                  md: "2.5rem",
                  lg: "3rem",
                },
              }}
            >
              Patient Record Management System
            </Typography>
            <Typography
              variant={isMobile ? "body1" : "h6"}
              component="p"
              sx={{
                mb: { xs: 3, md: 4 },
                textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                fontSize: {
                  xs: "1rem",
                  sm: "1.1rem",
                  md: "1.25rem",
                },
                px: { xs: 1, sm: 0 },
                maxWidth: 600,
              }}
            >
              View your medical history, manage prescriptions, and schedule
              appointments with doctors - all in one place.
            </Typography>
            <Button
              variant="contained"
              size={isMobile ? "medium" : "large"}
              onClick={openup}
              sx={{
                px: { xs: 4, md: 6 },
                py: { xs: 1, md: 1.5 },
                borderRadius: 2,
                fontSize: { xs: "1rem", md: "1.1rem" },
                fontWeight: "bold",
                textTransform: "none",
                boxShadow: theme.shadows[4],
                "&:hover": {
                  boxShadow: theme.shadows[6],
                },
              }}
            >
              Book Appointment
            </Button>
          </HeroContent>
        </HeroBackground>
      </Box>

      <Box
        id="services-section"
        sx={{
          py: { xs: 4, md: 8 },
          backgroundColor: theme.palette.grey[50],
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant={isMobile ? "h5" : "h4"}
            component="h2"
            align="center"
            gutterBottom
            sx={{
              fontWeight: 600,
              mt: { xs: -35, md: 0 },
              position: "relative",
              "&:after": {
                content: '""',
                display: "block",
                width: { xs: 60, md: 80 },
                height: 4,
                backgroundColor: theme.palette.primary.main,
                margin: "16px auto 0",
                borderRadius: 2,
              },
            }}
          >
            Our Services
          </Typography>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            sx={{
              flexWrap: { xs: "wrap", md: "nowrap" },
              justifyContent: "center",
            }}
          >
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              sx={{
                minWidth: 0,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <ServiceCard sx={{ width: "100%" }}>
                <CardContent sx={{ flexGrow: 1, p: { xs: 2, md: 3 } }}>
                  <Typography
                    variant="h6"
                    component="h3"
                    gutterBottom
                    sx={{
                      fontWeight: 600,
                      fontSize: { xs: "1.1rem", md: "1.25rem" },
                    }}
                  >
                    Online Appointments
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    paragraph
                    sx={{ fontSize: { xs: "0.85rem", md: "0.875rem" } }}
                  >
                    Book appointments with doctors easily and conveniently from
                    anywhere.
                  </Typography>
                </CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    p: { xs: 1.5, md: 2 },
                    backgroundColor: theme.palette.grey[100],
                  }}
                >
                  <Box
                    component="img"
                    src={image4}
                    alt="Online appointments"
                    sx={{
                      height: { xs: 80, sm: 100, md: 120 },
                      width: "auto",
                      objectFit: "contain",
                    }}
                  />
                </Box>
              </ServiceCard>
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              sx={{
                minWidth: 0,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <ServiceCard sx={{ width: "100%" }}>
                <CardContent sx={{ flexGrow: 1, p: { xs: 2, md: 3 } }}>
                  <Typography
                    variant="h6"
                    component="h3"
                    gutterBottom
                    sx={{
                      fontWeight: 600,
                      fontSize: { xs: "1.1rem", md: "1.25rem" },
                    }}
                  >
                    Medical History
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    paragraph
                    sx={{ fontSize: { xs: "0.85rem", md: "0.875rem" } }}
                  >
                    Access your complete medical history securely whenever you
                    need it.
                  </Typography>
                </CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    p: { xs: 1.5, md: 2 },
                    backgroundColor: theme.palette.grey[100],
                  }}
                >
                  <Box
                    component="img"
                    src={image6}
                    alt="Medical history"
                    sx={{
                      height: { xs: 80, sm: 100, md: 120 },
                      width: "auto",
                      objectFit: "contain",
                    }}
                  />
                </Box>
              </ServiceCard>
            </Grid>

            <Grid
              item
              xs={12}
              sm={12}
              md={4}
              sx={{
                minWidth: 0,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <ServiceCard sx={{ width: "100%" }}>
                <CardContent sx={{ flexGrow: 1, p: { xs: 2, md: 3 } }}>
                  <Typography
                    variant="h6"
                    component="h3"
                    gutterBottom
                    sx={{
                      fontWeight: 600,
                      fontSize: { xs: "1.1rem", md: "1.25rem" },
                    }}
                  >
                    Pharmacy Management
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    paragraph
                    sx={{ fontSize: { xs: "0.85rem", md: "0.875rem" } }}
                  >
                    Track and manage your prescriptions with our pharmacy
                    system.
                  </Typography>
                </CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    p: { xs: 1.5, md: 2 },
                    backgroundColor: theme.palette.grey[100],
                  }}
                >
                  <Box
                    component="img"
                    src={image5}
                    alt="Pharmacy management"
                    sx={{
                      height: { xs: 80, sm: 100, md: 120 },
                      width: "auto",
                      objectFit: "contain",
                    }}
                  />
                </Box>
              </ServiceCard>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Appointment Modal */}
      <Modal
        open={popup}
        onClose={closeup}
        aria-labelledby="appointment-modal-title"
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(4px)",
          p: { xs: 1, sm: 2 },
        }}
      >
        <Fade in={popup} timeout={300}>
          <Paper
            elevation={10}
            sx={{
              position: "relative",
              width: { xs: "95%", sm: "85%", md: "70%", lg: "60%" },
              maxWidth: "900px",
              maxHeight: { xs: "95vh", md: "90vh" },
              overflow: "hidden",
              borderRadius: "12px",
              background: theme.palette.background.paper,
              boxShadow: theme.shadows[10],
              p: 0,
              outline: "none",
            }}
          >
            {/* Header with gradient background */}
            {/* <Box
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                color: theme.palette.common.white,
                p: { xs: 2, sm: 3 },
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h5" component="h2" fontWeight="bold">
                Book Your Appointment
              </Typography>
              <IconButton
                onClick={closeup}
                size="small"
                sx={{
                  color: theme.palette.common.white,
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.2)",
                  },
                }}
              >
                <FontAwesomeIcon icon={faTimes} />
              </IconButton>
            </Box> */}

            {/* Content with subtle pattern background */}
            <Box
              sx={{
                position: "relative",
                height: { xs: "82vh", md: "77vh" },
                overflowY: "auto",
                p: { xs: 2, sm: 3, md: 4 },
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.03) 1px, transparent 0)",
                backgroundSize: "20px 20px",
              }}
            >
              <PatientAppointment />
            </Box>

            {/* Footer with decorative element */}
            <Box
              sx={{
                p: 1,
                textAlign: "center",
                backgroundColor: theme.palette.grey[100],
                borderTop: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography variant="caption" color="text.secondary">
                Need help? Contact our support team
              </Typography>
            </Box>
          </Paper>
        </Fade>
      </Modal>

      <Footer />
    </Box>
  );
}
