import { docco } from 'react-syntax-highlighter/dist/styles/hljs';
import { formatDistance } from 'date-fns';
import { useApolloQuery } from 'react-apollo-hooks';
import React, { useContext } from 'react';
import ReactMarkdown from 'react-markdown';
import SyntaxHighlighter from 'react-syntax-highlighter';
import gql from 'graphql-tag';
import reactStringReplace from 'react-string-replace';

import {
  Col, Card, Fade, Row, CardBody, CardHeader, ListGroup, ListGroupItem,
} from 'reactstrap';

import { InboxDispatch, actions } from '../Inbox';

const Code = ({ language, value }) => (
  <SyntaxHighlighter className="p-3 ml-4 border-left" language={language} style={docco}>
    {value}
  </SyntaxHighlighter>
);

const Text = ({ value }) => {
  // Abbreviations
  let v = reactStringReplace(value, /\b(xss|rce|sqli|csp)\b/gi, match => (
    <span className="border-bottom border-info">{match}</span>
  ));

  // Replace the FXXXX references by images
  v = reactStringReplace(v, /\{F(\d+)\}/gi, match => (
    <span className="badge badge-danger">
IMAGE REF ERROR! I do not know the src of #
      {match}
    </span>
  ));

  return v;
};

const Heading = ({ level, children }) => React.createElement(`h${level}`, { className: `h${level + 2}` }, children);

const Report = ({ reportId }) => {
  const dispatch = useContext(InboxDispatch);

  const { data } = useApolloQuery(
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

  console.log(report);

  return (
    <Fade>
      <Card>
        <Row className="my-2">
          <Col md="6" className="p-2">
            {reporter.username}
            <img
              className="rounded-circle ml-4 mr-2 border border-secondary float-left"
              src={reporter.profilePicture}
              style={{ height: '20px' }}
              alt={reporter.username}
            />
          </Col>
          <Col md="6" className="text-right pt-2 pr-4">
            <span className="font-weight-light">
              Reputation:
              {' '}
              {reporter.reputation}
              {' | '}
              Rank:
              {' '}
              {reporter.rank}
              {' | '}
              Signal:
              {' '}
              {reporter.signal && reporter.signal.toFixed(2)}
              {' | '}
              Impact:
              {' '}
              {reporter.impact && reporter.impact.toFixed(2)}
            </span>
          </Col>
        </Row>
        <CardHeader className="border-top">
          {report.substate}
          <span className="pl-2 h6">
            <span>
              {report.databaseId}
              {' - '}
              {report.title}
            </span>
          </span>
        </CardHeader>
        <ListGroup flush>
          <ListGroupItem>
            <small className="text-muted">
              <span>Reported </span>
              {formatDistance(report.created_at, new Date())}
              <span> ago to </span>
              <button onClick={event => dispatch({ type: actions.CHANGE_TEAM, payload: team.id })}>
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
