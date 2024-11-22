import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Container,
  Box,
  Button,
  IconButton,
  Avatar,
  TextField,
  InputAdornment,
  Typography
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext"; // Import the Auth context
import logo from "../../Assets/Images/Rootz_logo.png";
import LoginModal from "../LoginModal/LoginModal";

const Navbar = () => {
  const { isLoggedIn, login, logout } = useAuth(); // Use AuthContext
  const [user, setUser] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [anchorEl, setAnchorEl] = useState(null); // For user menu
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Fetch user data from localStorage when isLoggedIn changes
  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, [isLoggedIn]);

  const handleOpenLoginModal = () => {
    setOpenLoginModal(true);
  };

  const handleCloseLoginModal = () => {
    setOpenLoginModal(false);
  };

  const handleLogin = (userInfo) => {
    login(userInfo); // Update context
    setUser(userInfo); // Set local state
    handleCloseLoginModal();
  };

  const handleLogout = () => {
    logout(); // Update context
    setDropdownOpen(false); // Close dropdown
    navigate("/"); // Redirect to home
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev); // Toggle dropdown visibility
  };

  const closeDropdown = () => {
    setDropdownOpen(false); // Close dropdown
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#fff", boxShadow: "none" }}>
      <Container maxWidth="lg">
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Logo */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Link to="/" style={{ textDecoration: "none" }}>
              <IconButton edge="start" color="inherit" sx={{ padding: 0 }}>
                <img src={logo} alt="Logo" style={{ width: "310px", height: "100px" }} />
              </IconButton>
            </Link>
          </Box>

          {/* Search Bar */}
          <Box
            sx={{
              flexGrow: 0,
              marginRight: "100px",
              width: "400px",
              position: "relative",
            }}
          >
            <TextField
              variant="outlined"
              placeholder="Search shops"
              size="small"
              fullWidth
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      sx={{
                        backgroundColor: "#39B75D",
                        opacity: 0.8,
                        marginRight: -1.7,
                        "&:hover": {
                          backgroundColor: "#39B75D",
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
                backgroundColor: "#f5f5f5",
                borderRadius: "30px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "30px",
                  "& fieldset": {
                    borderColor: "#DDE2E7",
                  },
                  "&:hover fieldset": {
                    borderColor: "#DDE2E7",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#DDE2E7",
                  },
                },
              }}
            />
          </Box>

          {/* Login or User Menu */}
          <Box sx={{ display: "flex", gap: 2 }}>
            {isLoggedIn ? (
              <>
                <Avatar
                  sx={{ width: 56, height: 56, cursor: "pointer" }}
                  alt={user?.name}
                  src={user?.profilePicture}
                  onClick={toggleDropdown} // Toggle dropdown visibility
                />
                {dropdownOpen && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: "80px", // Below the avatar
                      right: 0,
                      backgroundColor: "white",
                      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                      borderRadius: "8px",
                      zIndex: 10,
                      padding: "10px",
                      width: "80px",
                    }}
                  >
                    <Typography
                      onClick={handleLogout}
                      sx={{
                        color: "black",
                        cursor: "pointer",
                        fontSize: "16px",
                      }}
                    >
                      Logout
                    </Typography>
                  </Box>
                )}
              </>
            ) : (
              <Button
                variant="outlined"
                sx={{
                  color: "white",
                  backgroundColor: "#39B75D",
                  opacity: 0.8,
                  border: "none",
                  borderRadius: "50px",
                  whiteSpace: "nowrap",
                  minWidth: "100px",
                  flexShrink: 0,
                  "&:hover": {
                    backgroundColor: "#39B75D",
                    opacity: 1,
                  },
                }}
                onClick={handleOpenLoginModal}
              >
                Log In
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>

      {/* Login Modal */}
      <LoginModal
        open={openLoginModal}
        handleClose={handleCloseLoginModal}
        onLogin={handleLogin}
      />
    </AppBar>
  );
};

export default Navbar;
