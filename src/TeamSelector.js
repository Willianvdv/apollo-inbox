import React from 'react';
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
} from 'reactstrap';

const TeamSelector = () => (
  <UncontrolledDropdown nav inNavbar>
    <DropdownToggle nav caret>
      Teams
    </DropdownToggle>
    <DropdownMenu right>
      <DropdownItem>Option 1</DropdownItem>
      <DropdownItem>Option 2</DropdownItem>
      <DropdownItem divider />
      <DropdownItem>Reset</DropdownItem>
    </DropdownMenu>
  </UncontrolledDropdown>
);

export default TeamSelector;
