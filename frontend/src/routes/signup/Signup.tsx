import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useCallback, useState } from 'react';
import { Alert } from 'react-bootstrap';
import { asyncSubmitForm } from '../../utils/asyncFormSubmit';

export function Signup() {
  const [errorMessage, setErrorMessage] = useState<string|null>(null);

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordRepeat, setPasswordRepeat] = useState<string>('');

  const isAValidPassword = useCallback((password: string) => {
    return password.length >= 8;
  }, []);

  const handleSubmit = useCallback(async (event: SubmitEvent) => {
    event.preventDefault();
    try {
      await asyncSubmitForm('http://localhost:5555/signup', { email, password })
    } catch (e: any) {
      setErrorMessage(e.message);
    }
  }, [email, password]);

  return (
    <>
    <h1>
      Signup
    </h1>
    <Form onSubmit={handleSubmit as any}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} isValid={isAValidPassword(password)} isInvalid={!isAValidPassword(password)} />
        {
          !isAValidPassword(password) && (
            <Form.Control.Feedback type="invalid">
              Password must be at least 8 characters long.
            </Form.Control.Feedback>
          )
        }
      </Form.Group>
      
      <Form.Group className="mb-3" controlId="formRepeatPassword">
        <Form.Label>Repeat password</Form.Label>
        <Form.Control type="password" placeholder="Password" onChange={(e) => setPasswordRepeat(e.target.value)} isValid={password === passwordRepeat} isInvalid={password !== passwordRepeat} />
        {
          password !== passwordRepeat && (
            <Form.Control.Feedback type="invalid">
              Passwords must match.
            </Form.Control.Feedback>
          )
        }
      </Form.Group>
      <Alert variant="danger" show={errorMessage !== null}>
        {errorMessage}
      </Alert>

      <Button variant="primary" type="submit" disabled={!isAValidPassword(password) || password !== passwordRepeat}>
        Sign up!
      </Button>
    </Form>
    </>
  );
}