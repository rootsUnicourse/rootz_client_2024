import React, { useEffect, useState } from "react";
import { Container } from "@mui/material";
import Grid2 from "@mui/material/Grid2";

import ShopCard from "../ShopCard/ShopCard";
import { fetchShops, fetchLikedShops } from "../../API/index"; // Ensure correct import paths
import { useAuth } from "../../AuthContext"; // Import AuthContext to track login state

function Home() {
  const { isLoggedIn } = useAuth(); // Get login state from AuthContext
  const [shops, setShops] = useState([]);
  const [likedShops, setLikedShops] = useState([]);

  // Fetch all shops and liked shops
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all shops
        const { data: shopsData } = await fetchShops();
        setShops(shopsData);

        // Fetch liked shops
        if (isLoggedIn) {
          const { data: likedShopsData } = await fetchLikedShops();
          const likedShopIds = likedShopsData.map((shop) => shop._id);
          setLikedShops(likedShopIds);
        } else {
          setLikedShops([]); // Clear liked shops if logged out
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [isLoggedIn]); // Re-fetch when login state changes

  // Toggle the like status of a shop
  const toggleLike = (shopId) => {
    setLikedShops((prev) =>
      prev.includes(shopId)
        ? prev.filter((id) => id !== shopId) // Remove from liked
        : [...prev, shopId] // Add to liked
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 2 }}>
      {/* Grid of ShopCards */}
      <Grid2
        container
        spacing={2}
        justifyContent="center" // Centers items horizontally
        alignItems="center" // Centers items vertically (if needed)
      >
        {shops.map((shop) => (
          <Grid2
            key={shop._id}
            size={{ xs: 6, sm: 6, md: 4, lg: 3, }}
          >
            <ShopCard
              shop={shop}
              isLiked={likedShops.includes(shop._id)} // Check if the shop is liked
              toggleLike={toggleLike} // Pass the toggleLike function
            />
          </Grid2>
        ))}
      </Grid2>
    </Container>
  );

}

export default Home;
