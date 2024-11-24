import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import { fetchWallet, fetchTransactions } from "../../API"; // Import API calls

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [wallet, setWallet] = useState(null);
    const [transactions, setTransactions] = useState([]);

    // Fetch user, wallet, and transaction data
    useEffect(() => {
        // Retrieve user data from localStorage
        const storedUser = localStorage.getItem("userInfo");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        // Fetch wallet and transactions data
        const fetchData = async () => {
            try {
                const walletResponse = await fetchWallet();
                setWallet(walletResponse.data);

                const transactionsResponse = await fetchTransactions();
                setTransactions(transactionsResponse.data);
            } catch (error) {
                console.error("Error fetching wallet or transactions:", error);
            }
        };

        fetchData();
    }, []);

    // Fallback message while data is loading
    if (!user || !wallet) {
        return (
            <Box
                sx={{
                    padding: "20px",
                    maxWidth: "1200px",
                    margin: "0 auto",
                    textAlign: "center",
                }}
            >
                <Typography variant="h5">Loading your profile...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
            {/* User Info Section */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    padding: "20px",
                    backgroundColor: "#f5f5f5",
                    borderRadius: "10px",
                    boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
                    marginBottom: "20px",
                }}
            >
                <Avatar
                    src={user.profilePicture || "https://via.placeholder.com/80"}
                    alt={user.name}
                    sx={{ width: 80, height: 80, marginRight: "20px" }}
                />
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                        {user.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#777" }}>
                        {user.email}
                    </Typography>
                </Box>
            </Box>

            {/* Balance Overview Section */}
            <Grid2 container spacing={1} >
                <Grid2 xs={12} md={3}>
                    <Card >
                        <CardContent
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Typography variant="h5" sx={{ color: "#4caf50", fontWeight: "bold" }}>
                                Money Earned
                            </Typography>
                            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                                ${wallet.moneyEarned.toFixed(2)}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid2>
                <Grid2 xs={12} md={3}>
                    <Card >
                        <CardContent
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Typography variant="h5" sx={{ color: "#2196f3", fontWeight: "bold" }}>
                                Money Waiting
                            </Typography>
                            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                                ${wallet.moneyWaiting.toFixed(2)}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid2>
                <Grid2 xs={12} md={3}>
                    <Card >
                        <CardContent
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Typography variant="h5" sx={{ color: "#ff9800", fontWeight: "bold" }}>
                                Money Approved
                            </Typography>
                            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                                ${wallet.moneyApproved.toFixed(2)}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid2>
                <Grid2 xs={12} md={3}>
                    <Card >
                        <CardContent
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Typography variant="h5" sx={{ color: "#9c27b0", fontWeight: "bold" }}>
                                Cash Withdrawn
                            </Typography>
                            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                                ${wallet.cashWithdrawn.toFixed(2)}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid2>
            </Grid2>


            {/* Transaction History Section */}
            <Box sx={{ marginTop: "30px" }}>
                <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: "20px" }}>
                    Transaction History
                </Typography>
                <Table
                    sx={{
                        minWidth: 650,
                        backgroundColor: "#fff",
                        borderRadius: "10px",
                        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                        overflow: "hidden",
                    }}
                >
                    <TableHead>
                        <TableRow
                            sx={{
                                backgroundColor: "#39B75D", // Custom header background color
                            }}
                        >
                            <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>Date</TableCell>
                            <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>Description</TableCell>
                            <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>Amount</TableCell>
                            <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {transactions.map((transaction, index) => (
                            <TableRow
                                key={index}
                                sx={{
                                    "&:nth-of-type(odd)": {
                                        backgroundColor: "#f9f9f9",
                                    },
                                    "&:hover": {
                                        backgroundColor: "#f0f0f0",
                                    },
                                }}
                            >
                                <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                                <TableCell>{transaction.description}</TableCell>
                                <TableCell
                                    sx={{
                                        color: transaction.amount >= 0 ? "#4caf50" : "#f44336",
                                        fontWeight: "bold",
                                    }}
                                >
                                    ${transaction.amount.toFixed(2)}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        color: transaction.status === "Completed" ? "#4caf50" : "#ff9800",
                                        fontWeight: "bold",
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
