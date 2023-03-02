const express = require('express');
const path = require('path');

// import apollo server
const { ApolloServer } = require ('apollo-server-express')

// import typeDefs and resolvers
const { typeDefs, resolvers } = require ('./schemas');
const { authMiddleware } = require ('./utils/auth')

// DB Connection 
const db = require('./config/connection');

// const routes = require('./routes');

// Express Server 
const app = express();
const PORT = process.env.PORT || 3001;

// Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

// Apply Apollo Server with Express App
server.applyMiddleware({ app });

// Middleware Parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const __dirname = path.dirname("");
const buildPath = path.join(__dirname, "../client/build");
app.use(express.static(buildPath));

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// app.use(routes);

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
});
