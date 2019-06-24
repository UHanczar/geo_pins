const { AuthenticationError } = require('apollo-server');

const user = {
  _id: '1',
  name: 'John',
  email: 'john@gmail.com',
  image: 'https://res.cloudinary.com/djochmrxh/image/upload/v1553970977/sickfits/wxkrdnt0s9wkz0xheipe.jpg'
};

const authenticated = next => (root, args, ctx, info) => {
  if (!ctx.currentUser) {
    throw new AuthenticationError('You must be logged in');
  } else {
    return next(root, args, ctx, info);
  }
};

module.exports = {
  Query: {
    me: authenticated((root, args, ctx, info) => ctx.currentUser),
  }
};
