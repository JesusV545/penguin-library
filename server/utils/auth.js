const jwt = require('jsonwebtoken');

// set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
  // function for authenticating routes
  authMiddleware: function ({ req }) {
    // check if request object exists and has headers and authorization properties
    if (!req || !req.headers || !req.headers.authorization) {
      // if not, return the request object as-is
      return req;
    }

    // extract the token from the authorization header
    const token = req.headers.authorization.split(" ").pop().trim();

    try {
      // verify the token and decode the payload
      const decoded = jwt.verify(token, SECRET, { maxAge: EXPIRATION });
      // set the decoded user data as a property of the request object
      req.user = decoded.data;
    } catch (err) {
      // log any errors that occur during verification
      console.error(err);
    }

    // return the updated request object
    return req;
  },

  // function for signing a JWT with user data
  signToken: async function ({ username, email, _id }) {
    try {
      // create a payload object with the user data
      const payload = { username, email, _id };
      // sign the token using the payload and secret, with an expiration time
      const token = await jwt.sign({ data: payload }, SECRET, { expiresIn: EXPIRATION });
      // return the signed token
      return token;
    } catch (err) {
      // log any errors that occur during signing
      console.error(err);
      // return null if an error occurs
      return null;
    }
  },
};