// LoginModal.jsx

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  TextField,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import GoogleIcon from "@mui/icons-material/Google";
import { useGoogleLogin } from "@react-oauth/google";

const LoginModal = ({ open, handleClose }) => {
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      // Handle successful login here
      console.log(tokenResponse);
      // Close the modal if needed
      handleClose();
    },
    onError: (error) => {
      console.error("Google Login Failed:", error);
    },
  });

  const handleEmailLogin = (event) => {
    event.preventDefault();
    // Implement email login logic here
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
        Log In
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
        {/* Email Login Form */}
        <Box component="form" noValidate sx={{ mt: 1 }} onSubmit={handleEmailLogin}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
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
            Sign In
          </Button>
        </Box>

        <Box sx={{ textAlign: "center", my: 2 }}>
          <span>or</span>
        </Box>

        {/* Google Login Button */}
        <Button
          variant="outlined"
          fullWidth
          startIcon={<GoogleIcon />}
          onClick={() => handleGoogleLogin()}
          sx={{ textTransform: "none" }}
        >
          Sign in with Google
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
