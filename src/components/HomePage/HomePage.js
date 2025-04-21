import React, { useEffect, useState } from "react";
import { Container, Box, Typography } from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import ShopCard from "../ShopCard/ShopCard";
import { fetchShops, fetchLikedShops, trackSiteVisit } from "../../API/index";
import { useAuth } from "../../AuthContext";
import promoVideo from "../../Assets/video/main.mp4";
import logo from "../../Assets/Images/Rootz_update_logo.png";

function Home() {
  const { isLoggedIn } = useAuth();
  const [shops, setShops] = useState([]);
  const [likedShopIds, setLikedShopIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const storedUser = JSON.parse(localStorage.getItem("userInfo") || "{}");
  
  useEffect(() => {
    // Track site visit once per session with userId if available
    trackSiteVisit(storedUser?._id);
  }, [storedUser?._id]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: shopsData } = await fetchShops();

        if (isLoggedIn) {
          const { data: likedShopsData } = await fetchLikedShops();
          const likedIds = likedShopsData.map((shop) => shop._id);
          setLikedShopIds(likedIds);
          
          // Sort shops to place favorites first
          const sortedShops = [...shopsData].sort((a, b) => {
            const aIsLiked = likedIds.includes(a._id);
            const bIsLiked = likedIds.includes(b._id);
            
            if (aIsLiked && !bIsLiked) return -1; // a comes first
            if (!aIsLiked && bIsLiked) return 1;  // b comes first
            return 0; // no change in order
          });
          
          setShops(sortedShops);
        } else {
          setLikedShopIds([]);
          setShops(shopsData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isLoggedIn]);

  return (
    <Container maxWidth="lg" sx={{ mt: 2 }}>
      <Box
        sx={{
          width: '100%',
          maxWidth: '700px',
          margin: '0 auto',
          mb: 4,
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: 3
        }}
      >
        <video
          width="100%"
          height="auto"
          controls
          autoPlay
          muted
          loop
          style={{ 
            display: 'block',
            maxHeight: '350px',
            objectFit: 'cover'
          }}
        >
          <source src={promoVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </Box>
      {loading ? (
        <Grid2 container justifyContent="center" alignItems="center" style={{ minHeight: "80vh" }}>
          <Box textAlign="center">
            <Box
              sx={{
                animation: "spin 2s infinite linear",
                "@keyframes spin": {
                  "0%": { transform: "scale(1)" },
                  "50%": { transform: "scale(1.1)" },
                  "100%": { transform: "scale(1)" }
                },
              }}
            >
              <img 
                src={logo} 
                alt="Rootz Logo" 
                style={{ 
                  width: "120px",
                  height: "auto"
                }} 
              />
            </Box>
            <Typography 
              variant="h5" 
              sx={{ 
                color: "#FF8B0F", 
                fontWeight: 600,
                letterSpacing: "0.5px",
                fontFamily: "'Segoe UI', Roboto, Arial, sans-serif",
                animation: "fadeInOut 1.5s infinite ease-in-out",
                "@keyframes fadeInOut": {
                  "0%": { opacity: 0.7 },
                  "50%": { opacity: 1 },
                  "100%": { opacity: 0.7 }
                }
              }}
            >
              Loading Companies...
            </Typography>
          </Box>
        </Grid2>
      ) : (
        <>
          {/* All Shops Section with Favorites First */}
          <Grid2 container spacing={2} justifyContent="flex-start" alignItems="stretch">
            {shops.map((shop) => (
              <Grid2 key={shop._id} size={{ xs: 6, sm: 6, md: 4, lg: 3 }}>
                <ShopCard shop={shop} isLiked={likedShopIds.includes(shop._id)} />
              </Grid2>
            ))}
          </Grid2>
        </>
      )}
    </Container>
  );
}

export default Home;
