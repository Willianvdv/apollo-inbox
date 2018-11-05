import React from 'react';
import {
  Container, Fade, Row, Col,
} from 'reactstrap';

const Inbox = () => (
  <Container fluid>
    <Fade>
      <Row className="bg-light py-2 border-bottom border-medium">
        <span className="border-right pl-3 pr-2">Search:</span>
        <span className="border-right px-3">
            TODO: TeamSelector
        </span>
        <span className="border-right px-3">Hacker filter</span>
        <span className="border-right px-3">Substate filter</span>
      </Row>
      <Row>
        <Col md="5" className="pt-4">
            TODO: Reports index
        </Col>
        <Col md="7" className="p-0 pr-4 pt-4">
            TODO: Report show
        </Col>
      </Row>
    </Fade>
  </Container>
);

export default Inbox;
