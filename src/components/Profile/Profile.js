import React, { useEffect, useState } from 'react';
import { Avatar, Box, Typography, Grid, Card, CardContent, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

const ProfilePage = () => {
    const [user, setUser] = useState(null);

    // Demo data for balance and transactions
    const demoBalance = {
        total: 500.0,
        available: 300.0,
        pending: 200.0,
    };

    const demoTransactions = [
        { date: '2024-11-01', description: 'Shopping Cashback', amount: 50, status: 'Completed' },
        { date: '2024-11-05', description: 'Referral Bonus', amount: 25, status: 'Pending' },
        { date: '2024-11-10', description: 'Bank Transfer', amount: -100, status: 'Completed' },
    ];

    // Retrieve user data from localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem('userInfo');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // If user data is not available, show a loading or fallback message
    if (!user) {
        return (
            <Box sx={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
                <Typography variant="h5">Loading your profile...</Typography>
            </Box>
        );
    }

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
                    src={user.profilePicture || 'https://via.placeholder.com/80'}
                    alt={user.name}
                    sx={{ width: 80, height: 80, marginRight: '20px' }}
                />
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                        {user.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#777' }}>
                        {user.email}
                    </Typography>
                </Box>
            </Box>

            {/* Balance Overview Section */}
            <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ color: '#4caf50', fontWeight: 'bold' }}>
                                Total Balance
                            </Typography>
                            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                ${demoBalance.total.toFixed(2)}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ color: '#2196f3', fontWeight: 'bold' }}>
                                Available Balance
                            </Typography>
                            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                ${demoBalance.available.toFixed(2)}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ color: '#ff9800', fontWeight: 'bold' }}>
                                Pending Balance
                            </Typography>
                            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                ${demoBalance.pending.toFixed(2)}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Transaction History Section */}
            <Box sx={{ marginTop: '30px' }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '20px' }}>
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
                        <TableRow
                            sx={{
                                backgroundColor: '#39B75D', // Custom header background color
                            }}
                        >
                            <TableCell sx={{ fontWeight: 'bold', color: '#fff' }}>Date</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: '#fff' }}>Description</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: '#fff' }}>Amount</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: '#fff' }}>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {demoTransactions.map((transaction, index) => (
                            <TableRow
                                key={index}
                                sx={{
                                    '&:nth-of-type(odd)': {
                                        backgroundColor: '#f9f9f9',
                                    },
                                    '&:hover': {
                                        backgroundColor: '#f0f0f0',
                                    },
                                }}
                            >
                                <TableCell>{transaction.date}</TableCell>
                                <TableCell>{transaction.description}</TableCell>
                                <TableCell
                                    sx={{
                                        color: transaction.amount >= 0 ? '#4caf50' : '#f44336',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    ${transaction.amount.toFixed(2)}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        color: transaction.status === 'Completed' ? '#4caf50' : '#ff9800',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    {transaction.status}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Box>
        </Box>
    );
};

export default ProfilePage;
