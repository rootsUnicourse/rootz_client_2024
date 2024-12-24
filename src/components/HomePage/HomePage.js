import React, { useEffect, useState } from "react";
import { Container, CircularProgress } from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import ShopCard from "../ShopCard/ShopCard";
import { fetchShops, fetchLikedShops, trackSiteVisit } from "../../API/index";
import { useAuth } from "../../AuthContext";

function Home() {
  const { isLoggedIn } = useAuth();
  const [shops, setShops] = useState([]);
  const [likedShops, setLikedShops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Track site visit once per session
    trackSiteVisit();
  }, []);

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
