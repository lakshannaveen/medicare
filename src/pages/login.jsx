

// //This page is for the doctor login
// import '../styles/login.css';
// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Link } from 'react-router-dom';
// import emailjs from "emailjs-com";
// import axios from 'axios';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

// export default function Login() {
//   const [form, setForm] = useState({
//     username: "",
//     password: "",
//   });
//   const [errorMessage, setErrorMessage] = useState("");

//   const [pouperror, setPopuperror] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [rememberMe, setRememberMe] = useState(false);
//   const [email, setEmail] = useState('');
//   const [showPopup, setShowPopup] = useState(false);
//   const [stage, setStage] = useState(1); // Initial stage is 1 (email input)
//   const [generatedOtp, setGeneratedOtp] = useState('');
//   const [otp, setOtp] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [message, setMessage] = useState('');
//   const [isPasswordVisible, setIsPasswordVisible] = useState(false); // State for password visibility

//   const [isPasswordVisible2, setIsPassswordvisible2] = useState(false);

//   const [userType, setUserType] = useState('doctor'); // Added state for user type (doctor or pharmacy)

//   const navigate = useNavigate();

//   const checkuserexists = async (email) => {
//     try {
//       const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/User/checkuserexists?email=${email}`);
//       return response.data;
//     }
//     catch (error) {
//       setPopuperror("The given email is not registered");
//       return false;
//     }
//   }

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     setIsLoading(true);

//     try {
//       const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/Login/Login`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(form),
//       });

//       if (!response.ok) {
//         const errorMessage = await response.text();
//         setErrorMessage(errorMessage.includes("Invalid username")
//           ? "Invalid username. Please check and try again."
//           : errorMessage.includes("Invalid password")
//             ? "Invalid password. Please check and try again."
//             : `Login failed: ${errorMessage}`);
//         setIsLoading(false);
//         return;
//       }

//       const data = await response.json();

//       // Save user token and details
//       localStorage.setItem('Token', data.Token);
//       localStorage.setItem('Role', data.Role);
//       localStorage.setItem('Name', data.Name);
//       localStorage.setItem('id', data.id);

//       // Handle "Remember Me" functionality
//       if (rememberMe) {
//         localStorage.setItem("rememberedUsername", form.username);// get the username and set it to rememberedUsername state
//         localStorage.setItem("rememberedPassword", form.password);
//       } else {
//         localStorage.removeItem("rememberedUsername");
//         localStorage.removeItem("rememberedPassword");
//       }

//       navigate("/dashboard/");
//     } catch (error) {
//       console.error('Error signing in:', error);
//       setErrorMessage('Login failed: Unable to connect to the server.');
//       setIsLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm({
//       ...form,
//       [name]: value,
//     });
//   };

//   const validateEmail = (email) => {
//     return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
//   };

//   const handleRememberMe = (e) => {
//     setRememberMe(e.target.checked);
//   };

//   const sendOTP = async () => {
//     const userExists = await checkuserexists(email);
//     if (!userExists) return;

//     const otpCode = Math.floor(100000 + Math.random() * 900000).toString(); // Generate OTP
//     setGeneratedOtp(otpCode);

//     const emailParams = {
//       user_email: email,
//       otp_code: otpCode,
//       to_name: email.split('@')[0],
//     };

//     emailjs
//       .send('service_dxxordi', 'template_ia67qxx', emailParams, 'S7S_3J-55UO3MxGEK')
//       .then(() => {
//         setMessage('OTP sent to your email. please check your email');
//         setStage(2);
//       })
//       .catch(() => setMessage('Failed to send OTP. Try again.'));
//   };

//   const handlePasswordVisibility = () => {
//     setIsPasswordVisible(!isPasswordVisible);
//   };

//   const handlePasswordVisibility2 = () => {
//     setIsPassswordvisible2(!isPasswordVisible2)
//   }

//   const resetPassword = () => {
//     // Validate OTP
//     if (otp === generatedOtp) {
//       // Send the new password to the backend to update
//       axios.put(`${process.env.REACT_APP_API_BASE_URL}/User/update-password`, {
//         Email: email,
//         NewPassword: newPassword
//       })
//         .then(response => {
//           setMessage('Password reset successful!');
//           setStage(1); // Go back to stage 1
//           // Clear the form
//           setEmail('');
//           setOtp('');
//           setNewPassword('');
//         })
//         .catch(error => {
//           setMessage('Error resetting password: ' + error.response.data);
//           console.log(error.response.data);
//         });
//     } else {
//       setMessage('Invalid OTP.');
//     }
//   };

//   useEffect(() => {
//     const savedUsername = localStorage.getItem("rememberedUsername");
//     const savedPassword = localStorage.getItem("rememberedPassword");
//     if (savedUsername && savedPassword) {
//       setForm({ username: savedUsername, password: savedPassword });
//       setRememberMe(true);
//     }
//   }, []);

