import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  Grid,
  CircularProgress,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Button,
  Alert,
  Snackbar,
  Tooltip,
  Avatar,
  Paper,
  Breadcrumbs,
  Link,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Refresh as RefreshIcon,
  Dashboard as DashboardIcon,
  Science as ScienceIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import LabDetails from "./labDetails"; // Import the LabDetails component

// Styled components for professional look
const StyledCard = styled(Card)(({ theme, isActive }) => ({
  height: "auto",
  minHeight: 200,
  display: "flex",
  flexDirection: "column",
  borderRadius: theme.spacing(2),
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  cursor: "pointer",
  position: "relative",
  overflow: "visible",
  border: isActive ? `2px solid ${theme.palette.primary.main}` : "none",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: theme.shadows[12],
  },
}));

export default function LaboratoryDashboard() {
  const theme = useTheme();
  const [labs, setLabs] = useState([]);
  const [filteredLabs, setFilteredLabs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [selectedLab, setSelectedLab] = useState(null); // State for selected lab
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    locations: new Set(),
  });

  // Fetch labs with error handling and retry logic
  const fetchLabs = useCallback(async (retryCount = 0) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/LabMaster`,
        { timeout: 10000 },
      );
      const labData = res.data || [];
      setLabs(labData);
      setFilteredLabs(labData);

      // Calculate statistics
      const locations = new Set(
        labData.map((lab) => lab.MLM_LAB_LOCATION).filter(Boolean),
      );
      setStats({
        total: labData.length,
        active: labData.filter((lab) => lab.MLM_IS_ACTIVE !== false).length,
        locations: locations,
      });
    } catch (err) {
      console.error("Error fetching labs:", err);
      if (retryCount < 3) {
        setTimeout(() => fetchLabs(retryCount + 1), 2000);
      } else {
        setSnackbar({
          open: true,
          message: "Failed to load laboratory data. Please refresh the page.",
          severity: "error",
        });
        setLabs([]);
        setFilteredLabs([]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLabs();
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem("labFavorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, [fetchLabs]);

  // Filter labs based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredLabs(labs);
    } else {
      const filtered = labs.filter(
        (lab) =>
          lab.MLM_LAB_NAME?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lab.MLM_LAB_LOCATION?.toLowerCase().includes(
            searchTerm.toLowerCase(),
          ) ||
          lab.MLM_LAB_PHONE?.includes(searchTerm),
      );
      setFilteredLabs(filtered);
    }
  }, [searchTerm, labs]);

  // Toggle favorite lab
  const toggleFavorite = (labId, event) => {
    event.stopPropagation();
    const newFavorites = favorites.includes(labId)
      ? favorites.filter((id) => id !== labId)
      : [...favorites, labId];

    setFavorites(newFavorites);
    localStorage.setItem("labFavorites", JSON.stringify(newFavorites));

    setSnackbar({
      open: true,
      message: favorites.includes(labId)
        ? "Removed from favorites"
        : "Added to favorites",
      severity: "success",
    });
  };

  // Handle lab click - navigate to lab details
  const handleLabClick = (lab) => {
    setSelectedLab(lab);
  };

  // Handle back from lab details
  const handleBack = () => {
    setSelectedLab(null);
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchLabs();
    setSnackbar({
      open: true,
      message: "Refreshing laboratory data...",
      severity: "info",
    });
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm("");
  };

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
        <Avatar sx={{ bgcolor: alpha(color, 0.1), color: color }}>
          {icon}
        </Avatar>
      </Box>
    </Card>
  );

  // If a lab is selected, show LabDetails component
  if (selectedLab) {
    return (
      <Box
        sx={{
          p: { xs: 2, md: 4 },
          bgcolor: "background.default",
          minHeight: "100vh",
        }}
      >
        <LabDetails lab={selectedLab} onBack={handleBack} />
      </Box>
    );
  }

  // Otherwise show the dashboard
  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        bgcolor: "background.default",
        minHeight: "100vh",
      }}
    >
      {/* Header Section */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
          color: "white",
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
        >
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Laboratory Dashboard
            </Typography>
            <Breadcrumbs sx={{ color: alpha(theme.palette.common.white, 0.7) }}>
              <Link
                color="inherit"
                href="/"
                sx={{ display: "flex", alignItems: "center" }}
              >
                <DashboardIcon sx={{ mr: 0.5 }} fontSize="small" />
                Home
              </Link>
              <Typography color="white">Laboratories</Typography>
            </Breadcrumbs>
          </Box>
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            sx={{
              bgcolor: alpha(theme.palette.common.white, 0.2),
              "&:hover": { bgcolor: alpha(theme.palette.common.white, 0.3) },
            }}
          >
            Refresh Data
          </Button>
        </Box>
      </Paper>

      {/* Statistics Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            icon={<ScienceIcon />}
            title="Total Laboratories"
            value={stats.total}
            color={theme.palette.primary.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            icon={<TrendingUpIcon />}
            title="Active Laboratories"
            value={stats.active}
            color={theme.palette.success.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            icon={<LocationIcon />}
            title="Service Locations"
            value={stats.locations.size}
            color={theme.palette.warning.main}
          />
        </Grid>
      </Grid>

      {/* Search Bar */}
      <Card sx={{ mb: 4, p: 2, borderRadius: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by lab name, location, or phone number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton onClick={clearSearch} size="small">
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
            sx: { borderRadius: 2 },
          }}
        />
      </Card>

      {/* Labs Grid */}
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="400px"
        >
          <CircularProgress size={60} thickness={4} />
        </Box>
      ) : (
        <>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="body2" color="textSecondary">
              Showing {filteredLabs.length} of {labs.length} laboratories
            </Typography>
            {searchTerm && (
              <Chip
                label={`Search: ${searchTerm}`}
                onDelete={clearSearch}
                size="small"
                color="primary"
              />
            )}
          </Box>

          <Grid container spacing={3}>
            {filteredLabs.map((lab) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={lab.MLM_LAB_ID}>
                <StyledCard
                  isActive={favorites.includes(lab.MLM_LAB_ID)}
                  onClick={() => handleLabClick(lab)}
                >
                  <CardContent sx={{ flex: 1, p: 3 }}>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="flex-start"
                      mb={2}
                    >
                      <Box display="flex" alignItems="center" gap={1}>
                        <Avatar
                          sx={{
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            color: theme.palette.primary.main,
                          }}
                        >
                          <ScienceIcon />
                        </Avatar>
                        <Box>
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            gutterBottom
                          >
                            {lab.MLM_LAB_NAME}
                          </Typography>
                          {lab.MLM_LAB_CODE && (
                            <Typography variant="caption" color="textSecondary">
                              Code: {lab.MLM_LAB_CODE}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                      <Tooltip
                        title={
                          favorites.includes(lab.MLM_LAB_ID)
                            ? "Remove from favorites"
                            : "Add to favorites"
                        }
                      >
                        <IconButton
                          size="small"
                          onClick={(e) => toggleFavorite(lab.MLM_LAB_ID, e)}
                          sx={{
                            color: favorites.includes(lab.MLM_LAB_ID)
                              ? theme.palette.warning.main
                              : "inherit",
                          }}
                        >
                          {favorites.includes(lab.MLM_LAB_ID) ? (
                            <StarIcon />
                          ) : (
                            <StarBorderIcon />
                          )}
                        </IconButton>
                      </Tooltip>
                    </Box>

                    <Box mt={2}>
                      {lab.MLM_LAB_LOCATION && (
                        <Box
                          display="flex"
                          alignItems="center"
                          gap={1}
                          mb={1.5}
                        >
                          <LocationIcon fontSize="small" color="action" />
                          <Typography variant="body2" color="textSecondary">
                            {lab.MLM_LAB_LOCATION}
                          </Typography>
                        </Box>
                      )}

                      {lab.MLM_LAB_PHONE && (
                        <Box
                          display="flex"
                          alignItems="center"
                          gap={1}
                          mb={1.5}
                        >
                          <PhoneIcon fontSize="small" color="action" />
                          <Typography variant="body2" color="textSecondary">
                            {lab.MLM_LAB_PHONE}
                          </Typography>
                        </Box>
                      )}

                      {lab.MLM_LAB_EMAIL && (
                        <Box
                          display="flex"
                          alignItems="center"
                          gap={1}
                          mb={1.5}
                        >
                          <EmailIcon fontSize="small" color="action" />
                          <Typography variant="body2" color="textSecondary">
                            {lab.MLM_LAB_EMAIL}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </CardContent>

                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                      size="small"
                      fullWidth
                      variant="outlined"
                      onClick={() => handleLabClick(lab)}
                      sx={{ borderRadius: 2 }}
                    >
                      View Details
                    </Button>
                  </CardActions>
                </StyledCard>
              </Grid>
            ))}
          </Grid>

          {!loading && filteredLabs.length === 0 && (
            <Box textAlign="center" py={8}>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                No laboratories found
              </Typography>
              {searchTerm && (
                <Button variant="outlined" onClick={clearSearch} sx={{ mt: 2 }}>
                  Clear Search
                </Button>
              )}
            </Box>
          )}
        </>
      )}

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        {/* <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert> */}
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
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
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
