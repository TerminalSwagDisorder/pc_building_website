import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { CardActionArea } from "@mui/material";

const RenderMemories = ({ memories }) => {
	const [loading, setLoading] = useState(true);

	useEffect(() => {
	  if (memories.length > 0) {
		setLoading(false);
	  }
	}, [memories]);

	return (
		<div style={{ maxWidth: "1000px", margin: "0 auto" }}>
      <h1>Computer Memories</h1>
      {loading ? (
        <CircularProgress /> // Display a loading indicator while loading
      ) : (
        <Grid container spacing={2} sx={{ justifyContent: "center" }}>
          {memories.map((memorieItem) => (
            <Grid item xs={12} sm={6} md={3} key={memorieItem.ID}>
              <Card sx={{ maxWidth: 345 }}>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="200" // Increase height for larger images
                    image={`/product_images/${memorieItem.Image}`}
                    alt={memorieItem.Name}
                    sx={{
                      objectFit: "cover",
                    }}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="div">
                      Name: {memorieItem.Name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <div>Manufacturer: {memorieItem.Manufacturer}</div>
                      <div>Price: {memorieItem.Price}</div>
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

export default RenderMemories;
