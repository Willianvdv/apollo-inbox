import React from 'react';
import ImageFilter from 'react-image-filter';
import {
  Col,
  Card,
  Row,
  CardBody,
  CardText,
  ListGroupItem,
} from 'reactstrap';
import gql from 'graphql-tag';
import { useApolloQuery } from 'react-apollo-hooks';

const GrayedoutTeam = ({ teamId }) => {
  const {
    data: { team },
  } = useApolloQuery(
    gql`
      query GrayedoutTeam($teamId: ID!) {
        team: node(id: $teamId) {
          ... on GrayedoutTeam {
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
            <CardText>
              <h4>{team.name}</h4>
              <small className="text-muted">Some data</small>
            </CardText>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default GrayedoutTeam;
