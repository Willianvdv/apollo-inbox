import React, { invariant } from 'react';
import {
  Container, Fade, Row, Col,
} from 'reactstrap';
import gql from 'graphql-tag';
import { useApolloQuery } from 'react-apollo-hooks';

const GET_REPORTS = gql`
  {
    reports(first: 10) {
      edges {
        node {
          databaseId: _id
          id
        }
      }
    }
  }
`;

const Inbox = () => {
  const { data, error } = useApolloQuery(GET_REPORTS);
  if (error) invariant(error, error.message);

  return (
    <Container fluid>
      <Fade>
        <Row className="bg-light py-2 border-bottom border-medium">
          <span className="border-right pl-3 pr-2">Search:</span>
          <span className="border-right px-3">TODO: TeamSelector</span>
          <span className="border-right px-3">Hacker filter</span>
          <span className="border-right px-3">Substate filter</span>
        </Row>
        <Row>
          <Col md="5" className="pt-4">
            <ul>
              {data.reports.edges.map(edge => (
                <li key={edge.node.id}>{edge.node.databaseId}</li>
              ))}
            </ul>
          </Col>
          <Col md="7" className="p-0 pr-4 pt-4">
            TODO: Report show
          </Col>
        </Row>
      </Fade>
    </Container>
  );
};

export default Inbox;
