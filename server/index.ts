import 'reflect-metadata';
import 'dotenv/config';
import { createConnection } from 'typeorm';
import { ApolloServer } from 'apollo-server-express';
import express = require('express');
import session = require('express-session');

import { typeDefs } from './typeDefs';
import { resolvers } from './resolvers';

const startServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req }),
  });

  await createConnection();

  const app = express();

  app.use(
    session({
      secret: 'myRandomSecretKey',
      resave: false,
      saveUninitialized: false,
    })
  );

  server.applyMiddleware({
    app,
    cors: {
      credentials: true,
      origin: 'http://localhost:3000',
    },
  });

  app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
};

startServer();