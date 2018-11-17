const { ApolloServer, gql } = require("apollo-server");
const { RESTDataSource } = require("apollo-datasource-rest");
const { MemcachedCache } = require("apollo-server-cache-memcached");
const { RedisCache } = require("apollo-server-cache-redis");
const { ApolloEngine } = require("apollo-engine");
const { GraphQLDataSource } = require("apollo-datasource-graphql");
const fetchJson = require("fetch-json");
const { createfetchUnlessCached } = require("fetch-unless-cached");

const cachedFetch = createfetchUnlessCached(300);

const restUrl =
  "https://ngftg30rl3.execute-api.eu-central-1.amazonaws.com/prod/";

const TEAM = gql`
  query($handle: String!) {
    team(handle: $handle) {
      id: _id
      name
      handle
      profilePicture: profile_picture(size: small)
    }
  }
`;

const USER = gql`
  query($username: String!) {
    user(username: $username) {
      name
      username
      reputation
      rank
      signal
      impact
      signalPercentile: signal_percentile
      profilePicture: profile_picture(size: small)
    }
  }
`;

const REPORTS = gql`
  query {
    reports(first: 10) {
      edges {
        report: node {
          databaseId: _id
        }
      }
    }
  }
`;

const legacyReportTransformer = legacyReport => {
  return {
    ...legacyReport,
    vulnerabilityInformation: legacyReport.vulnerability_information
  };
};

class ReportsLegacyAPI extends RESTDataSource {
  constructor() {
    super();

    this.baseURL = restUrl;
  }

  async getReport(id) {
    return this.get(`reports/${id}`);
  }
}

class GraphQLAPI extends GraphQLDataSource {
  constructor() {
    super();

    this.baseURL =
      "https://ngftg30rl3.execute-api.eu-central-1.amazonaws.com/prod/graphql";
  }

  async getUser(username) {
    const response = await this.query(USER, {
      variables: { username }
    });
    return response.data.user;
  }

  async getTeam(handle) {
    const response = await this.query(TEAM, {
      variables: { handle }
    });
    return response.data.team;
  }

  async getReports() {
    const response = await this.query(REPORTS);

    return await Promise.all(
      response.data.reports.edges.map(async edge => {
        return fetchJson
          .get(restUrl + "reports/" + edge.report.databaseId)
          .then(data => legacyReportTransformer(data));
      })
    );
  }
}

const typeDefs = gql`
  type User {
    id: Int
    name: String
    username: String
    reputation: Int
    rank: Int
    signal: Float
    signalPercentile: String
    impact: Float
    profilePicture: String
  }

  type Team {
    id: Int
    name: String
    handle: String
    profilePicture: String
  }

  type Report {
    id: Int
    title: String
    reporter: User
    team: Team
    vulnerabilityInformation: String
    vulnerability_information: String
    substate: String
    disclosedAt: String
    createdAt: String
  }

  type Query {
    report(id: Int): Report @cacheControl(scope: PUBLIC)
    reports: [Report] @cacheControl(scope: PUBLIC)
  }
`;

const resolvers = {
  Report: {
    reporter: async (source, {}, { dataSources }, { cacheControl }) => {
      cacheControl.setCacheHint({ maxAge: 35800 });
      return dataSources.graphQLApi.getUser(source.reporter.username);
    },
    team: async (source, {}, { dataSources }, { cacheControl }) => {
      cacheControl.setCacheHint({ maxAge: 35800 });
      return dataSources.graphQLApi.getTeam(source.team.handle);
    }
  },

  Query: {
    report: async (_source, { id }, { dataSources }, { cacheControl }) => {
      cacheControl.setCacheHint({ maxAge: 35800 });
      return dataSources.reportsLegacyApi.getReport(id);
    },

    reports: async (_source, {}, { dataSources }, { cacheControl }) => {
      cacheControl.setCacheHint({ maxAge: 35800 });
      return dataSources.graphQLApi.getReports();
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  tracing: true,
  cacheControl: true,
  logging: {
    level: "DEBUG"
  },
  dataSources: () => ({
    reportsLegacyApi: new ReportsLegacyAPI(),
    graphQLApi: new GraphQLAPI()
  })
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
