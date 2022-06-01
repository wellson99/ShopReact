import {useState} from "react"
import {Link} from 'react-router-dom'
import {useSignin} from "../Hooks/useSignin"

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

const message = {
  title: "Loading",
  body: "Signing you in, please wait..."
}

export default function Signin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const {signin, actionPending, error} = useSignin()
  const [signingIn, setSigningIn] = useState(false)
  
  const handleKeyDown = (e) => {
    if(e.key === 'Enter')   handleSignIn(e)
  }

  const handleSignIn = (e) => {
    e.preventDefault()
    setSigningIn(true)
    setShowModal(true)
    signin(email, password).then(() => setSigningIn(false))
  }

  return (
    <Box sx={{my:5}}>
      <Grid container justifyContent="center" alignItems="center">
        <Grid item xs={12} sm={9} md={7} lg={5}>
          <Paper elevation={10}>
            <Box sx={{p:2, mx:3}}>
              <Grid container justifyContent="center" alignItems="center" sx={{pb:1}}>
                <Grid item>
                  <Typography variant="h5" component="span" fontWeight={500}>Sign In</Typography><br/>
                </Grid>
              </Grid>

              <Box sx={{py:2}}>
                <Collapse in={error ?true :false}>
                  <Alert color="error" icon={<FeedbackRoundedIcon/>}>
                    <Typography variant="body2" component="span" fontWeight={600}>{error}</Typography>
                  </Alert>
                </Collapse>
              </Box>

                <Grid container sx={{pb:2}}>
                  <Grid item sx={{flexGrow:1}}>
                    <Typography variant="body1" component="span">Email</Typography><br/>
                    <TextField required type="email" fullWidth id="signin-email" label="User Email" variant="outlined" size="small" sx={{mt:1}} 
                      disabled={signingIn} value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={handleKeyDown} />
                  </Grid>
                </Grid>

                <Grid container sx={{pb:2}}>
                  <Grid item sx={{flexGrow:1}}>
                    <Typography variant="body1" component="span">Password</Typography><br/>
                    <FormControl sx={{mt:1}} variant="outlined" size="small" fullWidth>
                      <InputLabel htmlFor="outlined-adornment-password" margin="dense">Password</InputLabel>
                      <OutlinedInput required id="outlined-adornment-password" label="Password" disabled={signingIn} onKeyDown={handleKeyDown}
                        type={showPassword ?"text" :"password"} value={password} onChange={(e) => setPassword(e.target.value)} endAdornment={
                          <InputAdornment position="end">
                            <Tooltip title={showPassword ?"Hide password" :"Show password"}>
                              <IconButton aria-label="toggle password visibility" edge="end" disabled={signingIn} 
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
                    <Button type="submit" color="primary" variant="contained" component="label" sx={{width:{xs:"80%", md:"60%", lg:"40%"}}} disabled={signingIn}
                      onClick={handleSignIn} >
                      Sign In
                    </Button>    
                  </Box>         
                  <Box component="div" sx={{textAlign:"center"}}>
                    <Link to="/signup">
                      <Button color="primary" size="small" component="label" sx={{ width:{xs:"80%", md:"60%", lg:"40%"}}} disabled={signingIn}>
                        Don't have an account? Sign up now!
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