import React, { useContext } from 'react';
import {
  Row, Col, ListGroup, Button,
} from 'reactstrap';
import gql from 'graphql-tag';
import { InboxDispatch, actions } from '../Inbox';

import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { RestLink } from 'apollo-link-rest';

// setup your `RestLink` with your endpoint
const hackeroneRestLink = new RestLink({ uri: "https://ngftg30rl3.execute-api.eu-central-1.amazonaws.com/prod/" });

// setup your client
const hackeroneRestClient = new ApolloClient({
    link: hackeroneRestLink,
    cache: new InMemoryCache(),
});

/* This works! */

const restReportQueryCrappy = gql`
  query restReport($reportId: String!) {
    report @rest(type: "RestReport", path: "reports/427502") {
      databaseId: id
      substate
    }
  }
`;

hackeroneRestClient.query({ query: restReportQueryCrappy, variables: { reportId: '427502' } }).then(response => {
    console.log(response.data.report);
});

/* This doesn't work! */

const restReportQuery = gql`
  query restReport($reportId: String!) {
    report @rest(type: "RestReport", path: "reports/{args.reportId}") {
      databaseId: id
      substate
    }
  }
`;

hackeroneRestClient.query({ query: restReportQuery, variables: { reportId: '427502' } }).then(response => {
    console.log(response.data.report);
});

const Reports = ({ reports: { edges: reports } }) => {
  const dispatch = useContext(InboxDispatch);
  return (
    <ListGroup flush className="mr-2 pl-2">
      {reports.map(({ node: report }) => (
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
                alt={report.team.name}
              />

              <div>
                <span className="text-dark" href="#">
                  Fake Report Title
                </span>
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
