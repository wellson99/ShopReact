import Modal from 'react-bootstrap/Modal'
import {useNavigate} from 'react-router-dom'
import Stack from 'react-bootstrap/Stack'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { useState } from 'react'
import { updateProfile, updatePassword } from "firebase/auth"
import { useAuthContext } from '../Hooks/useAuthContext' 
import { useFirestore } from '../Hooks/useFirestore'
import {getStorage, ref, deleteObject, getDownloadURL, uploadBytes} from "firebase/storage"

export default function ModalForm({show, showStateChanger, profileInfo}){
  const navigate = useNavigate()
  const [email] = useState(profileInfo.email)
  const [photoURL] = useState(profileInfo.photoURL)
  const [displayName, setDisplayName] = useState(profileInfo.displayName)
  const [password, setPassword] = useState('')
  const [image, setImage] = useState(null)

  const {user, dispatch} = useAuthContext()
  const {updateDocument} = useFirestore("Users")

  const handleSubmit = async (e) => {
    e.preventDefault()
    if(password !== ""){
      let err = null
      await updatePassword(user, password).catch(error => {
        console.log(error.message)
        err = error
      })

      if(err) return
    }

    if(image){
      const imageType = image.type.split("/")[1]
      const imageMetadata = {contentType: image.type}
      const storageRef = ref(getStorage(), `profileImages/${user.uid}.${imageType}`)

      if(photoURL){
        const deleteRef = ref(getStorage(), photoURL)
        await deleteObject(deleteRef).catch(error => console.log(error.message))
      }
      
      uploadBytes(storageRef, image, imageMetadata).then(async (snapshot) => {
        let newPhotoURL = await getDownloadURL(snapshot.ref)
        updateProfile(user, {displayName, photoURL: newPhotoURL}).then(async () => {
          // await updateDocument({...profileInfo, displayName, photoURL: newPhotoURL}, user.uid)
          dispatch({type: 'UPDATE', payload: user})
          showStateChanger(false)
        })
      })
    }else{
      updateProfile(user, {displayName}).then(async () => {
        // await updateDocument({...profileInfo, displayName}, user.uid)
        dispatch({type: 'UPDATE', payload: user})
        showStateChanger(false)
      })
    }
  }

  return(
    <Modal show={show} onHide={() => showStateChanger(false)} size="lg">
      <Modal.Header closeButton>
        <Modal.Title id="example-custom-modal-styling-title">
          Edit Profile
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form className="m-1" onSubmit={(e) => handleSubmit(e)}> 
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control disabled type="email" placeholder="Enter email" value={email} />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicName">
            <Form.Label>Username</Form.Label>
            <Form.Control type="input" placeholder="Enter email" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3 pb-2" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </Form.Group>

          <Form.Group>
            <Form.Control type="file" className="custom-file-label" id="inputGroupFile01" label="Upload Boundary File" onChange={(e) => setImage(e.target.files[0])}/>
        </Form.Group>

          <div className="py-3">
            <Stack gap={2} className="col-xs-12 col-md-9 mx-auto">
              <Button type="submit" variant="primary">Sign In</Button>
              <Button variant="outline-danger" onClick={() => showStateChanger(false)}>Cancel</Button>
            </Stack>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  )
}