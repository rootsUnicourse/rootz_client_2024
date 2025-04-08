// src/components/ShopCard/ShopCard.js

import React, { useState, useRef, useEffect } from 'react';
import {
  Card,
  Typography,
  Box,
  IconButton,
  Button,
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { likeShop, simulatePurchase, incrementShopClickCount } from '../../API/index';
import { useAuth } from "../../AuthContext";
import { useLoginModal } from '../../LoginModalContext'; // Import useLoginModal
import { useTheme } from '@mui/material/styles';


const ShopCard = ({ shop, isLiked: initialIsLiked = false, toggleLike }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [hover, setHover] = useState(false);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const descriptionRef = useRef(null);
  const [descriptionHeight, setDescriptionHeight] = useState(0);

  const { isLoggedIn } = useAuth();
  const { handleOpenLoginModal } = useLoginModal(); // Use LoginModalContext
  const theme = useTheme();
  // Sync isLiked state with initialIsLiked prop
  useEffect(() => {
    setIsLiked(initialIsLiked);
  }, [initialIsLiked]);

  useEffect(() => {
    if (descriptionRef.current) {
      setDescriptionHeight(descriptionRef.current.scrollHeight);
    }
  }, [shop.description]);

  const handleLike = async () => {
    if (!isLoggedIn) {
      handleOpenLoginModal(); // Open login modal
      return;
    }

    try {
      await likeShop(shop._id);
      setIsLiked((prev) => !prev); // Toggle state locally
      if (toggleLike) toggleLike(shop._id); // Notify parent if needed
    } catch (error) {
      console.error('Error liking/unliking shop:', error.message);
    }
  };

  const handlePurchase = async () => {
    if (!isLoggedIn) {
      handleOpenLoginModal(); // Open login modal if the user is not logged in
      return;
    }
  
    try {
      // Simulate purchase (e.g., for user or wallet tracking)
      await simulatePurchase(shop._id);
  
      // Increment the click count for the shop
      await incrementShopClickCount(shop._id);
  
      // Open the shop's external site in a new tab
      window.open(shop.siteUrl, '_blank');
    } catch (error) {
      console.error('Error during shop purchase or click tracking:', error.message);
      alert('An error occurred while processing your purchase. Please try again later.');
    }
  };
  

  const cardHeight = 300; // Total card height
  const bottomSectionBaseHeight = cardHeight * 0.55; // Base bottom section height

  const additionalSpaceForDescription =
    shop.description && isHovered ? descriptionHeight : 0;

  const bottomSectionHeight = bottomSectionBaseHeight + additionalSpaceForDescription;

  return (
    <Card
      sx={{
        width: 275, // Default width for larger screens
        [theme.breakpoints.down('sm')]: {
          width: '100%',
          height: 200 // Full width on mobile devices
        }, // Card width
        height: cardHeight, // Fixed card height
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.3)',
        borderRadius: '8px',
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
          
          opacity: 0.9,
          zIndex: 4,
          '&:hover': {
             backgroundColor: 'transparent'
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


      {/* Expanding Content */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 40, // Ensures expanding content stays above the button
          width: '100%',
          height: `${bottomSectionHeight}px`,
          backgroundColor: '#fff',
          zIndex: 3,
          transition: 'height 0.3s ease-in-out',
          [theme.breakpoints.down('sm')]: {
            bottom: 5,
          },
        }}
      >
        <Box sx={{ boxSizing: 'border-box' }}>
          {/* Logo */}

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              border: '3px solid #fff',
              objectFit: 'cover',
            }}
          >
            <img
              src={shop.image || 'https://via.placeholder.com/80'}
              alt={shop.title}
              style={{ width: '90%', height: '90%' }}
            />
          </Box>


          {/* Shop Name */}
          <Typography
            sx={{ textAlign: 'center', fontSize: '16px', color: '#4f4f4f' }}
          >
            {shop.title}
          </Typography>

          {/* Cashback */}
          <Typography
            variant="body1"
            sx={{
              color: '#4CAF50',
              fontWeight: 700,
              textAlign: 'center',
              marginBottom: '8px',
              fontSize: '18px', // Reduced spacing between cashback and button,
              [theme.breakpoints.down('sm')]: {
                fontSize: '12px'
              },
            }}
          >
            {shop.discount ? `${shop.discount} Cashback` : 'No Discount'}
          </Typography>

          {/* Description */}
          {shop.description && (
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
                sx={{
                  color: '#555',
                  lineHeight: 1.4,
                  padding: '0 10px',
                  [theme.breakpoints.down('sm')]: {
                    lineHeight: 1.4,
                    fontSize: '12px'
                  },
                }}
              >
                {shop.description}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* Fixed Button */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 5, // Distance from the bottom edge
          left: '50%', // Position at 50% of the parent's width
          transform: 'translateX(-50%)', // Adjust to center it horizontally
          zIndex: 4,
          width: 'fit-content',
          [theme.breakpoints.down('sm')]: {
            width: '100%', // Set full width
            left: '0', // Reset left position for full width
            transform: 'none', // No horizontal transformation needed
            textAlign: 'center', // Center the content within the box
          },
        }}
      >
        <Button
          variant="contained"
          sx={{
            padding: '10px 20px', // Consistent padding for roundness
            borderRadius: '50px', // Fully rounded button
            backgroundColor: 'white',
            color: '#FF8B0F',
            textTransform: 'none', // Prevent uppercase text
            border: '1px solid #FF8B0F',
            boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)', // Subtle shadow
            '&:hover': {
              backgroundColor: '#FF8B0F',
              color: 'white',
            },
            [theme.breakpoints.down('sm')]: {
              padding: '5px 10px',    // Smaller padding on mobile
              fontSize: '0.875rem',   // Adjust font size
              borderRadius: '30px',   // Slightly smaller border radius
            },
          }}
          onClick={handlePurchase}
        >
          Shop on Site
        </Button>
      </Box>

    </Card>
  );
};

export default ShopCard;
