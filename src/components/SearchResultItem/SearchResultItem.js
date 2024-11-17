import React from "react";
import { Box, Typography } from "@mui/material";

const SearchResultItem = ({ company }) => {
  return (
    <Box
      sx={{
        padding: "10px",
        borderBottom: "1px dotted #ccc",
        cursor: "pointer",
        "&:hover": {
          backgroundColor: "#f1f1f1",
        },
        textAlign: "center",
      }}
      onClick={() => {
        // Handle click event, e.g., navigate to company page
        window.open(company.siteUrl, "_blank"); // Open company site in a new tab
      }}
    >
      {/* Shop Logo */}
      <Box sx={{ display: "flex", justifyContent: "center", marginBottom: "5px" }}>
        <img
          src={company.image || "https://via.placeholder.com/50"}
          alt={company.title}
          style={{ width: "100px", height: "40px", objectFit: "fit" }}
        />
      </Box>
      {/* Shop Name */}
      <Typography variant="body1" sx={{ marginBottom: "5px", color: "#666666" }}>
        {company.title}
      </Typography>
      {/* Refund */}
      <Typography variant="body2" sx={{ color: "#46C76B", opacity: 0.9, fontWeight: "bold" }}>
        {company.discount ? `${company.discount} Cashback` : "No Discount"}
      </Typography>
    </Box>
  );
};

export default SearchResultItem;
