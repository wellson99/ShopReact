import {Link} from 'react-router-dom'
import { useState } from 'react'
import { useSignup } from '../Hooks/useSignup'

import Paper from "@mui/material/Paper"
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FeedbackRoundedIcon from '@mui/icons-material/FeedbackRounded';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import IconButton from '@mui/material/IconButton';
import Tooltip from "@mui/material/Tooltip";
import Alert from "@mui/material/Alert";
import Collapse from "@mui/material/Collapse";

import LoadingModal from "../Components/loadingModal"

const message = {title: "Loading", body: "Creating your account, please wait..."}
const alertText = "Unable to upload review. Make sure you fill in all the review details."

export default function Signup() {
  const [email, setEmail] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [alertError, setAlertError] = useState(false)
  const {signup, actionPending, error} = useSignup()
  const [signingUp, setSigningUp] = useState(false)
  
  const handleKeyDown = (e) => {
    if(e.key === 'Enter')   handleSignUp(e)
  }

  const handleSignUp = (e) => {
    if(email === "" || displayName === "" || password === ""){
      setAlertError(true)
      return
    }
    e.preventDefault()
    console.log(email, password, displayName)
    setAlertError(false)
    setSigningUp(true)
    setShowModal(true)
    signup(email, password, displayName).then(() => setSigningUp(false))
  }

  return (
    <Box sx={{my:5}}>
      <Grid container justifyContent="center" alignItems="center">
        <Grid item xs={12} sm={9} md={7} lg={5}>
          <Paper elevation={10}>
            <Box sx={{p:2, mx:3}}>
              <Grid container justifyContent="center" alignItems="center" sx={{pb:1}}>
                <Grid item>
                  <Typography variant="h5" component="span" fontWeight={500}>Sign Up</Typography><br/>
                </Grid>
              </Grid>

              <Box sx={{py:2}}>
                <Collapse in={error ?true :false}>
                  <Alert color="error" icon={<FeedbackRoundedIcon/>}>
                    <Typography variant="body2" component="span" fontWeight={600}>{error}</Typography>
                  </Alert>
                </Collapse>
                <Collapse in={alertError ?true :false}>
                  <Alert color="error" icon={<FeedbackRoundedIcon/>}>
                    <Typography variant="body2" component="span" fontWeight={600}>{alertText}</Typography>
                  </Alert>
                </Collapse>
              </Box>

              <Grid container sx={{pb:2}}>
                <Grid item sx={{flexGrow:1}}>
                  <Typography variant="body1" component="span">Username</Typography><br/>
                  <TextField required type="text" fullWidth id="signup-dName" label="Username" variant="outlined" size="small" sx={{mt:1}} 
                    disabled={signingUp} value={displayName} onChange={(e) => setDisplayName(e.target.value)} onKeyDown={handleKeyDown} />
                </Grid>
              </Grid>

              <Grid container sx={{pb:2}}>
                <Grid item sx={{flexGrow:1}}>
                  <Typography variant="body1" component="span">Email</Typography><br/>
                  <TextField required type="email" fullWidth id="signup-email" label="User Email" variant="outlined" size="small" sx={{mt:1}} 
                    disabled={signingUp} value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={handleKeyDown} />
                </Grid>
              </Grid>

              <Grid container sx={{pb:2}}>
                <Grid item sx={{flexGrow:1}}>
                  <Typography variant="body1" component="span">Password</Typography><br/>
                  <FormControl sx={{mt:1}} variant="outlined" size="small" fullWidth>
                    <InputLabel htmlFor="outlined-adornment-password" margin="dense">Password</InputLabel>
                    <OutlinedInput required id="outlined-adornment-password" label="Password" disabled={signingUp} onKeyDown={handleKeyDown}
                      type={showPassword ?"text" :"password"} value={password} onChange={(e) => setPassword(e.target.value)} endAdornment={
                        <InputAdornment position="end">
                          <Tooltip title={showPassword ?"Hide password" :"Show password"}>
                            <IconButton aria-label="toggle password visibility" edge="end" disabled={signingUp} 
                              onClick={() => setShowPassword(!showPassword)} onMouseDown={() => setShowPassword(!showPassword)}>
                              {showPassword ?<VisibilityOff /> :<Visibility />}
                            </IconButton>
                          </Tooltip>
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                </Grid>
              </Grid>

              <Stack spacing={1} >
                <Box component="div" sx={{mt:2,textAlign:"center"}}>
                  <Button type="submit" color="primary" variant="contained" component="label" sx={{width:{xs:"80%", md:"60%", lg:"40%"}}} disabled={signingUp}
                    onClick={handleSignUp} >
                    Sign Up
                  </Button>    
                </Box>         
                <Box component="div" sx={{textAlign:"center"}}>
                  <Link to="/signin">
                    <Button color="primary" size="small" component="label" sx={{ width:{xs:"80%", md:"60%", lg:"50%"}}} disabled={signingUp}>
                      Already have an account? Log in now!
                    </Button> 
                  </Link>   
                </Box>  
              </Stack>

            </Box>
          </Paper>
        </Grid>
      </Grid>

      <LoadingModal show={showModal} setShow={setShowModal} loading={actionPending} error={error} message={message} />
    </Box>
  )
}