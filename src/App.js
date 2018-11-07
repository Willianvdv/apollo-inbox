import React, { Suspense } from 'react';
import { Navbar, NavbarBrand } from 'reactstrap';
import { ApolloProvider as ApolloHooksProvider } from 'react-apollo-hooks';
import ApolloClient from 'apollo-boost';
import Inbox from './Inbox';
import Loading from './Loading';

const client = new ApolloClient({
  uri: 'https://ngftg30rl3.execute-api.eu-central-1.amazonaws.com/prod/graphql',
});

const App = () => (
  <Suspense fallback={<Loading />}>
    <ApolloHooksProvider client={client}>
      <div className="App">
        <Navbar color="dark" dark>
          <NavbarBrand href="/" className="p-2">
            YAHI
          </NavbarBrand>
        </Navbar>

        <Inbox />
      </div>
    </ApolloHooksProvider>
  </Suspense>
);

export default App;
