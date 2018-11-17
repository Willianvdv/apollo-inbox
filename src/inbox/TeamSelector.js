import { useApolloQuery } from 'react-apollo-hooks';
import React, { useContext } from 'react';
import gql from 'graphql-tag';

import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Badge,
} from 'reactstrap';

import { InboxDispatch, actions } from '../Inbox';
import TeamSelector from './TeamSelector';

const TeamSelector = () => {
  const dispatch = useContext(InboxDispatch);
  const {
    data: { teams },
  } = useApolloQuery(
    gql`
      {
        teams(first: 10, order_by: { field: reports_resolved, direction: DESC }) {
          edges {
            node {
              id
              handle
              resolvedReportCount: resolved_report_count
            }
          }
        }
      }
    `,
  );

  return (
    <UncontrolledDropdown nav inNavbar>
      <DropdownToggle nav caret>
        Teams
      </DropdownToggle>
      <DropdownMenu right>
        <DropdownItem>Reset</DropdownItem>
        <DropdownItem divider />
        {teams.edges.map(({ node: team }) => (
          <DropdownItem
            key={team.id}
            onClick={() => dispatch({ type: actions.CHANGE_TEAM, payload: team.id })}
          >
            {team.handle}
            <Badge color="success">{team.resolvedReportCount}</Badge>
          </DropdownItem>
        ))}
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

export default TeamSelector;
