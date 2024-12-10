import React, { useState, useEffect } from "react";
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
  Alert,
  Checkbox,
  FormControlLabel,
  Link,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { GoogleLogin } from "@react-oauth/google";
import {
  register,
  login,
  verifyEmail,
  googleLogin,
  requestPasswordReset,
} from "../../API/index";
import { useLocation } from "react-router-dom"; // Import useLocation
import { Buffer } from 'buffer';


const LoginModal = ({ open, handleClose, onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    verificationCode: "",
    parentId: null,
  });
  const [showVerification, setShowVerification] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [termsAgreed, setTermsAgreed] = useState(false);

  const location = useLocation(); // Get the current location

  useEffect(() => {
    if (!open) {
      // Reset all states when the modal is closed
      setTermsAgreed(false);
      setIsSignUp(false);
      setIsForgotPassword(false);
      setShowVerification(false);
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        verificationCode: "",
        parentId: null,
      });
      setFieldErrors({});
    } else {
      // Extract parentId from URL when modal opens
      const params = new URLSearchParams(location.search);
      const encodedParentId = params.get("parentId");
      if (encodedParentId) {
        // Decode the parentId based on the encoding used
        //const decodedParentId = decodeURIComponent(encodedParentId);
        // For encodeURIComponent encoding
        // OR, if using Base64:
        const decodedParentId = Buffer.from(encodedParentId, 'base64').toString('utf-8');
        console.log(decodedParentId)

        setFormData((prevData) => ({
          ...prevData,
          parentId: decodedParentId,
        }));
      }
    }
  }, [open, location.search]);

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFieldErrors({ ...fieldErrors, [e.target.name]: "" });
  };

  const handleEmailLogin = async (event) => {
    event.preventDefault();
    setFieldErrors({});
    if (!termsAgreed) {
      setSnackbar({
        open: true,
        message: "You must agree to the Terms and Conditions.",
        severity: "error",
      });
      return;
    }
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
          parentId: formData.parentId, // Include parentId
        });
        setSnackbar({
          open: true,
          message:
            response.data.message ||
            "Registration successful! Please verify your email.",
          severity: "success",
        });
        setShowVerification(true);
      } catch (error) {
        console.error(
          "Registration Error:",
          error.response?.data?.message || error.message
        );
        setSnackbar({
          open: true,
          message: error.response?.data?.message || "Registration failed.",
          severity: "error",
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
        onLogin(user,token);
        handleClose();
      } catch (error) {
        console.error(
          "Login Error:",
          error.response?.data?.message || error.message
        );
        setSnackbar({
          open: true,
          message: error.response?.data?.message || "Login failed.",
          severity: "error",
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
        severity: "success",
      });
      const { token, user } = response.data;
      localStorage.setItem("userToken", token);
      localStorage.setItem("userInfo", JSON.stringify(user));
      onLogin(user,token);
      handleClose();
    } catch (error) {
      console.error(
        "Verification Error:",
        error.response?.data?.message || error.message
      );
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Verification failed.",
        severity: "error",
      });
    }
  };

  const handlePasswordResetRequest = async (event) => {
    event.preventDefault();
    if (!termsAgreed) {
      setSnackbar({
        open: true,
        message: "You must agree to the Terms and Conditions.",
        severity: "error",
      });
      return;
    }
    try {
      const response = await requestPasswordReset(formData.email);
      setSnackbar({
        open: true,
        message: response.data.message || "Password reset email sent.",
        severity: "success",
      });
      setIsForgotPassword(false);
    } catch (error) {
      console.error(
        "Password Reset Request Error:",
        error.response?.data?.message || error.message
      );
      setSnackbar({
        open: true,
        message:
          error.response?.data?.message || "Password reset request failed.",
        severity: "error",
      });
    }
  };

  const responseMessage = async (response) => {
    try {
      const tokenId = response.credential;
      const result = await googleLogin(tokenId, formData.parentId); // Pass parentId
      localStorage.setItem("userToken", result.data.token);
      localStorage.setItem("userInfo", JSON.stringify(result.data.user));
      onLogin(result.data.user, result.data.token); // Update context with user info
      handleClose();
    } catch (error) {
      console.error("Error during Google sign-in:", error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Google sign-in failed.",
        severity: "error",
      });
    }
  };

  const errorMessage = (error) => {
    console.log(error);
    setSnackbar({
      open: true,
      message: "Google sign-in failed.",
      severity: "error",
    });
  };

  return (
    <>
      {/* Main Authentication Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="login-dialog-title"
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle id="login-dialog-title" sx={{ color: 'white', m: 0, p: 2, backgroundColor: '#1DC14C', opacity: 0.7 }}>
          {isSignUp
            ? "Sign Up"
            : isForgotPassword
              ? "Forgot Password"
              : "Log In"}
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: 'white',
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {(() => {
            if (showVerification) {
              // Verification code input
              return (
                <Box
                  component="form"
                  noValidate
                  sx={{ mt: 1 }}
                  onSubmit={handleVerifyCode}
                >
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
              );
            } else if (isForgotPassword) {
              // Password reset request form
              return (
                <Box
                  component="form"
                  noValidate
                  sx={{ mt: 1 }}
                  onSubmit={handlePasswordResetRequest}
                >
                  <Typography variant="body1">
                    Please enter your email address to request a password reset.
                  </Typography>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    value={formData.email}
                    onChange={handleChange}
                    error={Boolean(fieldErrors.email)}
                    helperText={fieldErrors.email}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={termsAgreed}
                        onChange={(e) => setTermsAgreed(e.target.checked)}
                        name="terms"
                        color="primary"
                      />
                    }
                    label={
                      <Typography variant="body2">
                        I agree to the{" "}
                        <Link
                          href="/rootz_terms.pdf"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Terms and Conditions
                        </Link>
                      </Typography>
                    }
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={!termsAgreed}
                    sx={{
                      mt: 3,
                      mb: 2,
                      backgroundColor: "#39B75D",
                      "&:hover": { backgroundColor: "#39B75D" },
                    }}
                  >
                    Send Password Reset Email
                  </Button>
                  <Typography align="center">
                    <Button onClick={() => setIsForgotPassword(false)}>
                      Back to Login
                    </Button>
                  </Typography>
                </Box>
              );
            } else if (isSignUp) {
              // Sign up form
              return (
                <Box
                  component="form"
                  noValidate
                  sx={{ mt: 1 }}
                  onSubmit={handleEmailLogin}
                >
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
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
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
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
                    error={Boolean(fieldErrors.password)}
                    helperText={fieldErrors.password}
                  />
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
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={termsAgreed}
                        onChange={(e) => setTermsAgreed(e.target.checked)}
                        name="terms"
                        color="primary"
                      />
                    }
                    label={
                      <Typography variant="body2">
                        I agree to the{" "}
                        <Link
                          href="/rootz_terms.pdf"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Terms and Conditions
                        </Link>
                      </Typography>
                    }
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={!termsAgreed}
                    sx={{
                      mt: 3,
                      mb: 2,
                      backgroundColor: "#39B75D",
                      "&:hover": { backgroundColor: "#39B75D" },
                    }}
                  >
                    Sign Up
                  </Button>
                  <Typography align="center">
                    Already have an account?
                    <Button onClick={() => setIsSignUp(false)}>Log In</Button>
                  </Typography>
                </Box>
              );
            } else {
              // Login form
              return (
                <Box
                  component="form"
                  noValidate
                  sx={{ mt: 1 }}
                  onSubmit={handleEmailLogin}
                >
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
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
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleChange}
                    error={Boolean(fieldErrors.password)}
                    helperText={fieldErrors.password}
                  />
                  <Typography align="right">
                    <Button onClick={() => setIsForgotPassword(true)}>
                      Forgot Password?
                    </Button>
                  </Typography>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={termsAgreed}
                        onChange={(e) => setTermsAgreed(e.target.checked)}
                        name="terms"
                        color="primary"
                      />
                    }
                    label={
                      <Typography variant="body2">
                        I agree to the{" "}
                        <Link
                          href="/rootz_terms.pdf"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Terms and Conditions
                        </Link>
                      </Typography>
                    }
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={!termsAgreed}
                    sx={{
                      mt: 1,
                      mb: 2,
                      backgroundColor: "#39B75D",
                      "&:hover": { backgroundColor: "#39B75D" },
                    }}
                  >
                    Sign In
                  </Button>
                  <Typography align="center">
                    Don't have an account?
                    <Button onClick={() => setIsSignUp(true)}>Sign Up</Button>
                  </Typography>
                  <Box sx={{ textAlign: "center", my: 2 }}>
                    <span>or</span>
                  </Box>
                  {/* Google Login Button */}
                  <Box
                    sx={{
                      position: "relative",
                      display: "inline-block",
                      width: "100%",
                    }}
                  >
                    <GoogleLogin
                      onSuccess={responseMessage}
                      onError={errorMessage}
                    />
                    {!termsAgreed && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          zIndex: 1,
                          cursor: "not-allowed",
                          backgroundColor: "rgba(255, 255, 255, 0)", // Transparent overlay
                        }}
                        onClick={() => {
                          setSnackbar({
                            open: true,
                            message:
                              "You must agree to the Terms and Conditions.",
                            severity: "error",
                          });
                        }}
                      />
                    )}
                  </Box>
                </Box>
              );
            }
          })()}
        </DialogContent>

        {/* Snackbar for messages */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Dialog>
    </>
  );
};

export default LoginModal;
