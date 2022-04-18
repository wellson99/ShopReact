import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Card from "react-bootstrap/Card"
import Button from "react-bootstrap/Button"
import Container from "react-bootstrap/Container"
import Image from 'react-bootstrap/Image'
import ModalForm from "../Components/modalForm"

import { useState } from "react"
import {useSnapshot} from "../Hooks/useGet"
import { useAuthContext } from "../Hooks/useAuthContext"


const imgURL = "https://www.itdp.org/wp-content/uploads/2021/06/avatar-man-icon-profile-placeholder-260nw-1229859850-e1623694994111.jpg"

export default function Profile() {
  const {user} = useAuthContext()
  // const {documents} = useSnapshot("Users", ["uid", "==", user.uid])
  const [showModal, setShowModal] = useState(false)

  // console.log(documents)

  const handleClick = () => {
    setShowModal(true)
  }

  return (
    <>
    {/* {documents && ( */}
    <Container>
      {/* {documents.map(info => ( */}
        <Row className="justify-content-md-center">
          <Col className="col-xs-12 col-md-9 p-xs-1 p-md-4">
            <Card>
              <Card.Header>Profile</Card.Header>
              <Card.Body>
                <Card.Title>View your profile here</Card.Title>

                
                  <Row className="py-2 mb-3" >
                    <Col className="col-xs-12 col-md-4 col-lg-3">
                      {user.photoURL ?<Image src={user.photoURL} thumbnail/> :<Image src={imgURL} thumbnail/>}
                    </Col>
                    <Col className="col-xs-12 col-md-8 col-lg-9">
                      <p>{user.email}</p>
                      <p>{user.displayName}</p>
                      {/* <p>{info.createdAt.toDate().toString()}</p> */}
                    </Col>
                  </Row>
                              
                
                <Button variant="primary" onClick={() => handleClick()}>Edit Profile</Button>
              </Card.Body>
            </Card>
          </Col>

      <ModalForm show={showModal} showStateChanger={setShowModal} profileInfo={user} />

        </Row>
      

      {/* ))} */}
    </Container>
    {/* )} */}
    </>
  )
}