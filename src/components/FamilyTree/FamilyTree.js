// src/components/FamilyTree/FamilyTree.js

import React from 'react';
import { Tree, TreeNode } from 'react-organizational-chart';
import { Avatar, Typography, Box } from '@mui/material';

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
          <Typography variant="body1" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
            {user.name}
          </Typography>
          {/* Remove email if not needed or keep it */}
          {/* <Typography variant="body2" sx={{ color: '#777', textAlign: 'center' }}>
            {user.email}
          </Typography> */}
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
            <Typography variant="body1" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
              {userData.name}
            </Typography>
            {/* Remove email if not needed or keep it */}
            {/* <Typography variant="body2" sx={{ color: '#777', textAlign: 'center' }}>
              {userData.email}
            </Typography> */}
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
