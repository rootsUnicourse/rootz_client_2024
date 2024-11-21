import React, { useEffect, useState } from "react";
import { Container } from "@mui/material";
import Grid2 from "@mui/material/Grid2";

import ShopCard from "../ShopCard/ShopCard";
import { fetchCompanies, fetchLikedCompanies } from "../../API/index"; // Ensure correct import paths

function Home() {
  const [companies, setCompanies] = useState([]);
  const [likedCompanies, setLikedCompanies] = useState([]);

  // Fetch all companies and liked companies on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all companies
        const { data: companiesData } = await fetchCompanies();
        setCompanies(companiesData);

        // Fetch liked companies
        const { data: likedCompaniesData } = await fetchLikedCompanies();
        const likedCompanyIds = likedCompaniesData.map((company) => company._id);
        setLikedCompanies(likedCompanyIds);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Toggle the like status of a company
  const toggleLike = (companyId) => {
    setLikedCompanies((prev) =>
      prev.includes(companyId)
        ? prev.filter((id) => id !== companyId) // Remove from liked
        : [...prev, companyId] // Add to liked
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
        {companies.map((company) => (
          <Grid2 key={company._id} xs={6} sm={6} md={3} lg={3}>
            <ShopCard
              company={company}
              isLiked={likedCompanies.includes(company._id)} // Check if the company is liked
              toggleLike={toggleLike} // Pass the toggleLike function
            />
          </Grid2>
        ))}
      </Grid2>
    </Container>
  );
}

export default Home;
