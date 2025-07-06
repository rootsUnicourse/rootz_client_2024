// src/components/FamilyTree/FamilyTree.js

import React, { useRef, useEffect, useState } from 'react';
import { Tree, TreeNode } from 'react-organizational-chart';
import { 
  Avatar, 
  Typography, 
  Box, 
  useMediaQuery, 
  useTheme,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Divider,
  Chip,
  Card,
  CardContent
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import GroupIcon from '@mui/icons-material/Group';

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
const TreeNodeComponent = ({ user, onNodeClick, userData, getEarningsFromUser }) => {
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

          {/* Show how much YOU earn from this user */}
          {(() => {
            const earningsFromUser = getEarningsFromUser(user, userData);
            if (earningsFromUser) {
              return (
                <Typography
                  variant="body2"
                  sx={{
                    color: user._id === userData._id ? '#9c27b0' : '#4caf50',
                    textAlign: 'center',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    '@media (max-width:600px)': {
                      fontSize: '0.7rem',
                    },
                  }}
                >
                  {user._id === userData._id 
                    ? `My Total: $${formatAmount(earningsFromUser)}`
                    : `Earnings: $${formatAmount(earningsFromUser)}`
                  }
                </Typography>
              );
            }
            return null;
          })()}
        </Box>
      }
    >
      {user.children &&
        user.children.map((child) => (
          <TreeNodeComponent 
            key={child._id} 
            user={child} 
            onNodeClick={onNodeClick} 
            userData={userData}
            getEarningsFromUser={getEarningsFromUser}
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
  const [selectedUser, setSelectedUser] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Debug: Log the userData structure
  useEffect(() => {
    console.log('FamilyTree userData:', userData);
    if (userData.children) {
      userData.children.forEach((child, index) => {
        console.log(`Child ${index}:`, {
          name: child.name,
          amountEarnedFromChild: child.amountEarnedFromChild,
          _id: child._id
        });
      });
    }
  }, [userData]);

  // Function to calculate how much you earn from a specific user
  const getEarningsFromUser = (targetUser, currentUser) => {
    // If it's the current user, show their total earnings
    if (targetUser._id === currentUser._id) {
      return currentUser.wallet ? currentUser.wallet.moneyEarned : null;
    }
    
    // For descendants, use the amountEarnedFromChild field which represents
    // how much the current user earns from this descendant
    if (targetUser.amountEarnedFromChild) {
      // Check if it's a Decimal128 object
      if (targetUser.amountEarnedFromChild.$numberDecimal) {
        const amount = parseFloat(targetUser.amountEarnedFromChild.$numberDecimal);
        return amount > 0 ? targetUser.amountEarnedFromChild : null;
      }
      // Check if it's a regular number
      else if (typeof targetUser.amountEarnedFromChild === 'number') {
        return targetUser.amountEarnedFromChild > 0 ? targetUser.amountEarnedFromChild : null;
      }
      // Check if it's a string representation
      else if (typeof targetUser.amountEarnedFromChild === 'string') {
        const amount = parseFloat(targetUser.amountEarnedFromChild);
        return amount > 0 ? amount : null;
      }
    }
    
    // If no earnings data available or amount is 0, return null (don't show anything)
    return null;
  };

  // Function to determine generation level and relationship
  const getGenerationInfo = (user, currentUser, level = 0) => {
    if (user._id === currentUser._id) {
      return { level: 0, relationship: 'You' };
    }
    
    // Check if user is a direct child
    if (currentUser.children && currentUser.children.some(child => child._id === user._id)) {
      return { level: 1, relationship: 'Son' };
    }
    
    // Recursively check deeper levels
    if (currentUser.children) {
      for (const child of currentUser.children) {
        const result = getGenerationInfo(user, child, level + 1);
        if (result.level > 0) {
          const newLevel = result.level + 1;
          let relationship;
          if (newLevel === 2) {
            relationship = 'Grandson';
          } else {
            relationship = 'Family Member';
          }
          return { level: newLevel, relationship };
        }
      }
    }
    
    return { level: -1, relationship: 'Family Member' };
  };

  // Function to get section title based on generation
  const getSectionTitle = (selectedUser, userData) => {
    if (!selectedUser.children || selectedUser.children.length === 0) return '';
    
    if (selectedUser._id === userData._id) {
      // Looking at your own descendants
      return `Your Sons (${selectedUser.children.length})`;
    } else {
      // Looking at someone else's descendants
      const genInfo = getGenerationInfo(selectedUser, userData);
      if (genInfo.level === 1) {
        return `His Sons (${selectedUser.children.length})`;
      } else {
        return `His Descendants (${selectedUser.children.length})`;
      }
    }
  };
  
  // Calculate initial scale to fit tree
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && treeRef.current) {
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
  }, [userData]);
  
  // Handle node click - show dialog with user details
  const handleNodeClick = (node) => {
    setSelectedUser(node);
    setDialogOpen(true);
  };

  // Handle dialog close
  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedUser(null);
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
      
      {/* Instructions */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <Typography 
          variant="body2" 
          sx={{ 
            color: '#666',
            fontStyle: 'italic',
            textAlign: 'center' 
          }}
        >
          Click on any person to view their details
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
            transform: `scale(${scale})`,
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
                    color: '#9c27b0',
                    textAlign: 'center',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    '@media (max-width:600px)': {
                      fontSize: '0.7rem',
                    },
                  }}
                >
                  My Total: ${formatAmount(userData.wallet.moneyEarned)}
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
                  userData={userData}
                  getEarningsFromUser={getEarningsFromUser}
                />
              ))}
          </Tree>
        </Box>
      </Box>

      {/* User Details Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)',
          }
        }}
      >
        <DialogTitle sx={{ 
          position: 'relative',
          textAlign: 'center',
          backgroundColor: '#FF8B0F',
          color: 'white',
          padding: '24px',
          '&.MuiDialogTitle-root': {
            paddingBottom: '24px'
          }
        }}>
          <IconButton
            aria-label="close"
            onClick={handleDialogClose}
            sx={{
              position: 'absolute',
              right: 16,
              top: 16,
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)'
              }
            }}
          >
            <CloseIcon />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            <PersonIcon sx={{ fontSize: '1.5rem' }} />
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              User Details
            </Typography>
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ padding: '32px' }}>
          {selectedUser && (
            <Box>
              {/* User Profile Section */}
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                marginBottom: '24px',
                padding: '20px',
                backgroundColor: '#f8f9fa',
                borderRadius: '12px',
                border: '2px solid #FF8B0F20'
              }}>
                <Avatar
                  src={selectedUser.profilePicture || 'https://via.placeholder.com/120'}
                  alt={selectedUser.name}
                  sx={{
                    width: 100,
                    height: 100,
                    marginBottom: '16px',
                    border: '4px solid #FF8B0F',
                    boxShadow: '0 4px 12px rgba(255, 139, 15, 0.3)'
                  }}
                />
                <Typography variant="h5" sx={{ 
                  fontWeight: 'bold', 
                  color: '#333',
                  marginBottom: '8px'
                }}>
                  {selectedUser.name}
                </Typography>
                {selectedUser.email && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: '8px' }}>
                    <EmailIcon sx={{ color: '#666', fontSize: '1.2rem' }} />
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      {selectedUser.email}
                    </Typography>
                  </Box>
                )}
                                 <Chip
                   icon={<GroupIcon />}
                   label={(() => {
                     const genInfo = getGenerationInfo(selectedUser, userData);
                     return genInfo.relationship;
                   })()}
                   sx={{
                     backgroundColor: selectedUser._id === userData._id ? '#4caf50' : '#FF8B0F',
                     color: 'white',
                     fontWeight: 'bold'
                   }}
                 />
              </Box>

              <Divider sx={{ marginY: '24px' }} />

              {/* Earnings Section */}
              <Box sx={{ marginBottom: '24px' }}>
                <Typography variant="h6" sx={{ 
                  color: '#FF8B0F', 
                  fontWeight: 'bold', 
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <AccountBalanceWalletIcon />
                  Earnings Information
                </Typography>
                
                <Box sx={{ display: 'grid', gap: '16px' }}>
                  {/* Total Earnings */}
                  {selectedUser.totalEarnings && (
                    <Card sx={{ 
                      background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
                      color: 'white'
                    }}>
                      <CardContent sx={{ padding: '16px !important' }}>
                        <Typography variant="body2" sx={{ opacity: 0.9, marginBottom: '4px' }}>
                          Total Earnings
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                          ${formatAmount(selectedUser.totalEarnings)}
                        </Typography>
                      </CardContent>
                    </Card>
                  )}

                                    {/* Amount I Earn from This Person */}
                  {(() => {
                    const earningsFromThisPerson = getEarningsFromUser(selectedUser, userData);
                    if (earningsFromThisPerson && selectedUser._id !== userData._id) {
                      return (
                        <Card sx={{ 
                          background: 'linear-gradient(135deg, #FF8B0F 0%, #e67900 100%)',
                          color: 'white'
                        }}>
                          <CardContent sx={{ padding: '16px !important' }}>
                            <Typography variant="body2" sx={{ opacity: 0.9, marginBottom: '4px' }}>
                              Earnings from {selectedUser.name}
                            </Typography>
                            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                              ${formatAmount(earningsFromThisPerson)}
                            </Typography>
                          </CardContent>
                        </Card>
                      );
                    }
                    return null;
                  })()}

                  {/* Show user's wallet info if it's the current user */}
                  {selectedUser._id === userData._id && userData.wallet && (
                    <Card sx={{ 
                      background: 'linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)',
                      color: 'white'
                    }}>
                      <CardContent sx={{ padding: '16px !important' }}>
                        <Typography variant="body2" sx={{ opacity: 0.9, marginBottom: '4px' }}>
                          My Total Earnings
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                          ${formatAmount(userData.wallet.moneyEarned)}
                        </Typography>
                      </CardContent>
                    </Card>
                  )}
                </Box>
              </Box>

              {/* Children/Descendants Section */}
              {selectedUser.children && selectedUser.children.length > 0 && (
                <Box>
                  <Typography variant="h6" sx={{ 
                    color: '#FF8B0F', 
                    fontWeight: 'bold', 
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <GroupIcon />
                    {getSectionTitle(selectedUser, userData)}
                  </Typography>
                  
                  <Box sx={{ display: 'grid', gap: '12px' }}>
                    {selectedUser.children.map((child) => (
                      <Card key={child._id} sx={{ 
                        padding: '12px',
                        border: '1px solid #f0f0f0',
                        borderRadius: '8px',
                        '&:hover': {
                          borderColor: '#FF8B0F',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        },
                        transition: 'all 0.2s ease',
                        cursor: 'pointer'
                      }}
                      onClick={() => {
                        setSelectedUser(child);
                      }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar
                            src={child.profilePicture || 'https://via.placeholder.com/40'}
                            alt={child.name}
                            sx={{ width: 40, height: 40 }}
                          />
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                              {child.name}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#666', fontSize: '0.85rem' }}>
                              {(() => {
                                if (selectedUser._id === userData._id) {
                                  return 'Son';
                                } else {
                                  const parentGenInfo = getGenerationInfo(selectedUser, userData);
                                  if (parentGenInfo.level === 0) {
                                    return 'Son';
                                  } else if (parentGenInfo.level === 1) {
                                    return 'Grandson';
                                  } else {
                                    return 'Family Member';
                                  }
                                }
                              })()}
                            </Typography>
                            {(() => {
                              const myEarningsFromChild = getEarningsFromUser(child, userData);
                              if (myEarningsFromChild) {
                                return (
                                  <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 'bold' }}>
                                    I Earn: ${formatAmount(myEarningsFromChild)}
                                  </Typography>
                                );
                              }
                              // Fallback: show their total earnings if no earnings data for you
                              if (child.totalEarnings) {
                                return (
                                  <Typography variant="body2" sx={{ color: '#666' }}>
                                    Their Earnings: ${formatAmount(child.totalEarnings)}
                                  </Typography>
                                );
                              }
                              return null;
                            })()}
                          </Box>
                        </Box>
                      </Card>
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FamilyTree;
