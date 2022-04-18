import {useState} from "react"
import {useNavigate} from 'react-router-dom'
import Stack from 'react-bootstrap/Stack'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import {useSignin} from "../Hooks/useSignin"

import LoadingModal from "../Components/loadingModal"

export default function Signin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showModal, setShowModal] = useState(false)
  const {signin, actionPending, error} = useSignin()

  const handleSubmit = (e) => {
    setShowModal(true)
    e.preventDefault()
    signin(email, password)
  }

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col className="col-xs-12 col-md-9 col-lg-6">
          <h3 className="text-center mt-5">Sign In</h3>
          <Card className="authCard">
            <Form className="m-4" onSubmit={(e) => handleSubmit(e)}> 
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <Form.Text className="text-muted">
                  We'll never share your email with anyone else.
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3 pb-2" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </Form.Group>

              <div className="py-3">
                <Stack gap={2} className="col-xs-12 col-md-9 mx-auto">
                  <Button type="submit" variant="primary">Sign In</Button>
                  <Button variant="link" onClick={() => navigate("/signup")}>Don't have an account? Sign up now!</Button>
                </Stack>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>   

      <LoadingModal show={showModal} loading={actionPending} error={error} showStateChanger={setShowModal} />
    </Container>
  )
}