//   return (
//     <div className="main-page-container">
//       <div className="left-side-container">
//         <div className="welcome-message"></div>
//       </div>
//       <div className="right-side-container">
//         <div className="login-form-container">
//           {/* Added section for user type selection */}
//           {/* <div className="user-type-selection">
//             <button
//               className={userType === 'doctor' ? 'selected' : ''}
//               onClick={() => setUserType('doctor')}
//             >
//               Doctor
//             </button>
//             <button
//               className={userType === 'pharmacy' ? 'selected' : ''}
//               onClick={() => setUserType('pharmacy')}
//             >
//               Pharmacy
//             </button>
//           </div> */}

//           <form onSubmit={handleSubmit} className="main-form">
//             <h1 style={{ textAlign: "center" }}>Welcome Back!</h1>
//             <p className="intro-text">Please log in to your account</p>
//             <div className="group">
//               <label htmlFor="username">Username</label>
//               <input
//                 type="text"
//                 id="username"
//                 name="username"
//                 value={form.username}
//                 onChange={handleChange}
//                 placeholder="Enter your username"
//                 required
//               />
//             </div>
//             <div className="group">
//               <label htmlFor="password">Password</label>
//               <div className="password-input-container">
//                 <input
//                   type={isPasswordVisible ? "text" : "password"}
//                   id="password"
//                   name="password"
//                   value={form.password}
//                   onChange={handleChange}
//                   placeholder="Enter your password"
//                   required
//                 />
//                 <span
//                   className="toggle-password-visibility"
//                   onClick={handlePasswordVisibility}
//                 >
//                   <FontAwesomeIcon icon={isPasswordVisible ? faEye : faEyeSlash} />
//                 </span>
//               </div>
//             </div>

//             <div className="options">
//               <div className="remember-me-container">
//                 <input
//                   type="checkbox"
//                   id="rememberMe"
//                   checked={rememberMe}
//                   onChange={handleRememberMe}
//                 />
//                 <label htmlFor="rememberMe">Remember Me</label>
//               </div>
//               <Link onClick={() => setShowPopup(true)}>Change password</Link>
//             </div>

//             {errorMessage && <div className="error-message">{errorMessage}</div>}
//             <button type="submit" className="btn-submit" disabled={isLoading}>
//               {isLoading ? 'Logging In...' : 'Log In'}
//             </button>
//           </form>
//         </div>

//         {showPopup && (
//           <div className="popup-overlay5">
//             <div className="popu5">
//               <button className="close-btn" onClick={() => setShowPopup(false)}>
//                 X
//               </button>
//               <h3>Reset Your Password</h3>
//               {stage === 1 && (
//                 <div>
//                   <input
//                     type="email"
//                     placeholder="Enter your registered email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                   />
//                   <button className='b1' onClick={sendOTP}>Send OTP</button>
//                   <p>{message}</p>
//                 </div>
//               )}
//               {stage === 2 && (
//                 <div>
//                   <input
//                     type="text"
//                     placeholder="Enter OTP"
//                     value={otp}
//                     onChange={(e) => setOtp(e.target.value)}
//                   />
//                   <input
//                     type="password"
//                     placeholder="Enter new password"
//                     value={newPassword}
//                     onChange={(e) => setNewPassword(e.target.value)}
//                   />
//                   <button  className="b1" onClick={resetPassword}>Reset Password</button>
//                   <p>{message}</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import emailjs from "emailjs-com";
import {
  Box,
  Button,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  useMediaQuery,
  useTheme,
  styled,
  Avatar
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Close,
  Lock,
  Person,
  Email
} from '@mui/icons-material';
import Doctor from "../assets/doctor3.jpeg";
import { Add as AddIcon } from "@mui/icons-material";

const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #1976d2, #2196f3)',
  color: 'white',
  padding: '12px 24px',
  fontWeight: 'bold',
  '&:hover': {
    background: 'linear-gradient(45deg, #1565c0, #1e88e5)',
  },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[10],
  maxWidth: 500,
  width: '100%',
}));

