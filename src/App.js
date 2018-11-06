import React, { Component } from 'react';
import { Navbar, NavbarBrand } from 'reactstrap';
import { ApolloProvider } from 'react-apollo';
import ApolloClient from 'apollo-boost';
import Inbox from './Inbox';

const client = new ApolloClient({
  uri: 'https://ngftg30rl3.execute-api.eu-central-1.amazonaws.com/prod/graphql',
});

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <div className="App">
          <Navbar color="dark" dark>
            <NavbarBrand href="/" className="p-2">
              YAHI
            </NavbarBrand>
          </Navbar>

          <Inbox />
        </div>
      </ApolloProvider>
    );
  }
}

export default App;
