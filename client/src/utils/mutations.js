import gql from "graphql-tag";

// Define the LOGIN_USER mutation and its variables
export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    // Call the login mutation with the provided variables
    login(email: $email, password: $password) {
      // Return the token and user data if the mutation was successful
      token
      user {
        _id
        username
      }
    }
  }
`;

// Define the ADD_USER mutation and its variables
export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    // Call the addUser mutation with the provided variables
    addUser(username: $username, email: $email, password: $password) {
      // Return the token and user data if the mutation was successful
      token
      user {
        _id
        username
      }
    }
  }
`;

// Define the SAVE_BOOK mutation and its variables
export const SAVE_BOOK = gql`
  mutation saveBook($bookData: BookInput!) {
    // Call the saveBook mutation with the provided variables
    saveBook(bookData: $bookData) {
      // Return the user data including their saved books if the mutation was successful
      _id
      username
      email
      savedBooks {
        bookId
        authors
        image
        description
        title
        link
      }
    }
  }
`;

// Define the REMOVE_BOOK mutation and its variables
export const REMOVE_BOOK = gql`
  mutation removeBook($bookId: ID!) {
    // Call the removeBook mutation with the provided variables
    removeBook(bookId: $bookId) {
      // Return the user data including their saved books if the mutation was successful
      _id
      username
      email
      savedBooks {
        bookId
        authors
        image
        description
        title
        link
      }
    }
  }
`;
