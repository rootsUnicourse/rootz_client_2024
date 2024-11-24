import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { fetchLikedShops } from '../../API/index';
import ShopCard from '../ShopCard/ShopCard';
import Grid2 from "@mui/material/Grid2";

const FavoriteShops = () => {
    const [likedShops, setLikedShops] = useState([]);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const { data } = await fetchLikedShops();
                setLikedShops(data);
            } catch (error) {
                console.error('Error fetching liked shops:', error);
            }
        };

        fetchFavorites();
    }, []);

    return (
        <Box sx={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <Grid2 container spacing={3}>
                {likedShops.length > 0 ? (
                    likedShops.map((shop) => (
                        <Grid2 item xs={12} sm={6} md={4} lg={3} key={shop._id}>
                            <ShopCard shop={shop} isLiked={true} toggleLike={() => {}} />
                        </Grid2>
                    ))
                ) : (
                    <Typography>No favorite shops found.</Typography>
                )}
            </Grid2>
        </Box>
    );
};

export default FavoriteShops;
