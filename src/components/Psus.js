import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { CardActionArea } from "@mui/material";


const RenderPsus = ({ psus }) => {
	const [loading, setLoading] = useState(true);

	useEffect(() => {
	  if (psus.length > 0) {
		setLoading(false);
	  }
	}, [psus]);

	return (
		<div style={{ maxWidth: "1000px", margin: "0 auto" }}>
      <h1>Computer PSUs</h1>
      {loading ? (
        <CircularProgress /> // Display a loading indicator while loading
      ) : (
        <Grid container spacing={2} sx={{ justifyContent: "center" }}>
          {psus.map((psuItem) => (
            <Grid item xs={12} sm={6} md={3} key={psuItem.ID}>
              <Card sx={{ maxWidth: 345 }}>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="200" // Increase height for larger images
                    image={`/product_images/${psuItem.Image}`}
                    alt={psuItem.Name}
                    sx={{
                      objectFit: "cover",
                    }}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="div">
                      Name: {psuItem.Name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <div>Manufacturer: {psuItem.Manufacturer}</div>
                      <div>Price: {psuItem.Price}</div>
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

export default RenderPsus;
