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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import GoogleIcon from "@mui/icons-material/Google";
import { GoogleLogin } from '@react-oauth/google';
import { register, login, verifyEmail, googleLogin } from "../../API/index";

const LoginModal = ({ open, handleClose, onLogin }) => { // Destructure onLogin
  const [isSignUp, setIsSignUp] = useState(false); // Toggle between login and sign-up
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    verificationCode: "",
  });

  const [showVerification, setShowVerification] = useState(false); // Show verification code input

  const responseMessage = async (response) => {
    try {
      // Extract the ID token from the Google login response
      const tokenId = response.credential;

      // Use the googleLogin function to send the token to your backend
      const result = await googleLogin(tokenId);

      // If the backend response is successful, store the token and user details
      console.log('Google sign in successful:', result);
      localStorage.setItem('userToken', result.data.token); // Standardize key
      localStorage.setItem('userInfo', JSON.stringify(result.data.user)); // Standardize key
      onLogin(result.data.user); // Update user state in Navbar
      handleClose(); // Close the modal
    } catch (error) {
      // Handle errors, e.g., display a message to the user
      console.error('Error during Google sign-in:', error);
    }
  };

  const errorMessage = (error) => {
    console.log(error);
  };

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleEmailLogin = async (event) => {
    event.preventDefault();
    if (isSignUp) {
      // Sign-up logic
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
      try {
        // Use the register function from the API file
        const response = await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });
        alert(response.data.message);
        setShowVerification(true); // Show verification code input
      } catch (error) {
        console.error("Registration Error:", error.response?.data?.message || error.message);
        alert(error.response?.data?.message || "Registration failed.");
      }
    } else {
      // Login logic
      try {
        // Use the login function from the API file
        const response = await login({
          email: formData.email,
          password: formData.password,
        });
        // Handle successful login
        const { token, user } = response.data;
        // Save to local storage
        localStorage.setItem("userToken", token);
        localStorage.setItem("userInfo", JSON.stringify(user));
        onLogin(user); // Update user state in Navbar
        handleClose(); // Close the modal
      } catch (error) {
        console.error("Login Error:", error.response?.data?.message || error.message);
        alert(error.response?.data?.message || "Login failed.");
      }
    }
  };

  // Handle verification code submission
  const handleVerifyCode = async (event) => {
    event.preventDefault();
    try {
      // Use the verifyEmail function from the API file
      const response = await verifyEmail({
        email: formData.email,
        verificationCode: formData.verificationCode,
      });
      alert("Email verified successfully!");
      const { token, user } = response.data;
      // Save to local storage
      localStorage.setItem("userToken", token);
      localStorage.setItem("userInfo", JSON.stringify(user));
      onLogin(user); // Update user state in Navbar
      handleClose(); // Close the modal
    } catch (error) {
      console.error("Verification Error:", error.response?.data?.message || error.message);
      alert(error.response?.data?.message || "Verification failed.");
    }
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
    </Dialog>
  );
};

export default LoginModal;
