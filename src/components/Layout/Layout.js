import React from "react";
import Navbar from "../Navbar/Navbar";
import SubNavbar from "../SubNavbar/SubNavbar";
import { Box } from "@mui/material";
import { useAuth } from "../../AuthContext";

const Layout = ({ children }) => {
    const { isLoggedIn } = useAuth();

    return (
        <Box
            sx={{
                padding: "0",
                backgroundColor: "#f1f1f1",
            }}
        >
            <Navbar />
            {isLoggedIn && <SubNavbar />}
            <main
                style={{
                    marginTop: "50px",
                }}
            >
                {children}
            </main>
        </Box>
    );
};

export default Layout;
