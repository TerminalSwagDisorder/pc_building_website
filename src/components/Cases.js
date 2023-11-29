import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { CardActionArea } from "@mui/material";

// Function for rendering cases, which takes cases as a prop from api
const RenderCases = ({ cases }) => {
	const [loading, setLoading] = useState(true);

	// Display loading icon when the cases array has no data
	useEffect(() => {
	  if (cases.length > 0) {
		setLoading(false);
	  }
	}, [cases]);

	return (
		<div style={{ maxWidth: "1000px", margin: "0 auto" }}>
      <div class="wrapper">
        <h1 title="Warning">Computer CASEs</h1>
        <p>This page showcases a comprehensive collection of CASES components. Feel free to scroll through and explore the available models.</p>
        <div class="scroll-downs">
          <div class="mousey">
            <div class="scroller"></div>
          </div>
        </div>
      </div>
      {loading ? (
        <div style={{ display: "block", justifyContent: "center", alignItems: "center", minHeight: "400" }}>
          <CircularProgress color="inherit" size={100} thickness={20} />
        </div>
      ) : (
        <Grid container spacing={2} sx={{ justifyContent: "center" }}>
          {cases.map((caseItem) => (
            <Grid item xs={12} sm={6} md={3} key={caseItem.ID}>
              <Card sx={{ maxWidth: 345 }}>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="200" // Increase height for larger images
                    image={`/product_images/${caseItem.Image}`}
                    alt={caseItem.Name}
                    sx={{
                      objectFit: "cover",
                    }}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="div">
                      Name: {caseItem.Name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <div>Manufacturer: {caseItem.Manufacturer}</div>
                      <div>Price: {caseItem.Price} €</div>
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default RenderCases;