export default function Login() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [form, setForm] = useState({ username: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogStage, setDialogStage] = useState(1);
  const [email, setEmail] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');
  const navigate = useNavigate();

  const checkUserExists = async (email) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/User/checkuserexists?email=${email}`);
      return response.data;
    } catch (error) {
      setDialogMessage("The given email is not registered");
      return false;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/Login/Login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        setErrorMessage(errorMessage.includes("Invalid username")
          ? "Invalid username. Please check and try again."
          : errorMessage.includes("Invalid password")
            ? "Invalid password. Please check and try again."
            : `Login failed: ${errorMessage}`);
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      localStorage.setItem('Token', data.Token);
      localStorage.setItem('Role', data.Role);
      localStorage.setItem('Name', data.Name);
      localStorage.setItem('id', data.id);

      if (rememberMe) {
        localStorage.setItem("rememberedUsername", form.username);
        localStorage.setItem("rememberedPassword", form.password);
      } else {
        localStorage.removeItem("rememberedUsername");
        localStorage.removeItem("rememberedPassword");
      }

      navigate("/dashboard/");
    } catch (error) {
      console.error('Error signing in:', error);
      setErrorMessage('Login failed: Unable to connect to the server.');
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const sendOTP = async () => {
    const userExists = await checkUserExists(email);
    if (!userExists) return;

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otpCode);

    const emailParams = {
      user_email: email,
      otp_code: otpCode,
      to_name: email.split('@')[0],
    };

    emailjs
      .send('service_dxxordi', 'template_ia67qxx', emailParams, 'S7S_3J-55UO3MxGEK')
      .then(() => {
        setDialogMessage('OTP sent to your email. Please check your inbox.');
        setDialogStage(2);
      })
      .catch(() => setDialogMessage('Failed to send OTP. Please try again.'));
  };

  const resetPassword = () => {
    if (otp === generatedOtp) {
      axios.put(`${process.env.REACT_APP_API_BASE_URL}/User/update-password`, {
        Email: email,
        NewPassword: newPassword
      })
        .then(() => {
          setDialogMessage('Password reset successful!');
          setTimeout(() => setOpenDialog(false), 2000);
        })
        .catch(error => {
          setDialogMessage('Error resetting password: ' + error.response?.data);
        });
    } else {
      setDialogMessage('Invalid OTP. Please try again.');
    }
  };

  useEffect(() => {
    const savedUsername = localStorage.getItem("rememberedUsername");
    const savedPassword = localStorage.getItem("rememberedPassword");
    if (savedUsername && savedPassword) {
      setForm({ username: savedUsername, password: savedPassword });
      setRememberMe(true);
    }
  }, []);

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
    }}>
      {/* Left Side - Image Section */}
      <Box sx={{
        width: isMobile ? '100%' : '55%',
        minHeight: isMobile ? '300px' : '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <img
          src={Doctor}
          alt="Doctor"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(0.9)'
          }}
        />
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          textAlign: 'center',
          p: 4
        }}>
          <Avatar
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.5)",
              color: "red",
              width: 80,
              height: 80,
              mb: 2,
              backdropFilter: "blur(4px)",
            }}
          >
            <AddIcon sx={{ fontSize: 80 }} />
          </Avatar>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
            Welcome to MediCare
          </Typography>
          <Typography variant="h5" sx={{ mb: 3 }}>
            Administration Management System
          </Typography>
          <Typography variant="body1" sx={{ maxWidth: '500px' }}>
            Access your personalized dashboard to manage patient care and medical records
          </Typography>
        </Box>
      </Box>


      {/* Right Side - Login Form */}
      <Box
        sx={{
          p: { xs: 3, md: 8 },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          height: "100%",
          ml: { xs: 0, md: 10 },
          mt: { md: 12 }
        }}
      >
        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          sx={{ fontWeight: 700 }}
        >
          Doctor / PH User / Admin Login /Lab
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 1 }}>
          Enter your credentials to access the dashboard
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
            margin="normal"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person color="primary" />
                </InputAdornment>
              ),
            }}
          />

          {/* <TextField
            fullWidth
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={form.password}
            onChange={handleChange}
            margin="normal"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock color="primary" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          /> */}
          <TextField
            fullWidth
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={form.password}
            onChange={handleChange}
            margin="normal"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock color="primary" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiInputAdornment-root': {
                marginRight: 0, 
              }
            }}
          />

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 1,
              mb: 2,
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  color="primary"
                />
              }
              label="Remember me"
            />
            <Button onClick={() => setOpenDialog(true)} color="primary" size="small">
              Forgot password?
            </Button>
          </Box>

          {errorMessage && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMessage}
            </Alert>
          )}

          <Button
            fullWidth
            variant="contained"
            type="submit"
            size="large"
            disabled={isLoading}
            sx={{
              py: 1.5,
              fontWeight: 700,
              background: 'linear-gradient(45deg, #1976d2, #2196f3)',
            }}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
          </Button>
        </Box>

        <Typography
          variant="body2"
          color="textSecondary"
          align="center"
          sx={{ mt: 3 }}
        >
          By signing in, you agree to our Terms and Privacy Policy
        </Typography>
      </Box>


      {/* Password Reset Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          Reset Password
          <IconButton
            onClick={() => {
              setOpenDialog(false);
              setDialogStage(1);
              setDialogMessage('');
            }}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {dialogStage === 1 && (
            <Box sx={{ minWidth: 300 }}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email />
                    </InputAdornment>
                  ),
                }}
              />
              {dialogMessage && (
                <Alert severity={dialogMessage.includes('sent') ? 'success' : 'error'} sx={{ mt: 2 }}>
                  {dialogMessage}
                </Alert>
              )}
              <Button
                fullWidth
                variant="contained"
                onClick={sendOTP}
                sx={{ mt: 2 }}
              >
                Send OTP
              </Button>
            </Box>
          )}

          {dialogStage === 2 && (
            <Box sx={{ minWidth: 300 }}>
              <TextField
                fullWidth
                label="OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                margin="normal"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                margin="normal"
              />
              {dialogMessage && (
                <Alert severity={dialogMessage.includes('success') ? 'success' : 'error'} sx={{ mt: 2 }}>
                  {dialogMessage}
                </Alert>
              )}
              <Button
                fullWidth
                variant="contained"
                onClick={resetPassword}
                sx={{ mt: 2 }}
              >
                Reset Password
              </Button>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}