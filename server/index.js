const { ApolloServer, gql } = require("apollo-server");
const { RESTDataSource } = require("apollo-datasource-rest");
const { RedisCache } = require("apollo-server-cache-redis");
const { ApolloEngine } = require("apollo-engine");

class ReportsAPI extends RESTDataSource {
  constructor() {
    super();

    this.baseURL =
      "https://ngftg30rl3.execute-api.eu-central-1.amazonaws.com/prod/";
  }

  async getReports() {
    return [this.get(`reports/429298`)];
  }

  async getReport(id) {
    return this.get(`reports/${id}`);
  }
}

const typeDefs = gql`
  type Report {
    title: String
  }

  type Query {
    report(id: Int): Report
    reports: [Report]
  }
`;

const resolvers = {
  Query: {
    report: async (_source, { id }, { dataSources }) => {
      return dataSources.reportsApi.getReport(id);
    },
    reports: async (_source, {}, { dataSources }) => {
      return dataSources.reportsApi.getReports();
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  tracing: true,
  cache: new RedisCache({
    host: "127.0.0.1"
  }),
  dataSources: () => {
    return {
      reportsApi: new ReportsAPI()
    };
  }
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
