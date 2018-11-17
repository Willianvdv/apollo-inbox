const { ApolloServer, gql } = require("apollo-server");
const { RESTDataSource } = require("apollo-datasource-rest");
const { RedisCache } = require("apollo-server-cache-redis");
const { ApolloEngine } = require("apollo-engine");
const { GraphQLDataSource } = require("apollo-datasource-graphql");
const fetchJson = require("fetch-json");

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
    try {
      const response = await this.query(REPORTS);

      return await Promise.all(
        response.data.reports.edges.map(async edge => {
          return await fetchJson
            .get(restUrl + edge.databaseId)
            .then(data => data);
        })
      );

      //   await ;
    } catch (error) {
      console.error(error);
    }
  }
}

const typeDefs = gql`
  type Report {
    id: String # FIX ME
    title: String
  }

  type Query {
    report(id: Int): Report
    reports: [Report]
  }
`;

const resolvers = {
  Query: {
    report: async (_source, { id }, { dataSources }) =>
      dataSources.reportsLegacyApi.getReport(id),

    reports: async (_source, {}, { dataSources }) =>
      dataSources.reportsGraphQLApi.getReports()
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  tracing: true,
  cache: new RedisCache({
    host: "127.0.0.1"
  }),
  dataSources: () => ({
    reportsLegacyApi: new ReportsLegacyAPI(),
    reportsGraphQLApi: new ReportsGraphQLAPI()
  })
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
