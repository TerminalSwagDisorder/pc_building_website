import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";

// Function for rendering cases, which takes cases as a prop from api
const RenderCases = ({ cases }) => {
  const [loading, setLoading] = useState(true);

  // Display loading icon when the cases array has no data
  useEffect(() => {
    if (cases.length > 0) {
      setLoading(false);
    }
  }, [cases]);

  return (
    <Container style={{ maxWidth: "1000px", margin: "0 auto" }}>
      <div className="wrapper">
        <h1 title="Warning">Computer CASEs</h1>
        <p>This page showcases a comprehensive collection of CASES components. Feel free to scroll through and explore the available models.</p>
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
          {cases.map((caseItem) => (
            <Col xs={12} sm={6} md={3} key={caseItem.ID}>
              <Card style={{ maxWidth: "345px", marginBottom: "20px" }}>
                <Card.Img variant="top" src={`/product_images/${caseItem.Image}`} style={{ height: "200px", objectFit: "cover" }} alt={caseItem.Name} />
                <Card.Body>
                  <Card.Title>Name: {caseItem.Name}</Card.Title>
                  <Card.Text>
                    <div>Manufacturer: {caseItem.Manufacturer}</div>
                    <div>Price: {caseItem.Price} €</div>
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

export default RenderCases;
