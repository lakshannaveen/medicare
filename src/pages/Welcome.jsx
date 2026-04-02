// import React from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Box,
//   Typography,
//   Grid,
//   Card,
//   CardContent,
//   CardActionArea,
//   CardMedia,
//   Button,
//   Avatar,
//   useTheme,
//   useMediaQuery,
// } from "@mui/material";
// import { styled } from "@mui/material/styles";
// import {
//   People,
//   MedicalServices,
//   ArrowForward
// } from "@mui/icons-material";
// import medicalVideo from "../assets/medical-bg.mp4";

// const Welcome = () => {
//   const navigate = useNavigate();
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

//   const handleCardClick = (route) => {
//     navigate(route);
//   };

//   const StyledCard = styled(Card)(({ theme }) => ({
//     maxWidth: isMobile ? 300 : 320,
//     borderRadius: 16,
//     boxShadow: theme.shadows[10],
//     transition: 'all 0.3s ease',
//     background: 'rgba(255, 255, 255, 0.85)',
//     backdropFilter: 'blur(10px)',
//     '&:hover': {
//       transform: 'translateY(-10px)',
//       boxShadow: theme.shadows[16],
//       background: 'rgba(255, 255, 255, 0.95)'
//     }
//   }));

//   return (
//     <Box
//       sx={{
//         position: "relative",
//         width: "100vw",
//         height: "100vh",
//         overflow: "hidden",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//       }}
//     >
//       {/* Background Video */}
//       <video
//         autoPlay
//         loop
//         muted
//         style={{
//           position: "absolute",
//           width: "100%",
//           height: "100%",
//           objectFit: "cover",
//           zIndex: -1,
//           opacity: 0.8
//         }}
//       >
//         <source src={medicalVideo} type="video/mp4" />
//         Your browser does not support the video tag.
//       </video>

//       {/* Overlay */}
//       <Box
//         sx={{
//           position: "absolute",
//           top: 0,
//           left: 0,
//           width: "100%",
//           height: "100%",
//           backgroundColor: "rgba(0, 0, 0, 0.4)",
//           zIndex: 0,
//         }}
//       />

//       {/* Content */}
//       <Box
//         sx={{
//           zIndex: 1,
//           textAlign: "center",
//           color: "white",
//           px: isMobile ? 2 : 4,
//           maxWidth: 1200,
//         }}
//       >
//         <Typography
//           variant={isMobile ? "h3" : "h2"}
//           component="h1"
//           gutterBottom
//           sx={{
//             fontWeight: 700,
//             mb: 3,
//             textShadow: "2px 2px 8px rgba(0,0,0,0.5)",
//           }}
//         >
//           Welcome to Medicare
//         </Typography>

//         <Typography
//           variant={isMobile ? "body1" : "h6"}
//           component="p"
//           sx={{
//             mb: 4,
//             textShadow: "1px 1px 4px rgba(0,0,0,0.5)",
//             maxWidth: 800,
//             mx: "auto",
//             lineHeight: 1.6,
//             px: isMobile ? 1 : 0,
//           }}
//         >
//           Medicare provides a comprehensive digital healthcare solution where patients can easily book appointments,
//           manage time slots, and receive electronic prescriptions via SMS with access to their complete medical history.
//           Healthcare providers can efficiently manage appointments, issue digital prescriptions, and oversee patient care,
//           while pharmacy users can view prescriptions and dispense medications directly from inventory.
//         </Typography>

