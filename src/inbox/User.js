import React, { useContext } from 'react';
import {
  Col,
  Card,
  Fade,
  Row,
  CardBody,
  CardHeader,
  CardText,
  ListGroup,
  Button,
  ListGroupItem,
} from 'reactstrap';
import gql from 'graphql-tag';
import { useApolloQuery } from 'react-apollo-hooks';

const User = ({ teamId }) => (
  <Row className="mt-4">
    <Col md="12">
      <Fade>
        <Card>
          <CardBody>
            <CardText>User data</CardText>
          </CardBody>
        </Card>
      </Fade>
    </Col>
  </Row>
);

export default User;
