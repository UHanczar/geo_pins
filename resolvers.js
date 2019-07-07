const { AuthenticationError, PubSub } = require('apollo-server');
const PinModel = require('./models/Pin');

const authenticated = next => (root, args, ctx, info) => {
  if (!ctx.currentUser) {
    throw new AuthenticationError('You must be logged in');
  } else {
    return next(root, args, ctx, info);
  }
};

const pubSub = new PubSub();
const PIN_ADDED = 'PIN_ADDED';
const PIN_DELETED = 'PIN_DELETED';
const PIN_UPDATED = 'PIN_UPDATED';

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
      const pinAdded = await PinModel.populate(pin, 'author');
      await pubSub.publish(PIN_ADDED, { pinAdded });

      return pinAdded;
    }),

    deletePin: authenticated(async (root, args, ctx, info) => {
      const pinDeleted = await PinModel.findOneAndDelete({ _id: args.pinId}).exec();
      await pubSub.publish(PIN_DELETED, { pinDeleted });

      return pinDeleted;
    }),

    createComment: authenticated(async (root, args, ctx, info) => {
      const newCommnet = {
        text: args.text,
        author: ctx.currentUser._id,
      };

      const pinUpdated = await PinModel
        .findOneAndUpdate(
        { _id: args.pinId},
        { $push: { comments: newCommnet }},
        { new: true }
        )
        .populate('author')
        .populate('comments.author');
      await pubSub.publish(PIN_UPDATED, { pinUpdated });

      return pinUpdated;
    }),
  },
  Subscription: {
    pinAdded: {
      subscribe: () => pubSub.asyncIterator(PIN_ADDED)
    },
    pinDeleted: {
      subscribe: () => pubSub.asyncIterator(PIN_DELETED)
    },
    pinUpdated: {
      subscribe: () => pubSub.asyncIterator(PIN_UPDATED)
    },
  },
};
