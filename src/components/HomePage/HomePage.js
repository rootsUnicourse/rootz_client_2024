import React, { useEffect, useState } from "react";
import { Container } from "@mui/material";
import Grid2 from "@mui/material/Grid2";

import ShopCard from "../ShopCard/ShopCard";
import { fetchCompanies } from "../../API/index"; // Make sure this is the correct import path

function Home() {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const fetchCompaniesData = async () => {
      try {
        const { data } = await fetchCompanies();
        setCompanies(data);
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };

    fetchCompaniesData();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 2 }}>
      {/* Grid of ShopCards */}
      <Grid2
        container
        spacing={2}
        justifyContent="center" // Centers items horizontally
        alignItems="center" // Centers items vertically (if needed)
      >
        {companies.map((company) => (
          <Grid2 item key={company._id} xs={6} sm={6} md={3} lg={3}>
            <ShopCard company={company} />
          </Grid2>
        ))}
      </Grid2>
    </Container>
  );
}

export default Home;
