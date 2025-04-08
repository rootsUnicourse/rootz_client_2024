import React, { useEffect, useState } from "react";
import { Container, CircularProgress, Box } from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import ShopCard from "../ShopCard/ShopCard";
import { fetchShops, fetchLikedShops, trackSiteVisit } from "../../API/index";
import { useAuth } from "../../AuthContext";
import promoVideo from "../../Assets/video/main.mp4";

function Home() {
  const { isLoggedIn } = useAuth();
  const [shops, setShops] = useState([]);
  const [likedShops, setLikedShops] = useState([]);
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
        setShops(shopsData);

        if (isLoggedIn) {
          const { data: likedShopsData } = await fetchLikedShops();
          setLikedShops(likedShopsData.map((shop) => shop._id));
        } else {
          setLikedShops([]);
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
          <CircularProgress sx={{ color: "#EE7214" }} />
        </Grid2>
      ) : (
        <Grid2 container spacing={2} justifyContent="center" alignItems="center">
          {shops.map((shop) => (
            <Grid2 key={shop._id} size={{ xs: 6, sm: 6, md: 4, lg: 3 }}>
              <ShopCard shop={shop} isLiked={likedShops.includes(shop._id)} />
            </Grid2>
          ))}
        </Grid2>
      )}
    </Container>
  );
}

export default Home;
