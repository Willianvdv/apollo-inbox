import React, { Suspense } from "react";
import { Navbar, NavbarBrand } from "reactstrap";
import { ApolloProvider as ApolloHooksProvider } from "react-apollo-hooks";
import ApolloClient from "apollo-boost";
import Inbox from "./Inbox";
import Typist from "react-typist";

const client = new ApolloClient({
  uri: "https://dljbnibt6hb9r.cloudfront.net/"
});

const Loading = () => {
  return (
    <div
      style={{
        fontFamily:
          "Lucida Console,Lucida Sans Typewriter,monaco,Bitstream Vera Sans Mono,monospace"
      }}
    >
      <Typist>
        &gt;&gt; loading YAHI &amp;&amp;
        <br />
        &gt;&gt; ZERO DAY ATTACK_Access_Level8
        <br />
        &gt;&gt ACCESS_CODES ZD6800001070199#ODA
        <br />
        &gt;&gt IDENTIFY CABLE ARD392_VIA GPS_ST 3 <br />
        &gt;&gt LOCATION NORTH ATLANTIC
        <br /> &gt; &gt EXECUTE &gt; &gt &gt; &gt EXECUTE &gt; &gt <br />
        <Typist.Delay ms={500} />
        &gt; &gt ZERO DAY ATTACK LAUNCHED
      </Typist>
    </div>
  );
};

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
