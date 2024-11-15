import React from 'react';
import Navbar from '../Navbar/Navbar';
import { Box } from '@mui/material';

const Layout = ({ children }) => {
    return (
        <Box
            sx={{
                padding: "0", // Ensures no extra padding
                backgroundColor: '#f1f1f1',
            }}
        >
            {/* Navbar */}
            <Navbar />

            {/* Main Content */}
            <main
                style={{
                    marginTop: "20px", // Adds space below the Navbar
                }}
            >
                {children}
            </main>
        </Box>
    );
};

export default Layout;
