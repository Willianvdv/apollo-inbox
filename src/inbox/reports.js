import React, { useContext } from 'react';
import { Row, Col, ListGroup } from 'reactstrap';
import gql from 'graphql-tag';
import { ChangeReportDispatch, actions } from '../Inbox';

const Reports = ({ reports }) => {
  const dispatch = useContext(ChangeReportDispatch);
  return (
    <ListGroup flush className="mr-2 pl-2">
      {reports.edges.map(({ node: report }) => (
        <span
          key={report.id}
          onClick={() => dispatch({ type: actions.CHANGE_REPORT, payload: report.id })}
          className="p-0 list-group-item list-group-item-action"
        >
          <Row className="p-0 py-3 mx-0">
            <Col>
              <img
                className="rounded-circle float-left mr-3 mt-2"
                src={report.team.profilePicture}
                style={{ height: '35px' }}
              />

              <div>
                <span className="text-dark" href="#">
                  Report Title
                </span>
                <div>
                  <small className="text-muted">
                    x
                    {' '}
                    {report.databaseId}
                    {' | '}
                    <span>
                      by
                      {report.reporter.username}
                    </span>
                    {' | '}
                    <span>
                      to
                      {report.team.name}
                    </span>
                  </small>
                </div>
              </div>
            </Col>
          </Row>
        </span>
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
