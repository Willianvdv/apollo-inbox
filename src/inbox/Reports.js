import { useApolloQuery } from "react-apollo-hooks";
import React, { useContext } from "react";
import gql from "graphql-tag";

import { Row, Col } from "reactstrap";

import { InboxDispatch, actions } from "../Inbox";

const Report = ({ dispatch, report }) => (
  <span
    key={report.id}
    onClick={() =>
      dispatch({ type: actions.CHANGE_REPORT, payload: report.id })
    }
    className="p-0 list-group-item list-group-item-action"
  >
    <Row className="p-0 py-3 mx-0">
      <Col>
        <img
          className="rounded-circle float-left mr-3 mt-2"
          src={report.team.profilePicture}
          style={{ height: "35px" }}
          alt={report.team.name}
        />

        <div>
          <span className="text-dark" href="#">
            {report.title}
          </span>
          <div>
            <small className="text-muted">
              {report.substate} {report.databaseId}
              {" | "}
              <span>by </span>
              {report.reporter.username}
              {" | "}
              <span> to </span>
              <a
                href="#top"
                onClick={event =>
                  dispatch({
                    type: actions.CHANGE_TEAM,
                    payload: report.team.id
                  })
                }
              >
                {report.team.name}
              </a>{" "}
            </small>
          </div>
        </div>
      </Col>
    </Row>
  </span>
);

const Reports = ({ query }) => {
  const {
    data: { reports },
    error
  } = useApolloQuery(
    gql`
      query Reports($query: String) {
        reports(query: $query) {
          ...InboxReports
        }
      }
      ${Reports.fragments.reports}
    `,
    { variables: { query } }
  );

  if (error) {
    return (
      <>
        <strong>Error! </strong> {error.message}
      </>
    );
  }

  const dispatch = useContext(InboxDispatch);

  return (
    <>
      {reports.map(report => (
        <Report key={report.id} dispatch={dispatch} report={report} />
      ))}
    </>
  );
};

Reports.fragments = {
  reports: gql`
    fragment InboxReports on Report {
      id
      title
      substate
      disclosedAt
      reporter {
        name
        username
        reputation
      }
      team {
        id
        name
        handle
        profilePicture
      }
    }
  `
};

export default Reports;
