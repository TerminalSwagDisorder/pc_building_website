import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { CardActionArea } from "@mui/material";

// Function for rendering motherboards, which takes motherboards as a prop from api
const RenderMotherboards = ({ motherboards }) => {
	const [loading, setLoading] = useState(true);

	// Display loading icon when the array has no data
	useEffect(() => {
	  if (motherboards.length > 0) {
		setLoading(false);
	  }
	}, [motherboards]);

	return (
		<div style={{ maxWidth: "1000px", margin: "0 auto" }}>
      <div class="wrapper">
        <h1 title="Warning">Computer Motherboards</h1>
        <p>This page showcases a comprehensive collection of MOTHERBOARDS components. Feel free to scroll through and explore the available models.</p>
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
          {motherboards.map((motherboardItem) => (
            <Grid item xs={12} sm={6} md={3} key={motherboardItem.ID}>
              <Card sx={{ maxWidth: 345 }}>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="200" // Increase height for larger images
                    image={`/product_images/${motherboardItem.Image}`}
                    alt={motherboardItem.Name}
                    sx={{
                      objectFit: "cover",
                    }}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="div">
                      Name: {motherboardItem.Name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <div>Manufacturer: {motherboardItem.Manufacturer}</div>
                      <div>Price: {motherboardItem.Price} €</div>
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

export default RenderMotherboards;
