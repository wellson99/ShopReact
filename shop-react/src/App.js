// import logo from './logo.svg';
// import './App.css';
// import Button from 'react-bootstrap/Button';
import { BrowserRouter, Link, Route, Routes, Navigate } from 'react-router-dom'
import Home from './Pages/home';
import Signup from './Pages/signup';
import Signin from './Pages/signin';
import Profile from './Pages/profile';
import Products from './Pages/products';
import ProductDetails from './Pages/productDetails';
import Carts from './Pages/carts';
import {Purchases} from './Pages/purchases';
import PurchaseDetails from './Pages/purchaseDetails';
import {NavBar} from './Components/navbar';
import { Container } from 'react-bootstrap';
import { useAuthContext } from './Hooks/useAuthContext';
import {CartContextProvider} from "./Context/cartContext"

function App() {
  const {authReady, user} = useAuthContext()

  return (
    <div className="App">
      {authReady && (
        <BrowserRouter>
          <CartContextProvider>
            <NavBar />
            <Container fluid>
              <Routes>
                <Route path="/signup" element={!user ?<Signup/> :<Navigate to={"/"}/>} />
                <Route path="/signin" element={!user ?<Signin/> :<Navigate to={"/"}/>} />
                <Route path="/" element={user ?<Home/> :<Navigate to={"/signin"}/>} />
                <Route path="/user/profile" element={user ?<Profile/> :<Navigate to={"/signin"}/>} />
                <Route path="/products" element={user ?<Products/> :<Navigate to={"/signin"}/>} />
                <Route path="/products/:id" element={user ?<ProductDetails/> :<Navigate to={"/signin"}/>} />
                <Route path="/user/carts" element={user ?<Carts/> :<Navigate to={"/signin"}/>} />
                <Route path="/user/purchases" element={user ?<Purchases/> :<Navigate to={"/signin"}/>} />
                <Route path="/user/purchases/:id" element={user ?<PurchaseDetails/> :<Navigate to={"/signin"}/>} />
              </Routes>
            </Container>
          </CartContextProvider>       
        </BrowserRouter>
      )}
    </div>
  );
}

export default App;
