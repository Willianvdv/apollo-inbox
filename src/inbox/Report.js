import { docco } from "react-syntax-highlighter/dist/styles/hljs";
import { formatDistance } from "date-fns";
import { useQuery } from "react-apollo-hooks";
import React, { useContext } from "react";
import ReactMarkdown from "react-markdown";
import SyntaxHighlighter from "react-syntax-highlighter";
import gql from "graphql-tag";
import reactStringReplace from "react-string-replace";
import { useTitle } from "react-use";

import {
  Col,
  Card,
  Fade,
  Row,
  CardBody,
  CardHeader,
  ListGroup,
  ListGroupItem
} from "reactstrap";

import { InboxDispatch, actions } from "../Inbox";

const Code = ({ language, value }) => (
  <SyntaxHighlighter
    className="p-3 ml-4 border-left"
    language={language}
    style={docco}
  >
    {value}
  </SyntaxHighlighter>
);

const Text = ({ value, nodeKey }) => {
  return reactStringReplace(value, /\{F(\d+)\}/gi, match => (
    <span className="badge badge-danger" key={nodeKey}>
      IMAGE REF ERROR! I do not know the src of #{match}
    </span>
  ));
};

const Heading = ({ level, children }) =>
  React.createElement(`h${level}`, { className: `h${level + 2}` }, children);

const Report = ({ reportId }) => {
  const dispatch = useContext(InboxDispatch);

  const { data } = useQuery(
    gql`
      query Report($reportId: Int!) {
        report(id: $reportId) {
          id
          substate
          title
          vulnerabilityInformation: vulnerability_information
          createdAt
          disclosedAt

          team {
            id
            name
            handle
          }

          reporter {
            name
            username
            reputation
            rank
            signal
            signalPercentile
            impact
            profilePicture
          }
        }
      }
    `,
    { variables: { reportId } }
  );

  const {
    report,
    report: { reporter, team }
  } = data;

  useTitle("YAHI - " + report.title);

  return (
    <Fade>
      <Card className="border-0">
        <Row className="my-2">
          <Col md="6" className="p-2">
            <img
              className="rounded-circle ml-4 mr-2 border border-secondary float-left"
              src={reporter.profilePicture}
              style={{ height: "30px" }}
              alt={reporter.username}
            />
            <div className="mt-1">{reporter.username}</div>
          </Col>
          <Col md="6" className="text-right pt-2 pr-4">
            <div className="mt-1">
              <small className="text-muted font-weight-light">
                Reputation: {reporter.reputation}
                {" | "}
                Rank: {reporter.rank}
                {" | "}
                Signal: {reporter.signal && reporter.signal.toFixed(2)}
                {" | "}
                Impact: {reporter.impact && reporter.impact.toFixed(2)}
              </small>
            </div>
          </Col>
        </Row>
        <CardHeader className="border-top">
          <span className="h4">
            <span>{report.title}</span>
          </span>
        </CardHeader>
        <ListGroup flush>
          <ListGroupItem>
            <small className="text-muted">
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={`https://hackerone.com/reports/${report.id}`}
                className="mr-2"
              >
                <span className="fas fa-external-link-alt" />
              </a>
              {"#"}
              {report.id}
              {" - "}
              {report.substate}
              {" - "}
              <span>Reported </span>
              {formatDistance(report.created_at, new Date())}
              <span> ago to </span>
              <button
                onClick={event =>
                  dispatch({ type: actions.CHANGE_TEAM, payload: team.id })
                }
              >
                {team.name}
              </button>
              <span> and disclosed </span>
              {formatDistance(report.disclosedAt, new Date())}
              <span> ago</span>
            </small>
          </ListGroupItem>
        </ListGroup>
        <CardBody>
          <div className="vulnerability-information-html">
            <ReactMarkdown
              renderers={{ code: Code, heading: Heading, text: Text }}
              source={report.vulnerabilityInformation}
              escapeHtml
            />
          </div>
        </CardBody>
      </Card>
    </Fade>
  );
};

export default Report;
