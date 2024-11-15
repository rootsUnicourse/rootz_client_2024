import React, { useState, useRef, useEffect } from 'react';
import {
    Card,
    CardMedia,
    Typography,
    Box,
    IconButton,
    Button,
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const ShopCard = ({ company }) => {
    const [isHovered, setIsHovered] = useState(false);

    const descriptionRef = useRef(null);
    const [descriptionHeight, setDescriptionHeight] = useState(0);

    useEffect(() => {
        if (descriptionRef.current) {
            setDescriptionHeight(descriptionRef.current.scrollHeight);
        }
    }, [company.description]);

    const cardHeight = 300; // Total card height
    const bottomSectionBaseHeight = cardHeight * 0.65; // Base bottom section height

    const additionalSpaceForDescription =
        company.description && isHovered ? descriptionHeight : 0;

    const bottomSectionHeight = bottomSectionBaseHeight + additionalSpaceForDescription;

    return (
        <Card
            sx={{
                width: 250, // Card width
                height: cardHeight, // Fixed card height
                borderRadius: '10px',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                    boxShadow: '0px 4px 8px rgba(0,0,0,0.1)',
                    transform: 'translateY(-5px)',
                },
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Heart Icon */}
            <IconButton
                sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: '#fff',
                    '&:hover': { backgroundColor: '#f5f5f5' },
                    zIndex: 4,
                }}
            >
                <FavoriteBorderIcon sx={{ color: '#ff4081' }} />
            </IconButton>

            {/* Background Image */}
            <CardMedia
                component="img"
                image={company.image || 'https://via.placeholder.com/250x100'}
                alt={company.title}
                sx={{
                    width: '100%',
                    height: '35%',
                    objectFit: 'contain',
                    backgroundColor: '#f0f0f0',
                    transition: 'opacity 0.3s',
                    opacity: isHovered ? 0.7 : 1,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                }}
            />

            {/* Expanding Content */}
            <Box
                sx={{
                    position: 'absolute',
                    bottom: 10, // Ensures expanding content stays above the button
                    width: '100%',
                    height: `${bottomSectionHeight}px`,
                    backgroundColor: '#fff',
                    borderTopLeftRadius: '10px',
                    borderTopRightRadius: '10px',
                    zIndex: 3,
                    transition: 'height 0.3s ease-in-out',
                    paddingBottom: 0, // Removed extra padding at the bottom
                }}
            >
                <Box sx={{ padding: '10px', boxSizing: 'border-box' }}>
                    {/* Logo */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                        <img
                            src={company.image || 'https://via.placeholder.com/80'}
                            alt={company.title}
                            style={{
                                border: '3px solid #fff',
                                width: '120px',
                                height: '40px',
                                objectFit: 'cover',
                                borderRadius: '5px',
                            }}
                        />
                    </Box>

                    {/* Shop Name */}
                    <Typography
                        variant="h6"
                        sx={{ fontWeight: 'bold', textAlign: 'center', mt: 1 }}
                    >
                        {company.title}
                    </Typography>

                    {/* Cashback */}
                    <Typography
                        variant="body1"
                        sx={{
                            mt: 1,
                            color: '#388e3c',
                            fontWeight: 'bold',
                            textAlign: 'center',
                            marginBottom: '8px', // Reduced spacing between cashback and button
                        }}
                    >
                        {company.discount ? `${company.discount} Cashback` : 'No Discount'}
                    </Typography>

                    {/* Description */}
                    {company.description && (
                        <Box
                            sx={{
                                textAlign: 'center',
                                mt: 1,
                                transition: 'opacity 0.3s ease-in-out',
                                overflow: 'hidden',
                                opacity: isHovered ? 1 : 0,
                                height: isHovered ? 'auto' : '0px',
                            }}
                            ref={descriptionRef}
                        >
                            <Typography
                                variant="body2"
                                sx={{ color: '#555', lineHeight: 1.4, padding: '0 10px' }}
                            >
                                {company.description}
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Box>

            {/* Fixed Button */}
            <Box
                sx={{
                    position: 'absolute',
                    bottom: 5, // Reduced distance from the bottom edge
                    left: '50%',
                    transform: 'translateX(-50%)', // Center horizontally
                    zIndex: 4,
                    width: 'fit-content',
                }}
            >
                <Button
                    variant="contained"
                    color="primary"
                    sx={{
                        padding: '10px 20px', // Consistent padding for roundness
                        borderRadius: '50px', // Fully rounded button
                        backgroundColor: '#000',
                        color: '#fff',
                        fontWeight: 'bold',
                        textTransform: 'none', // Prevent uppercase text
                        '&:hover': {
                            backgroundColor: '#333',
                        },
                    }}
                    onClick={() => window.open(company.siteUrl, '_blank')}
                >
                    Go to Site
                </Button>
            </Box>
        </Card>
    );
};

export default ShopCard;
