// src/components/Footer/Footer.jsx
import React from "react";
import { Box, Container, Typography,Link, IconButton } from "@mui/material";
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import Grid2 from "@mui/material/Grid2";

const Footer = () => {
    return (
        <Box
            sx={{
                backgroundColor: "#333",
                color: "#fff",
                paddingY: 6,
                marginTop: 'auto',
            }}
        >
            <Container maxWidth="lg">
                <Grid2 container spacing={4}>
                    {/* About Us */}
                    <Grid2 size={{xs: 12, sm: 6, md: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            About Us
                        </Typography>
                        <Typography variant="body2">
                            We are committed to providing the 
                            best cashback deals to our users.
                        </Typography>
                    </Grid2>

                    {/* Quick Links */}
                    <Grid2 size={{xs: 12, sm: 6, md: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Quick Links
                        </Typography>
                        <Box component="ul" sx={{ listStyle: "none", padding: 0, margin: 0 }}>
                            <li>
                                <Link href="/" sx={footerLinkStyle}>
                                    All Shops
                                </Link>
                            </li>
                            <li>
                                <Link href="/howItWorks.html" sx={footerLinkStyle}>
                                    How It Works
                                </Link>
                            </li>
                            {/* <li>
                                <Link href="/contact" sx={footerLinkStyle}>
                                    Contact Us
                                </Link>
                            </li> */}
                            <li>
                                <Link href="/Rootz Cashback Referral System - FAQ.pdf" target="_blank" sx={footerLinkStyle}>
                                    FAQ
                                </Link>
                            </li>
                        </Box>
                    </Grid2>

                    {/* Support */}
                    <Grid2 size={{xs: 12, sm: 6, md: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Support
                        </Typography>
                        <Box component="ul" sx={{ listStyle: "none", padding: 0, margin: 0 }}>
                            <li>
                                <Link href="/rootz_terms.pdf" target="_blank" sx={footerLinkStyle}>
                                    Terms of Service
                                </Link>
                            </li>
                            <li>
                                <Link href="/Privacy Policy for Rootz Cashback Referral System.pdf" target="_blank" sx={footerLinkStyle}>
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/Rootz Cookie Policy.pdf" target="_blank" sx={footerLinkStyle}>
                                    Cookie Policy
                                </Link>
                            </li>
                        </Box>
                    </Grid2>

                    {/* Follow Us */}
                    <Grid2 size={{xs: 12, sm: 6, md: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Follow Us
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                            <IconButton
                                component="a"
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={socialIconStyle}
                            >
                                <FacebookIcon />
                            </IconButton>
                            <IconButton
                                component="a"
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={socialIconStyle}
                            >
                                <TwitterIcon />
                            </IconButton>
                            <IconButton
                                component="a"
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={socialIconStyle}
                            >
                                <InstagramIcon />
                            </IconButton>
                        </Box>
                    </Grid2>
                </Grid2>

                {/* Footer Bottom */}
                <Box mt={4} textAlign="center">
                    <Typography variant="body2">
                        © {new Date().getFullYear()} rootz.website All rights reserved.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

// Define styles outside the component for better readability
const footerLinkStyle = {
    color: "#fff",
    textDecoration: "none",
    display: "block",
    marginY: 0.5,
    "&:hover": {
        textDecoration: "underline",
    },
};

const socialIconStyle = {
    color: "#fff",
    "&:hover": {
        color: "primary.main",
    },
};

export default Footer;
