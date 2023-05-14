import Container from 'react-bootstrap/Container';
import { Outlet } from "react-router-dom";
import { TopMenu } from './TopMenu';

export function Layout() {
  return (
    <>
    <TopMenu />
    <Container style={{padding: '10px'}}>
      <Outlet />
    </Container>
    </>
  );
}
