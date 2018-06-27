# Scheme Driven Development
When Adding new API features:
1. Extend the GraphQL Schema definition with a new root field (and new data types if needed)
2. Implement Corresponding resolver functions for the fields.

# GraphQL Schema
Written in Schema Definition Language (SDL) which has a strong type system.

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
# Connecting a Database
Typically, when implementing resolvers and connecting to a database you have 2 options:
1. Access directly via SQL queries or NoSQL API
 - Problematic since dealing with SWL in resolvers is complex and gets out of hand quickly. SQL is also commonly submitted to database as plain strings which means tooling wont help you with autocompletion, error checking, or highlighting.
2. Use an ORM that provides an abstraction for your database and lets you access it directly from your programming language.
 - Problematic because ORMS are typically implementing simple solutions and with GraphQL complexities and edge cases arise.

## Prisma
Provides a GrapQL query engine which is taking care of resolving queries for you. When using it, your resolvers are delegating queries to the underlying Prisma engine.

### Prisma Bindings
<!-- Add to this section if time -->

### Architecture
![Client <-> GraphQL Server <-> Prisma <-> Database](https://imgur.com/ik5P7RO.png)
#### Application Layer
The API client applications talk to. WHere you implement business logic, common workflows like authentication and authorization or integrate with 3rd party services like Stripe. Schema of this part is known as Application schema
#### Database Layer
Provided by Prisma and provides the database layer. Basically a GraphQL-based interface to your database that saves you from the intricacies of querying yourself. Mirrors a databse API.

Allows you to perform CRUD operations for certain data types that you define using SDL. Typically, data types represent the entities of your application domain. Once the model is defined in SDL, Prisma translates it into an according database schema and sets up the underlying database accordingly. When sending queries and mutations, it translates it to DB operations and performs them for you. Prisma is automatically generating the Prisma GRaphQL API based on the data model provided. This schema is called the **Prisma Database Schema**

A simple data model like the following generates (this)[https://gist.github.com/gc-codesnippets/3f4178ad93c51d03195c92ce119d444c]. In addition to simple CRUD operations, it allows for things like batched updates and deletes.

##### Why not access Prisma GrapQL API directly?
The Prisma API is an interface to a DB. If you consumed it directly from the client, you are directly accessing a database. Its rare that this is an option. Most apps need additional logic for data validation, transformation, authentication, permissions, integrating 3rd party services, and other custom functionality. 

Security is another big issue. GraphQL works in the way that everyone who has access to the GraphQL API's endpoint can retrieve the entire schema from it (called **introspection**). If clients were talking directly to Prisma on the otherhand, it is a matter of checking network requests to get access to the Prisma API endpoint and everyone would be able to see your entire database schema. (**Note** limiting introspection capabilities )

```graphql
type User {
  # @unique tells Prisma to make sure no two User elements in the database have the same ID.
  # The id:ID field is also special in Prisma as it will auto-generate globally unique IDs for types with this field.
  id: ID! @unique
  name: String!
}
```

### Using Prisma
Install CLI. The CLI will now prompt you to select a cluster to which it should deploy the Prisma service. You can use a development cluster which is completely free to use.

**Note:** Prisma is open-source. It is based on Docker which means you can deploy it to any cloud provider of your choice (such as Digital Ocean, AWS, Google Cloud, …). If you don’t want to deal with DevOps and the manual configuration of Docker, you can also use Prisma Cloud to easily spin up a private cluster to which you can deploy your services.

Run `prisma deploy` in database folder.
Run `prisma token` to generate JWT

Paste the Authorization token in the HTTP header.

# Questions

## Why is a second GraphQL API (defined by the application schema) needed in a GraphQL server architecture with Prisma?
The Prisma API is just an interface to the database - it doesnt allow for any kind of application logic which you need an most apps. Authentication, authorization, data validation, transformations, integrating 3rd party services (like Stripe). There is also security risk involved thanks to **introspection** which means you can see the database schema by checking network requests.

## Is GraphQL an ORM?

## What is REST and why is GraphQL a better version?

## What implementations are available?