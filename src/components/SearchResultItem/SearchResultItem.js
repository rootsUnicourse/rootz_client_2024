import React from "react";
import { Box, Typography } from "@mui/material";
import { useAuth } from "../../AuthContext"; // Import useAuth
import { useLoginModal } from "../../LoginModalContext"; // Import useLoginModal

const SearchResultItem = ({ shop }) => {
  const { isLoggedIn } = useAuth(); // Access authentication state
  const { handleOpenLoginModal } = useLoginModal(); // Access modal controls

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
        if (!isLoggedIn) {
          handleOpenLoginModal(); // Open login modal
        } else {
          window.open(shop.siteUrl, "_blank"); // Open shop site in a new tab
        }
      }}
    >
      {/* Shop Logo */}
      <Box sx={{ display: "flex", justifyContent: "center", marginBottom: "5px" }}>
        <img
          src={shop.image || "https://via.placeholder.com/50"}
          alt={shop.title}
          style={{ width: "100px", height: "40px", objectFit: "fit" }}
        />
      </Box>
      {/* Shop Name */}
      <Typography variant="body1" sx={{ marginBottom: "5px", color: "#666666" }}>
        {shop.title}
      </Typography>
      {/* Cashback */}
      <Typography variant="body2" sx={{ color: "#4CAF50", fontWeight: "bold" }}>
        {shop.discount ? `${shop.discount} Cashback` : "No Discount"}
      </Typography>
    </Box>
  );
};

export default SearchResultItem;
