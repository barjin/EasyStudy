import { Container, Row, Col } from 'react-bootstrap';
import { Outlet } from "react-router-dom";

export function LoginLayout() {
  return (
    <>
    <Container>
      <Row>
          <Col />
      </Row>
      <Row>
          <Col />
          <Col xs={5}><Outlet/></Col>
          <Col />
      </Row>
    </Container>
    </>
  );
}
