import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";

const Navbar = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: "#fff", boxShadow: "none" }}>
      <Container maxWidth="lg">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {/* Left: Logo */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton edge="start" color="inherit" sx={{ padding: 0 }}>
              <img
                src="https://via.placeholder.com/310x55" // Replace with your logo URL
                alt="Logo"
                style={{ width: "310px", height: "55px" }}
              />
            </IconButton>
          </Box>

          {/* Center: Search Bar */}
          <Box sx={{ flexGrow: 1, mx: 2 }}>
            <TextField
              variant="outlined"
              placeholder="Search shops"
              size="small"
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                backgroundColor: "#f5f5f5", // Light gray background
                borderRadius: "50px", // Ensures the input is round
                "& .MuiOutlinedInput-root": {
                  borderRadius: "50px", // Matches the round style
                  "& fieldset": {
                    borderColor: "#DDE2E7", // Sets the border color to your specified color
                  },
                  "&:hover fieldset": {
                    borderColor: "#B0B8C1", // Optional: Darker border on hover
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#DDE2E7", // Keeps the same border color on focus
                    borderWidth: "2px", // Makes the border slightly thicker on focus
                  },
                },
              }}
            />
          </Box>

          {/* Right: Buttons */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button variant="outlined" sx={{ borderColor: "#000", color: "#000" }}>
              Sign In
            </Button>
            <Button variant="contained" sx={{ backgroundColor: "#000", color: "#fff" }}>
              Sign Up
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
