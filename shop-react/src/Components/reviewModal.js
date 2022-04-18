import { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Stack from 'react-bootstrap/Stack'

const ratingArr = [1, 2, 3, 4, 5]

export default function ReviewModal({show, showStateFunc, data, index, uploadReview}){
  const [rating, setRating] = useState(null)
  const [review, setReview] = useState("")

  const handleChange = (e) => {
    setRating(parseInt(e.target.value))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if(!rating || review === ""){
      console.log("Empty field")
      return
    }
    console.log(rating, review, index)
    uploadReview(rating, review, index)
  }

  return(
    <>
      {data && (<Modal
        size="lg"
        show={show}
        onHide={() => {setReview(""); showStateFunc(false)}}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            Review
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          IMG: {data.imgURL}<br/>
          name: {data.name}<br/>
          quantity: {data.quantity}<br/><br/>

          <Form className="m-1" onSubmit={handleSubmit}> 
            <div key="inline-radio" className="mb-3">
              {ratingArr.map((r, index) => (
                <Form.Check key={r} inline label={r} name="group1" type="radio" id="inline-radio-1" value={r} onChange={handleChange} />
              ))}
            </div>

            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label>Username</Form.Label>
              <Form.Control as="textarea" rows={3} placeholder="Enter review" value={review} onChange={(e) => setReview(e.target.value)} />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>

            <div className="py-3">
              <Stack gap={2} className="col-xs-12 col-md-9 mx-auto">
                <Button type="submit" variant="primary">Sign In</Button>
                <Button variant="outline-danger" onClick={() => {setReview(""); showStateFunc(false)}}>Cancel</Button>
              </Stack>
            </div>
          </Form>
        </Modal.Body>
      </Modal>)}
    </>
    
  )
}