const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    // resolver function for the 'me' query
    me: async (parent, args, context) => {
      // check if the user is authenticated
      if (context.user) {
        // find the user by their ID and exclude the password and version fields
        const userData = await User.findOne({ _id: context.user._id }).select(
          "-__v -password"
        );

        return userData;
      }

      // throw an error if the user is not authenticated
      throw new AuthenticationError("Not logged in");
    },
  },

  Mutation: {
    // resolver function for the 'addUser' mutation
    addUser: async (parent, args) => {
      // create a new user
      const user = await User.create(args);
      // sign a token for the user
      const token = signToken(user);

      return { token, user };
    },
    // resolver function for the 'login' mutation
    login: async (parent, { email, password }) => {
      // find the user by their email address
      const user = await User.findOne({ email });

      if (!user) {
        // throw an error if the user does not exist
        throw new AuthenticationError("Incorrect credentials");
      }

      // check if the provided password is correct
      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        // throw an error if the password is incorrect
        throw new AuthenticationError("Incorrect credentials");
      }

      // sign a token for the user
      const token = signToken(user);
      return { token, user };
    },
    // resolver function for the 'saveBook' mutation
    saveBook: async (parent, { bookData }, context) => {
      if (context.user) {
        // add the book to the user's list of saved books
        const updatedUser = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { savedBooks: bookData } },
          { new: true }
        );

        return updatedUser;
      }

      // throw an error if the user is not authenticated
      throw new AuthenticationError("You need to be logged in!");
    },
    // resolver function for the 'removeBook' mutation
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        // remove the book from the user's list of saved books
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );

        return updatedUser;
      }

      // throw an error if the user is not authenticated
      throw new AuthenticationError("You need to be logged in!");
    },
  },
};

module.exports = resolvers;
