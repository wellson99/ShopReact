import {useNavigate} from 'react-router-dom'
import Stack from 'react-bootstrap/Stack'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { useState } from 'react'
import { useSignup } from '../Hooks/useSignup'

export default function Signup() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')  
  const {signup, actionPending, error} = useSignup()

  const handleSubmit = async (e) => {
    e.preventDefault()
    await signup(email, password, displayName)
  }

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col className="col-xs-12 col-md-9 col-lg-6">
          <h3 className="text-center mt-5">Sign Up</h3>
          <Card className="authCard">
            <Form className="m-4" onSubmit={handleSubmit}> 
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Username</Form.Label>
                <Form.Control type="input" placeholder="Enter email" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                <Form.Text className="text-danger">
                  We'll never share your email with anyone else.
                </Form.Text>
              </Form.Group>

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
                  <Button type="submit" variant="primary">Signup Account</Button>
                  <Button variant="link" onClick={() => navigate("/signin")}>Already have an account? Log in now!</Button>
                </Stack>
                <p>{actionPending.toString()}</p>
              </div>
              
            </Form>
          </Card>
        </Col>
      </Row>   
    </Container>
  )
}