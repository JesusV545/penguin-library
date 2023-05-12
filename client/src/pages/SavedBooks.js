import React from "react";
import { Jumbotron, Container, CardColumns, Card, Button } from "react-bootstrap";

import { useQuery, useMutation } from "@apollo/react-hooks";
import { GET_ME } from "../utils/queries";
import { REMOVE_BOOK } from "../utils/mutations";
import Auth from "../utils/auth";
import { removeBookId } from "../utils/localStorage";

const SavedBooks = () => {
  // useQuery hook to get current user's data
  const { loading, data } = useQuery(GET_ME);

  // useMutation hook to remove a book from the user's saved books
  const [removeBook] = useMutation(REMOVE_BOOK);

  // extract the current user's data from the query results
  const userData = data?.me || {};

  // function to handle deletion of a book from the user's saved books
  const handleDeleteBook = async (bookId) => {
    // get the user's auth token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    // return if there is no token
    if (!token) {
      return false;
    }

    try {
      // call the removeBook mutation with the book's ID
      const { data } = await removeBook({
        variables: { bookId },
      });

      // upon success, remove the book's ID from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  // if the query is still loading, show a loading message
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      {/* display a Jumbotron with the user's username */}
      <Jumbotron fluid className="text-light bg-dark">
        <Container>
          <h1>Viewing {userData.username}'s saved books!</h1>
        </Container>
      </Jumbotron>

      {/* display the user's saved books */}
      <Container>
        <h2>
          {userData.savedBooks?.length
            ? `Viewing ${userData.savedBooks.length} saved ${
                userData.savedBooks.length === 1 ? "book" : "books"
              }:`
            : "You have no saved books!"}
        </h2>

        {/* display the saved books in a card layout */}
        <CardColumns>
          {userData.savedBooks?.map((book) => {
            return (
              <Card key={book.bookId} border="dark">
                {/* if the book has an image, display it */}
                {book.image ? (
                  <Card.Img
                    src={book.image}
                    alt={`The cover for ${book.title}`}
                    variant="top"
                  />
                ) : null}

                <Card.Body>
                  {/* display the book's title */}
                  <Card.Title>{book.title}</Card.Title>

                  {/* display the book's authors */}
                  <p className="small">Authors: {book.authors}</p>

                  {/* display the book's description */}
                  <Card.Text>{book.description}</Card.Text>

                  {/* display a button to delete the book */}
                  <Button
                    className="btn-block btn-danger"
                    onClick={() => handleDeleteBook(book.bookId)}
                  >
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SavedBooks;
