// src/components/PasswordReset.js
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import { submitNewPassword } from '../../API/index';
import {
  Box,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
} from '@mui/material';

const PasswordReset = () => {
  const { token } = useParams();
  const navigate = useNavigate(); // Use useNavigate instead of useHistory
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFieldErrors({ ...fieldErrors, [e.target.name]: '' });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFieldErrors({});
    if (formData.newPassword !== formData.confirmPassword) {
      setFieldErrors({ confirmPassword: "Passwords do not match!" });
      return;
    }
    try {
      const response = await submitNewPassword(token, formData.newPassword);
      setSnackbar({
        open: true,
        message: response.data.message || "Password has been updated successfully.",
        severity: 'success',
      });
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error) {
      console.error("Password Reset Error:", error.response?.data?.message || error.message);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Password reset failed.",
        severity: 'error',
      });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box component="form" noValidate sx={{ mt: 1, maxWidth: 400, mx: 'auto' }} onSubmit={handleSubmit}>
      <Typography variant="h5" align="center" gutterBottom>
        Reset Your Password
      </Typography>
      <TextField
        margin="normal"
        required
        fullWidth
        name="newPassword"
        label="New Password"
        type="password"
        id="newPassword"
        autoComplete="new-password"
        value={formData.newPassword}
        onChange={handleChange}
        error={Boolean(fieldErrors.newPassword)}
        helperText={fieldErrors.newPassword}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="confirmPassword"
        label="Confirm New Password"
        type="password"
        id="confirmPassword"
        autoComplete="new-password"
        value={formData.confirmPassword}
        onChange={handleChange}
        error={Boolean(fieldErrors.confirmPassword)}
        helperText={fieldErrors.confirmPassword}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{
          mt: 3,
          mb: 2,
          backgroundColor: "#39B75D",
          "&:hover": { backgroundColor: "#39B75D" },
        }}
      >
        Reset Password
      </Button>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PasswordReset;
