// components/ViewReport.jsx
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Box,
  Typography,
  TextField,
} from "@mui/material";
import axios from "axios";

export default function ViewReport({ open, onClose, patientCode }) {
  const [reportData, setReportData] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!open || !patientCode) return;

    const fetchReports = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/LabTransaction/search?patientCode=${patientCode}`
        );
        setReportData(res.data || []);
        setFilteredReports(res.data || []);
      } catch (err) {
        console.error(err);
        setReportData([]);
        setFilteredReports([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [open, patientCode]);

  useEffect(() => {
  if (!open) {
    setSearchTerm(""); // reset search when dialog closes
  }
}, [open]);

  // Filter reports when searchTerm changes
  useEffect(() => {
    if (!searchTerm) {
      setFilteredReports(reportData);
    } else {
      const filtered = reportData.filter(
        (lab) =>
          lab.MLT_TEST_NAME?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lab.MLT_STATUS?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredReports(filtered);
    }
  }, [searchTerm, reportData]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Lab Reports - {patientCode}</DialogTitle>
      <DialogContent>
        <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
          <TextField
            size="small"
            placeholder="Search by Test Name or Status"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button variant="outlined" onClick={onClose}>
            Close
          </Button>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" my={3}>
            <CircularProgress />
          </Box>
        ) : filteredReports.length === 0 ? (
          <Typography>No lab records found.</Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Test Name</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Result</TableCell>
                  <TableCell>Completed Date</TableCell>
                  <TableCell>Report</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredReports.map((lab) => (
                  <TableRow key={lab.MLT_LAB_TRANS_ID}>
                    <TableCell>{lab.MLT_TEST_NAME || "-"}</TableCell>
                    <TableCell>{lab.MLT_STATUS || "-"}</TableCell>
                    <TableCell>{lab.MLT_REPORT_RESULT || "-"}</TableCell>
                    <TableCell>
                      {lab.MLT_COMPLETED_DATE
                        ? new Date(lab.MLT_COMPLETED_DATE).toLocaleString()
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {lab.ReportDownloadUrl ? (
                        <Button
                          size="small"
                          variant="outlined"
                          href={lab.ReportDownloadUrl}
                          target="_blank"
                        >
                          Download
                        </Button>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
    </Dialog>
  );
}