//         <Grid
//           container
//           spacing={isMobile ? 2 : 4}
//           justifyContent="center"
//           sx={{ mt: isMobile ? 1 : 3 }}
//         >
//           <Grid item xs={12} sm={8} md={5} lg={4}>
//             <StyledCard>
//               <CardActionArea onClick={() => handleCardClick("/patient-login")}>
//                 <CardMedia
//                   component="img"
//                   height={isMobile ? 160 : 180}
//                   image="https://images.unsplash.com/photo-1579684453423-f84349ef60b0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
//                   alt="Patient"
//                   sx={{ objectFit: "cover" }}
//                 />
//                 <CardContent sx={{ textAlign: 'center' }}>
//                   <Avatar sx={{
//                     bgcolor: theme.palette.secondary.main,
//                     width: isMobile ? 50 : 60,
//                     height: isMobile ? 50 : 60,
//                     mb: 2,
//                     mx: 'auto'
//                   }}>
//                     <People fontSize={isMobile ? "medium" : "large"} />
//                   </Avatar>
//                   <Typography gutterBottom variant={isMobile ? "h6" : "h5"} component="div" sx={{ fontWeight: 600 }}>
//                     Patient
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
//                     Book appointments, view prescriptions, and access your medical history.
//                   </Typography>
//                   <Button
//                     variant="outlined"
//                     size={isMobile ? "small" : "medium"}
//                     endIcon={<ArrowForward />}
//                     sx={{
//                       mt: 1,
//                       borderRadius: 8,
//                       px: 3
//                     }}
//                   >
//                     Continue
//                   </Button>
//                 </CardContent>
//               </CardActionArea>
//             </StyledCard>
//           </Grid>
//           <Grid item xs={12} sm={8} md={5} lg={4}>
//             <StyledCard>
//               <CardActionArea onClick={() => handleCardClick("/admin")}>
//                 <CardMedia
//                   component="img"
//                   height={isMobile ? 160 : 180}
//                   image="https://images.unsplash.com/photo-1581056771107-24ca5f033842?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
//                   alt="Healthcare Provider"
//                   sx={{ objectFit: "cover" }}
//                 />
//                 <CardContent sx={{ textAlign: 'center' }}>
//                   <Avatar sx={{
//                     bgcolor: theme.palette.primary.main,
//                     width: isMobile ? 50 : 60,
//                     height: isMobile ? 50 : 60,
//                     mb: 2,
//                     mx: 'auto'
//                   }}>
//                     <MedicalServices fontSize={isMobile ? "medium" : "large"} />
//                   </Avatar>
//                   <Typography gutterBottom variant={isMobile ? "h6" : "h5"} component="div" sx={{ fontWeight: 600 }}>
//                     Healthcare Provider
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
//                     Manage appointments, issue prescriptions, and oversee patient care.
//                   </Typography>
//                   <Button
//                     variant="outlined"
//                     size={isMobile ? "small" : "medium"}
//                     endIcon={<ArrowForward />}
//                     sx={{
//                       mt: 1,
//                       borderRadius: 8,
//                       px: 3
//                     }}
//                   >
//                     Continue
//                   </Button>
//                 </CardContent>
//               </CardActionArea>
//             </StyledCard>
//           </Grid>
//         </Grid>
//       </Box>
//     </Box>
//   );
// };

// export default Welcome;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  CardMedia,
  Button,
  useTheme,
  useMediaQuery,
  Container,
  Paper,
  Avatar,
  Divider,
  Slide,
  Fade,
  Zoom,
  Grow,
  styled,
} from "@mui/material";
import {
  MedicalServices,
  People,
  CalendarToday,
  Medication,
  Receipt,
  HealthAndSafety,
  LocalHospital,
  ArrowForward,
} from "@mui/icons-material";
import medicalVideo from "../assets/medical-bg.mp4";
// import medicalPattern from '../assets/medical-pattern.png';
import CountUp from "react-countup";
import { useInView } from 'react-intersection-observer';

const features = [
  {
    icon: <MedicalServices fontSize="large" />,
    title: "Expert Doctors",
    description: "Access to qualified healthcare professionals",
  },
  {
    icon: <CalendarToday fontSize="large" />,
    title: "Easy Appointments",
    description: "Book your visits with just a few clicks",
  },
  {
    icon: <Medication fontSize="large" />,
    title: "Digital Prescriptions",
    description: "Get and manage your prescriptions online",
  },
  {
    icon: <Receipt fontSize="large" />,
    title: "Medical History",
    description: "Complete digital record of your treatments",
  },
  {
    icon: <LocalHospital fontSize="large" />,
    title: "24/7 Support",
    description: "Round-the-clock medical assistance",
  },
  {
    icon: <HealthAndSafety fontSize="large" />,
    title: "Preventive Care",
    description: "Health checkups and wellness programs",
  },
];

