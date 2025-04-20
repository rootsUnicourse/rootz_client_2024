// src/components/FamilyTree/FamilyTree.js

import React, { useRef, useEffect, useState } from 'react';
import { Tree, TreeNode } from 'react-organizational-chart';
import { Avatar, Typography, Box, useMediaQuery, useTheme, Button, IconButton, Slider, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import TouchAppIcon from '@mui/icons-material/TouchApp';

// Helper function to format Decimal128 amounts
const formatAmount = (amount) => {
  if (amount && amount.$numberDecimal) {
    return parseFloat(amount.$numberDecimal).toFixed(2);
  } else if (typeof amount === 'number') {
    return amount.toFixed(2);
  } else {
    return '0.00';
  }
};

// Recursive component to render each node
const TreeNodeComponent = ({ user }) => {
  return (
    <TreeNode
      label={
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '10px',
            borderRadius: '10px',
            backgroundColor: '#ffffff',
            border: '2px solid #FF8B0F',
            boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
            minWidth: '120px',
            '@media (max-width:600px)': {
              minWidth: '80px',
              padding: '5px',
            },
          }}
        >
          <Avatar
            src={user.profilePicture || 'https://via.placeholder.com/80'}
            alt={user.name}
            sx={{
              width: 60,
              height: 60,
              marginBottom: '10px',
              '@media (max-width:600px)': {
                width: 40,
                height: 40,
                marginBottom: '5px',
              },
            }}
          />
          <Typography
            variant="body1"
            sx={{
              fontWeight: 'bold',
              textAlign: 'center',
              fontSize: '1rem',
              '@media (max-width:600px)': {
                fontSize: '0.8rem',
              },
            }}
          >
            {user.name}
          </Typography>

          {/* Show total earnings if available */}
          {user.totalEarnings && (
            <Typography
              variant="body2"
              sx={{
                color: '#4caf50',
                textAlign: 'center',
                fontSize: '0.8rem',
                '@media (max-width:600px)': {
                  fontSize: '0.7rem',
                },
              }}
            >
              My Earnings: ${formatAmount(user.totalEarnings)}
            </Typography>
          )}

          {/* Display amount earned from this user if available */}
          {user.amountEarnedFromChild && (
            <Typography
              variant="body2"
              sx={{
                color: '#4caf50',
                textAlign: 'center',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                '@media (max-width:600px)': {
                  fontSize: '0.7rem',
                },
              }}
            >
              Earned (Child): ${formatAmount(user.amountEarnedFromChild)}
            </Typography>
          )}
        </Box>
      }
    >
      {user.children &&
        user.children.map((child) => (
          <TreeNodeComponent key={child._id} user={child} />
        ))}
    </TreeNode>
  );
};


