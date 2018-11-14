import { InMemoryCache } from 'apollo-cache-inmemory';
import { RestLink } from 'apollo-link-rest';
import gql from 'graphql-tag';
import { ApolloClient } from 'apollo-client';
import usePromise from 'react-use-promise';
import { useMemo } from 'react';

// setup your `RestLink` with your endpoint
const hackeroneRestLink = new RestLink({
  uri: 'https://ngftg30rl3.execute-api.eu-central-1.amazonaws.com/prod/',
});

// setup your client
const hackeroneRestClient = new ApolloClient({
  link: hackeroneRestLink,
  cache: new InMemoryCache(),
});

const restReportQuery = gql`
  query restReport($path: String!) {
    report @rest(type: "RestReport", path: $path) {
      databaseId: id
      substate
      title
    }
  }
`;

const useEnhancedReport = reportId => usePromise(
  useMemo(
    () => {
      console.log(`MEMO => ${reportId}`);
      return hackeroneRestClient
        .query({ query: restReportQuery, variables: { path: `reports/${reportId}` } })
        .then(response => response.data.report);
    },
    [reportId],
  ),
);
export { useEnhancedReport };
