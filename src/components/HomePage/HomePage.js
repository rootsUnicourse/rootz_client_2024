import React, { useEffect, useState } from 'react';
import { Container, Typography } from '@mui/material';
import Grid2 from '@mui/material/Grid2';

import ShopCard from '../ShopCard/ShopCard';
import { fetchCompanys } from '../../API/index'; // Make sure this is the correct import path

function Home() {
    const [companies, setCompanies] = useState([]);

    useEffect(() => {
        const fetchCompaniesData = async () => {
            try {
                const { data } = await fetchCompanys();
                setCompanies(data);
            } catch (error) {
                console.error('Error fetching companies:', error);
            }
        };

        fetchCompaniesData();
    }, []);

    return (
        <Container maxWidth="xl" sx={{ mt: 2 }}>
            {/* Title */}
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
                All Shops
            </Typography>

            {/* Grid of ShopCards */}
            <Grid2 container spacing={2}>
                {companies.map((company) => (
                    <Grid2 item key={company._id} xs={12} sm={6} md={3} lg={3}>
                        {/* Change md to 3 for 4 items per row */}
                        <ShopCard company={company} />
                    </Grid2>
                ))}
            </Grid2>
        </Container>
    );
}

export default Home;
