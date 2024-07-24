import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";

// Function for rendering CPU coolers, which takes cpuCoolers as a prop from API
const RenderCpuCoolers = ({ cpuCoolers }) => {
  const [loading, setLoading] = useState(true);

  // Display loading icon when the array has no data
  useEffect(() => {
    if (cpuCoolers.length > 0) {
      setLoading(false);
    }
  }, [cpuCoolers]);

  return (
    <Container style={{ maxWidth: "1000px", margin: "0 auto" }}>
      <div className="wrapper">
        <h1 title="Warning">Computer CPU Coolers</h1>
        <p>
          This page showcases a comprehensive collection of CPU coolers components. Feel free to scroll through and explore the available models.
        </p>
        <div className="scroll-downs">
          <div className="mousey">
            <div className="scroller"></div>
          </div>
        </div>
      </div>
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
          <Spinner animation="border" />
        </div>
      ) : (
        <Row className="justify-content-center">
          {cpuCoolers.map((cpuCoolerItem) => (
            <Col xs={12} sm={6} md={3} key={cpuCoolerItem.ID}>
              <Card style={{ maxWidth: "345px", marginBottom: "20px" }}>
                <Card.Img
                  variant="top"
                  src={`/product_images/${cpuCoolerItem.Image}`}
                  style={{ height: "200px", objectFit: "cover" }}
                  alt={cpuCoolerItem.Name}
                />
                <Card.Body>
                  <Card.Title>Name: {cpuCoolerItem.Name}</Card.Title>
                  <Card.Text>
                    <div>Manufacturer: {cpuCoolerItem.Manufacturer}</div>
                    <div>Price: {cpuCoolerItem.Price} €</div>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default RenderCpuCoolers;
