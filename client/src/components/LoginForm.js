import React, { useState, useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useMutation } from "@apollo/react-hooks";
import { LOGIN_USER } from "../utils/mutations";
import Auth from "../utils/auth";

const LoginForm = () => {
  // set initial state using useState hook
  const [userFormData, setUserFormData] = useState({ email: "", password: "" });
  const [validated, setValidated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  // destructure the login mutation and any error that occurs
  const [login, { error }] = useMutation(LOGIN_USER);

  // useEffect hook to show an error alert if there is an error
  useEffect(() => {
    setShowAlert(!!error); // set showAlert to true if error exists
  }, [error]);

  // handle form input change and update state using the name attribute of the input
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  // handle form submit
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    // validate the form
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      try {
        const { data } = await login({
          variables: { ...userFormData },
        });
        Auth.login(data.login.token); // store the login token in local storage
      } catch (e) {
        console.error(e);
      } finally {
        // reset the form after submission
        setUserFormData({ email: "", password: "" });
        setValidated(false);
      }
    }
    setValidated(true); // set validated to true after form submission
  };

  return (
    <>
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        <Alert
          dismissible
          onClose={() => setShowAlert(false)}
          show={showAlert}
          variant="danger"
        >
          Something went wrong with your login credentials!
        </Alert>
        <Form.Group>
          <Form.Label htmlFor="email">Email</Form.Label>
          <Form.Control
            type="text"
            placeholder="Your email"
            name="email"
            onChange={handleInputChange}
            value={userFormData.email}
            required
          />
          <Form.Control.Feedback type="invalid">
            Email is required!
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group>
          <Form.Label htmlFor="password">Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Your password"
            name="password"
            onChange={handleInputChange}
            value={userFormData.password}
            required
          />
          <Form.Control.Feedback type="invalid">
            Password is required!
          </Form.Control.Feedback>
        </Form.Group>
        <Button
          disabled={!(userFormData.email && userFormData.password)}
          type="submit"
          variant="success"
        >
          Submit
        </Button>
      </Form>
    </>
  );
};

export default LoginForm;

