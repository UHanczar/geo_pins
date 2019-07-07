const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');

const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const { findOrCreateUser } = require('./controllers/userController');

require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .then(() => console.log('Connected to database'))
  .catch(error => console.error(error));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    let authToken = null;
    let currentUser = null;

    try {
      authToken = req.headers.authorization;

      if (authToken) {
        currentUser = await findOrCreateUser(authToken);
      } else {

      }
    } catch (error) {
      console.error('Unable to authenticate user with token', error);
    }

    return { currentUser };
  },
  cors: true,
});

server.listen({ port: process.env.PORT || 4000 }).then(params => console.log(`Server listens on url: ${params.url}`));

