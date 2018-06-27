const { GraphQLServer } = require('graphql-yoga');

const links = [{
  id: 'link-0',
  url: 'ali-r.com',
  description: 'My portfolio',
}];

let idCount = links.length;

const resolvers = {
  Query: {
    info: () => 'This is the API of a Hackernews Clone',
    feed: () => links,
  },

  // Can be omitted since resolver is trivial and the server can infer what it looks like.
  Link: {
    id: root => root.id,
    description: root => root.description,
    url: root => root.url,
  },

  Mutation: {
    post: (root, args) => {
      const link = {
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url,
      };
      links.push(link);
      return link;
    },
  },
};

const server = new GraphQLServer({
  // typeDefs can be provided either directly as a string or by referencing a file that contains your schema definition
  typeDefs: './src/schema.graphql',
  resolvers,
});
server.start(() => console.log('Server is running on http://localhost: 4000'));

