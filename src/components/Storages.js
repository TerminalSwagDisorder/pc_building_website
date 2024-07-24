import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import '../style/style.scss';  // Ensure your CSS is properly imported

// Function for rendering storages, which takes storages as a prop from API
const RenderStorages = ({ storages }) => {
  const [loading, setLoading] = useState(true);

  // Display loading icon when the array has no data
  useEffect(() => {
    if (storages.length > 0) {
      setLoading(false);
    }
  }, [storages]);

  return (
    <Container style={{ maxWidth: "1000px", margin: "0 auto" }}>
      <div className="wrapper">
        <h1 title="Warning">Computer Storages</h1>
        <h2 title="The new revolution started">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</h2>
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
          {storages.map((storageItem) => (
            <Col xs={12} sm={6} md={3} key={storageItem.ID}>
              <Card style={{ maxWidth: "345px", marginBottom: "20px" }}>
                <Card.Img
                  variant="top"
                  src={`/product_images/${storageItem.Image}`}
                  style={{ height: "200px", objectFit: "cover" }}
                  alt={storageItem.Name}
                />
                <Card.Body>
                  <Card.Title>Name: {storageItem.Name}</Card.Title>
                  <Card.Text>
                    <div>Manufacturer: {storageItem.Manufacturer}</div>
                    <div>Price: {storageItem.Price} €</div>
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

export default RenderStorages;
