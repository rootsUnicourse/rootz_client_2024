// src/components/Navbar/Navbar.js

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
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { useLoginModal } from '../../LoginModalContext';
import logo from "../../Assets/Images/Rootz_logo.png";
import LoginModal from "../LoginModal/LoginModal";
import { fetchShopsBySearch } from "../../API/index";
import SearchResultItem from "../SearchResultItem/SearchResultItem";
import Confetti from "react-confetti";

const Navbar = () => {
  const { isLoggedIn, login, logout } = useAuth();
  const { openLoginModal, handleOpenLoginModal, handleCloseLoginModal } = useLoginModal();
  const [user, setUser] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Fetch user data from localStorage when isLoggedIn changes
  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, [isLoggedIn]);

  // Debounce search input
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchInput.trim() !== "") {
        const fetchData = async () => {
          try {
            const response = await fetchShopsBySearch(searchInput);
            setSearchResults(response.data);
          } catch (error) {
            console.error("Error fetching shops:", error);
            setSearchResults([]);
          }
        };
        fetchData();
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchInput]);

  // Detect parentId in URL and update showLoginPrompt
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const parentId = params.get("parentId");

    if (parentId && !isLoggedIn) {
      setShowLoginPrompt(true);
    } else {
      setShowLoginPrompt(false);
    }
  }, [location.search, isLoggedIn]);

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
                  "&::-webkit-scrollbar": {
                    display: "none",
                  },
                  "-ms-overflow-style": "none",
                  "scrollbar-width": "none",
                }}
              >
                {searchResults.map((shop, index) => (
                  <React.Fragment key={shop._id}>
                    <SearchResultItem shop={shop} />
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

          {/* Login or User Menu */}
          <Box sx={{ display: "flex", gap: 2, position: "relative" }}>
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
                      top: "60px", // Below the avatar
                      right: 0,
                      backgroundColor: "white",
                      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                      borderRadius: "8px",
                      zIndex: 10,
                      padding: "10px",
                      minWidth: "100px",
                    }}
                  >
                    <Typography
                      onClick={handleLogout}
                      sx={{
                        color: "black",
                        cursor: "pointer",
                        fontSize: "16px",
                        fontWeight: "bold",
                        padding: "8px",
                        "&:hover": {
                          backgroundColor: "#f1f1f1",
                        },
                      }}
                    >
                      Logout
                    </Typography>
                  </Box>
                )}
              </>
            ) : (
              <Box sx={{ position: "relative", display: "flex", alignItems: "center" }}>
                {/* Glowing Log In Button */}
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
                    animation: showLoginPrompt ? "glow 1.5s ease-in-out infinite" : "none",
                    "@keyframes glow": {
                      "0%": {
                        boxShadow: "0 0 5px #39B75D",
                      },
                      "50%": {
                        boxShadow: "0 0 20px #39B75D",
                      },
                      "100%": {
                        boxShadow: "0 0 5px #39B75D",
                      },
                    },
                    "&:hover": {
                      backgroundColor: "#39B75D",
                      opacity: 1,
                    },
                  }}
                  onMouseEnter={() => setShowConfetti(true)}
                  onMouseLeave={() => setShowConfetti(false)}
                  onClick={() => {
                    handleOpenLoginModal();
                    setShowLoginPrompt(false); // Hide prompt when modal opens
                  }}
                >
                  Log In
                </Button>

                {/* Speech Bubble */}
                {showLoginPrompt && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: "calc(100% + 10px)", // Positioned below the button
                      right: "-10px",
                      backgroundColor: "#fff",
                      padding: "10px",
                      borderRadius: "10px",
                      boxShadow: "0px 2px 4px rgba(0,0,0,0.2)",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: "-10px", // Arrow points upwards
                        left: "50%",
                        transform: "translateX(-50%)",
                        borderWidth: "10px",
                        borderStyle: "solid",
                        borderColor: "transparent transparent #fff transparent",
                      },
                    }}
                  >
                    <Typography sx={{ color: "black", fontWeight: "bold", fontSize: "12px" }}>
                      Log in to make money!💲
                    </Typography>
                  </Box>
                )}
              </Box>
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
      {showConfetti && showLoginPrompt &&(
        <Confetti
          width={window.innerWidth}
          height={100} // Confetti height limited to Navbar height
          recycle={false}
          numberOfPieces={200}
          gravity={0.4}
          drawShape={(ctx) => {
            ctx.font = "20px Arial";
            ctx.fillText("💲", 0, 0); // Draw money emoji at each confetti position
          }}
        />
      )}
    </AppBar>
  );
};

export default Navbar;
