// src/components/Layout.js
import React from 'react';
import Navbar from '../Navbar/Navbar';
import { Container } from '@mui/material';

const Layout = ({ children }) => {
    return (
        <Container
            maxWidth="lg" // Sets the max width for the entire page, including Navbar
            sx={{
                padding: "0", // Ensures no extra padding around the container
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
        </Container>
    );
};

export default Layout;
