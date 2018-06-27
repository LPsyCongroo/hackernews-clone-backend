# Scheme Driven Development
When Adding new API features:
1. Extend the GraphQL Schema definition with a new root field (and new data types if needed)
2. Implement Corresponding resolver functions for the fields.

# GraphQL Schema
Written in Schema Definition Language (SDL) which has a type system.

## Root Types
There are three special Root Types: Query, Mutation, and Subscription. These in turn have root fields.

## Root Fields
These define available API options. There are Scalar and Object types.

### Scalar Types
A GraphQL object has a name and fields but eventually the fields need to resolve into concrete data. Scalar types represent the leaves of the query.
#### Default Scalar Types
- `Int`: A signed 32-bit integer 
- `Float`: A signed double-precision floating-point value
- `Strings`: A UTF-8 character sequence
- `ID`: THe ID scalar type represents a unique identifier, often used to refetch an object or as the key for a cache. The ID type is serialized in the same way as a String; however, defining it as an ID signifies that it is **not** meant to be human-readable.
#### Custom Scalar Types

### Object Types
You are required to query at least one field in a selection set
### Type Modifiers
Combinations of "!" and "\[\]" to denote required and list fields respectively.

# GraphQL Resolver Functions
- Implements the available API options.
- You need one not only for Root Fields but ALL fields.
- They always have to be named after the corresponding field in the schema definition

## Resolver Arguments
Each resolver function receives 4 input arguments:

### root (or parent)
The `root` argument is the result of the previous *resolver execution level*. GraphQL queries can be nested and each level of nesting corresponds to one resolver execution level. In the following, the first level invokes the `feed` resolver and returns the data stored in `links`. For the second level, the GraphQL server is smart enough to invoke the resolver of the `Link` type for each element inside the list that was returned on the first resolver level. This is because, thanks to the schema, it knows that `feed` returns a list of `Link` elements. The incoming `root` object is the element inside the `links` list.
```graphql
type Query {
  feed: [Link!]!
}

type Link {
  id: ID!
  description: String!
  url: String!
}
```
```javascript
{
  Query: {
    feed: () => links,
  },

  Link: {
    id: root => root.id,
    description: root => root.description,
    url: root => root.url,
  },
}
```
### args (or arguments)
The `args` argument seems confusing, but it's just the *arguments of the query.* This is easier demonstrated:
```graphql
type Mutation {
  # The query arguments are in the parenthesis below:
  post(url: String!, description: String!): Link!
}
```
```javascript
{
  Mutation: {
    // The query arguments can be referred to by args
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
}
```
