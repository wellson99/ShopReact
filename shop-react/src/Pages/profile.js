import { useState } from "react"
import { useAuthContext } from "../Hooks/useAuthContext"

import { PageHeader } from "../Components/pageHeader"

import Paper from "@mui/material/Paper"
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Typography from "@mui/material/Typography";
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import Tooltip from "@mui/material/Tooltip";

import { grey } from '@mui/material/colors';

import { updateProfile, updatePassword } from "firebase/auth"
import { getStorage, ref, deleteObject, getDownloadURL, uploadBytes } from "firebase/storage"

const headerTitle = "Profile"
const headerDescription = "View all of your profile details here."

export default function Profile() {
  const {user, dispatch} = useAuthContext()
  const [showModal, setShowModal] = useState(false)

  // const photoURL = useState(user.photoURL)
  const [updatingProfilePic, setUpdatingProfilePic] = useState(false)

  const [displayName, setDisplayName] = useState(user.displayName)
  const [showDisplayNameForm, setShowDisplayNameForm] = useState(false)
  const [updatingDisplayName, setUpdatingDisplayName] = useState(false)

  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [updatingPassword, setUpdatingPassword] = useState(false)

  const updateProfilePic = async (e) => {
    setUpdatingProfilePic(true)
    const image = e.target.files[0]
    const imageType = image.type.split("/")[1]
    const imageMetadata = {contentType: image.type}
    const storageRef = ref(getStorage(), `profileImages/${user.uid}.${imageType}`)

    if(user.photoURL){
      const deleteRef = ref(getStorage(), user.photoURL)
      await deleteObject(deleteRef).catch(error => console.log(error.message))
    }
    uploadBytes(storageRef, image, imageMetadata).then(async (snapshot) => {
      let newPhotoURL = await getDownloadURL(snapshot.ref)
      updateProfile(user, {photoURL: newPhotoURL}).then(() => {
        dispatch({type: 'UPDATE', payload: user})
        setUpdatingProfilePic(false)
      })
    })
  }

  const removeProfilePic = async () => {
    setUpdatingProfilePic(true)
    const deleteRef = ref(getStorage(), user.photoURL)
    await deleteObject(deleteRef).catch(error => console.log(error.message))
    updateProfile(user, {photoURL: ""}).then(() => {
      dispatch({type: 'UPDATE', payload: user})
      setUpdatingProfilePic(false)
    })
  }

  const updateDisplayName = () => {
    setUpdatingDisplayName(true)
    updateProfile(user, {displayName}).then(() => {
      dispatch({type: 'UPDATE', payload: user})
      setUpdatingDisplayName(false)
      setShowDisplayNameForm(false)
    })
  }

  const updateUserPassword = () => {
    setUpdatingPassword(true)
    updatePassword(user, password).then(() => {
      setUpdatingPassword(false)
      setShowPasswordForm(false)
      setShowPassword(false)
      setPassword("")
    }).catch(error => {
      setUpdatingPassword(false)
      console.log(error.message)
    })
  }

  const getDisplayNameInitials = () => {
    if(user.displayName.includes(" ")){
      let firstName =  user.displayName.split(" ")[0]
      let lastName =  user.displayName.split(" ")[1]
      return firstName.substr(0,1) + lastName.substr(0,1)
    }else{
      return user.displayName.substr(0,1)
    }
  }

  return (
    <Box sx={{my:3, mx:{xs:3, md:7, lg:10}}}>
      <PageHeader title={headerTitle} description={headerDescription} />

      <Grid container justifyContent="center" alignItems="center" sx={{py:3}}>
        <Grid item xs={12} sm={9} xl={6}>
          <Paper elevation={10}>
            {user && (
              <Grid container sx={{p:2}}>
                <Grid item xs={12} md={4} alignContent="center" sx={{mb:2}}>
                  <Grid container justifyContent="center" alignItems="center">
                    <Stack spacing={2}>
                      {user.photoURL
                        ?<Avatar alt={user.displayName} src={user.photoURL} sx={{width:150, height:150}} />
                        :<Avatar sx={{bgcolor:grey[50], width:150, height:150}}>
                          <Typography variant="h3" noWrap component="span" color="#1976d2">{getDisplayNameInitials()}</Typography>
                        </Avatar>
                      }
                      <Stack spacing={1}>
                        <Button color="primary" size="small" component="label" sx={{mt:2}} disabled={updatingProfilePic} >
                          {user.photoURL ?"Change Picture" :"Add Picture"}
                          <input type="file" hidden onChange={updateProfilePic}/>
                        </Button>
                        {user.photoURL && (
                          <Button color="error" size="small" component="label" sx={{mt:2}} disabled={updatingProfilePic} onClick={removeProfilePic} >
                            Remove Picutre
                          </Button>
                        )}
                      </Stack>
                    </Stack>
                  </Grid>
                </Grid>

                <Grid item xs={12} md={8}>
                  <Grid container sx={{pb:2}}>
                    <Grid item sx={{flexGrow:1}}>
                      <Typography variant="body1" component="span">Email</Typography><br/>
                      <Typography variant="h6" component="span">{user.email}</Typography>
                    </Grid>
                  </Grid>

                  <Grid container sx={{pb:2}}>
                    <Grid item sx={{flexGrow:1}}>
                      <Typography variant="body1" component="span">Username</Typography><br/>
                      {!showDisplayNameForm && <Typography variant="h6" component="span">{user.displayName}</Typography>}
                      {showDisplayNameForm && (<>
                        <TextField fullWidth id="standard-basic" label="New username" variant="outlined" size="small" sx={{mt:1}} disabled={updatingDisplayName}
                          value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                        {!updatingDisplayName && (
                          <Stack direction="row" spacing={2} sx={{py:1}}>
                            <Button variant="contained" size="small" onClick={updateDisplayName}>Update</Button>
                            <Button color="error" size="small" onClick={() => {setShowDisplayNameForm(false); setDisplayName(user.displayName)}}>Cancel</Button>
                          </Stack>
                        )}
                        {updatingDisplayName && (
                          <Stack direction="row" spacing={2} sx={{py:1}}>
                            <CircularProgress size={23} />
                            <Typography variant="body1" component="span" >Please wait, updating name...</Typography>
                          </Stack>
                        )}
                      </>)}
                    </Grid>
                    <Grid item>
                      <Grid container justifyContent="flex-end" alignItems="flex-start">
                        {!showDisplayNameForm && (
                          <IconButton aria-label="delete" size="small" onClick={() => setShowDisplayNameForm(true)}>
                            <EditRoundedIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid container>
                    <Grid item sx={{flexGrow:1}}>
                      <Typography variant="body1" component="span">Password</Typography><br/>
                      {!showPasswordForm && <Button variant="contained" onClick={() => setShowPasswordForm(true)}>Update Password</Button>}
                      {showPasswordForm && (<>
                        <FormControl sx={{mt:1}} variant="outlined" size="small" fullWidth>
                          <InputLabel htmlFor="outlined-adornment-password" margin="dense">New Password</InputLabel>
                          <OutlinedInput id="outlined-adornment-password" label="New Password" disabled={updatingPassword} 
                            type={showPassword ?"text" :"password"} value={password} onChange={(e) => setPassword(e.target.value)} endAdornment={
                              <InputAdornment position="end">
                                <Tooltip title={showPassword ?"Hide password" :"Show password"}>
                                  <IconButton aria-label="toggle password visibility" edge="end" disabled={updatingPassword} 
                                    onClick={() => setShowPassword(!showPassword)} onMouseDown={() => setShowPassword(!showPassword)}>
                                    {showPassword ?<VisibilityOff /> :<Visibility />}
                                  </IconButton>
                                </Tooltip>
                              </InputAdornment>
                            }
                          />
                        </FormControl>
                        
                        {!updatingPassword && (
                          <Stack direction="row" spacing={2} sx={{py:1}}>
                            <Button variant="contained" size="small" onClick={updateUserPassword}>Update</Button>
                            <Button color="error" size="small" onClick={() => {setShowPasswordForm(false); setPassword(""); setShowPassword(false)}}
                            >Cancel</Button>
                          </Stack>
                        )}
                        {updatingPassword && (
                          <Stack direction="row" spacing={2} sx={{py:1}}>
                            <CircularProgress size={23} />
                            <Typography variant="body1" component="span" >Please wait, updating name...</Typography>
                          </Stack>
                        )}
                      </>)}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}