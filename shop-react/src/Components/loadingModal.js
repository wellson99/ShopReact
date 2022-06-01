import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';

import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';

export default function LoadingModal({show, setShow, loading, error, message}){
  const handleCloseModal = () => {
    if(error) setShow(false)
  }

  return(
    <Dialog open={show} onClose={handleCloseModal} fullWidth maxWidth="xs">
      <DialogContent>
        <Grid container justifyContent="center" alignItems="center" sx={{mb:1}}>
          {loading  
            ?<Typography variant="h5" component="p" fontWeight="500">{message.title}</Typography>
            :<Typography variant="h5" component="p" fontWeight="500">Attention</Typography>
          }
        </Grid>
        
        <Grid container justifyContent="center" alignItems="center">
          {loading && (
            <Stack direction="column" spacing={2} sx={{py:1, pt:3}}>
              <CircularProgress size={85} sx={{mx:"auto", mb:2}} />
              <DialogContentText sx={{mx:"auto"}}>{message.body}</DialogContentText>
            </Stack>
          )}
          {error && (
            <Stack direction="column" spacing={2} sx={{py:1}}>
              <ErrorRoundedIcon color="error" sx={{fontSize:100, mx:"auto"}} />
              <DialogContentText sx={{mx:"auto", pb:2}}>{error}</DialogContentText>
              <Button onClick={() => setShow(false)}>Ok, got it.</Button>
            </Stack>
          )}
        </Grid>
      </DialogContent>
    </Dialog>
  )
}