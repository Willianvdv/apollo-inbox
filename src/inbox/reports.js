import React, { useContext } from 'react';
import {
  Row, Col, ListGroup, Button,
} from 'reactstrap';
import gql from 'graphql-tag';
import { InboxDispatch, actions } from '../Inbox';

const Reports = ({ reports: { edges: reports } }) => {
  const dispatch = useContext(InboxDispatch);
  return (
    <ListGroup flush className="mr-2 pl-2">
      {reports.map(({ node: report }) => (
        <Row key={report.id} className="p-0 py-3 p-0 list-group-item list-group-item-action">
          <Col>
            <img
              className="rounded-circle float-left mr-3 mt-2"
              src={report.team.profilePicture}
              style={{ height: '35px' }}
              alt={report.team.name}
            />

            <div>
              <a
                href="#{}"
                className="text-dark"
                onClick={() => dispatch({ type: actions.CHANGE_REPORT, payload: report.id })}
              >
                Fake Report Title
              </a>
              <div>
                <small className="text-muted">
                  {report.substate}
                  {' '}
                  {report.databaseId}
                  {' | '}
                  <span>by </span>
                  {report.reporter.username}
                  {' | '}
                  <span> to </span>
                  <a
                    href="#"
                    onClick={event => dispatch({ type: actions.CHANGE_TEAM, payload: report.team.id })
                    }
                  >
                    {report.team.name}
                  </a>
                  {' '}
                </small>
              </div>
            </div>
          </Col>
        </Row>
      ))}
    </ListGroup>
  );
};

Reports.fragments = {
  reports: gql`
    fragment InboxReports on ReportConnection {
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
            id
            name
            handle
            profilePicture: profile_picture(size: small)
          }
        }
      }
    }
  `,
};

export default Reports;
