import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { useGetDocs } from "../Hooks/useGet"
import { Link } from "react-router-dom"


// const x = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]

export default function Purchases() {
  const {documents} = useGetDocs("Purchases")

  return (
    <Container>
      <Row className="justify-content-md-start">
        {documents.map((p, index) => (
          <Col key={index} className="col-xs-12 col-md-6">
            <Card className="mx-auto my-2">
              <Card.Header as="h5">{p.id}</Card.Header>
              <Card.Body>
                <Card.Title>Purchase date: {p.createdAt.toDate().toString()}</Card.Title>
                <Card.Text>
                  item count: {p.cartItems.length} item(s) in this purchsae.<br/>
                  Total: RM {p.itemsTotal} <br/>
                  Delivery: {p.sDT.show} <br/>
                </Card.Text>
                <Link to={`/user/purchases/${p.id}`}>
                  <Button variant="primary">Go somewhere</Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
        
      </Row>
    </Container>
  )
}