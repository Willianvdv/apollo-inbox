import React from 'react';
import ImageFilter from 'react-image-filter';
import {
  Col,
  Card,
  Row,
  CardBody,
  CardText,
} from 'reactstrap';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo-hooks';

const GrayedoutTeam = ({ teamId }) => {
  const {
    data: { team },
  } = useQuery(
    gql`
      query GrayedoutTeam($teamId: ID!) {
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
        <Card>
          <CardBody>
            <ImageFilter image={team.profilePicture} filter="grayscale" className="float-left mr-3" />
            <h4>{team.name}</h4>
            <CardText>
              <small className="text-muted">Some data</small>
            </CardText>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default GrayedoutTeam;
