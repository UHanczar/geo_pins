const { AuthenticationError } = require('apollo-server');
const PinModel = require('./models/Pin');

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
    getPins: async (root, args, cts) => {
      const pins = await PinModel.find({}).populate('author').populate('comments.author');

      return pins;
    },
  },
  Mutation: {
    createPin: authenticated(async (root, args, ctx, info) => {
      const pin = await new PinModel({
        ...args.input,
        author: ctx.currentUser._id,
      }).save();
      const addedPin = await PinModel.populate(pin, 'author');

      return addedPin;
    }),
  }
};
