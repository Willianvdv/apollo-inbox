import React, { useReducer } from 'react';
import {
  Container, Fade, Row, Col,
} from 'reactstrap';
import gql from 'graphql-tag';
import { useApolloQuery } from 'react-apollo-hooks';
import { filter } from 'graphql-anywhere';
import Reports from './inbox/Reports';

const initialState = {
  teamId: null,
  reportId: 'Z2lkOi8vaGFja2Vyb25lL1JlcG9ydC80MzQxMTY=',
};
const InboxDispatch = React.createContext(null);

const actions = {
  CHANGE_REPORT: 'CHANGE_REPORT',
  CHANGE_TEAM: 'CHANGE_TEAM',
};

const Inbox = () => {
  const { data, error } = useApolloQuery(gql`
    {
      reports(first: 10) {
        ...InboxReports
      }
    }
    ${Reports.fragments.reports}
  `);

  const [state, dispatch] = useReducer((prevState, action) => {
    switch (action.type) {
      case actions.CHANGE_REPORT:
        return { ...prevState, reportId: action.payload };
      case actions.CHANGE_TEAM:
        return { ...prevState, teamId: action.payload };
      default:
        return state;
    }
  }, initialState);

  if (error) {
    return (
      <>
        <strong>Error! </strong> {error.message}
      </>
    );
  }

  return (
    <InboxDispatch.Provider value={dispatch}>
      <Container fluid>
        <Fade>
          <Row className="bg-light py-2 border-bottom border-medium">
            <span className="border-right pl-3 pr-2">Search:</span>
            <span className="border-right px-3">TODO: TeamSelector</span>
            <span className="border-right px-3">Hacker filter</span>
            <span className="border-right px-3">Substate filter</span>
          </Row>
          {state.teamId && (
            <Row>
              <span>Selected team: </span>
              {state.teamId}
              <div>
                <code>Add more team data</code>
              </div>
            </Row>
          )}
          <Row>
            <Col md="5" className="pt-4">
              <Reports reports={filter(Reports.fragments.reports, data.reports)} />
            </Col>
            <Col md="7" className="p-0 pr-4 pt-4">
              Selected report:
              {' '}
              {state.reportId}
              TODO: Report show
            </Col>
          </Row>
        </Fade>
      </Container>
    </InboxDispatch.Provider>
  );
};

export { Inbox as default, InboxDispatch, actions };
