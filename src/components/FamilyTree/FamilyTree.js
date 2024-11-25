// src/components/FamilyTree/FamilyTree.js

import React from 'react';
import { Tree, TreeNode } from 'react-organizational-chart';
import { Avatar, Typography, Box } from '@mui/material';

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
            border: '1px solid #ccc',
            boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
            minWidth: '120px',
          }}
        >
          <Avatar
            src={user.profilePicture || 'https://via.placeholder.com/80'}
            alt={user.name}
            sx={{ width: 60, height: 60, marginBottom: '10px' }}
          />
          <Typography
            variant="body1"
            sx={{ fontWeight: 'bold', textAlign: 'center' }}
          >
            {user.name}
          </Typography>
          {/* Display amount earned from this user if available */}
          {user.amountEarnedFromChild && (
            <Typography
              variant="body2"
              sx={{ color: '#4caf50', textAlign: 'center' }}
            >
              Earned: ${formatAmount(user.amountEarnedFromChild)}
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
  return (
    <Box sx={{ overflow: 'auto', padding: '20px' }}>
      <Tree
        lineWidth={'2px'}
        lineColor={'#ccc'}
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
              border: '1px solid #ccc',
              boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
              minWidth: '120px',
            }}
          >
            <Avatar
              src={userData.profilePicture || 'https://via.placeholder.com/80'}
              alt={userData.name}
              sx={{ width: 60, height: 60, marginBottom: '10px' }}
            />
            <Typography
              variant="body1"
              sx={{ fontWeight: 'bold', textAlign: 'center' }}
            >
              {userData.name}
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
  );
};

export default FamilyTree;