const Welcome = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setChecked(true);
  }, []);

  const handleCardClick = (route) => {
    navigate(route);
  };

  const StyledCard = styled(Card)(({ theme }) => ({
    maxWidth: 345,
    borderRadius: 16,
    boxShadow: theme.shadows[10],
    transition: "all 0.3s ease",
    background: "rgba(255, 255, 255, 0.85)",
    backdropFilter: "blur(10px)",
    "&:hover": {
      transform: "translateY(-10px)",
      boxShadow: theme.shadows[16],
      background: "rgba(255, 255, 255, 0.95)",
    },
  }));


  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        overflowX: "hidden",
        overflowY: "auto",
        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -2,
          // background: "linear-gradient(135deg, #0d0d0d 0%, #1c1c1c 100%)",
          opacity: 0.9,
        }}
      >
        <video
          autoPlay
          loop
          muted
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: -1,
            opacity: 0.8,
          }}
        >
          <source src={medicalVideo} type="video/mp4" />
        </video>
      </Box>

      {/* Pattern Overlay */}
      {/* <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        backgroundImage: `url(${medicalPattern})`,
        backgroundSize: '400px',
        opacity: 0.1
      }} /> */}

      <Container
        maxWidth="xl"
        sx={{
          py: 8,
          px: isMobile ? 2 : 4,
          position: "relative",
        }}
      >
        <Box
          sx={{
            textAlign: "center",
            py: 10,
            color: "white",
          }}
        >
          <Grow in={checked} timeout={500}>
            <Typography
              variant={isMobile ? "h3" : "h2"}
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 800,
                mb: 2,
                // textShadow: "2px 2px 8px rgba(0,0,0,0.3)",
              }}
            >
              <span >
                Welcome to{" "}
              </span>
              <span style={{ color: theme.palette.primary.main }}>
                Medicare<sup style={{ color: "red", }}>+</sup>
              </span>
            </Typography>
          </Grow>

          <Fade in={checked} timeout={800}>
            <Typography
              variant={isMobile ? "h6" : "h5"}
              component="p"
              sx={{
                mb: 4,
                maxWidth: 900,
                mx: "auto",
                // textShadow: "1px 1px 4px rgba(0,0,0,0.3)",
                fontWeight: 600,
                // textShadow: "2px 2px 8px rgba(0,0,0,0.5)",
              }}
            >
              Your comprehensive digital healthcare solution. Connecting
              patients with healthcare providers seamlessly.
            </Typography>
          </Fade>

          <Zoom in={checked} timeout={1000}>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
              sx={{
                mt: 2,
                px: 4,
                py: 1.5,
                borderRadius: 8,
                fontSize: isMobile ? "1rem" : "1.1rem",
                fontWeight: 600,
                boxShadow: theme.shadows[6],
                "&:hover": {
                  boxShadow: theme.shadows[10],
                },
              }}
              onClick={() =>
                window.scrollTo({
                  top: document.getElementById("roles").offsetTop - 100,
                  behavior: "smooth",
                })
              }
            >
              Get Started
            </Button>
          </Zoom>
        </Box>

        
        <Slide direction="up" in={checked} timeout={800}>
          <Box sx={{ my: 4 }}>
            <Typography
              variant="h3"
              component="h2"
              align="center"
              gutterBottom
              sx={{
                color: "white",
                mb: 4,
                fontWeight: 600,
              }}
            >
              Our Services
            </Typography>
            <Grid container spacing={4} justifyContent="center">
              {features.map((feature, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Grow in={checked} timeout={800 + index * 100}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        height: "100%",
                        borderRadius: 4,
                        backgroundColor: "rgba(255, 255, 255)", 
                        // border: "2px dashed rgba(0, 0, 0, 0.2)", 
                        backdropFilter: "blur(6px)", 
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-5px)",
                          boxShadow: theme.shadows[10],
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          textAlign: "center",
                          height: "100%",
                        }}
                      >
                        <Avatar
                          sx={{
                            bgcolor: theme.palette.primary.main,
                            width: 60,
                            height: 60,
                            mb: 2,
                          }}
                        >
                          {feature.icon}
                        </Avatar>
                        <Typography
                          variant="h6"
                          component="h3"
                          gutterBottom
                          sx={{ fontWeight: 600 }}
                        >
                          {feature.title}
                        </Typography>
                        <Typography
                          variant="body1"
                          color="primary.main"
                        // sx={{ textShadow: "2px 2px 8px rgba(0,0,0,0.5)" }}
                        >
                          {feature.description}
                        </Typography>
                      </Box>
                    </Paper>
                  </Grow>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Slide>

        <Box id="roles" sx={{ my: 10 }}>
          <Typography
            variant="h3"
            component="h2"
            align="center"
            gutterBottom
            sx={{
              color: "white",
              mb: 4,
              fontWeight: 600,
            }}
          >
            Continue As
          </Typography>

          <Grid container spacing={6} justifyContent="center">
            <Grid item xs={12} md={5}>
              <Fade in={checked} timeout={1000}>
                <StyledCard>
                  <CardActionArea
                    onClick={() => handleCardClick("/patient-login")}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image="https://images.unsplash.com/photo-1579684453423-f84349ef60b0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
                      alt="Patient"
                      sx={{ objectFit: "cover" }}
                    />
                    <CardContent sx={{ textAlign: "center" }}>
                      <Avatar
                        sx={{
                          bgcolor: theme.palette.secondary.main,
                          width: 60,
                          height: 60,
                          mb: 2,
                          mx: "auto",
                        }}
                      >
                        <People fontSize="large" />
                      </Avatar>
                      <Typography
                        gutterBottom
                        variant="h5"
                        component="div"
                        sx={{ fontWeight: 600 }}
                      >
                        Patient
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"

                        sx={{ mb: 2, fontWeight: 600 }}
                      >
                        Access your medical records, book appointments, view
                        prescriptions, and track your health journey.
                      </Typography>
                      <Button
                        variant="outlined"
                        endIcon={<ArrowForward />}
                        sx={{
                          mt: 1,
                          borderRadius: 8,
                          px: 3,
                        }}
                      >
                        Continue
                      </Button>
                    </CardContent>
                  </CardActionArea>
                </StyledCard>
              </Fade>
            </Grid>

            <Grid item xs={12} md={5}>
              <Fade in={checked} timeout={1200}>
                <StyledCard>
                  <CardActionArea onClick={() => handleCardClick("/admin")}>
                    <CardMedia
                      component="img"
                      height="200"
                      image="https://images.unsplash.com/photo-1581056771107-24ca5f033842?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
                      alt="Healthcare Provider"
                      sx={{ objectFit: "cover" }}
                    />
                    <CardContent sx={{ textAlign: "center" }}>
                      <Avatar
                        sx={{
                          bgcolor: theme.palette.primary.main,
                          width: 60,
                          height: 60,
                          mb: 2,
                          mx: "auto",
                        }}
                      >
                        <MedicalServices fontSize="large" />
                      </Avatar>
                      <Typography
                        gutterBottom
                        variant="h5"
                        component="div"
                        sx={{ fontWeight: 600 }}
                      >
                        Doctor / PH User / Admin
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2, fontWeight: 600 }}
                      >
                        Manage patient records, appointments, prescriptions, and
                        provide comprehensive care.
                      </Typography>
                      <Button
                        variant="outlined"
                        endIcon={<ArrowForward />}
                        sx={{
                          mt: 1,
                          borderRadius: 8,
                          px: 3,
                        }}
                      >
                        Continue
                      </Button>
                    </CardContent>
                  </CardActionArea>
                </StyledCard>
              </Fade>
            </Grid>
          </Grid>
        </Box>


        <Slide direction="up" in={checked} timeout={1000}>
          <Box
            ref={ref}
            sx={{
              p: 3,
              height: "100%",
              borderRadius: 4,
              backgroundColor: "rgba(255, 255, 255, 0)",
            }}
          >
           
            <Box textAlign="center" mb={6}>
              <Typography variant="h3" fontWeight={700} gutterBottom sx={{ color: "white" }}>
                <span>Why Choose </span>
                <span style={{ color: theme.palette.primary.main }}>
                  Medicare<sup style={{ color: "red" }}>+</sup>
                </span>
                ?
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  maxWidth: 800,
                  mx: "auto",
                  color: "white",
                  fontWeight: 700,
                }}
              >
                Our platform bridges the gap between patients and healthcare
                providers with cutting-edge technology and compassionate care.
              </Typography>
            </Box>

         
            <Grid container spacing={8} justifyContent="center">
              {[
                { value: 1000, suffix: "+", label: "Patients" },
                { value: 100, suffix: "+", label: "Doctors" },
                { value: 24, suffix: "/7", label: "Support" },
                { value: 99, suffix: "%", label: "Satisfaction" },
              ].map((stat, index) => (
                <Grid item xs={6} sm={3} key={index} textAlign="center">
                  <Typography
                    variant="h2"
                    sx={{ color: theme.palette.primary.main, fontWeight: 700 }}
                  >
                    {inView ? (
                      <CountUp end={stat.value} suffix={stat.suffix} duration={2.5} />
                    ) : (
                      `0${stat.suffix}`
                    )}
                  </Typography>
                  <Typography variant="h6" color="white" fontWeight={600}>
                    {stat.label}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Slide>
      </Container>
    </Box>
  );
};

export default Welcome;
