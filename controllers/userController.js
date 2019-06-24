const { OAuth2Client } = require('google-auth-library');

const User = require('../models/User');

const client = new OAuth2Client(process.env.OATH_CLIENT_ID);

exports.findOrCreateUser = async authToken => {
  const googleUser = await verifyAuthToken(authToken);

  const user = await checkIfUserExits(googleUser.email);

  return user ? user : createNewUser(googleUser);
};

const verifyAuthToken = async authToken => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: authToken,
      audience: process.env.OATH_CLIENT_ID,
    });

    return ticket.getPayload();
  } catch (error) {
    console.error(`Error verifying token ${error}`);
  }
};

const checkIfUserExits = async email => await User.findOne({ email }).exec();

const createNewUser = user => {
  const { name, email, picture } = user;

  return new User({
    name,
    email,
    picture,
  }).save();
};

