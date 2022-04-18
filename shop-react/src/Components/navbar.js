import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown'
import logo from "../logo.svg"
import {useSignout} from '../Hooks/useSignout';
import { useAuthContext } from '../Hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';
import { useCartContext } from '../Hooks/useCartContext';

export default function NavBar(){
  const {signout} = useSignout()
  const {user} = useAuthContext()
  const {cart} = useCartContext()
  const navigate = useNavigate()

  return(
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container fluid>
        <Navbar.Brand>
          <img alt="Logo" src={logo} width="45" /> 
          shopReact
        </Navbar.Brand>

        {user && (<>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link onClick={() => navigate("/")}>Home</Nav.Link>
              <Nav.Link onClick={() => navigate("/products")}>Products</Nav.Link>
            </Nav>

            <Nav>
              <Nav.Link onClick={() => navigate("/carts")}>Cart {cart.length}</Nav.Link>
              <NavDropdown align="end" title={user.displayName} id="nav-dropdown">
                <NavDropdown.Item onClick={() => navigate("/profile")}>Profile</NavDropdown.Item>
                <NavDropdown.Item onClick={() => navigate("/user/purchases")}>Purchase</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={signout}>Logout</NavDropdown.Item>
              </NavDropdown>
              
            </Nav>
          </Navbar.Collapse>
          </>)}
      </Container>
    </Navbar>
  )
}