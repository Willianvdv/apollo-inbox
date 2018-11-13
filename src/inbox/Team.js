import React from 'react';
import {
  Col,
  Card,
  Fade,
  Row,
  CardBody,
  CardText,
} from 'reactstrap';
import gql from 'graphql-tag';
import { useApolloQuery } from 'react-apollo-hooks';

const Team = ({ teamId }) => {
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
              <img src={team.profilePicture} className="float-left mr-3" alt="" />
              <h4>{team.name}</h4>
              <CardText>
                <small className="text-muted">Some data</small>
              </CardText>
            </CardBody>
          </Card>
        </Fade>
      </Col>
    </Row>
  );
};

export default Team;
