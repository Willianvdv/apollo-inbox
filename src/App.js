import React, { Component } from 'react';
import { Navbar, NavbarBrand } from 'reactstrap';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Navbar color="dark" dark>
          <NavbarBrand href="/" className="p-2">
            YAHI
          </NavbarBrand>
        </Navbar>
      </div>
    );
  }
}

export default App;
