import React from "react";
import { Box, Button, Container } from "@mui/material";
import { Link, useLocation } from "react-router-dom";

const SubNavbar = () => {
    const location = useLocation();

    return (
        <Box
            sx={{
                backgroundColor: "#39B75D",
                width: "100vw", // Full-width background
                boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
            }}
        >
            {/* Inner container aligns content with the Navbar */}
            <Container
                maxWidth="lg"
                sx={{
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <Button
                    component={Link}
                    to="/profile"
                    sx={{
                        textTransform: "none",
                        fontWeight: "bold",
                        color: location.pathname === "/profile" ? "#39B75D" : "#fff",
                        fontSize: "18px",
                        backgroundColor: location.pathname === "/profile" ? "#cce7d6" : "transparent",
                        borderRadius: "0",
                        padding: "10px 20px",
                        borderLeft: "1px solid #fff",
                        "&:hover": {
                            backgroundColor: "#cce7d6",
                            color: "#39B75D",
                        },
                    }}
                >
                    Profile
                </Button>
                <Button
                    component={Link}
                    to="/favorite-shops"
                    sx={{
                        textTransform: "none",
                        fontWeight: "bold",
                        color: location.pathname === "/favorite-shops" ? "#39B75D" : "#fff",
                        fontSize: "18px",
                        backgroundColor: location.pathname === "/favorite-shops" ? "#cce7d6" : "transparent",
                        borderRadius: "0",
                        padding: "10px 20px",
                        borderRight: "1px solid #fff",
                        borderLeft: "1px solid #fff",
                        "&:hover": {
                            backgroundColor: "#cce7d6",
                            color: "#39B75D",
                        },
                    }}
                >
                    Favorite Shops
                </Button>
                <Button
                    component={Link}
                    to="/"
                    sx={{
                        textTransform: "none",
                        fontWeight: "bold",
                        color: location.pathname === "/" ? "#39B75D" : "#fff",
                        fontSize: "18px",
                        backgroundColor: location.pathname === "/" ? "#cce7d6" : "transparent",
                        borderRadius: "0",
                        borderRight: "1px solid #fff",
                        padding: "10px 20px",
                        "&:hover": {
                            backgroundColor: "#cce7d6",
                            color: "#39B75D",
                        },
                    }}
                >
                    All Shops
                </Button>
            </Container>
        </Box>
    );
};

export default SubNavbar;
