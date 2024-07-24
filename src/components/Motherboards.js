import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import '../style/style.scss';

// Function for rendering motherboards, which takes motherboards as a prop from API
const RenderMotherboards = ({ motherboards }) => {
  const [loading, setLoading] = useState(true);

  // Display loading icon when the array has no data
  useEffect(() => {
    if (motherboards.length > 0) {
      setLoading(false);
    }
  }, [motherboards]);

  return (
    <Container style={{ maxWidth: "1000px", margin: "0 auto" }}>
      <div className="wrapper">
        <h1 title="Warning">Computer Motherboards</h1>
        <p>This page showcases a comprehensive collection of MOTHERBOARD components. Feel free to scroll through and explore the available models.</p>
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
          {motherboards.map((motherboardItem) => (
            <Col xs={12} sm={6} md={3} key={motherboardItem.ID}>
              <Card style={{ maxWidth: "345px", marginBottom: "20px" }}>
                <Card.Img
                  variant="top"
                  src={`/product_images/${motherboardItem.Image}`}
                  style={{ height: "200px", objectFit: "cover" }}
                  alt={motherboardItem.Name}
                />
                <Card.Body>
                  <Card.Title>Name: {motherboardItem.Name}</Card.Title>
                  <Card.Text>
                    <div>Manufacturer: {motherboardItem.Manufacturer}</div>
                    <div>Price: {motherboardItem.Price} €</div>
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

export default RenderMotherboards;
