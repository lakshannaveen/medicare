
// import axios from 'axios';
// import logo from '../assets/medicare_logo.png';
// import { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import '../styles/Remarks.css';
// import html2pdf from 'html2pdf.js';
// import { useNavigate } from 'react-router-dom';

// export default function Remarks() {
//     const { patientId, serial_no } = useParams();
//     const [details, setDetails] = useState(null);
//     const [error, setError] = useState('');
//     const [patientdetail, setPatientdetail] = useState('');
//     const [doctorRemarks, setDoctorRemarks] = useState('');
//     const navigate = useNavigate("");

//     useEffect(() => {
//         const fetchRecords = async () => {
//             try {
//                 const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/Treatment/patient/record/${patientId}/${serial_no}`);
//                 setDetails(response.data);
//                 setDoctorRemarks(response.data.MTD_REMARKS || '');
//             } catch (error) {
//                 console.error('Error fetching records:', error.response ? error.response.data : error.message);
//                 setError('Failed to fetch patient records. ' + (error.response ? error.response.data : error.message));
//             }
//         };

//         const fetchPatients = async () => {
//             try {
//                 const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/Patient/${patientId}`);
//                 setPatientdetail(response.data);
//             } catch (error) {
//                 console.error('Error fetching patient details:', error.response ? error.response.data : error.message);
//                 setError('Failed to fetch patient details. ' + (error.response ? error.response.data : error.message));
//             }
//         };

//         fetchRecords();
//         fetchPatients();
//     }, [patientId, serial_no]);

//     const calculateAge = (birthdate) => {
//         if (!birthdate) return 'N/A';
//         const birthDateObj = new Date(birthdate);
//         const today = new Date();
//         let age = today.getFullYear() - birthDateObj.getFullYear();
//         const monthDiff = today.getMonth() - birthDateObj.getMonth();
//         if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
//             age--;
//         }
//         return age;
//     };

//     const handleViewInvoice = () => {
//         navigate(`/dashboard/invoice/${patientId}/${serial_no}`);
//     };

//     const handlePrint = () => {
//         window.print();
//     };

//     const downloadInvoice = () => {
//         const invoiceElement = document.querySelector('.remarks-container');

//         // Add a class to hide the buttons
//         invoiceElement.classList.add('hide-elements');

//         const opt = {
//             margin: 0.5,
//             filename: `invoice_${patientId}.pdf`,
//             image: { type: 'jpeg', quality: 0.98 },
//             html2canvas: { scale: 2 },
//             jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
//         };

//         html2pdf().from(invoiceElement).set(opt).save().then(() => {
//             // Remove the hide class after the PDF is saved
//             invoiceElement.classList.remove('hide-elements');
//         });
//     };


//     if (error) {
//         return <div className="error-message">{error}</div>;
//     }

//     if (!details || !patientdetail) {
//         return <div className="loading-message">Loading...</div>;
//     }

//     return (
//         <div className="remarks-container">
//               <button className="back-button" onClick={() => navigate(-1)}>Back</button>

//             <header className="header1">
//                 <div className='logo-container'>
//                     <img src={logo} alt="Medilink Logo" className="logo" />
//                 </div>
//                 <div className="contact-info">
//                     <p>85/1, Horana Road, Bandaragama.<br />
//                     Tel: 0771068887<br />
//                     Email: Medilink@gmail.com<br />
//                     Web: www.medilink.lk</p>
//                 </div>
//             </header>

//             <h2 className="section-title">Doctor remarks</h2>

//             <div className='patient-details'>
//                 <p><strong>Patient Name:</strong> {patientdetail.MPD_PATIENT_NAME}</p>
//                 <p><strong>Age:</strong> {calculateAge(patientdetail.MPD_BIRTHDAY)}</p>
//                 <p><strong>Date:</strong> {new Date(details.MTD_DATE).toLocaleDateString()}</p>
//             </div>

//             <h3 className="section-subtitle">Doctor's Remarks</h3>
//             <textarea
//                 className="doctor-remarks"
//                 value={doctorRemarks}
//                 onChange={(e) => setDoctorRemarks(e.target.value)}
//             ></textarea>

//             <p className="doctor-info"><strong>Doctor Name:</strong> Dr. {details.MTD_DOCTOR}</p>

//             <div className="button-container-no-print">

