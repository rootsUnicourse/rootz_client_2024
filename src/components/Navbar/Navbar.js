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
          <Box sx={{ flexGrow: 0, mx: 3, width: "400px" }}>
            <TextField
              variant="outlined"
              placeholder="Search shops"
              size="small"
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      sx={{
                        backgroundColor: "#39B75D",
                        opacity: 0.8,
                        marginRight: -1.7,
                        "&:hover": {
                          backgroundColor: "#39B75D", // Hover background color
                          opacity: 1,
                        },
                      }}
                    >
                      <SearchIcon sx={{ color: "white", fontSize: "21.5px" }} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                backgroundColor: "#f5f5f5", // Light gray background
                borderRadius: "30px", // Rounded style
                "& .MuiOutlinedInput-root": {
                  borderRadius: "30px",
                  "& fieldset": {
                    borderColor: "#DDE2E7", // Sets the border color to your specified color
                  },
                  "&:hover fieldset": {
                    borderColor: "#DDE2E7", // Optional: Darker border on hover
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#DDE2E7", // Keeps the same border color on focus
                  },
                },
              }}
            />
          </Box>

          {/* Right: Buttons */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button variant="outlined" sx={{ color: "white", backgroundColor: "#39B75D", opacity: 0.8, border: "none", borderRadius: "50px" }}>
              Log In
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
