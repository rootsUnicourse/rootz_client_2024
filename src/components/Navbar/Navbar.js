// Navbar.jsx

import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Container,
  Box,
  Button,
  TextField,
  IconButton,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Link } from "react-router-dom";
import logo from "../../Assets/Images/Rootz_logo.png";
import { fetchCompanysBySearch } from "../../API/index";
import SearchResultItem from "../SearchResultItem/SearchResultItem";
import LoginModal from "../LoginModal/LoginModal"; // Import the LoginModal component

const Navbar = () => {
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [openLoginModal, setOpenLoginModal] = useState(false);

  const handleOpenLoginModal = () => {
    setOpenLoginModal(true);
  };

  const handleCloseLoginModal = () => {
    setOpenLoginModal(false);
  };

  // Debounce API calls to prevent excessive requests
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchInput.trim() !== "") {
        // Fetch matching companies
        const fetchData = async () => {
          try {
            const response = await fetchCompanysBySearch(searchInput);
            setSearchResults(response.data); // Assuming the server returns an array
          } catch (error) {
            console.error("Error fetching companies:", error);
            setSearchResults([]);
          }
        };
        fetchData();
      } else {
        setSearchResults([]);
      }
    }, 500); // Adjust the debounce delay as needed

    return () => clearTimeout(delayDebounceFn);
  }, [searchInput]);

  return (
    <AppBar position="static" sx={{ backgroundColor: "#fff", boxShadow: "none" }}>
      <Container maxWidth="lg">
        <Toolbar
          sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
        >
          {/* Left: Logo */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Link to="/" style={{ textDecoration: "none" }}>
              <IconButton edge="start" color="inherit" sx={{ padding: 0 }}>
                <img
                  src={logo}
                  alt="Logo"
                  style={{ width: "310px", height: "100px" }}
                />
              </IconButton>
            </Link>
          </Box>

          {/* Center: Search Bar */}
          <Box
            sx={{ flexGrow: 0, marginRight: "100px", width: "400px", position: "relative" }}
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

            {/* Search Results Dropdown */}
            {searchResults.length > 0 && (
              <Box
                sx={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  backgroundColor: "white",
                  zIndex: 1000,
                  maxHeight: "300px",
                  overflowY: "auto",
                  border: "1px solid #ccc",
                  marginTop: "5px",
                  // Hide scrollbar
                  "&::-webkit-scrollbar": {
                    display: "none",
                  },
                  "-ms-overflow-style": "none", // IE and Edge
                  "scrollbar-width": "none", // Firefox
                }}
              >
                {searchResults.map((company, index) => (
                  <React.Fragment key={company._id}>
                    <SearchResultItem company={company} />
                    {/* Add dotted line except after the last item */}
                    {index !== searchResults.length - 1 && (
                      <Box
                        sx={{
                          borderBottom: "1px dotted #ccc",
                          margin: "0 10px",
                        }}
                      />
                    )}
                  </React.Fragment>
                ))}
              </Box>
            )}
          </Box>

          {/* Right: Buttons */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="outlined"
              sx={{
                color: "white",
                backgroundColor: "#39B75D",
                opacity: 0.8,
                border: "none",
                borderRadius: "50px",
                "&:hover": {
                  backgroundColor: "#39B75D",
                  opacity: 1,
                },
              }}
              onClick={handleOpenLoginModal} // Open the modal
            >
              Log In
            </Button>
          </Box>
        </Toolbar>
      </Container>

      {/* Login Modal */}
      <LoginModal open={openLoginModal} handleClose={handleCloseLoginModal} />
    </AppBar>
  );
};

export default Navbar;