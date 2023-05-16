import { Container } from "react-bootstrap";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

import { Link } from 'react-router-dom';
import { useEffect, useState } from "react";
import { getURL } from "../utils/getRootURL";

export function TopMenu() {
    const [currentUser, setCurrentUser] = useState<string|null>(null);
    useEffect(() => {
        fetch(getURL('current_user'), {
            credentials: 'include',
        })
            .then(r => r.json())
            .then(r => {
                if(r.authenticated){
                    setCurrentUser(r.email);
                }
            });
    }, []);

  return (
    <Navbar bg="dark" variant="dark">
        <Container>
        <Navbar.Brand href="/">EasyStudy</Navbar.Brand>
        <Nav className="me-auto">
            {
                currentUser !== null ?
                (
                <>
                    <Link to="/plugins" className="nav-link">Plugins</Link>
                    <Link to="/studies" className="nav-link">My user studies</Link>
                </>
                ) : null
            }
        </Nav>
        <Navbar.Toggle />

        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            { 
                currentUser !== null ?
                (
                <>
                    <strong>Signed in as {currentUser}</strong> (<a href={getURL('/logout')}>Logout?</a>)                
                </>
                ) :
                (
                <Nav>
                    <Link to="/signup" className="nav-link">Sign up</Link>
                    <Link to="/login" className="nav-link">Login</Link>
                </Nav>
                )
            }
          </Navbar.Text>
        </Navbar.Collapse>
        </Container>
    </Navbar>
  );
}