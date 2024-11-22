import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { fetchLikedShops } from '../../API/index';
import ShopCard from '../ShopCard/ShopCard';

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
            <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '20px' }}>
                Favorite Shops
            </Typography>
            <Grid container spacing={3}>
                {likedShops.length > 0 ? (
                    likedShops.map((shop) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={shop._id}>
                            <ShopCard shop={shop} isLiked={true} toggleLike={() => {}} />
                        </Grid>
                    ))
                ) : (
                    <Typography>No favorite shops found.</Typography>
                )}
            </Grid>
        </Box>
    );
};

export default FavoriteShops;
