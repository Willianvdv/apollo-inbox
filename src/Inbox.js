import { filter } from "graphql-anywhere";
import { useApolloQuery } from "react-apollo-hooks";
import React, { useReducer, Suspense } from "react";
import gql from "graphql-tag";

import { Container, Fade, Row, Col } from "reactstrap";

import GrayedoutTeam from "./inbox/GrayedoutTeam";
import Loading from "./Loading";
import Report from "./inbox/Report";
import Reports from "./inbox/Reports";
import Team from "./inbox/Team";

const initialState = {
  previousTeamId: "Z2lkOi8vaGFja2Vyb25lL1RlYW0vMTg=",
  teamId: null,
  reportId: 429298
};
const InboxDispatch = React.createContext(null);

const actions = {
  CHANGE_REPORT: "CHANGE_REPORT",
  CHANGE_TEAM: "CHANGE_TEAM"
};

const Inbox = () => {
  const { data, error } = useApolloQuery(gql`
    {
      reports {
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
        return {
          ...prevState,
          previousTeamId: prevState.teamId,
          teamId: action.payload
        };
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
          {state.teamId && (
            <Suspense fallback={<Loading />}>
              <Team teamId={state.teamId} />
            </Suspense>
          )}
          <Row>
            <Col md="4" className="p-0">
              <Reports
                reports={filter(Reports.fragments.reports, data.reports)}
              />
            </Col>
            <Col md="8" className="p-0 border-left">
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