//                 <button onClick={handlePrint} className="print-btn">Print</button>
//                 <button onClick={downloadInvoice} className="download-btn">Download</button>
//                 {/* <button onClick={handleViewInvoice} className='Invoice-btn'>Invoice</button> */}
//             </div>
//         </div>
//     );
// }


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Divider,
    Avatar,
    IconButton,
    Tooltip,
    CircularProgress,
    Chip
} from '@mui/material';
import {
    ArrowBack,
    Print,
    Download,
    Description,
    Person,
    CalendarToday,
    MedicalInformation
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import logo from '../assets/logo192.png';
import html2pdf from 'html2pdf.js';

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    marginTop: theme.spacing(3),
    borderRadius: theme.shape.borderRadius * 2,
    boxShadow: theme.shadows[3],
    maxWidth: 1500,
    margin: '0 auto',
    '@media print': {
        boxShadow: 'none',
        padding: theme.spacing(3),
        border: '1px solid #ddd',
    }
}));

const HeaderBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(4),
    '@media (max-width: 600px)': {
        flexDirection: 'column',
        gap: theme.spacing(2),
        alignItems: 'flex-start'
    },
    '@media print': {
        flexDirection: 'row',
        alignItems: 'center'
    }
}));

const RemarkNumberBox = styled(Box)(({ theme }) => ({
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

export default function Remarks() {
    const { patientId, serial_no } = useParams();
    const [details, setDetails] = useState(null);
    const [error, setError] = useState('');
    const [patientdetail, setPatientdetail] = useState(null);
    const [doctorRemarks, setDoctorRemarks] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API_BASE_URL}/Treatment/patient/record/${patientId}/${serial_no}`
                );
                setDetails(response.data);
                setDoctorRemarks(response.data.MTD_REMARKS || '');
            } catch (error) {
                console.error('Error fetching records:', error);
                setError('Failed to fetch patient records. ' + (error.response?.data || error.message));
            } finally {
                setLoading(false);
            }
        };

        const fetchPatients = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API_BASE_URL}/Patient/${patientId}`
                );
                setPatientdetail(response.data);
            } catch (error) {
                console.error('Error fetching patient details:', error);
                setError('Failed to fetch patient details. ' + (error.response?.data || error.message));
            }
        };

        fetchRecords();
        fetchPatients();
    }, [patientId, serial_no]);

    const calculateAge = (birthdate) => {
        if (!birthdate) return 'N/A';
        const birthDateObj = new Date(birthdate);
        const today = new Date();
        let age = today.getFullYear() - birthDateObj.getFullYear();
        const monthDiff = today.getMonth() - birthDateObj.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
            age--;
        }
        return age;
    };

    const handlePrint = () => {
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
            
            #print-content, #print-content * {
                visibility: visible;
            }
            
            #print-content {
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

    const downloadPdf = () => {
        const element = document.getElementById('print-content');

        const opt = {
            margin: [10, 10, 10, 10],
            filename: `doctor_remarks_${patientId}_${serial_no}.pdf`,
            image: {
                type: 'jpeg',
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
                unit: 'mm',
                format: 'a4',
                orientation: 'portrait',
                putOnlyUsedFonts: true,
                floatPrecision: 16
            },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        };

        const tempStyles = document.createElement('style');
        tempStyles.innerHTML = `
            .remark-number-pdf {
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
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress size={60} />
            </Box>
        );
    }

    if (error) {
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
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

    if (!details || !patientdetail) {
        return null;
    }

    return (
        <>
            {/* Main content */}
            <Container maxWidth="xl" sx={{ py: 4 }}>
                <Box sx={{ mb: 3 }} className="no-print">
                    <Button
                        startIcon={<ArrowBack />}
                        onClick={() => navigate(-1)}
                        variant="outlined"
                    >
                        Back
                    </Button>
                </Box>

                <StyledPaper elevation={3}>
                    <div id="print-content">
                        {/* Header */}
                        <HeaderBox>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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

                            <Box sx={{ textAlign: 'right' }}>
                                <Typography variant="h6" color="primary" gutterBottom sx={{ '@media print': { fontSize: '1.2rem' } }}>
                                    Doctor Remarks
                                </Typography>
                                <RemarkNumberBox className="remark-number-pdf">
                                    Treatment - {serial_no}
                                </RemarkNumberBox>
                            </Box>
                        </HeaderBox>

                        <Divider sx={{ my: 3 }} />

                        {/* Patient Details */}
                        {/* <Box sx={{ 
                            display: 'flex', 
                            flexWrap: 'wrap', 
                            gap: 3, 
                            mb: 4,
                            '& > *': { minWidth: 200 },
                            '@media print': {
                                gap: 2,
                                marginBottom: '16px'
                            }
                        }}>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary" sx={{ '@media print': { fontSize: '0.8rem' } }}>
                                    <Person fontSize="small" color="primary" sx={{ verticalAlign: 'middle', mr: 1 }} />
                                    Patient Name
                                </Typography>
                                <Typography variant="body1" fontWeight="500" sx={{ '@media print': { fontSize: '1rem' } }}>
                                    {patientdetail.MPD_PATIENT_NAME}
                                </Typography>
                            </Box>
                            
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary" sx={{ '@media print': { fontSize: '0.8rem' } }}>
                                    <MedicalInformation fontSize="small" color="primary" sx={{ verticalAlign: 'middle', mr: 1 }} />
                                    Age
                                </Typography>
                                <Typography variant="body1"  fontWeight="500" sx={{ '@media print': { fontSize: '1rem' } }}>
                                    {calculateAge(patientdetail.MPD_BIRTHDAY)}
                                </Typography>
                            </Box>
                            
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary" sx={{ '@media print': { fontSize: '0.8rem' } }}>
                                    <CalendarToday fontSize="small" color="primary" sx={{ verticalAlign: 'middle', mr: 1, }} />
                                    Date
                                </Typography>
                                <Typography variant="body1" fontWeight="500" sx={{ '@media print': { fontSize: '1rem' } }}>
                                    {new Date(details.MTD_DATE).toLocaleDateString()}
                                </Typography>
                            </Box>
                        </Box> */}

                        {/*Modified the styles in patient detsila*/}
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
                                        {patientdetail.MPD_PATIENT_NAME}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box>
                                <MedicalInformation color="primary" />
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary" sx={{ '@media print': { fontSize: '0.8rem' } }}>
                                        Age
                                    </Typography>
                                    <Typography variant="body1" fontWeight="500" sx={{ '@media print': { fontSize: '1rem' } }}>
                                        {calculateAge(patientdetail.MPD_BIRTHDAY)}
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
                                        {new Date(details.MTD_DATE).toLocaleDateString()}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>


                        {/* Doctor Remarks */}
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', '@media print': { fontSize: '1.2rem' } }}>
                                Doctor's Remarks
                            </Typography>
                            <Box sx={{
                                border: '1px solid #e0e0e0',
                                borderRadius: '4px',
                                padding: '16px',
                                minHeight: '200px',
                                '@media print': {
                                    border: '1px solid #ddd',
                                    padding: '12px'
                                }
                            }}>
                                <Typography sx={{
                                    whiteSpace: 'pre-wrap',
                                    lineHeight: '1.6',
                                    '@media print': {
                                        fontSize: '1rem'
                                    }
                                }}>
                                    {doctorRemarks}
                                </Typography>
                            </Box>
                        </Box>

                        {/* Doctor Info */}
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            mt: 3,
                            '@media print': {
                                marginTop: '24px'
                            }
                        }}>
                            <Typography variant="body1" sx={{ fontStyle: 'italic', '@media print': { fontSize: '1rem' } }}>
                                <strong>Doctor Name:</strong> Dr. {details.MTD_DOCTOR}
                            </Typography>
                        </Box>
                    </div>

                    {/* Action Buttons */}
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 2,
                        mt: 4,
                        '@media print': {
                            display: 'none'
                        }
                    }} className="no-print">
                        <Tooltip title="Print remarks">
                            <Button
                                variant="contained"
                                startIcon={<Print />}
                                onClick={handlePrint}
                                sx={{ px: 4 }}
                            >
                                Print
                            </Button>
                        </Tooltip>

                        <Tooltip title="Download as PDF">
                            <Button
                                variant="outlined"
                                startIcon={<Download />}
                                onClick={downloadPdf}
                                sx={{ px: 4 }}
                            >
                                Download
                            </Button>
                        </Tooltip>
                    </Box>
                </StyledPaper>
            </Container>
        </>
    );
}