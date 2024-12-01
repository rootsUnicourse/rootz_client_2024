// src/components/ProfilePage.js

import React, { useEffect, useState, useRef } from 'react';
import {
  Avatar,
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Button,
  Snackbar,
  Alert,
  Pagination
} from '@mui/material';
import Grid2 from "@mui/material/Grid2";
import {
  fetchWallet,
  fetchTransactionsByPage,
  fetchUserProfile,
} from '../../API'; // Import API calls
import FamilyTree from '../FamilyTree/FamilyTree'; // Import the updated component
import { Buffer } from 'buffer';
import Confetti from 'react-confetti';


const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const boxRef = useRef(null);
  const rowsPerPage = 10;
  // Helper function to format Decimal128 amounts
  const formatAmount = (amount) => {
    if (amount && amount.$numberDecimal) {
      return parseFloat(amount.$numberDecimal).toFixed(2);
    } else {
      return '0.00';
    }
  };

  // Fetch user profile, wallet, and transaction data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user profile with family tree
        const profileResponse = await fetchUserProfile();
        setUserData(profileResponse.data.user);

        // Fetch wallet
        const walletResponse = await fetchWallet();
        setWallet(walletResponse.data);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchPaginatedTransactions = async () => {
      try {
        const response = await fetchTransactionsByPage(currentPage, rowsPerPage);
        setTransactions(response.data.transactions);
        setTotalPages(response.data.pages);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    fetchPaginatedTransactions();
  }, [currentPage]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setSnackbarOpen(true); // Open the Snackbar
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false); // Close the Snackbar
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };


  // Fallback message while data is loading
  if (!userData || !wallet) {
    return (
      <Box
        sx={{
          padding: '20px',
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        <Typography variant="h5">Loading your profile...</Typography>
      </Box>
    );
  }

  // Encode the `user_id` using Base64
  const encodedUserId = Buffer.from(userData._id).toString('base64');
  const inviteLink = `${window.location.origin}?parentId=${encodedUserId}`;


  return (
    <Box sx={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* User Info Section */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          padding: '20px',
          backgroundColor: '#f5f5f5',
          borderRadius: '10px',
          boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
          marginBottom: '20px',
        }}
      >
        <Avatar
          src={userData.profilePicture || 'https://via.placeholder.com/80'}
          alt={userData.name}
          sx={{ width: 80, height: 80, marginRight: '20px' }}
        />
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            {userData.name}
          </Typography>
          <Typography variant="body2" sx={{ color: '#777' }}>
            {userData.email}
          </Typography>
        </Box>
      </Box>

      {/* Balance Overview Section */}
      <Grid2 container spacing={1} sx={{ marginBottom: '20px' }}>
        <Grid2 item xs={12} md={3}>
          <Card>
            <CardContent
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Typography
                variant="h5"
                sx={{ color: '#4caf50', fontWeight: 'bold' }}
              >
                Money Earned
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                ${formatAmount(wallet.moneyEarned)}
              </Typography>
            </CardContent>
          </Card>
        </Grid2>
        <Grid2 item xs={12} md={3}>
          <Card>
            <CardContent
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Typography
                variant="h5"
                sx={{ color: '#2196f3', fontWeight: 'bold' }}
              >
                Money Waiting
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                ${formatAmount(wallet.moneyWaiting)}
              </Typography>
            </CardContent>
          </Card>
        </Grid2>
        <Grid2 item xs={12} md={3}>
          <Card>
            <CardContent
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Typography
                variant="h5"
                sx={{ color: '#ff9800', fontWeight: 'bold' }}
              >
                Money Approved
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                ${formatAmount(wallet.moneyApproved)}
              </Typography>
            </CardContent>
          </Card>
        </Grid2>
        <Grid2 item xs={12} md={3}>
          <Card>
            <CardContent
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Typography
                variant="h5"
                sx={{ color: '#9c27b0', fontWeight: 'bold' }}
              >
                Cash Withdrawn
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                ${formatAmount(wallet.cashWithdrawn)}
              </Typography>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>

      {/* Invite Link Section */}
      <Box
        ref={boxRef}
        sx={{
          marginBottom: '20px',
          padding: '20px',
          background: 'linear-gradient(45deg, #ff9800, #ff5722)',
          borderRadius: '15px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          transition: 'transform 0.3s, box-shadow 0.3s',
          position: 'relative',
          '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
          },
          overflow: 'hidden',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {isHovered && boxRef.current && (
          <Confetti
            width={boxRef.current.offsetWidth}
            height={boxRef.current.offsetHeight}
            numberOfPieces={200}
            recycle={false}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              pointerEvents: 'none',
            }}
          />
        )}
        <Typography
          variant="h5"
          sx={{
            fontWeight: 'bold',
            color: '#ffffff',
            marginBottom: '10px',
            textAlign: 'center',
          }}
        >
          💸 Invite Friends & Earn Cashback!
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: '#ffffff',
            marginBottom: '15px',
            textAlign: 'center',
          }}
        >
          Share the link below! When your friend makes a purchase using our app, you earn cashback commission!
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          value={inviteLink}
          InputProps={{
            readOnly: true,
            sx: {
              backgroundColor: '#ffffff',
              borderRadius: '5px',
              '& input': { color: '#ff5722', textAlign: 'center' },
            },
          }}
        />
        <Button
          variant="contained"
          sx={{
            marginTop: '15px',
            backgroundColor: '#ffffff',
            color: '#ff5722',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            '&:hover': {
              backgroundColor: '#ff5722',
              color: '#ffffff',
            },
          }}
          onClick={handleCopyLink}
        >
          📋 Copy Invite Link
        </Button>

        {/* Snackbar for confirmation */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
            Invite link copied! Share it with your friends and start earning!
          </Alert>
        </Snackbar>
      </Box>


      {/* Family Tree Section */}
      <Box
        sx={{
          marginBottom: '20px',
          padding: '20px',
          backgroundColor: '#fff3e0',
          borderRadius: '10px',
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: 'bold', marginBottom: '10px' }}
        >
          Your Family Tree
        </Typography>
        {/* Render the Family Tree Component */}
        <FamilyTree userData={userData} />
      </Box>

      {/* Transaction History Section */}
      <Box sx={{ marginTop: '30px' }}>
        <Typography
          variant="h5"
          sx={{ fontWeight: 'bold', marginBottom: '20px' }}
        >
          Transaction History
        </Typography>
        <Table
          sx={{
            minWidth: 650,
            backgroundColor: '#fff',
            borderRadius: '10px',
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
          }}
        >
          <TableHead>
            <TableRow sx={{ backgroundColor: '#39B75D' }}>
              <TableCell sx={{ fontWeight: 'bold', color: '#fff' }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#fff' }}>Description</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#fff' }}>Amount</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#fff' }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.length > 0 ? (
              transactions.map((transaction, index) => (
                <TableRow
                  key={index}
                  sx={{
                    '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' },
                    '&:hover': { backgroundColor: '#f0f0f0' },
                  }}
                >
                  <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell
                    sx={{
                      color:
                        parseFloat(transaction.amount?.$numberDecimal) >= 0
                          ? '#4caf50'
                          : '#f44336',
                      fontWeight: 'bold',
                    }}
                  >
                    ${formatAmount(transaction.amount)}
                  </TableCell>
                  <TableCell
                    sx={{
                      color:
                        transaction.status === 'Completed'
                          ? '#4caf50'
                          : '#ff9800',
                      fontWeight: 'bold',
                    }}
                  >
                    {transaction.status}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No Transactions yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          sx={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}
        />
      </Box>
    </Box>
  );
};

export default ProfilePage;
