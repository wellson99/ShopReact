import { useState } from 'react'

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Rating from '@mui/material/Rating';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Collapse from '@mui/material/Collapse';
import FeedbackRoundedIcon from '@mui/icons-material/FeedbackRounded';

const alertText = "Unable to upload review. Make sure you fill in all the review details."

export default function ReviewModal({show, setShow, item, index, uploadReview, uploadingReview, rating, setRating, review, setReview}){
  const [showError, setShowError] = useState(false)

  const handleModalClose = () => {
    setShow(false)
    setRating(null)
    setReview("")
    setShowError(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if(!rating || review === ""){
      setShowError(true)
      return
    }
    setShowError(false)
    console.log(rating, review, index)
    uploadReview(rating, review, index)
  }

  return(
    <div>
      {item && (
        <Dialog open={show} onClose={handleModalClose} fullWidth maxWidth="sm">
          <DialogTitle>Reviewing {item.name}</DialogTitle>
          <DialogContent>
            <Box sx={{py:1}}>
              <Grid container sx={{pb:2}}>
                <Grid item xs={5} >
                  <Avatar variant="square" alt={item.name} src={item.imgURL} sx={{width:150, height:150}} />  
                </Grid>
    
                <Grid item xs={7} >
                  <Stack >
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
                      <Typography variant="body1" component="span" fontWeight={700}>RM {(item.price * item.quantity).toFixed(2)}</Typography>
                    </Box>
                  </Stack>
                </Grid>
              </Grid>
            </Box>

            <Collapse in={showError}>
              <Alert color="error" icon={<FeedbackRoundedIcon/>}>
                <Typography variant="body2" component="span" fontWeight={600}>{alertText}</Typography>
              </Alert>
            </Collapse>
              
            <Box sx={{py:1}}>
              <Stack>
                <Typography variant="body1" component="span" fontWeight={700}>Rating</Typography>
                <Rating name="review-rating" value={rating} precision={0.5} size="large" disabled={uploadingReview}
                  onChange={(e, newRatingVal) => setRating(newRatingVal)} />
              </Stack>
              <Stack>
                <Typography variant="body1" component="span" fontWeight={700} sx={{mb:1}}>Review</Typography>
                <TextField id="outlined-textarea" label="Multiline Placeholder" placeholder="Placeholder" size="small" multiline fullWidth
                  value={review} onChange={(e) => setReview(e.target.value)} disabled={uploadingReview}/>
              </Stack>
            </Box>
          </DialogContent>
          <DialogActions>
            {!uploadingReview
              ?(<>
                <Button color="error" onClick={handleModalClose}>Cancel</Button>
                <Button onClick={handleSubmit}>Upload Review</Button>   
              </>)
              :(<>
                <Stack direction="row" spacing={2} sx={{pb:1, mr:2}}>
                  <CircularProgress size={23} />
                  <Typography variant="body1" component="span" >Please wait, uploading review...</Typography>
                </Stack>   
              </>)
            }
          </DialogActions>
        </Dialog>
      )}
    </div>
  )
}