import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";

// Function for rendering PSUs, which takes PSUs as a prop from API
const RenderPsus = ({ psus }) => {
  const [loading, setLoading] = useState(true);

  // Display loading icon when the array has no data
  useEffect(() => {
    if (psus.length > 0) {
      setLoading(false);
    }
  }, [psus]);

  return (
    <Container style={{ maxWidth: "1000px", margin: "0 auto" }}>
      <div className="wrapper">
        <h1 title="Warning">Computer PSUs</h1>
        <p>This page showcases a comprehensive collection of PSU components. Feel free to scroll through and explore the available models.</p>
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
          {psus.map((psuItem) => (
            <Col xs={12} sm={6} md={3} key={psuItem.ID}>
              <Card style={{ maxWidth: "345px", marginBottom: "20px" }}>
                <Card.Img
                  variant="top"
                  src={`/product_images/${psuItem.Image}`}
                  style={{ height: "200px", objectFit: "cover" }}
                  alt={psuItem.Name}
                />
                <Card.Body>
                  <Card.Title>Name: {psuItem.Name}</Card.Title>
                  <Card.Text>
                    <div>Manufacturer: {psuItem.Manufacturer}</div>
                    <div>Price: {psuItem.Price} €</div>
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

export default RenderPsus;