const FamilyTree = ({ userData }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const containerRef = useRef(null);
  const treeRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState('auto');
  const [autoScale, setAutoScale] = useState(true);
  const [userScale, setUserScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragInfo, setDragInfo] = useState(true);
  
  // Calculate auto-scale based on container and tree size
  useEffect(() => {
    if (!autoScale) return;

    const handleResize = () => {
      if (containerRef.current && treeRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const treeWidth = treeRef.current.scrollWidth;
        const treeHeight = treeRef.current.scrollHeight;
        
        if (treeWidth > containerWidth) {
          const newScale = (containerWidth / treeWidth) * 0.85;
          setScale(newScale);
          setUserScale(newScale);
          
          const scaledHeight = treeHeight * newScale;
          setHeight(scaledHeight + 80);
        } else {
          setScale(1);
          setUserScale(1);
          setHeight('auto');
        }
      }
    };

    const timer = setTimeout(() => {
      handleResize();
    }, 500);
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, [userData, autoScale]);
  
  // Handle zoom in/out
  const handleZoomIn = () => {
    setAutoScale(false);
    const newScale = Math.min(userScale + 0.1, 2);
    setUserScale(newScale);
    setScale(newScale);
  };
  
  const handleZoomOut = () => {
    setAutoScale(false);
    const newScale = Math.max(userScale - 0.1, 0.3);
    setUserScale(newScale);
    setScale(newScale);
  };
  
  const handleResetZoom = () => {
    setAutoScale(true);
    setPosition({ x: 0, y: 0 });
    // Auto scale will be applied by the useEffect
  };
  
  const handleSliderChange = (event, newValue) => {
    setAutoScale(false);
    setUserScale(newValue);
    setScale(newValue);
  };
  
  // Mouse dragging for panning
  const handleMouseDown = (e) => {
    if (scale !== 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };
  
  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };
  
  const handleTouchStart = (e) => {
    if (scale !== 1 && e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      });
    }
  };
  
  const handleTouchMove = (e) => {
    if (isDragging && e.touches.length === 1) {
      setPosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y,
      });
      // Prevent page scrolling while dragging
      e.preventDefault();
    }
  };
  
  const handleTouchEnd = () => {
    setIsDragging(false);
  };
  
  // Hide drag info after a short time
  useEffect(() => {
    const timer = setTimeout(() => {
      setDragInfo(false);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <>
      {/* Title */}
      <Typography 
        variant="h4" 
        sx={{ 
          textAlign: 'center', 
          color: '#FF8B0F', 
          fontWeight: 'bold',
          marginBottom: isMobile ? '5px' : '10px',
          marginTop: '10px',
          fontSize: isMobile ? '1.5rem' : '2rem'
        }}
      >
        Your Family Tree
      </Typography>
      
      {/* Zoom controls */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center',
        alignItems: 'center',
        mb: 2,
        flexDirection: isMobile ? 'column' : 'row',
        gap: 1
      }}>
        {dragInfo && scale !== 1 && (
          <Box sx={{ 
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 139, 15, 0.1)',
            padding: '3px 8px',
            borderRadius: '4px',
            marginRight: 2
          }}>
            <TouchAppIcon sx={{ color: '#FF8B0F', mr: 1, fontSize: '1rem' }} />
            <Typography variant="caption" sx={{ color: '#FF8B0F' }}>
              Drag to move around
            </Typography>
          </Box>
        )}
        
        <Stack direction="row" spacing={1} alignItems="center">
          <IconButton 
            onClick={handleZoomOut}
            size="small"
            sx={{ 
              bgcolor: '#FF8B0F',
              color: 'white',
              '&:hover': { bgcolor: '#e67b00' },
              width: 30,
              height: 30
            }}
          >
            <RemoveIcon fontSize="small" />
          </IconButton>
          
          <Slider
            value={userScale}
            min={0.3}
            max={2}
            step={0.1}
            onChange={handleSliderChange}
            aria-labelledby="zoom-slider"
            sx={{ 
              width: isMobile ? 120 : 150,
              color: '#FF8B0F',
              '& .MuiSlider-thumb': {
                height: 16,
                width: 16,
              },
            }}
          />
          
          <IconButton 
            onClick={handleZoomIn}
            size="small"
            sx={{ 
              bgcolor: '#FF8B0F',
              color: 'white',
              '&:hover': { bgcolor: '#e67b00' },
              width: 30,
              height: 30
            }}
          >
            <AddIcon fontSize="small" />
          </IconButton>
          
          <IconButton 
            onClick={handleResetZoom}
            size="small"
            sx={{ 
              bgcolor: '#FF8B0F',
              color: 'white',
              '&:hover': { bgcolor: '#e67b00' },
              width: 30,
              height: 30,
              ml: 1
            }}
          >
            <RestartAltIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Box>

      <Box
        ref={containerRef}
        sx={{
          width: '100%',
          padding: '10px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
          position: 'relative',
          overflow: 'hidden',
          cursor: isDragging ? 'grabbing' : (scale !== 1 ? 'grab' : 'default'),
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Box 
          ref={treeRef}
          sx={{
            transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.2s ease',
            height: height,
            display: 'flex',
            justifyContent: 'center',
            width: scale < 1 ? `${100/scale}%` : 'auto',
            marginBottom: scale < 0.8 ? '5%' : 0,
          }}
        >
          <Tree
            lineWidth={'2px'}
            lineColor={'#FF8B0F'}
            lineBorderRadius={'10px'}
            label={
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '10px',
                  borderRadius: '10px',
                  backgroundColor: '#ffffff',
                  border: '2px solid #FF8B0F',
                  boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
                  minWidth: '120px',
                  // Responsive styles
                  '@media (max-width:600px)': {
                    minWidth: '80px',
                    padding: '5px',
                  },
                }}
              >
                <Avatar
                  src={userData.profilePicture || undefined}
                  alt={userData.name}
                  sx={{
                    width: 60,
                    height: 60,
                    marginBottom: '10px',
                    // Responsive styles
                    '@media (max-width:600px)': {
                      width: 40,
                      height: 40,
                      marginBottom: '5px',
                    },
                  }}
                />
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 'bold',
                    textAlign: 'center',
                    fontSize: '1rem',
                    // Responsive styles
                    '@media (max-width:600px)': {
                      fontSize: '0.8rem',
                    },
                  }}
                >
                  {userData.name}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#4caf50',
                    textAlign: 'center',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    '@media (max-width:600px)': {
                      fontSize: '0.7rem',
                    },
                  }}
                >
                  My Earnings: ${formatAmount(userData.wallet.moneyEarned)}
                </Typography>
              </Box>
            }
          >
            {userData.children &&
              userData.children.map((child) => (
                <TreeNodeComponent key={child._id} user={child} />
              ))}
          </Tree>
        </Box>
      </Box>
    </>
  );
};

export default FamilyTree;
