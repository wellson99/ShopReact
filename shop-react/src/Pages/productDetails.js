import Col from "react-bootstrap/Col"
import Row from "react-bootstrap/Row"
import Button from "react-bootstrap/Button"
import Container from "react-bootstrap/Container"
import Stack from "react-bootstrap/Stack"
import Image from "react-bootstrap/Image"
import { useLocation } from "react-router-dom"

import { useCartContext } from "../Hooks/useCartContext"

// const imgURL = "https://i.pinimg.com/474x/f8/4d/73/f84d73d039477350d0e1f8a2ca0bfc7a--serpent-snake-glove-puppets.jpg"

export default function ProductDetails({products}) {
  const location = useLocation()
  const {product} = location.state
  const {addToCart} = useCartContext()

  const addProductToCart = () => {
    let x = {
      id: product.id,
      name: product.name,
      imgURL: product.imgURL,
      price: product.price,
      quantity: 1
    }
  
    addToCart(x)
  }

  return (
    <Container>
      <Row className="justify-content-md-start">
     
        <Col className="col-xs-12 col-md-4 col-lg-3">
          <Image src={product.imgURL} thumbnail/>
        </Col>

        <Col className="col-xs-12 col-md-8 col-lg-9">
          <p>{product.name}</p>
          <p>RM {product.price}</p>
          <p>{product.description}</p>
        </Col>

        <Stack gap={2} className="col-xs-12 col-md-9 mx-auto">
          <Button variant="primary" onClick={() => addProductToCart() }>Sign In</Button>
          <Button variant="link" onClick={() => console.log("hey")}>Don't have an account? Sign up now!</Button>
        </Stack>      
      </Row>
    </Container>
    
  )
}