import { filter } from "graphql-anywhere";
import { useApolloQuery } from "react-apollo-hooks";
import React, { useReducer, Suspense } from "react";
import gql from "graphql-tag";
import DebounceInput from "react-debounce-input";

import {
  ListGroup,
  ListGroupItem,
  Container,
  Fade,
  Row,
  Col
} from "reactstrap";

import GrayedoutTeam from "./inbox/GrayedoutTeam";
import Report from "./inbox/Report";
import Reports from "./inbox/Reports";
import Team from "./inbox/Team";
import Typist from "react-typist";

const initialState = {
  previousTeamId: "Z2lkOi8vaGFja2Vyb25lL1RlYW0vMTg=",
  teamId: null,
  reportId: 429298,
  query: ""
};
const InboxDispatch = React.createContext(null);

const actions = {
  CHANGE_REPORT: "CHANGE_REPORT",
  CHANGE_TEAM: "CHANGE_TEAM",
  CHANGE_QUERY: "CHANGE_QUERY"
};

const Loading = () => {
  return (
    <div
      className="p-3"
      style={{
        fontFamily:
          "Lucida Console,Lucida Sans Typewriter,monaco,Bitstream Vera Sans Mono,monospace"
      }}
    >
      <Typist>
        01101100 01101111 01100001 01100100 01101001 01101110 01100111 00101110
        00101110 00101110 00101110 00101110 00100000 01111001 01100101 01100001
        01101000 00100000 01110011 01110100 01101001 01101100 01101100 00100000
        01101100 01101111 01100001 01100100 01101001 01101110 01100111 00101110
        00101110 00101110 00100000 01110111 01110100 01100110 00100000 01110111
        01101000 01111001 00100000 01101001 01110011 00100000 01110100 01101000
        01101001 01110011 00100000 01110100 01101000 01101001 01101110 01100111
        00100000 01010011 01001111 00100000 01110011 01101100 01101111 01110111
        00100001 00100000 01001001 01110100 00100000 01101101 01110101 01110011
        01110100 00100000 01100010 01100101 00100000 01100010 01110010 01101111
        01101011 01100101 01101110 00100001 00100000 01001110 01101111 01110111
        00100000 01110100 01101000 01101001 01110011 00100000 01100010 01100101
        01100011 01101111 01101101 01100101 01110011 00100000 01110011 01101001
        01101100 01101100 01111001 00101100 00100000 01101110 01101111 00101101
        01101111 01101110 01100101 00100000 01101001 01110011 00100000 01100111
        01101111 01101001 01101110 01100111 00100000 01110100 01101111 00100000
        01110111 01100001 01101001 01110100 00100000 01110100 01101000 01101001
        01110011 00100000 01101100 01101111 01101110 01100111 00101110 00100000
        01001001 00100000 01100111 01101001 01110110 01100101 00100000 01110101
        01110000 00101100 00100000 01000011 00100000 01011001 01000001
      </Typist>
    </div>
  );
};

const Inbox = () => {
  const [state, dispatch] = useReducer((prevState, action) => {
    switch (action.type) {
      case actions.CHANGE_QUERY:
        return { ...prevState, query: action.payload };
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

  return (
    <InboxDispatch.Provider value={dispatch}>
      <Container fluid>
        <Fade>
          <Row>
            <Col md="4" className="p-0">
              <ListGroup flush>
                <ListGroupItem className="bg-light">
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text" id="basic-addon1">
                        <span className="fas fa-search" />
                      </span>
                    </div>
                    <DebounceInput
                      onChange={event => {
                        dispatch({
                          type: actions.CHANGE_QUERY,
                          payload: event.target.value
                        });
                      }}
                      type="text"
                      className="form-control"
                      placeholder="Search"
                      aria-label="Search"
                      aria-describedby="basic-addon1"
                    />
                  </div>
                </ListGroupItem>

                <Suspense fallback={<Loading />}>
                  <Reports query={state.query} />
                </Suspense>
              </ListGroup>
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
