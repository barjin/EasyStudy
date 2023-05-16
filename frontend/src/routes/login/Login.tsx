import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import { useCallback, useState } from 'react';
import { Alert } from 'react-bootstrap';
import { asyncSubmitForm } from '../../utils/asyncFormSubmit';
import { Link } from 'react-router-dom';
import { getURL } from '../../utils/getRootURL';

export function Login() {
  const [errorMessage, setErrorMessage] = useState<string|null>(null);

  const handleSubmit = useCallback(async (event: SubmitEvent) => {
    event.preventDefault();

    try {
      await asyncSubmitForm(getURL('/login'), 
        { 
          email: (event.target as any)[0].value, 
          password: (event.target as any)[1].value 
        });
    } catch (e: any) {
      setErrorMessage(e.message);
    }
  }, []);

  return (
    <>
    <Container>
    <Alert variant='primary'>You don't have an account yet? <Link to="/signup">Sign up now!</Link></Alert>
      <h1>
        Login
      </h1>
    <Form onSubmit={handleSubmit as any}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" placeholder="Enter email" />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Password" />
      </Form.Group>
      <Alert variant="danger" show={errorMessage !== null}>
        {errorMessage}
      </Alert>

      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
    </Container>
    </>
  );
}
