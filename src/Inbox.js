import React, { useReducer, Suspense } from 'react';
import {
  Container, Fade, Row, Col,
} from 'reactstrap';
import gql from 'graphql-tag';
import { useApolloQuery } from 'react-apollo-hooks';
import { filter } from 'graphql-anywhere';
import Reports from './inbox/Reports';
import Report from './inbox/Report';
import Team from './inbox/Team';
import GrayedoutTeam from './inbox/GrayedoutTeam';
import Loading from './Loading';

const initialState = {
  previousTeamId: 'Z2lkOi8vaGFja2Vyb25lL1RlYW0vMTg=',
  teamId: 'Z2lkOi8vaGFja2Vyb25lL1RlYW0vMTg=',
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
        debugger;
        return { ...prevState, previousTeamId: prevState.teamId, teamId: action.payload };
      default:
        return { ...prevState };
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
          <Suspense fallback={(
            <Suspense fallback={<Loading />}>
              <GrayedoutTeam teamId={state.previousTeamId} />
            </Suspense>
)}
          >
            <Team teamId={state.teamId} />
          </Suspense>
          )}
          <Row>
            <Col md="5" className="pt-4">
              <Reports reports={filter(Reports.fragments.reports, data.reports)} />
            </Col>
            <Col md="7" className="p-0 pr-4 pt-4">
              <Suspense fallback={<Loading />}>
                {state.reportId && <Report reportId={state.reportId} />}
              </Suspense>
            </Col>
          </Row>
        </Fade>
      </Container>
    </InboxDispatch.Provider>
  );
};

export { Inbox as default, InboxDispatch, actions };
