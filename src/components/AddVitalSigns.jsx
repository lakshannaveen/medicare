import React, { useState } from "react";
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Divider,
  InputAdornment,
  FormHelperText,
} from "@mui/material";
import { Favorite as FavoriteIcon, Save as SaveIcon } from "@mui/icons-material";
import axios from "axios";

const API_BASE_URL = "https://testnew.dockyardsoftware.com/api";

export default function AddVitalSigns({ 
  patientCode, 
  patientName, 
  onSuccess, 
  onClose 
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    systolicBP: "",
    diastolicBP: "",
    heartRate: "",
    temperature: "",
    respiratoryRate: "",
    oxygenSaturation: "",
    height: "",
    weight: "",
    notes: "",
  });

  const [calculatedBMI, setCalculatedBMI] = useState(null);

  // Calculate BMI when height or weight changes
  const calculateBMI = (height, weight) => {
    if (height && weight && height > 0) {
      const heightInMeters = height / 100;
      const bmi = weight / (heightInMeters * heightInMeters);
      return Math.round(bmi * 10) / 10;
    }
    return null;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Allow only numbers for numeric fields
    if (["systolicBP", "diastolicBP", "heartRate", "respiratoryRate", "oxygenSaturation"].includes(name)) {
      if (value === "" || /^\d+$/.test(value)) {
        setFormData({ ...formData, [name]: value });
      }
    } else if (["temperature", "height", "weight"].includes(name)) {
      if (value === "" || /^\d*\.?\d*$/.test(value)) {
        setFormData({ ...formData, [name]: value });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }

    // Calculate BMI when height or weight changes
    if (name === "height" || name === "weight") {
      const newHeight = name === "height" ? value : formData.height;
      const newWeight = name === "weight" ? value : formData.weight;
      const bmi = calculateBMI(newHeight, newWeight);
      setCalculatedBMI(bmi);
    }
  };

  const validateForm = () => {
    if (!patientCode) {
      setError("Patient code is missing");
      return false;
    }

    // Check required fields
    const requiredFields = [
      { name: "systolicBP", label: "Systolic BP" },
      { name: "diastolicBP", label: "Diastolic BP" },
      { name: "heartRate", label: "Heart Rate" },
      { name: "temperature", label: "Temperature" },
      { name: "weight", label: "Weight" },
    ];

    for (const field of requiredFields) {
      if (!formData[field.name]) {
        setError(`${field.label} is required`);
        return false;
      }
    }

    // Validate ranges
    if (formData.systolicBP && (formData.systolicBP < 40 || formData.systolicBP > 250)) {
      setError("Systolic BP should be between 40 and 250");
      return false;
    }

    if (formData.diastolicBP && (formData.diastolicBP < 30 || formData.diastolicBP > 150)) {
      setError("Diastolic BP should be between 30 and 150");
      return false;
    }

    if (formData.heartRate && (formData.heartRate < 30 || formData.heartRate > 220)) {
      setError("Heart rate should be between 30 and 220");
      return false;
    }

    if (formData.temperature && (formData.temperature < 30 || formData.temperature > 45)) {
      setError("Temperature should be between 30°C and 45°C");
      return false;
    }

    if (formData.oxygenSaturation && (formData.oxygenSaturation < 50 || formData.oxygenSaturation > 100)) {
      setError("Oxygen saturation should be between 50% and 100%");
      return false;
    }

    if (formData.height && (formData.height < 30 || formData.height > 250)) {
      setError("Height should be between 30cm and 250cm");
      return false;
    }

    if (formData.weight && (formData.weight < 1 || formData.weight > 300)) {
      setError("Weight should be between 1kg and 300kg");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    // Prepare the data for API
    const vitalSignsData = {
      MPVS_PATIENT_CODE: patientCode,
      MPVS_SYSTOLIC_BP: parseInt(formData.systolicBP) || 0,
      MPVS_DIASTOLIC_BP: parseInt(formData.diastolicBP) || 0,
      MPVS_HEART_RATE: parseInt(formData.heartRate) || 0,
      MPVS_TEMPERATURE: parseFloat(formData.temperature) || 0,
      MPVS_RESPIRATORY_RATE: parseInt(formData.respiratoryRate) || 0,
      MPVS_OXYGEN_SATURATION: parseInt(formData.oxygenSaturation) || 0,
      MPVS_HEIGHT: parseFloat(formData.height) || 0,
      MPVS_WEIGHT: parseFloat(formData.weight) || 0,
      MPVS_BMI: calculatedBMI || 0,
      MPVS_NOTES: formData.notes || "",
    };

    try {
      const response = await axios.post(
        `${API_BASE_URL}/PatientVitalSigns`,
        vitalSignsData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        onSuccess();
      } else {
        setError("Failed to save vital signs");
      }
    } catch (error) {
      console.error("Error saving vital signs:", error);
      setError(
        error.response?.data?.message || 
        "An error occurred while saving vital signs"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      systolicBP: "",
      diastolicBP: "",
      heartRate: "",
      temperature: "",
      respiratoryRate: "",
      oxygenSaturation: "",
      height: "",
      weight: "",
      notes: "",
    });
    setCalculatedBMI(null);
    setError("");
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      <Paper elevation={0} sx={{ p: 3, bgcolor: "grey.50", mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom fontWeight="bold">
          Patient Information
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Patient Code"
              value={patientCode || ""}
              disabled
              size="small"
              variant="filled"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Patient Name"
              value={patientName || ""}
              disabled
              size="small"
              variant="filled"
            />
          </Grid>
        </Grid>
      </Paper>

      <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
        Vital Signs Measurements
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={3}>
        {/* Blood Pressure */}
        <Grid item xs={12} sm={6} md={4}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Blood Pressure (mmHg)
          </Typography>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Systolic"
                name="systolicBP"
                value={formData.systolicBP}
                onChange={handleInputChange}
                size="small"
                InputProps={{
                  endAdornment: <InputAdornment position="end">mmHg</InputAdornment>,
                }}
                placeholder="120"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Diastolic"
                name="diastolicBP"
                value={formData.diastolicBP}
                onChange={handleInputChange}
                size="small"
                InputProps={{
                  endAdornment: <InputAdornment position="end">mmHg</InputAdornment>,
                }}
                placeholder="80"
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Heart Rate */}
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="Heart Rate"
            name="heartRate"
            value={formData.heartRate}
            onChange={handleInputChange}
            size="small"
            InputProps={{
              endAdornment: <InputAdornment position="end">bpm</InputAdornment>,
              startAdornment: (
                <InputAdornment position="start">
                  <FavoriteIcon color="error" fontSize="small" />
                </InputAdornment>
              ),
            }}
            placeholder="72"
          />
          <FormHelperText>Normal: 60-100 bpm</FormHelperText>
        </Grid>

        {/* Temperature */}
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="Temperature"
            name="temperature"
            value={formData.temperature}
            onChange={handleInputChange}
            size="small"
            InputProps={{
              endAdornment: <InputAdornment position="end">°C</InputAdornment>,
            }}
            placeholder="37.0"
          />
          <FormHelperText>Normal: 36.1-37.2°C</FormHelperText>
        </Grid>

        {/* Respiratory Rate */}
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="Respiratory Rate"
            name="respiratoryRate"
            value={formData.respiratoryRate}
            onChange={handleInputChange}
            size="small"
            InputProps={{
              endAdornment: <InputAdornment position="end">/min</InputAdornment>,
            }}
            placeholder="16"
          />
          <FormHelperText>Normal: 12-20 breaths/min</FormHelperText>
        </Grid>

        {/* Oxygen Saturation */}
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="O2 Saturation"
            name="oxygenSaturation"
            value={formData.oxygenSaturation}
            onChange={handleInputChange}
            size="small"
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
            placeholder="98"
          />
          <FormHelperText>Normal: 95-100%</FormHelperText>
        </Grid>

        {/* Height */}
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="Height"
            name="height"
            value={formData.height}
            onChange={handleInputChange}
            size="small"
            InputProps={{
              endAdornment: <InputAdornment position="end">cm</InputAdornment>,
            }}
            placeholder="170"
          />
        </Grid>

        {/* Weight */}
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="Weight"
            name="weight"
            value={formData.weight}
            onChange={handleInputChange}
            size="small"
            InputProps={{
              endAdornment: <InputAdornment position="end">kg</InputAdornment>,
            }}
            placeholder="70"
          />
        </Grid>

        {/* BMI (calculated) */}
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="BMI (Auto-calculated)"
            value={calculatedBMI !== null ? calculatedBMI.toFixed(1) : ""}
            size="small"
            disabled
            variant="filled"
            InputProps={{
              endAdornment: <InputAdornment position="end">kg/m²</InputAdornment>,
            }}
          />
          {calculatedBMI && (
            <FormHelperText>
              Category: {
                calculatedBMI < 18.5 ? "Underweight" :
                calculatedBMI < 25 ? "Normal" :
                calculatedBMI < 30 ? "Overweight" : "Obese"
              }
            </FormHelperText>
          )}
        </Grid>

        {/* Notes */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Notes"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            multiline
            rows={3}
            size="small"
            placeholder="Additional observations or notes about the patient's vital signs..."
          />
        </Grid>
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          variant="outlined"
          onClick={handleReset}
          disabled={loading}
        >
          Reset
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="success"
          startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Vital Signs"}
        </Button>
      </Box>
    </Box>
  );
}