// import Col from "react-bootstrap/Col"
// import Row from "react-bootstrap/Row"
// import Button from "react-bootstrap/Button"
// import Container from "react-bootstrap/Container"
// import Stack from "react-bootstrap/Stack"
// import Image from "react-bootstrap/Image"
import { useLocation, useParams } from "react-router-dom"

import { useCartContext } from "../Hooks/useCartContext"
import { useGetDoc } from "../Hooks/useGet"

import { PageHeader } from "../Components/pageHeader"

import Paper from "@mui/material/Paper"
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Rating from "@mui/material/Rating";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

import AddShoppingCartRoundedIcon from '@mui/icons-material/AddShoppingCartRounded';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import RemoveCircleRoundedIcon from '@mui/icons-material/RemoveCircleRounded';
import { useState } from "react";

const headerTitle = "Product Details"
const headerDescription = "View the product details here."

export default function ProductDetails() {
  const params = useParams()
  const {document:product} = useGetDoc("Products", params.id)
  const [quantity, setQuantity] = useState(1)

  // const location = useLocation()
  // const {product} = location.state
  const {addToCart} = useCartContext()

  // console.log(product)

  const increment = () => setQuantity(prevState => prevState += 1)
  const decrement = () => setQuantity(prevState => prevState -= 1)

  const addProductToCart = () => {
    let data = {id: product.id, name: product.name, imgURL: product.imgURL, price: product.price, quantity}
    addToCart(data)
    setQuantity(1)
  }

  const formatDate = (timestamp) => {
    const dateObj = new Date(timestamp.seconds * 1000) 
    const date = dateObj.toLocaleString(undefined, {day:"numeric", month:"short", year:"numeric"})
    const time = dateObj.toLocaleString(undefined, {hour12:true, hour:"numeric", minute:"numeric"})
    return `${date} at ${time}`
  }

  return (
    <Box sx={{my:3, mx:{xs:3, lg:5, xl:10}}} >
      <PageHeader title={headerTitle} description={headerDescription} />

      <Grid container justifyContent="space-around" alignItems="flex-start" sx={{py:3}}>
        {product && (<>
          <Grid item xs={12}  md={7} lg={7}>
            <Paper elevation={4}>
              <Avatar variant="square" alt={product.name} src={product.imgURL} 
                sx={{width:{xs:350, sm:400, lg:500, }, height:{xs:350, sm:400, lg:500, }, mx:"auto"}} />
            </Paper>
          </Grid>

          <Grid item xs={12}  md={4} lg={4}>
            <Paper elevation={4}>
              <Box sx={{p:2}}>
                <Stack spacing={1}> 
                  <Typography variant="h5" component="span" fontWeight={700}>{product.name}</Typography>
                  <Typography variant="h6" component="span" fontWeight={500}>RM {product.price.toFixed(2)}</Typography>
                  <Typography variant="body1" component="span" fontSize={17} >{product.description}</Typography>

                  <Grid container alignItems="center" sx={{py:2}}>
                    <Grid item xs={4}>
                      <Stack alignItems="center" justifyContent="center">
                        <Typography variant="h6" component="span" fontWeight={500} >Ratings</Typography>
                        <Rating name="read-only" value={product.rating} readOnly precision={0.1} color="primary" sx={{mt:0.3}} />
                      </Stack>
                    </Grid>
                    <Grid item xs={4}>
                      <Stack alignItems="center" justifyContent="center">
                        <Typography variant="h6" component="span" fontWeight={500}>Reviews</Typography>
                        <Typography variant="h5" component="span" fontWeight={700} color="primary">{product.review}</Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={4}>
                      <Stack alignItems="center" justifyContent="center">
                        <Typography variant="h6" component="span" fontWeight={500}>Sold</Typography>
                        <Typography variant="h5" component="span" fontWeight={700} color="primary">{product.sold}</Typography>
                      </Stack>
                    </Grid>
                  </Grid>

                  <Grid container alignItems="center" justifyContent="space-around">
                    <Grid item>
                      <Typography variant="h6" component="span" fontStyle="italic" fontWeight={400} >123 pieces available</Typography>
                    </Grid>

                    <Grid item>
                      <Stack direction="row" spacing={5} alignItems="center" justifyContent="center">
                        <IconButton size="large" color="primary" onClick={decrement} disabled={quantity <= 1}>
                          <RemoveCircleRoundedIcon fontSize="large" />
                        </IconButton>
                        <Typography variant="h4" component="span" fontWeight={500} color="primary">{quantity}</Typography>
                        <IconButton size="large" color="primary" onClick={increment} disabled={quantity >= 10}>
                          <AddCircleRoundedIcon fontSize="large" />
                        </IconButton>
                      </Stack>
                    </Grid>
                  </Grid>
                    
                  <Box sx={{textAlign:"center", py:1}}>
                    <Button type="submit" color="primary" variant="contained" component="label" size="large" sx={{width:{xs:"80%", md:"60%"}}}
                      startIcon={<AddShoppingCartRoundedIcon/>} onClick={addProductToCart}>
                      Add To Cart
                    </Button>  
                  </Box>
                </Stack>
              </Box>
            </Paper>
          </Grid>
        </>)}
      </Grid>

      <Grid container justifyContent="space-around" alignItems="flex-start" sx={{my:4}}>
        <Grid item xs={12}  md={7} lg={7} >
          <Paper elevation={4} >
            <Box sx={{p:2}}>
              <Typography variant="h6" component="span" fontWeight={700}>Reviews</Typography>
        
              <Stack spacing={1} direction="row" alignItems="flex-end" justifyContent="space-between" sx={{mb:1, mt:-1}}>
                <Typography variant="body1" component="span" fontWeight={500} fontSize={17}>Showing reviews</Typography>
                <Button type="submit" color="primary" variant="contained" component="label">Sort By</Button>
              </Stack>
              <Divider sx={{mt:1}}/>

              {product && product.userReviews.map((review, index) => (
                <Box key={index} sx={{pt:2}}>
                  <Stack>
                    <Stack spacing={1} direction="row" alignItems="center" justifyContent="space-between" >
                      <Typography variant="h6" component="span" fontWeight={500}>{review.postedBy}</Typography>
                      <Typography variant="body2" component="span">Reviewed on {formatDate(review.createdAt)}</Typography>
                    </Stack>
                    <Stack spacing={1} direction="row" alignItems="center">
                      <Rating name="read-only" value={review.rating} readOnly precision={0.1} size="small" />
                      <Typography component="legend">({review.rating})</Typography>
                    </Stack>
                    <Typography variant="body1" component="span">{review.review}</Typography>
                    <Divider sx={{mt:1}} />
                  </Stack>
                </Box>
              ))}

            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12}  md={4} lg={4}></Grid>
      </Grid>
    </Box>
  )
}