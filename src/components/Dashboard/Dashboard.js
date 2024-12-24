import React, { useEffect, useState } from "react";
import { fetchDashboardData, fetchVisitors } from "../../API"; // Ensure correct import paths
import { Grid, Card, Typography, List, ListItem, ListItemText } from "@mui/material";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    siteVisits: 0,
    walletStats: {},
    topShops: [],
    recentTransactions: [],
    userGrowth: [],
  });
  const [visitors, setVisitors] = useState([]); // State to hold visitor data

  useEffect(() => {
    const getDashboardData = async () => {
      try {
        const { data } = await fetchDashboardData();
        setDashboardData(data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    const getVisitors = async () => {
      try {
        const { data } = await fetchVisitors(); // Fetch visitor details
        setVisitors(data);
      } catch (error) {
        console.error("Error fetching visitors:", error);
      }
    };

    getDashboardData();
    getVisitors();
  }, []);

  return (
    <Grid container spacing={2} padding={2}>
      {/* Site Visits */}
      <Grid item xs={12} md={6}>
        <Card sx={{ padding: 2 }}>
          <Typography variant="h6" gutterBottom>
            Site Visits
          </Typography>
          <Typography variant="h4">{dashboardData.siteVisits}</Typography>
          <Typography mt={2} mb={-2} variant="h6" gutterBottom>
            Visitors
          </Typography>
          <List>
            {visitors.map((visitor, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={visitor.userName || "Anonymous"}
                  secondary={`Email: ${visitor.userEmail || "Unknown"} | From: ${visitor.location || "Unknown"} at ${new Date(
                    visitor.timestamp
                  ).toLocaleString()}`}
                />
              </ListItem>
            ))}
          </List>
        </Card>
      </Grid>

      {/* Wallet Stats */}
      <Grid item xs={12} md={6}>
        <Card sx={{ padding: 2 }}>
          <Typography variant="h6" gutterBottom>
            Wallet Stats
          </Typography>
          <List>
            {Object.entries(dashboardData.walletStats).map(([key, value]) => (
              <ListItem key={key}>
                <ListItemText
                  primary={key}
                  secondary={value?.$numberDecimal || value}
                />
              </ListItem>
            ))}
          </List>
        </Card>
      </Grid>

      {/* Top Shops */}
      <Grid item xs={12}>
        <Card sx={{ padding: 2 }}>
          <Typography variant="h6" gutterBottom>
            Top Shops
          </Typography>
          <List>
            {dashboardData.topShops.map((shop) => (
              <ListItem
                key={shop._id}
                sx={{ display: "flex", alignItems: "center" }}
              >
                <img
                  src={shop.image}
                  alt={shop.title}
                  style={{ width: 150, height: 50, marginRight: 20 }}
                />
                <ListItemText
                  primary={shop.title}
                  secondary={`Clicks: ${shop.clickCount} | Discount: ${shop.discount}`}
                />
              </ListItem>
            ))}
          </List>
        </Card>
      </Grid>

      {/* Recent Transactions */}
      <Grid item xs={12}>
        <Card sx={{ padding: 2 }}>
          <Typography variant="h6" gutterBottom>
            Recent Transactions
          </Typography>
          <List>
            {dashboardData.recentTransactions.map((transaction) => (
              <ListItem key={transaction._id}>
                <ListItemText
                  primary={transaction.description}
                  secondary={`Amount: ${transaction.amount.$numberDecimal} | Date: ${new Date(
                    transaction.date
                  ).toLocaleString()}`}
                />
              </ListItem>
            ))}
          </List>
        </Card>
      </Grid>

      {/* User Growth */}
      <Grid item xs={12}>
        <Card sx={{ padding: 2 }}>
          <Typography variant="h6" gutterBottom>
            User Growth
          </Typography>
          <List>
            {dashboardData.userGrowth.map((growth) => (
              <ListItem key={growth._id}>
                <ListItemText
                  primary={`Month: ${growth._id}`}
                  secondary={`Users: ${growth.count}`}
                />
              </ListItem>
            ))}
          </List>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
