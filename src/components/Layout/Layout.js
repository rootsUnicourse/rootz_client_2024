// src/components/Layout/Layout.jsx
import React from "react";
import Navbar from "../Navbar/Navbar";
import SubNavbar from "../SubNavbar/SubNavbar";
import Footer from "../Footer/Footer"; // Import the Footer component
import { Box, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useAuth } from "../../AuthContext";

const Layout = ({ children }) => {
    const { isLoggedIn } = useAuth();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
                padding: "0",
                backgroundColor: "#f1f1f1",
            }}
        >
            <Navbar />
            {!isMobile && isLoggedIn && <SubNavbar />}
            <main
                style={{
                    flex: 1,
                    marginTop: "50px",
                    padding: "20px", // Optional: Add padding for content
                }}
            >
                {children}
            </main>
            <Footer /> {/* Add the Footer component here */}
        </Box>
    );
};

export default Layout;
