import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { CardActionArea } from "@mui/material";
import '../style/style.scss';

// Function for rendering cpus, which takes cpus as a prop from api
const RenderCpus = ({ cpus }) => {
  const [loading, setLoading] = useState(true);

	// Display loading icon when the array has no data
  useEffect(() => {
    if (cpus.length > 0) {
      setLoading(false);
    }
  }, [cpus]);

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
      <div className="wrapper">
        <h1 title="Warning">Computer CPUs</h1>
        <p>This page showcases a comprehensive collection of CPUS components. Feel free to scroll through and explore the available models.</p>
        <div className="scroll-downs">
          <div className="mousey">
            <div className="scroller"></div>
          </div>
        </div>
      </div>
      {loading ? (
        <div style={{ display: "block", justifyContent: "center", alignItems: "center", minHeight: "400" }}>
          <CircularProgress color="inherit" size={100} thickness={20} />
        </div>
      ) : (
        <Grid container spacing={2} sx={{ justifyContent: "center" }}>
          {cpus.map((cpuItem) => (
            <Grid item xs={12} sm={6} md={3} key={cpuItem.ID}>
              <Card sx={{ maxWidth: 345 }}>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="200"
                    image={`/product_images/${cpuItem.Image}`}
                    alt={cpuItem.Name}
                    sx={{
                      objectFit: "cover",
                    }}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="div">
                      Name: {cpuItem.Name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <div>Manufacturer: {cpuItem.Manufacturer}</div>
                      <div>Price: {cpuItem.Price} €</div>
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

export default RenderCpus;
