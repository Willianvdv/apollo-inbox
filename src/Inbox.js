import React, { invariant, useReducer } from 'react';
import {
  Container, Fade, Row, Col, ListGroup,
} from 'reactstrap';
import gql from 'graphql-tag';
import { useApolloQuery } from 'react-apollo-hooks';

const initialState = { reportId: null };

const Inbox = () => {
  const { data, error } = useApolloQuery(gql`
    {
      reports(first: 10) {
        edges {
          node {
            databaseId: _id
            id
            title
            substate
            disclosed_at
            reporter {
              name
              username
              reputation
            }
            team {
              name
              handle
              profilePicture: profile_picture(size: small)
            }
          }
        }
      }
    }
  `);

  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case 'setReport':
        return { reportId: action.payload };
      default:
        return state;
    }
  }, initialState);

  invariant(true, 'siebejan');

  if (error) {
    return (
      <>
        <strong>Error! </strong> {error.message}
      </>
    );
  }

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
            Selected:
            {' '}
            {state.reportId}
            <ListGroup flush className="mr-2 pl-2">
              {data.reports.edges.map(({ node: report }) => (
                <span
                  key={report.id}
                  onClick={() => dispatch({ type: 'setReport', payload: report.id })}
                  className="p-0 list-group-item list-group-item-action"
                >
                  {report.databaseId}
                </span>
              ))}
            </ListGroup>
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
