const { GraphQLServer } = require('graphql-yoga');

const typeDefs = `
  type Query {
    info: String!
    feed: [Link!]!
  }

  type Link {
    id: ID!
    description: String!
    url: String!
  }

`;

const links = [{
  id: 'link-0',
  url: 'ali-r.com',
  description: 'My portfolio',
}];

const resolvers = {
  Query: {
    info: () => 'This is the API of a Hackernews Clone',
    feed: () => links,
  },

  // Can be omitted since resolver is so trivial
  Link: {
    id: root => root.id,
    description: root => root.description,
    url: root => root.url,
  },
};

const server = new GraphQLServer({
  typeDefs,
  resolvers,
});
server.start(() => console.log('Server is running on http://localhost: 4000'));

