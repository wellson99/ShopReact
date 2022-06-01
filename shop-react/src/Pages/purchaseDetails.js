import { useParams } from "react-router-dom"
import { useGetDoc } from "../Hooks/useGet"
import { useState, useEffect } from "react"
import ReviewModal from "../Components/reviewModal"
import { useFirestore } from "../Hooks/useFirestore"
import { doc, getDoc, increment } from "firebase/firestore"
import { db, timestamp } from "../Firebase/config"
import { useAuthContext } from "../Hooks/useAuthContext"

import { PageHeader } from "../Components/pageHeader"

import Paper from "@mui/material/Paper"
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Rating from '@mui/material/Rating';
import Alert from '@mui/material/Alert';
import Button from "@mui/material/Button"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RateReviewRoundedIcon from '@mui/icons-material/RateReviewRounded';
import FeedbackRoundedIcon from '@mui/icons-material/FeedbackRounded';

const alertText = "Seems like you haven't review this product, review it now!"
const headerTitle = "Purchase Details"
const headerDescription = "View all of your purchase details."

export default function PurchaseDetails() {
  const {id} = useParams()
  const {document} = useGetDoc("Purchases", id)
  const {user} = useAuthContext()
  const [show, setShow] = useState(false)
  const [uploadingReview, setUploadingReview] = useState(false)
  const [rating, setRating] = useState(null)
  const [review, setReview] = useState("")
  const [itemIndex, setItemIndex] = useState(null)
  const [selecteditem, setSelecteditem] = useState(null)
  const [purchase, setPurchase] = useState(null)
  const {updateDocument: updateProductReview} = useFirestore("Products")
  const {updateDocument: updatePurchase} = useFirestore("Purchases")


  // console.log(document)
  const uploadReview = async (rating, review, index) => {
    setUploadingReview(true)
    const currentTime = timestamp.now()
    const productId = purchase.cartItems[index].id
    const newReview = {review, rating, postedBy: user.displayName, createdAt: currentTime}
    const docSnap = await getDoc(doc(db, "Products", productId))
    const productToUpdate = docSnap.data()
    let prodRating = productToUpdate.rating
    let prodReviews = productToUpdate.review
    let updatedReviews = prodReviews + 1
    let updatedRating = null

    if(prodReviews === 0){
      updatedRating = prodRating + rating
      console.log(updatedRating, rating, prodRating)
    }else{
      let totalRating = prodRating * prodReviews
      updatedRating = (totalRating + rating) / updatedReviews
      console.log(updatedRating, totalRating, rating, updatedReviews, prodRating, prodReviews)
    }

    updateProductReview({
        userReviews: [...productToUpdate.userReviews, newReview],
        rating: Number(updatedRating.toFixed(1)),
        review: increment(1)
      }, productId)
      .then(() => {
        console.log("finish update")
        setPurchase(async (prevState) => {
          const purc = {...prevState}
          const cartItems = purc.cartItems[index]
          purc.cartItems[index] = {...cartItems, isReviewed: true, rating, review, createdAt: currentTime}
          await updatePurchase({cartItems: purc.cartItems}, purc.id)
          return purc
        })
        setShow(false)
        setUploadingReview(false)
        setRating(null)
        setReview("")
        console.log("update success",purchase)
    })
  }

  const reviewPurchasedItem = (item, index) => {
    setShow(true)
    setItemIndex(index)
    setSelecteditem(item)
  }

  const formatDate = (timestamp) => {
    const dateObj = new Date(timestamp.seconds * 1000) 
    const date = dateObj.toLocaleString(undefined, {day:"numeric", month:"short", year:"numeric"})
    const time = dateObj.toLocaleString(undefined, {hour12:true, hour:"numeric", minute:"numeric"})
    return `${date} at ${time}`
  }

  useEffect(() => {
    if(document) setPurchase(document)
  }, [document])
  
  return (
    <Box sx={{my:3, mx:{xs:3, md:7, lg:10}}}>
      <PageHeader title={headerTitle} description={headerDescription} />

      <Grid container justifyContent="center" alignItems="center" sx={{py:3}}>
        <Grid item xs={12} sm={10} md={9} xl={8}>
          <Paper elevation={10}>
            <Box sx={{p:2}}>
              {purchase && (<>
                <Grid container sx={{pb:2}}>
                  <Grid item sx={{flexGrow:1}}>
                    <Typography variant="body1" component="span">Showing details for purchase</Typography><br/>
                    <Typography variant="h6" component="span">{purchase.id}</Typography>
                  </Grid>
                </Grid>

                <Grid container sx={{pb:2}}>
                  <Grid item xs={12} md={3}>
                    <Typography variant="body1" component="span">Purchase Price</Typography><br/>
                    <Typography variant="h6" component="span">RM {purchase.itemsTotal}</Typography>
                  </Grid>
                  <Grid item xs={12} md={9}>
                    <Typography variant="body1" component="span">Purchase Date</Typography><br/>
                    <Typography variant="h6" component="span">{formatDate(purchase.createdAt)}</Typography>
                  </Grid>
                </Grid>

                <Grid container sx={{pb:2}}>
                  <Grid item xs={12} md={4} sx={{pr:3}}>
                    <Typography variant="body1" component="span">Item(s) in Purchase</Typography><br/>
                    <Typography variant="h6" component="span">{purchase.cartItems.length} items</Typography>
                  </Grid>
                  <Grid item xs={12} md={4} sx={{pr:3}}>
                    <Typography variant="body1" component="span">Delivery Type</Typography><br/>
                    <Typography variant="h6" component="span">{purchase.delivery.type}</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body1" component="span">Delivery Cost</Typography><br/>
                    <Typography variant="h6" component="span">RM {purchase.delivery.price}</Typography>
                  </Grid>
                </Grid>

                <Grid container sx={{pb:2}}>
                  <Grid item sx={{flexGrow:1}}>
                    <Typography variant="body1" component="span">Items in purchse</Typography><br/>
                    <Box sx={{mt:1}}>
                      {purchase.cartItems.map((item, index) => (
                        <Accordion key={item.id} TransitionProps={{unmountOnExit:true}} sx={{backgroundColor:"#fafafa"}}>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                            <Typography variant="h6" component="span">{item.name}</Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Grid container sx={{pb:2}}>
                              <Grid item xs={5} xl={2}>
                                <Avatar variant="square" alt={item.name} src={item.imgURL} sx={{width:150, height:150}} />  
                              </Grid>

                              <Grid item xs={7} xl={2}>
                                <Stack spacing={1}>
                                  <Box>
                                    <Typography variant="body1" component="span">Price per piece</Typography><br/>
                                    <Typography variant="body1" component="span" fontWeight={700}>RM {item.price.toFixed(2)}</Typography>
                                  </Box>
                                  <Box>
                                    <Typography variant="body1" component="span">Purchased quantity</Typography><br/>
                                    <Typography variant="body1" component="span" fontWeight={700}>{item.quantity} pieces</Typography>
                                  </Box>
                                  <Box>
                                    <Typography variant="body1" component="span">Total price</Typography><br/>
                                    <Typography variant="body1" component="span" fontWeight={700}>RM {(item.price*item.quantity).toFixed(2)}</Typography>
                                  </Box>
                                </Stack>
                              </Grid>

                              <Grid item xs={12} xl={8}>
                                <Stack spacing={1}>
                                  <Typography variant="body1" component="span" fontWeight={700}>Ratings	&amp; Review</Typography>
                                  {item.isReviewed && (<>
                                    <Typography variant="body2" component="span">Reviewed on <strong>{item.createdAt.toDate().toString()}</strong></Typography>
                                    <Stack direction="row" spacing={1}>
                                      <Rating name="read-only" value={item.rating} readOnly precision={0.1} />
                                      <Typography component="legend">({item.rating})</Typography>
                                    </Stack>
                                    <Typography variant="body1" component="span" fontWeight={400}>{item.review}</Typography>
                                  </>)}
                                  {!item.isReviewed && (<>
                                    <Alert color="primary" icon={<FeedbackRoundedIcon/>}>
                                      <Typography variant="body2" component="span" fontWeight={600}>{alertText}</Typography>
                                    </Alert>
                                    <Box sx={{pt:1, textAlign: "center"}}>
                                      <Button variant="contained" size="large" sx={{width:{xs:"80%", md:"60%", xl:"40%"}}} 
                                      startIcon={<RateReviewRoundedIcon/>} onClick={() => reviewPurchasedItem(item, index)}>
                                        Review Product
                                      </Button>
                                    </Box>
                                  </>)}
                                </Stack>
                              </Grid>
                            </Grid>
                          </AccordionDetails>
                        </Accordion>
                      ))}
                      <ReviewModal show={show} setShow={setShow} item={selecteditem} index={itemIndex} uploadReview={uploadReview} uploadingReview={uploadingReview} 
                        rating={rating} setRating={setRating} review={review} setReview={setReview}/>
                    </Box>
                  </Grid>
                </Grid>
              </>)}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}