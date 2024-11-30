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
import { likeShop, simulatePurchase } from '../../API/index';
import { useAuth } from "../../AuthContext";
import { useLoginModal } from '../../LoginModalContext'; // Import useLoginModal

const ShopCard = ({ shop, isLiked: initialIsLiked = false, toggleLike }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [hover, setHover] = useState(false);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const descriptionRef = useRef(null);
  const [descriptionHeight, setDescriptionHeight] = useState(0);

  const { isLoggedIn } = useAuth();
  const { handleOpenLoginModal } = useLoginModal(); // Use LoginModalContext

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
      handleOpenLoginModal(); // Open login modal
      return;
    }

    try {
      await simulatePurchase(shop._id);
      window.open(shop.siteUrl, '_blank');
    } catch (error) {
      console.error('Error simulating purchase:', error.message);
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
        width: 275, // Card width
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


      {/* Expanding Content */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 50, // Ensures expanding content stays above the button
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
              src={shop.image || 'https://via.placeholder.com/80'}
              alt={shop.title}
              style={{
                border: '3px solid #fff',
                width: '190px',
                height: '60px',
                objectFit: 'cover',
              }}
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
              fontSize: '18px' // Reduced spacing between cashback and button
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
                sx={{ color: '#555', lineHeight: 1.4, padding: '0 10px' }}
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
            color: '#4CAF50',
            textTransform: 'none', // Prevent uppercase text
            border: '1px solid #4CAF50',
            boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)', // Subtle shadow
            '&:hover': {
              backgroundColor: '#4CAF50',
              color: 'white',
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
