import Col from "react-bootstrap/Col"
import Row from "react-bootstrap/Row"
import Card from "react-bootstrap/Card"
import Button from "react-bootstrap/Button"
import { useGetDocs } from "../Hooks/useGet"
import { Link } from "react-router-dom"

// const x = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]

export default function Products() {
  const {documents:x} = useGetDocs("Products")

  const handleClick = (e) => {
    e.preventDefault()
    console.log("haha")
  }

  return (
    <Row className="justify-content-md-start">
      {x.map(y => (
      <Col key={y.id} className="col-xs-12 col-md-6 col-lg-3">
        <Card className="mx-auto" style={{ width: '350px' }}>
          <Link to={`/products/${y.id}`} state={{product: y}}>
            <Card.Img variant="top" src={y.imgURL} />
            <Card.Body>
              <Card.Title>{y.name}</Card.Title>
              <Card.Text>
                {`${y.description.slice(0,200)}...`}
              </Card.Text>
              <Button variant="primary" onClick={(e) => handleClick(e)}>Go somewhere</Button>

            </Card.Body>
          </Link>

        </Card>
      </Col>
      ))}
    </Row>
  )
}