import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Button,
  IconButton,
  Paper,
  Chip,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  Snackbar,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Download as DownloadIcon,
  Description as DescriptionIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  Assignment as AssignmentIcon,
  Person as PersonIcon,
  MedicalServices as MedicalIcon,
  CheckCircle as CompletedIcon,
  Pending as PendingIcon,
  Close as CloseIcon,
  Upload as UploadIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import { useTheme, alpha } from "@mui/material/styles";

// File Upload Dialog Component
const FileUploadDialog = ({ open, onClose, transaction, onUploadSuccess }) => {
  const theme = useTheme();
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileInfo, setFileInfo] = useState(null);
  const [uploadMethod, setUploadMethod] = useState("put"); // put, post, json
  const [debugInfo, setDebugInfo] = useState("");

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError("File size should be less than 10MB");
        setSelectedFile(null);
        setFileInfo(null);
        return;
      }

      setSelectedFile(file);
      setFileInfo({
        name: file.name,
        size: (file.size / 1024).toFixed(2),
        type: file.type,
        lastModified: new Date(file.lastModified).toLocaleString(),
      });
      setError("");
      setDebugInfo("");
    }
  };

  //   const handleUpload = async () => {
  //   if (!selectedFile) {
  //     setError("Please select a file to upload");
  //     return;
  //   }

  //   setUploading(true);
  //   setError("");
  //   setUploadProgress(0);
  //   setDebugInfo("Starting upload...");

  //   try {
  //     const formData = new FormData();

  //     // ✅ IMPORTANT FIX: correct key name
  //     formData.append("reportFile", selectedFile);

  //     // ✅ send only required fields
  //     formData.append("MLT_LAB_TRANS_ID", transaction.MLT_LAB_TRANS_ID);
  //     formData.append("MLT_STATUS", "Completed");

  //     const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/LabTransaction/update/${transaction.MLT_LAB_TRANS_ID}`;

  //     setDebugInfo(`Uploading to: ${apiUrl}`);

  //     const response = await axios.put(apiUrl, formData, {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //       },
  //       onUploadProgress: (progressEvent) => {
  //         if (progressEvent.total) {
  //           const progress = Math.round(
  //             (progressEvent.loaded * 100) / progressEvent.total
  //           );
  //           setUploadProgress(progress);
  //           setDebugInfo(`Upload progress: ${progress}%`);
  //         }
  //       },
  //     });

  //     if (response.status === 200 || response.status === 201) {
  //       onUploadSuccess(response.data);

  //       setTimeout(() => {
  //         onClose();
  //         setSelectedFile(null);
  //         setFileInfo(null);
  //         setUploadProgress(0);
  //       }, 800);
  //     } else {
  //       throw new Error(`Upload failed with status: ${response.status}`);
  //     }
  //   } catch (err) {
  //     console.error("Upload error:", err);

  //     let errorMessage = "Upload failed. ";

  //     if (err.response) {
  //       errorMessage += `Server error (${err.response.status})`;
  //     } else if (err.request) {
  //       errorMessage += "No response from server";
  //     } else {
  //       errorMessage += err.message;
  //     }

  //     setError(errorMessage);
  //   } finally {
  //     setUploading(false);
  //   }
  // };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file to upload");
      return;
    }

    setUploading(true);
    setError("");
    setUploadProgress(0);
    setDebugInfo("Starting upload...");

    try {
      const formData = new FormData();

      // ✅ Correct key for backend
      formData.append("reportFile", selectedFile);

      // ✅ IMPORTANT: send BOTH fields
      formData.append("MLT_STATUS", "Completed");
      formData.append("MLT_REPORT_RESULT", "Completed");

      const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/LabTransaction/update/${transaction.MLT_LAB_TRANS_ID}`;

      setDebugInfo(`Uploading to: ${apiUrl}`);

      const response = await axios.put(apiUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
            setUploadProgress(progress);
            setDebugInfo(`Upload progress: ${progress}%`);
          }
        },
      });

      if (response.status === 200 || response.status === 201) {
        setDebugInfo("Upload successful ✅");

        onUploadSuccess(response.data);

        setTimeout(() => {
          onClose();
          setSelectedFile(null);
          setFileInfo(null);
          setUploadProgress(0);
        }, 800);
      } else {
        throw new Error(`Upload failed with status: ${response.status}`);
      }
    } catch (err) {
      console.error("Upload error:", err);

      let errorMessage = "Upload failed. ";

      if (err.response) {
        errorMessage += `Server error (${err.response.status})`;
      } else if (err.request) {
        errorMessage += "No response from server";
      } else {
        errorMessage += err.message;
      }

      setError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <UploadIcon color="primary" />
          <Typography variant="h6">
            {transaction?.ReportDownloadUrl ? "Update Report" : "Upload Report"}
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 1 }}>
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              mb: 3,
              bgcolor: alpha(theme.palette.primary.main, 0.05),
            }}
          >
            <Typography variant="subtitle2" gutterBottom fontWeight="bold">
              Transaction Details:
            </Typography>
            <Typography variant="body2" color="textSecondary">
              <strong>Transaction ID:</strong> {transaction?.MLT_LAB_TRANS_ID}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              <strong>Patient Code:</strong>{" "}
              {transaction?.MLT_PATIENT_CODE || "N/A"}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              <strong>Test Name:</strong> {transaction?.MLT_TEST_NAME || "N/A"}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              <strong>Doctor ID:</strong> {transaction?.MLT_DOCTOR_ID || "N/A"}
            </Typography>
          </Paper>

          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <InputLabel>Upload Method</InputLabel>
            <Select
              value={uploadMethod}
              label="Upload Method"
              onChange={(e) => setUploadMethod(e.target.value)}
              disabled={uploading}
            >
              <MenuItem value="put">PUT with FormData</MenuItem>
              <MenuItem value="post">POST with FormData</MenuItem>
              <MenuItem value="json">JSON with Base64 File</MenuItem>
            </Select>
          </FormControl>

          {transaction?.ReportDownloadUrl && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Current report exists. Uploading a new file will replace it.
            </Alert>
          )}

          <Box sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<UploadIcon />}
              fullWidth
              sx={{ mb: 2, py: 1.5 }}
              disabled={uploading}
            >
              Select File to Upload
              <input
                type="file"
                hidden
                onChange={handleFileSelect}
                accept=".pdf,.xls,.xlsx,.doc,.docx,.jpg,.jpeg,.png"
              />
            </Button>

            {fileInfo && (
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  mb: 2,
                  bgcolor: alpha(theme.palette.info.main, 0.05),
                }}
              >
                <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                  Selected File:
                </Typography>
                <Typography variant="body2">
                  <strong>Name:</strong> {fileInfo.name}
                </Typography>
                <Typography variant="body2">
                  <strong>Size:</strong> {fileInfo.size} KB
                </Typography>
                <Typography variant="body2">
                  <strong>Type:</strong> {fileInfo.type || "Unknown"}
                </Typography>
              </Paper>
            )}

            {uploading && (
              <Box sx={{ mt: 2 }}>
                <LinearProgress variant="determinate" value={uploadProgress} />
                <Typography
                  variant="caption"
                  color="textSecondary"
                  sx={{ mt: 1, display: "block", textAlign: "center" }}
                >
                  Uploading: {uploadProgress}%
                </Typography>
              </Box>
            )}

            {debugInfo && (
              <Alert severity="info" sx={{ mt: 2 }} icon={<InfoIcon />}>
                <Typography
                  variant="caption"
                  component="pre"
                  sx={{ whiteSpace: "pre-wrap", fontSize: "0.75rem" }}
                >
                  {debugInfo}
                </Typography>
              </Alert>
            )}

            {error && (
              <Alert
                severity="error"
                sx={{ mt: 2 }}
                onClose={() => setError("")}
              >
                {error}
              </Alert>
            )}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={uploading}>
          Cancel
        </Button>
        <Button
          onClick={handleUpload}
          variant="contained"
          disabled={!selectedFile || uploading}
          startIcon={
            uploading ? <CircularProgress size={20} /> : <UploadIcon />
          }
          color="primary"
        >
          {uploading
            ? "Uploading..."
            : transaction?.ReportDownloadUrl
              ? "Update Report"
              : "Upload Report"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Main LabDetails component
const LabDetails = ({ lab, onBack }) => {
  const theme = useTheme();
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Requested");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedReport, setSelectedReport] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    requested: 0,
  });
  const [downloadingId, setDownloadingId] = useState(null);

  const fetchTransactions = async () => {
    setLoading(true);
    setError("");
    try {
      const [transactionRes, patientRes, userRes] = await Promise.all([
        axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/LabTransaction/search`,
          {
            timeout: 10000,
          },
        ),
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/Patient`, {
          timeout: 10000,
        }),
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/User`, {
          timeout: 10000,
        }),
      ]);

      const allTransactions = transactionRes.data || [];
      const allPatients = patientRes.data || [];
      const allUsers = userRes.data || [];

      const labTransactions = allTransactions
        .filter((t) => t.MLT_LAB_ID === lab.MLM_LAB_ID)
        .sort(
          (a, b) =>
            new Date(b.MLT_CREATED_DATE || b.MLT_DATE || 0) -
            new Date(a.MLT_CREATED_DATE || a.MLT_DATE || 0),
        );

      setPatients(allPatients);
      setUsers(allUsers);
      setTransactions(labTransactions);
      setFilteredTransactions(labTransactions);

      // setStats({
      //   total: labTransactions.length,
      //   completed: labTransactions.filter(
      //     (t) => t.MLT_REPORT_RESULT === "Completed",
      //   ).length,
      //   pending: labTransactions.filter(
      //     (t) =>
      //       t.MLT_REPORT_RESULT === "Requested" || t.MLT_STATUS === "Requested",
      //   ).length,
      //   requested: labTransactions.filter(
      //     (t) =>
      //       t.MLT_STATUS === "Requested" && t.MLT_REPORT_RESULT !== "Completed",
      //   ).length,
      // });
      setStats({
        total: labTransactions.length,
        completed: labTransactions.filter(
          (t) => t.MLT_REPORT_RESULT === "Completed" || t.ReportDownloadUrl,
        ).length,
        pending: labTransactions.filter(
          (t) =>
            !t.ReportDownloadUrl &&
            (t.MLT_REPORT_RESULT === "Requested" ||
              t.MLT_STATUS === "Requested"),
        ).length,
        requested: labTransactions.filter(
          (t) =>
            !t.ReportDownloadUrl &&
            t.MLT_STATUS === "Requested" &&
            t.MLT_REPORT_RESULT !== "Completed",
        ).length,
      });
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError("Failed to load lab reports. Please try again.");
      setTransactions([]);
      setFilteredTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [lab.MLM_LAB_ID]);

  useEffect(() => {
    let filtered = [...transactions];

    if (searchTerm.trim() !== "") {
      const search = searchTerm.toLowerCase();

      filtered = filtered.filter((t) => {
        const patientName =
          getPatientName(t.MLT_PATIENT_CODE)?.toLowerCase() || "";
        const doctorName = getDoctorName(t.MLT_DOCTOR_ID)?.toLowerCase() || "";
        const patientCode = t.MLT_PATIENT_CODE?.toLowerCase() || "";
        const doctorId = t.MLT_DOCTOR_ID?.toLowerCase() || "";
        const testName = t.MLT_TEST_NAME?.toLowerCase() || "";

        return (
          patientName.includes(search) ||
          doctorName.includes(search) ||
          patientCode.includes(search) ||
          doctorId.includes(search) ||
          testName.includes(search)
        );
      });
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((t) => {
        const currentStatus =
          t.MLT_REPORT_RESULT === "Completed" || t.ReportDownloadUrl
            ? "Completed"
            : t.MLT_STATUS || "Requested";

        return currentStatus === statusFilter;
      });
    }

    setFilteredTransactions(filtered);
    setPage(0);
  }, [searchTerm, statusFilter, transactions]);

  const handleDownload = async (reportUrl, testName) => {
    if (!reportUrl) return;
    try {
      setDownloadingId(reportUrl);
      const fileName = reportUrl.split("/").pop() || testName || "report";
      const response = await axios.get(reportUrl, { responseType: "blob" });

      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error("Download error:", err);
      setSnackbar({
        open: true,
        message: "Failed to download file",
        severity: "error",
      });
    } finally {
      setDownloadingId(null);
    }
  };

  const handlePreview = (transaction) => {
    setSelectedReport(transaction);
    setPreviewOpen(true);
  };
  const handleUploadClick = (transaction, e) => {
    if (e) e.stopPropagation();
    setSelectedTransaction(transaction);
    setUploadDialogOpen(true);
  };
  const handleUploadSuccess = () => {
    fetchTransactions();
    setSnackbar({
      open: true,
      message: "Report uploaded successfully!",
      severity: "success",
    });
  };
  const clearSearch = () => {
    setSearchTerm("");
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // const getStatusChip = (status, result) => {
  //   const finalStatus = result === "Completed" ? "Completed" : status;
  //   switch (finalStatus) {
  //     case "Completed":
  //       return (
  //         <Chip
  //           icon={<CompletedIcon />}
  //           label="Completed"
  //           size="small"
  //           sx={{
  //             bgcolor: alpha(theme.palette.success.main, 0.1),
  //             color: theme.palette.success.dark,
  //           }}
  //         />
  //       );
  //     case "Requested":
  //       return (
  //         <Chip
  //           icon={<PendingIcon />}
  //           label="Requested"
  //           size="small"
  //           sx={{
  //             bgcolor: alpha(theme.palette.warning.main, 0.1),
  //             color: theme.palette.warning.dark,
  //           }}
  //         />
  //       );
  //     default:
  //       return (
  //         <Chip
  //           label={finalStatus || "Pending"}
  //           size="small"
  //           variant="outlined"
  //         />
  //       );
  //   }
  // };

  const getStatusChip = (status, result, reportUrl) => {
    const finalStatus =
      result === "Completed" || reportUrl ? "Completed" : status;

    switch (finalStatus) {
      case "Completed":
        return (
          <Chip
            icon={<CompletedIcon />}
            label="Completed"
            size="small"
            sx={{
              bgcolor: alpha(theme.palette.success.main, 0.1),
              color: theme.palette.success.dark,
            }}
          />
        );
      case "Requested":
        return (
          <Chip
            icon={<PendingIcon />}
            label="Requested"
            size="small"
            sx={{
              bgcolor: alpha(theme.palette.warning.main, 0.1),
              color: theme.palette.warning.dark,
            }}
          />
        );
      default:
        return (
          <Chip
            label={finalStatus || "Pending"}
            size="small"
            variant="outlined"
          />
        );
    }
  };

  const getPatientName = (patientCode) => {
    const patient = patients.find(
      (p) =>
        p.MPD_PATIENT_CODE === patientCode ||
        p.MPD_PATIENT_ID === patientCode ||
        p.MPD_CODE === patientCode,
    );
    return patient?.MPD_PATIENT_NAME || patientCode;
  };

  const getDoctorName = (doctorId) => {
    const doctor = users.find(
      (u) => String(u.MUD_USER_ID).trim() === String(doctorId).trim(),
    );
    return doctor?.MUD_FULL_NAME || doctorId;
  };

  const paginatedTransactions = filteredTransactions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );
  const StatCard = ({ icon, title, value, color }) => (
    <Card sx={{ p: 2, borderRadius: 2, height: "100%" }}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4" fontWeight="bold">
            {value}
          </Typography>
        </Box>
        <Box sx={{ bgcolor: alpha(color, 0.1), borderRadius: "50%", p: 1 }}>
          {icon}
        </Box>
      </Box>
    </Card>
  );

  return (
    <Box>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 2,
          background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
          color: "white",
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton
            onClick={onBack}
            sx={{
              color: "white",
              bgcolor: alpha(theme.palette.common.white, 0.2),
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Box flex={1}>
            <Typography variant="h5" fontWeight="bold">
              {lab.MLM_LAB_NAME}
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.9 }}>
              {lab.MLM_LAB_LOCATION} • {lab.MLM_LAB_PHONE}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Statistics */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}>
          <StatCard
            icon={<AssignmentIcon sx={{ color: theme.palette.primary.main }} />}
            title="Total Reports"
            value={stats.total}
            color={theme.palette.primary.main}
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard
            icon={<CompletedIcon sx={{ color: theme.palette.success.main }} />}
            title="Completed"
            value={stats.completed}
            color={theme.palette.success.main}
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard
            icon={<PendingIcon sx={{ color: theme.palette.warning.main }} />}
            title="Pending"
            value={stats.pending}
            color={theme.palette.warning.main}
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard
            icon={<MedicalIcon sx={{ color: theme.palette.info.main }} />}
            title="Tests"
            value={transactions.length}
            color={theme.palette.info.main}
          />
        </Grid>
      </Grid>

      {/* Search Bar
      <Card sx={{ mb: 3, p: 2, borderRadius: 2 }}>
        <TextField
          fullWidth
          size="small"
          variant="outlined"
          placeholder="Search by Patient, Test, Doctor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton onClick={clearSearch}>
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Card> */}
      {/* Search + Filter */}
      <Card sx={{ mb: 3, p: 2, borderRadius: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              placeholder="Search by Patient, Test, Doctor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton onClick={clearSearch}>
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="Requested">Requested</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Card>

      {/* Transactions Table */}
      <TableContainer
        component={Paper}
        sx={{ borderRadius: 2, maxHeight: 500 }}
      >
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Patient Name</TableCell>
              <TableCell>Test Name</TableCell>
              <TableCell>Doctor Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : filteredTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No reports found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedTransactions.map((t) => (
                <TableRow key={t.MLT_LAB_TRANS_ID} hover>
                  <TableCell>{getPatientName(t.MLT_PATIENT_CODE)}</TableCell>
                  <TableCell>{t.MLT_TEST_NAME}</TableCell>
                  <TableCell>{getDoctorName(t.MLT_DOCTOR_ID)}</TableCell>
                  {/* <TableCell>
                    {getStatusChip(t.MLT_STATUS, t.MLT_REPORT_RESULT)}
                  </TableCell> */}
                  <TableCell>
                    {getStatusChip(
                      t.MLT_STATUS,
                      t.MLT_REPORT_RESULT,
                      t.ReportDownloadUrl,
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {t.ReportDownloadUrl && (
                      <Button
                        size="small"
                        startIcon={<DownloadIcon />}
                        onClick={() =>
                          handleDownload(t.ReportDownloadUrl, t.MLT_TEST_NAME)
                        }
                        disabled={downloadingId === t.ReportDownloadUrl}
                      >
                        {downloadingId === t.ReportDownloadUrl
                          ? "Downloading..."
                          : "Download"}
                      </Button>
                    )}
                    <Button
                      size="small"
                      startIcon={<UploadIcon />}
                      onClick={(e) => handleUploadClick(t, e)}
                    >
                      Upload
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filteredTransactions.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50]}
      />

      {/* Upload Dialog */}
      {selectedTransaction && (
        <FileUploadDialog
          open={uploadDialogOpen}
          onClose={() => setUploadDialogOpen(false)}
          transaction={selectedTransaction}
          onUploadSuccess={handleUploadSuccess}
        />
      )}

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          sx={{
            width: "100%",
            minWidth: "460px",
            fontSize: "1.18rem",
            fontWeight: 600,
            py: 1.7,
            px: 2.4,
            borderRadius: "14px",
            boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
            "& .MuiAlert-icon": {
              fontSize: "36px",
              alignItems: "center",
            },
            "& .MuiAlert-message": {
              fontSize: "1.12rem",
              fontWeight: 600,
            },
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LabDetails;
