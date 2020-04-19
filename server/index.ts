import 'reflect-metadata';
import 'dotenv/config';
import path from 'path';
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

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
    app.get('*', (req, res) =>
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    );
  }

  const PORT = process.env.PORT || 4000;

  const testCallback = () => {
    console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`);
    console.log(`Graphql server ready at ${server.graphqlPath}`);
  };

  app.listen(PORT, testCallback);
};

startServer();
