import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert, // Import Alert
  FormHelperText, // Import FormHelperText
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { GoogleLogin } from '@react-oauth/google';
import { register, login, verifyEmail, googleLogin } from "../../API/index";

const LoginModal = ({ open, handleClose, onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    verificationCode: "",
  });

  const [showVerification, setShowVerification] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' }); // Snackbar state
  const [fieldErrors, setFieldErrors] = useState({}); // Field-specific errors

  const responseMessage = async (response) => {
    try {
      const tokenId = response.credential;
      const result = await googleLogin(tokenId);
      console.log('Google sign in successful:', result);
      localStorage.setItem('userToken', result.data.token);
      localStorage.setItem('userInfo', JSON.stringify(result.data.user));
      onLogin(result.data.user);
      handleClose();
    } catch (error) {
      console.error('Error during Google sign-in:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Google sign-in failed.",
        severity: 'error',
      });
    }
  };

  const errorMessage = (error) => {
    console.log(error);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFieldErrors({ ...fieldErrors, [e.target.name]: '' }); // Clear field error on change
  };

  const handleEmailLogin = async (event) => {
    event.preventDefault();
    setFieldErrors({}); // Reset field errors
    if (isSignUp) {
      // Sign-up logic
      if (formData.password !== formData.confirmPassword) {
        setFieldErrors({ confirmPassword: "Passwords do not match!" });
        return;
      }
      try {
        const response = await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });
        setSnackbar({
          open: true,
          message: response.data.message || "Registration successful! Please verify your email.",
          severity: 'success',
        });
        setShowVerification(true);
      } catch (error) {
        console.error("Registration Error:", error.response?.data?.message || error.message);
        setSnackbar({
          open: true,
          message: error.response?.data?.message || "Registration failed.",
          severity: 'error',
        });
      }
    } else {
      // Login logic
      try {
        const response = await login({
          email: formData.email,
          password: formData.password,
        });
        const { token, user } = response.data;
        localStorage.setItem("userToken", token);
        localStorage.setItem("userInfo", JSON.stringify(user));
        onLogin(user);
        handleClose();
      } catch (error) {
        console.error("Login Error:", error.response?.data?.message || error.message);
        setSnackbar({
          open: true,
          message: error.response?.data?.message || "Login failed.",
          severity: 'error',
        });
      }
    }
  };

  const handleVerifyCode = async (event) => {
    event.preventDefault();
    try {
      const response = await verifyEmail({
        email: formData.email,
        verificationCode: formData.verificationCode,
      });
      setSnackbar({
        open: true,
        message: "Email verified successfully!",
        severity: 'success',
      });
      const { token, user } = response.data;
      localStorage.setItem("userToken", token);
      localStorage.setItem("userInfo", JSON.stringify(user));
      onLogin(user);
      handleClose();
    } catch (error) {
      console.error("Verification Error:", error.response?.data?.message || error.message);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Verification failed.",
        severity: 'error',
      });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="login-dialog-title"
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle id="login-dialog-title" sx={{ m: 0, p: 2 }}>
        {isSignUp ? "Sign Up" : "Log In"}
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {!showVerification ? (
          <Box component="form" noValidate sx={{ mt: 1 }} onSubmit={handleEmailLogin}>
            {isSignUp && (
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Name"
                name="name"
                autoComplete="name"
                autoFocus
                value={formData.name}
                onChange={handleChange}
                error={Boolean(fieldErrors.name)}
                helperText={fieldErrors.name}
              />
            )}
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus={!isSignUp}
              value={formData.email}
              onChange={handleChange}
              error={Boolean(fieldErrors.email)}
              helperText={fieldErrors.email}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete={isSignUp ? "new-password" : "current-password"}
              value={formData.password}
              onChange={handleChange}
              error={Boolean(fieldErrors.password)}
              helperText={fieldErrors.password}
            />
            {isSignUp && (
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={Boolean(fieldErrors.confirmPassword)}
                helperText={fieldErrors.confirmPassword}
              />
            )}
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
              {isSignUp ? "Sign Up" : "Sign In"}
            </Button>
            <Typography align="center">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}
              <Button onClick={() => setIsSignUp(!isSignUp)}>
                {isSignUp ? "Log In" : "Sign Up"}
              </Button>
            </Typography>
          </Box>
        ) : (
          // Verification Code Input
          <Box component="form" noValidate sx={{ mt: 1 }} onSubmit={handleVerifyCode}>
            <Typography variant="body1">
              Please enter the verification code sent to your email.
            </Typography>
            <TextField
              margin="normal"
              required
              fullWidth
              id="verificationCode"
              label="Verification Code"
              name="verificationCode"
              autoFocus
              value={formData.verificationCode}
              onChange={handleChange}
              error={Boolean(fieldErrors.verificationCode)}
              helperText={fieldErrors.verificationCode}
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
              Verify Email
            </Button>
          </Box>
        )}

        {!isSignUp && !showVerification && (
          <>
            <Box sx={{ textAlign: "center", my: 2 }}>
              <span>or</span>
            </Box>
            {/* Google Login Button */}
            <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />
          </>
        )}
      </DialogContent>

      {/* Snackbar for messages */}
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
    </Dialog>
  );
};

export default LoginModal;
