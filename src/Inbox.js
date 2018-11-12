import React, { useReducer, Suspense } from 'react';
import {
  Container, Fade, Row, Col, Nav, Navbar,
} from 'reactstrap';
import gql from 'graphql-tag';
import { useApolloQuery } from 'react-apollo-hooks';
import { filter } from 'graphql-anywhere';
import Reports from './inbox/Reports';
import Report from './inbox/Report';
import Team from './inbox/Team';
import User from './inbox/User';
import Loading from './Loading';
import TeamSelector from './TeamSelector';

const initialState = {
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
        return { ...prevState, teamId: action.payload };
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
          <Navbar color="light" light expand="md">
            <Nav className="ml-auto" navbar>
              <TeamSelector />
            </Nav>
          </Navbar>

          {state.teamId && (
            <Suspense fallback={<Loading />}>
              <Team teamId={state.teamId} />
            </Suspense>
          )}

          <Suspense fallback={<Loading />}>
            <User />
          </Suspense>

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
