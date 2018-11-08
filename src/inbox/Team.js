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

const Report = ({ teamId }) => {
  const {
    data: { team },
  } = useApolloQuery(
    gql`
      query Team($teamId: ID!) {
        team: node(id: $teamId) {
          ... on Team {
            id
            name
            handle
            profilePicture: profile_picture(size: small)
          }
        }
      }
    `,
    { variables: { teamId } },
  );

  return (
    <Row className="mt-4">
      <Col md="12">
        <Fade>
          <Card>
            <CardBody>
              <img src={team.profilePicture} className="float-left mr-3" />
              <CardText>
                <h4>{team.name}</h4>
                <small className="text-muted">Some data</small>
              </CardText>
            </CardBody>
          </Card>
        </Fade>
      </Col>
    </Row>
  );
};

export default Report;
