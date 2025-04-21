// src/components/FamilyTree/FamilyTree.js

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Tree, TreeNode } from 'react-organizational-chart';
import { Avatar, Typography, Box, useMediaQuery, useTheme } from '@mui/material';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';

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

// New NodeIdentifier component to help with node identification
const NodeIdentifier = ({ id, onNodeFound }) => {
  const ref = useRef(null);
  
  useEffect(() => {
    if (ref.current) {
      onNodeFound(id, ref.current);
    }
  }, [id, onNodeFound]);
  
  return <span ref={ref} style={{ display: 'none' }} data-node-id={id} />;
};

// Recursive component to render each node
const TreeNodeComponent = ({ user, onNodeClick, onNodeFound }) => {
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
            cursor: 'pointer',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: 'scale(1.05)',
              boxShadow: '0px 4px 8px rgba(0,0,0,0.2)',
            },
            '@media (max-width:600px)': {
              minWidth: '80px',
              padding: '5px',
            },
          }}
          onClick={() => onNodeClick(user)}
        >
          {/* Add identifier component */}
          <NodeIdentifier id={user._id} onNodeFound={onNodeFound} />
          
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
          <TreeNodeComponent 
            key={child._id} 
            user={child} 
            onNodeClick={onNodeClick} 
            onNodeFound={onNodeFound}
          />
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
  const [focusedNode, setFocusedNode] = useState(null);
  const [nodePosition, setNodePosition] = useState({ x: 0, y: 0 });
  const [nodeElements, setNodeElements] = useState({}); // Map of node IDs to DOM elements
  
  // Collect node references
  const handleNodeFound = useCallback((id, element) => {
    setNodeElements(prev => ({ ...prev, [id]: element }));
  }, []);
  
  // Calculate initial scale to fit tree
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && treeRef.current && !focusedNode) {
        const containerWidth = containerRef.current.clientWidth;
        const treeWidth = treeRef.current.scrollWidth;
        const treeHeight = treeRef.current.scrollHeight;
        
        if (treeWidth > containerWidth) {
          const newScale = (containerWidth / treeWidth) * 0.85;
          setScale(newScale);
          
          const scaledHeight = treeHeight * newScale;
          setHeight(scaledHeight + 80);
        } else {
          setScale(1);
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
  }, [userData, focusedNode]);
  
  // Handle node click - zoom to that node
  const handleNodeClick = (node) => {
    setFocusedNode(node);
    
    // Apply zoom
    const zoomLevel = 1.5;
    setScale(zoomLevel);
    
    // Find the node element in our collected references
    const nodeElement = nodeElements[node._id];
    
    if (nodeElement && containerRef.current) {
      // Get positions
      const containerRect = containerRef.current.getBoundingClientRect();
      const nodeRect = nodeElement.parentElement.getBoundingClientRect();
      
      // Calculate center offsets
      const offsetX = (containerRect.width / 2) - (nodeRect.left - containerRect.left + nodeRect.width / 2);
      const offsetY = (containerRect.height / 2) - (nodeRect.top - containerRect.top + nodeRect.height / 2);
      
      // Apply position
      setNodePosition({ 
        x: offsetX / zoomLevel,
        y: offsetY / zoomLevel 
      });
    }
  };
  
  // Reset zoom to show full tree
  const handleResetZoom = () => {
    setFocusedNode(null);
    setNodePosition({ x: 0, y: 0 });
    setScale(1);
    
    // Recalculate auto-scale
    if (containerRef.current && treeRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      const treeWidth = treeRef.current.scrollWidth;
      
      if (treeWidth > containerWidth) {
        const newScale = (containerWidth / treeWidth) * 0.85;
        setScale(newScale);
      }
    }
  };
  
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
      
      {/* Show zoom out button when a node is focused - ENHANCED */}
      {focusedNode && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Box sx={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            backgroundColor: '#FF8B0F',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '30px',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(255, 139, 15, 0.4)',
            transition: 'all 0.2s ease',
            '&:hover': { 
              backgroundColor: '#e67900',
              transform: 'scale(1.05)',
              boxShadow: '0 4px 12px rgba(255, 139, 15, 0.6)'
            },
          }}
          onClick={handleResetZoom}
          >
            <ZoomOutMapIcon sx={{ color: 'white', fontSize: '1.3rem' }} />
            <Typography sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>
              Show Full Tree
            </Typography>
          </Box>
        </Box>
      )}
      
      {/* Updated instructions */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <Typography 
          variant="body2" 
          sx={{ 
            color: '#666',
            fontStyle: 'italic',
            textAlign: 'center' 
          }}
        >
          {focusedNode 
            ? "Click on any other person to navigate to them" 
            : "Click on any person to zoom in"}
        </Typography>
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
          height: height !== 'auto' ? height : '400px',
        }}
      >
        <Box 
          ref={treeRef}
          sx={{
            transform: `scale(${scale}) translate(${nodePosition.x}px, ${nodePosition.y}px)`,
            transformOrigin: 'center center',
            transition: 'transform 0.5s ease',
            height: 'auto',
            display: 'flex',
            justifyContent: 'center',
            width: scale < 1 ? `${100/scale}%` : 'auto',
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
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0px 4px 8px rgba(0,0,0,0.2)',
                  },
                  '@media (max-width:600px)': {
                    minWidth: '80px',
                    padding: '5px',
                  },
                }}
                onClick={() => handleNodeClick(userData)}
              >
                {/* Add identifier component */}
                <NodeIdentifier id={userData._id} onNodeFound={handleNodeFound} />
                
                <Avatar
                  src={userData.profilePicture || undefined}
                  alt={userData.name}
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
                <TreeNodeComponent 
                  key={child._id} 
                  user={child} 
                  onNodeClick={handleNodeClick} 
                  onNodeFound={handleNodeFound}
                />
              ))}
          </Tree>
        </Box>
      </Box>
    </>
  );
};

export default FamilyTree;
