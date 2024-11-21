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
import FavoriteIcon from '@mui/icons-material/Favorite';
import { likeCompany } from '../../API/index';

const ShopCard = ({ company, isLiked: initialIsLiked = false, toggleLike }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [hover, setHover] = useState(false);
    const [isLiked, setIsLiked] = useState(initialIsLiked); // Track liked state
    const descriptionRef = useRef(null);
    const [descriptionHeight, setDescriptionHeight] = useState(0);

    // Sync isLiked state with initialIsLiked prop
    useEffect(() => {
        setIsLiked(initialIsLiked);
    }, [initialIsLiked]);

    useEffect(() => {
        if (descriptionRef.current) {
            setDescriptionHeight(descriptionRef.current.scrollHeight);
        }
    }, [company.description]);

    const handleLike = async () => {
        try {
            await likeCompany(company._id);
            setIsLiked((prev) => !prev); // Toggle the liked state
            if (toggleLike) toggleLike(company._id); // Notify parent if needed
        } catch (error) {
            console.error('Error liking company:', error.message);
        }
    };

    const cardHeight = 300; // Total card height
    const bottomSectionBaseHeight = cardHeight * 0.55; // Base bottom section height

    const additionalSpaceForDescription =
        company.description && isHovered ? descriptionHeight : 0;

    const bottomSectionHeight = bottomSectionBaseHeight + additionalSpaceForDescription;

    return (
        <Card
            sx={{
                width: 264, // Card width
                height: cardHeight, // Fixed card height
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
                    backgroundColor: '#f5f5f5',
                    opacity: 0.9,
                    zIndex: 4,
                    '&:hover': {
                        backgroundColor: '#f5f5f5', // Keeps the background consistent
                    },
                }}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                onClick={handleLike}
            >
                {isLiked ? (
                    <FavoriteIcon
                        sx={{
                            color: '#ff4081',
                            transform: hover ? 'scale(1.1)' : 'scale(1)', // Slight grow on hover
                            transition: 'transform 0.2s ease-in-out', // Smooth animation
                        }}
                    />
                ) : (
                    <FavoriteBorderIcon
                        sx={{
                            color: '#ff4081',
                            transform: hover ? 'scale(1.1)' : 'scale(1)', // Slight grow on hover
                            transition: 'transform 0.2s ease-in-out', // Smooth animation
                        }}
                    />
                )}
            </IconButton>

            {/* Background Image */}
            <CardMedia
                component="img"
                image={company.image || 'https://via.placeholder.com/250x100'}
                alt={company.title}
                sx={{
                    width: '100%',
                    height: '40%',
                    objectFit: 'contain',
                    backgroundColor: '#CCCCCC',
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
                    bottom: 0, // Ensures expanding content stays above the button
                    width: '100%',
                    height: `${bottomSectionHeight}px`,
                    backgroundColor: '#fff',
                    zIndex: 3,
                    transition: 'height 0.3s ease-in-out',
                }}
            >
                <Box sx={{ boxSizing: 'border-box' }}>
                    {/* Logo */}
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <img
                            src={company.image || 'https://via.placeholder.com/80'}
                            alt={company.title}
                            style={{
                                border: '3px solid #fff',
                                width: '120px',
                                height: '40px',
                                objectFit: 'cover',
                            }}
                        />
                    </Box>

                    {/* Shop Name */}
                    <Typography
                        sx={{ textAlign: 'center', fontSize: '15px', color: '#4f4f4f' }}
                    >
                        {company.title}
                    </Typography>

                    {/* Cashback */}
                    <Typography
                        variant="body1"
                        sx={{
                            color: '#46C76B',
                            fontWeight: 700,
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
                    sx={{
                        padding: '10px 20px', // Consistent padding for roundness
                        borderRadius: '50px', // Fully rounded button
                        backgroundColor: 'white',
                        color: '#46c76b',
                        textTransform: 'none', // Prevent uppercase text
                        border: '1px solid #46C76B',
                        boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)', // Subtle shadow
                        '&:hover': {
                            backgroundColor: '#46C76B',
                            color: 'white',
                        },
                    }}
                    onClick={() => window.open(company.siteUrl, '_blank')}
                >
                    Shop on Site
                </Button>
            </Box>
        </Card>
    );
};

export default ShopCard;
