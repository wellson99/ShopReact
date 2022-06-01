// import Table from 'react-bootstrap/Table'
// import Image from 'react-bootstrap/Image'
// import Button from "react-bootstrap/Button"
// import Stack from "react-bootstrap/Stack"
import { useCartContext } from "../Hooks/useCartContext"
import { useAuthContext } from "../Hooks/useAuthContext"
import { timestamp } from '../Firebase/config'
// import Form from 'react-bootstrap/Form'
import { useState } from 'react'
import {useFirestore} from "../Hooks/useFirestore"
import { useNavigate } from 'react-router-dom'
import { increment } from 'firebase/firestore'

import Paper from "@mui/material/Paper"
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from "@mui/material/Divider"
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';

import PointOfSaleRoundedIcon from '@mui/icons-material/PointOfSaleRounded';
import RemoveShoppingCartRoundedIcon from '@mui/icons-material/RemoveShoppingCartRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import IndeterminateCheckBoxRoundedIcon from '@mui/icons-material/IndeterminateCheckBoxRounded';

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
  const [selected, setSelected] = useState(deliveryType[0])

  const calculateTotal = () =>{
    let total = 0
    cart.map(c => total += (c.price * c.quantity))
    return total.toFixed(2)
  }

  const calculateGrandTotal = () =>{
    return (selected.price + parseFloat(calculateTotal())).toFixed(2)
  }

  const handleChange = (event) => {
    setSelected(event.target.value)
  }

  const purchase = () => {
    const cartItems = cart.map(item => ({...item, isReviewed: false, rating: null, review: null, createdAt: null}))
    const itemsTotal = calculateTotal()
    const uid = user.uid
    const delivery = selected
    let data = {cartItems, itemsTotal, uid, delivery}

    addDocument(data, true).then(() => {
      cartItems.map(async item => await updateDocument({quantity: increment(-item.quantity), sold: increment(item.quantity)}, item.id))
      clearCart()
      navigate("/")
    })
  }

  return (
    <div>
      {cart && (
        <Box sx={{my:5}}>
          <Grid container justifyContent="space-around" alignItems="flex-start">
            <Grid item xs={12} sm={9} xl={6}>
              {cart.map(item => (
                <Paper elevation={5} key={item.id} sx={{mb:3}}>
                  <Box sx={{p:1}}>
                    
                      <Grid container sx={{pb:2}} alignItems="center">
                        <Box>
                          <Avatar variant="square" alt={item.name} src={item.imgURL} sx={{width:120, height:120}} />  
                        </Box>

                        <Box sx={{flexGrow:1}}>
                          <Stack spacing={0}>
                          <Box>
                              <Typography variant="h6" component="span" fontWeight={700}>{item.name}</Typography>
                            </Box>
                            <Box>
                              <Typography variant="body1" component="span">Price per piece: </Typography>
                              <Typography variant="body1" component="span" fontWeight={700}>RM {item.price.toFixed(2)}</Typography>
                            </Box>
                            <Box>
                              <Typography variant="body1" component="span">Quantity: </Typography>
                              <Typography variant="body1" component="span" fontWeight={700}>{item.quantity} pieces</Typography>
                            </Box>
                            <Box>
                              <Typography variant="body1" component="span">Total price: </Typography>
                              <Typography variant="body1" component="span" fontWeight={700}>RM {(item.price*item.quantity).toFixed(2)}</Typography>
                            </Box>
                          </Stack>
                        </Box>

                        <Box sx={{pr:2}}>
                            <Stack spacing={1}>
                              <Box component="div" sx={{textAlign:"right"}}>
                                <Button variant="contained" size="small" startIcon={<AddBoxRoundedIcon/>} 
                                  onClick={() => updateCartItem(item.id, item.quantity += 1)}>
                                  Increment item
                                </Button>
                              </Box>
                              <Box component="div" sx={{textAlign:"right"}}>
                                <Button variant="contained" size="small" startIcon={<IndeterminateCheckBoxRoundedIcon/>} disabled={item.quantity <= 1} 
                                  onClick={() => updateCartItem(item.id, item.quantity -= 1)}>
                                  Decrement Item
                                </Button>
                              </Box>
                              <Box component="div" sx={{textAlign:"right"}}>
                                <Button variant="contained" size="small" color="error" startIcon={<DeleteRoundedIcon/>} 
                                  onClick={() => deleteFromCart(item.id)}>
                                  Remove from cart
                                </Button>
                              </Box>
                            </Stack>
                        </Box>
                      </Grid>
                  </Box>
                </Paper>
              ))}
            </Grid>

            <Grid item xs={12} sm={9} xl={4}>
              <Paper elevation={5}>
                <Box sx={{p:2}}>
                  <Grid container sx={{pb:2}}>
                    <Grid item sx={{flexGrow:1}}>
                      <Typography variant="h6" component="span" fontWeight={600}>Cart Summary</Typography>
                      <Divider sx={{mt:1}}/>
                    </Grid>
                  </Grid>

                  <Grid container sx={{pb:1}}>
                    <Grid item sx={{flexGrow:1}}>
                      <Typography variant="body1" component="span">Items in cart:&nbsp;</Typography>
                      <Typography variant="h6" component="span">{cart.length}</Typography>
                    </Grid>
                  </Grid>

                  <Grid container sx={{pb:1}}>
                    <Grid item sx={{flexGrow:1}}>
                      <Typography variant="body1" component="span">Items Total:&nbsp;</Typography>
                      <Typography variant="h6" component="span">RM {calculateTotal()}</Typography>
                    </Grid>
                  </Grid>

                  <Grid container sx={{pb:1}}>
                    <Grid item sx={{flexGrow:1}}>
                      <Typography variant="body1" component="span">Delivery Method:</Typography><br/>
                      <FormControl size="small" sx={{mt:1, width:{xs:"100%", md:"70%", xl:"60%"}}}>
                        <InputLabel id="demo-simple-select-label">Delivery Type</InputLabel>
                        <Select labelId="demo-simple-select-label" id="demo-simple-select" defaultValue={selected} value={selected} label="Delivery Type" onChange={handleChange}>
                          {deliveryType.map((d, i) => (<MenuItem key={i} value={d}>{d.show}</MenuItem>))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>

                  <Grid container sx={{pb:3}}>
                    <Grid item sx={{flexGrow:1}}>
                      <Typography variant="body1" component="span">Grand Total:&nbsp;</Typography>
                      <Typography variant="h6" component="span">RM {calculateGrandTotal()}</Typography>
                    </Grid>
                  </Grid>

                  <Stack spacing={2}>
                    <Box component="div" sx={{textAlign:"center"}}>
                      <Button variant="contained" startIcon={<PointOfSaleRoundedIcon/>} sx={{width:{xs:"80%", md:"60%", xl:"50%"}}} onClick={purchase}
                        disabled={cart.length === 0}>
                        Purchase Items
                      </Button>
                    </Box>
                    <Box component="div" sx={{textAlign:"center"}}>
                      <Button color="error" startIcon={<RemoveShoppingCartRoundedIcon/>} sx={{width:{xs:"80%", md:"60%", xl:"50%"}}} onClick={clearCart}
                        disabled={cart.length === 0}>
                        Empty Cart
                      </Button>
                    </Box>
                  </Stack>


                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      )}
    </div>
  )
}