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
import { formatDistance } from 'date-fns';
import { InboxDispatch, actions } from '../Inbox';

const Report = ({ reportId }) => {
  const dispatch = useContext(InboxDispatch);

  const { data } = useApolloQuery(
    gql`
      query Report($reportId: ID!) {
        report: node(id: $reportId) {
          ... on Report {
            databaseId: _id
            substate
            created_at
            disclosed_at

            team {
              id
              name
              handle
              profilePicture: profile_picture(size: small)
            }

            reporter {
              name
              username
              reputation
              rank
              signal
              signal_percentile
              impact
              profilePicture: profile_picture(size: small)
            }
          }
        }
      }
    `,
    { variables: { reportId } },
  );
  const {
    report,
    report: { reporter, team },
  } = data;
  return (
    <Fade>
      <Card>
        <small className="text-muted">
          <Row className="my-2">
            <Col md="7" className="p-2">
              {reporter.username}
              <img
                className="rounded-circle ml-4 mr-2 border border-secondary float-left"
                src={reporter.profilePicture}
                style={{ height: '20px' }}
                alt={reporter.username}
              />
            </Col>
            <Col md="5">
              <Row>
                <Col md="3">
                  <div className="text-center">
                    {reporter.reputation}
                    <div>Rep</div>
                  </div>
                </Col>
                <Col md="3" className="border-right">
                  <div className="text-center">
                    {reporter.rank}
                    <div>Rank</div>
                  </div>
                </Col>
                <Col md="3">
                  <div className="text-center">
                    {reporter.signal && reporter.signal.toFixed(2)}
                    <div>Signal</div>
                  </div>
                </Col>
                <Col md="3">
                  <div className="text-center">
                    {reporter.impact && reporter.impact.toFixed(2)}
                    <div>Impact</div>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </small>
        <CardHeader className="border-top">
          {report.substate}
          <span className="pl-2 h6">
            <span>Fake Report Title</span>
          </span>
        </CardHeader>
        <ListGroup flush>
          <ListGroupItem>
            <small className="text-muted">
              <span>Reported </span>
              {formatDistance(report.created_at, new Date())}
              <span> to </span>
              <a
                href="#"
                onClick={event => dispatch({ type: actions.CHANGE_TEAM, payload: team.id })}
              >
                {team.name}
              </a>
              <span> and disclosed </span>
              {formatDistance(report.disclosed_at, new Date())}
              <span> ago</span>
            </small>
          </ListGroupItem>
        </ListGroup>
        <CardBody>
          <CardText className="vulnerability-information-html">rep</CardText>
        </CardBody>
      </Card>
    </Fade>
  );
};

export default Report;
