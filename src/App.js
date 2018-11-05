import React, { Component } from 'react';
import { Navbar, NavbarBrand } from 'reactstrap';
import Inbox from './Inbox';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Navbar color="dark" dark>
          <NavbarBrand href="/" className="p-2">
            YAHI
          </NavbarBrand>
        </Navbar>

        <Inbox/>
      </div>
    );
  }
}

export default App;
