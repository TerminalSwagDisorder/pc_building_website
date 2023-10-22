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
      <div class="wrapper">
        <h1 title="Warning">Computer PSUs</h1>
        <h2 title="The new revolution started">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</h2>
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
                      <div>Price: {psuItem.Price} €</div>
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
