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

class ReportsGraphQLAPI extends GraphQLDataSource {
  constructor() {
    super();

    this.baseURL =
      "https://ngftg30rl3.execute-api.eu-central-1.amazonaws.com/prod/graphql";
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
    reputation: String
    rank: String
    signal: String
    signalPercentile: String
    impact: String
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
  Query: {
    report: async (_source, { id }, { dataSources }, { cacheControl }) => {
      cacheControl.setCacheHint({ maxAge: 86400 });
      return dataSources.reportsLegacyApi.getReport(id);
    },

    reports: async (_source, {}, { dataSources }, { cacheControl }) => {
      cacheControl.setCacheHint({ maxAge: 86400 });
      return dataSources.reportsGraphQLApi.getReports();
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
    reportsGraphQLApi: new ReportsGraphQLAPI()
  })
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
