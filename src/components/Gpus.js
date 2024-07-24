import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import '../style/style.scss';

// Function for rendering GPUs, which takes GPUs as a prop from API
const RenderGpus = ({ gpus }) => {
  const [loading, setLoading] = useState(true);

  // Display loading icon when the array has no data
  useEffect(() => {
    if (gpus.length > 0) {
      setLoading(false);
    }
  }, [gpus]);

  return (
    <Container style={{ maxWidth: "1000px", margin: "0 auto" }}>
      <div className="wrapper">
        <h1 title="Warning">Computer GPUs</h1>
        <p>This page showcases a comprehensive collection of GPU components. Feel free to scroll through and explore the available models.</p>
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
          {gpus.map((gpuItem) => (
            <Col xs={12} sm={6} md={3} key={gpuItem.ID}>
              <Card style={{ maxWidth: "345px", marginBottom: "20px" }}>
                <Card.Img
                  variant="top"
                  src={`/product_images/${gpuItem.Image}`}
                  style={{ height: "200px", objectFit: "cover" }}
                  alt={gpuItem.Name}
                />
                <Card.Body>
                  <Card.Title>Name: {gpuItem.Name}</Card.Title>
                  <Card.Text>
                    <div>Manufacturer: {gpuItem.Manufacturer}</div>
                    <div>Price: {gpuItem.Price} €</div>
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

export default RenderGpus;
