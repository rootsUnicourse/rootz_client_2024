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
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  Divider,
  Badge
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { useAuth } from "../../AuthContext";
import { useLoginModal } from "../../LoginModalContext";
import logo from "../../Assets/Images/Rootz_logo.png";
import LoginModal from "../LoginModal/LoginModal";
import { fetchShopsBySearch } from "../../API/index";
import SearchResultItem from "../SearchResultItem/SearchResultItem";
import Confetti from "react-confetti";
import AccountCircle from "@mui/icons-material/AccountCircle";

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md")); // Adjust breakpoint as needed

  const { isLoggedIn, login, logout } = useAuth();
  const { openLoginModal, handleOpenLoginModal, handleCloseLoginModal } =
    useLoginModal();
  const [user, setUser] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

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
    setShowNotification(true);
  };

  const handleLogout = () => {
    logout(); // Update context
    setDropdownOpen(false); // Close dropdown
    navigate("/"); // Redirect to home
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev); // Toggle dropdown visibility
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Mobile drawer content
  const drawer = (
    <Box
      sx={{
        width: 280,
        display: "flex",
        flexDirection: "column",
        textAlign: "center",
        backgroundColor: "white",
        height: "100%",
      }}
    >
      {/* Logo */}
      <Link to="/" style={{ textDecoration: "none", marginBottom: "20px" }}>
        <img
          src={logo}
          alt="Logo"
          style={{ width: "150px", margin: "20px auto" }}
        />
      </Link>

      {/* Search Bar */}
      <Box sx={{ padding: "10px 20px", position: "relative" }}>
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
                    width: "35px", // Set width
                    height: "35px", // Set height
                    padding: "15px", // Adjust padding for inner spacing
                    "&:hover": {
                      backgroundColor: "#2d9a4c",
                    },
                    marginRight: -1.5,
                  }}
                >
                  <SearchIcon sx={{ color: "white", fontSize: "18px" }} /> {/* Adjust icon size */}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            backgroundColor: "#ffffff",
            borderRadius: "20px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "20px",
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

        {/* Search Results */}
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

      <Divider sx={{ marginBottom: "10px" }} />

      {/* User Menu */}
      <List>
        {isLoggedIn && (
          <ListItem
            button="true"
            component={Link}
            to="/profile"
            onClick={() => setMobileOpen(false)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              backgroundColor: "#A8CD89",
              color: 'white',
              borderBottom: '1px solid white',
            }}
          >
            <Avatar
              src={user?.profilePicture}
              alt={user?.name}
              sx={{ width: 40, height: 40 }}
            />
            <Typography>
              Profile
            </Typography>
          </ListItem>
        )}
        {isLoggedIn && (<ListItem button="true" onClick={() => setMobileOpen(false)} component={Link} to="/favorite-shops" sx={{ backgroundColor: "#A8CD89", color: 'white', fontWeight: "bold", borderBottom: '1px solid white' }}>
          <ListItemText primary="Favorite Shops" />
        </ListItem>)}
        {isLoggedIn && (
          <ListItem
            button="true"
            onClick={() => {
              handleLogout();
              setMobileOpen(false);
            }}
            variant="body1"
            sx={{ backgroundColor: "#A8CD89", color: 'white', borderBottom: '1px solid white' }}>
            <ListItemText primary="Logout" />
          </ListItem>
        )}
        {!isLoggedIn && (
          <ListItem
            variant="body1"
            button="true"
            onClick={() => {
              handleOpenLoginModal();
              setMobileOpen(false);
            }}
            sx={{ backgroundColor: "#F1F1F1", fontWeight: "bold", color: "#AAAAAA" }}>
            <ListItemText primary="Log In" />
          </ListItem>
        )}
        <ListItem button="true" component={Link} onClick={() => setMobileOpen(false)} to="/" variant="body1" sx={{ backgroundColor: "#F1F1F1", fontWeight: "bold", color: "#AAAAAA" }}>
          <ListItemText primary="All Shops" />
        </ListItem>

      </List>

      {/* Favorite Shops */}
      {isLoggedIn && user?.favoriteShops?.length > 0 && (
        <>
          <Divider sx={{ margin: "10px 0" }} />
          <Typography variant="h6" sx={{ margin: "10px 20px", textAlign: "left" }}>
            Favorite Shops
          </Typography>
          <List>
            {user.favoriteShops.map((shop) => (
              <ListItem
                button
                component={Link}
                to={`/shop/${shop._id}`}
                key={shop._id}
                onClick={() => setMobileOpen(false)}
              >
                <ListItemText primary={shop.name} />
              </ListItem>
            ))}
          </List>
        </>
      )}
    </Box>
  );

  return (
    <AppBar
      position="static"
      sx={{ backgroundColor: "#fff", boxShadow: "none" }}
    >
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
                <img
                  src={logo}
                  alt="Logo"
                  style={{
                    width: isMobile ? "150px" : "310px",
                    height: isMobile ? "50px" : "100px",
                  }}
                />
              </IconButton>
            </Link>
          </Box>

          {/* Desktop Menu */}
          {!isMobile && (
            <>
              {/* Search Bar */}
              <Box
                sx={{
                  flexGrow: 0,
                  marginRight: "20px",
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
                          <SearchIcon
                            sx={{ color: "white", fontSize: "21.5px" }}
                          />
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
                      onClick={toggleDropdown}
                    />
                    {dropdownOpen && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: "60px",
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
                  <Box
                    sx={{
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
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
                        animation: showLoginPrompt
                          ? "glow 1.5s ease-in-out infinite"
                          : "none",
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
                        setShowLoginPrompt(false);
                      }}
                    >
                      Log In
                    </Button>

                    {/* Speech Bubble */}
                    {showLoginPrompt && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: "calc(100% + 10px)",
                          right: "-10px",
                          backgroundColor: "#fff",
                          padding: "10px",
                          borderRadius: "10px",
                          boxShadow: "0px 2px 4px rgba(0,0,0,0.2)",
                          "&::before": {
                            content: '""',
                            position: "absolute",
                            top: "-10px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            borderWidth: "10px",
                            borderStyle: "solid",
                            borderColor:
                              "transparent transparent #fff transparent",
                          },
                        }}
                      >
                        <Typography
                          sx={{
                            color: "black",
                            fontWeight: "bold",
                            fontSize: "12px",
                          }}
                        >
                          Log in to make money!💲
                        </Typography>
                      </Box>
                    )}
                  </Box>
                )}
              </Box>
            </>
          )}

          {/* Mobile Menu Icon */}
          {isMobile && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {isLoggedIn ? (
                <IconButton
                  component={Link}
                  to="/profile"
                  sx={{ color: "#39B75D" }}
                >
                  <Badge
                    color="error"
                    variant="dot"
                    invisible={!showNotification} // If showNotification is false, badge won't show
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    sx={{
                      "& .MuiBadge-badge": {
                        top: 4,    // Adjust these values as needed
                        right: 4,  // to move the badge closer
                      }
                    }}
                  >
                    <Avatar
                      alt={user?.name}
                      src={user?.profilePicture}
                      sx={{ width: 35, height: 35 }}
                    />
                  </Badge>
                </IconButton>
              ) : (
                <IconButton
                  sx={{ color: "#39B75D" }}
                  onClick={handleOpenLoginModal}
                >
                  <AccountCircle sx={{ fontSize: 35 }} />
                </IconButton>
              )}

              <IconButton
                aria-label="open drawer"
                edge="end"
                onClick={handleDrawerToggle}
                sx={{ marginLeft: 1 }}
              >
                <MenuIcon sx={{ fontSize: 30 }} />
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </Container>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
      >
        {drawer}
      </Drawer>

      {/* Login Modal */}
      <LoginModal
        open={openLoginModal}
        handleClose={handleCloseLoginModal}
        onLogin={handleLogin}
      />

      {showConfetti && showLoginPrompt && (
        <Confetti
          width={window.innerWidth}
          height={100}
          recycle={false}
          numberOfPieces={200}
          gravity={0.4}
          drawShape={(ctx) => {
            ctx.font = "20px Arial";
            ctx.fillText("💲", 0, 0);
          }}
        />
      )}
    </AppBar>
  );
};

export default Navbar;
