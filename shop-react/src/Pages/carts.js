import Table from 'react-bootstrap/Table'
import Image from 'react-bootstrap/Image'
import Button from "react-bootstrap/Button"
import Stack from "react-bootstrap/Stack"
import { useCartContext } from "../Hooks/useCartContext"
import { useAuthContext } from "../Hooks/useAuthContext"
import { timestamp } from '../Firebase/config'
import Form from 'react-bootstrap/Form'
import { useState } from 'react'
import {useFirestore} from "../Hooks/useFirestore"
import { useNavigate } from 'react-router-dom'
import { increment } from 'firebase/firestore'

const deliveryType = [
  {type: "Standard Delivery", price: 0, show: "Standard Delivery - Free"},
  {type: "Premium Delivery", price: 9, show: "Premium Delivery - RM 9"}
]

export default function Carts() {
  const {cart, updateCartItem, deleteFromCart, clearCart} = useCartContext()
  const {user} = useAuthContext()
  const {addDocument} = useFirestore("Purchases")
  const {updateDocument} = useFirestore("Products")
  const navigate = useNavigate()
  const [selected, setSelected] = useState(JSON.stringify(deliveryType[0]))

  const calculateTotal = () =>{
    let total = 0
    cart.map(c => total += (c.price * c.quantity))
    return total.toFixed(2)
  }

  const handleChange = (event) => {
    setSelected(event.target.value)
  }

  const purchase = () => {
    const cartItems = cart.map(item => ({...item, isReviewed: false, rating: null, review: null}))
    const itemsTotal = calculateTotal()
    const uid = user.uid
    const sDT = JSON.parse(selected)
    let data = {cartItems, itemsTotal, uid, sDT}

    addDocument(data, true).then(() => {
      cartItems.map(async item => await updateDocument({quantity: increment(-item.quantity), sold: increment(item.quantity)}, item.id))
      clearCart()
      navigate("/")
    })
  }

  return (
    <div>
      <p>items in cart: {cart.length}</p>
      <p>Total: RM{calculateTotal()}</p>
      <Button variant="danger" onClick={clearCart}>clear</Button>
      <Button variant="success" disabled={!selected} onClick={purchase}>clear</Button>
      <Form.Select size="lg" option={deliveryType} value={selected} onChange={(e) => setSelected(e.target.value)}>
        {deliveryType.map((d, i) => (
          <option key={i} name={d.type} value={JSON.stringify(d)} onChange={handleChange}>{d.show}</option>
        ))}
      </Form.Select>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Img</th>
            <th>Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((x, index) => (
            <tr key={x.id}>
              <td>{index}</td>
              <td><Image src={x.imgURL} thumbnail width={100} height={100}/></td>
              <td>{x.name}</td>
              <td>{x.price.toFixed(2)}</td>
              <td>{x.quantity}</td>
              <td>
              <Stack gap={2} className="col-xs-12 col-md-9 mx-auto">
                <Button variant="primary" onClick={() => updateCartItem(x.id, 3) }>increment</Button>
                <Button variant="primary" onClick={() => updateCartItem(x.id, 1)}>decrement</Button>
                <Button variant="danger" onClick={() => deleteFromCart(x.id)}>remove</Button>
              </Stack>  
              </td>
            </tr>
          ))}
          
        </tbody>
      </Table>
    </div>
  )
}