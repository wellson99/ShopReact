import { useParams } from "react-router-dom"
import { useGetDoc } from "../Hooks/useGet"
import Card from 'react-bootstrap/Card'
import Accordion from 'react-bootstrap/Accordion'
import { Link } from "react-router-dom"
import Button from "react-bootstrap/Button"
import { useState, useEffect } from "react"
import ReviewModal from "../Components/reviewModal"
import { useFirestore } from "../Hooks/useFirestore"
import { doc, getDoc, increment } from "firebase/firestore"
import { db, timestamp } from "../Firebase/config"
import { useAuthContext } from "../Hooks/useAuthContext"

export default function PurchaseDetails() {
  const {id} = useParams()
  const {document} = useGetDoc("Purchases", id)
  const {user} = useAuthContext()
  const [show, setShow] = useState(false)
  const [itemIndex, setItemIndex] = useState(null)
  const [selecteditem, setSelecteditem] = useState(null)
  const [purchase, setPurchase] = useState(null)
  const {updateDocument: updateProductReview} = useFirestore("Products")
  const {updateDocument: updatePurchase} = useFirestore("Purchases")

  // console.log(document)
  const uploadReview = async (rating, review, index) => {
    const productId = purchase.cartItems[index].id
    const newReview = {review, rating, uid: user.uid, createdAt: timestamp.now()}
    const docSnap = await getDoc(doc(db, "Products", productId))
    const productToUpdate = docSnap.data()
    let prodRating = productToUpdate.rating
    let prodReviews = productToUpdate.review
    let updatedReviews = prodReviews + 1
    let updatedRating = null

    if(prodReviews === 0){
      updatedRating = prodRating + rating
      console.log(updatedRating, rating, prodRating)
    }else{
      let totalRating = prodRating * prodReviews
      updatedRating = (totalRating + rating) / updatedReviews
      console.log(updatedRating, totalRating, rating, updatedReviews, prodRating, prodReviews)
    }

    updateProductReview({
        userReviews: [...productToUpdate.userReviews, newReview],
        rating: Number(updatedRating.toFixed(1)),
        review: increment(1)
      }, productId)
      .then(() => {
        console.log("finish update")
        setPurchase(prevState => {
          const purc = {...prevState}
          const cartItems = purc.cartItems[index]
          purc.cartItems[index] = {...cartItems, isReviewed: true, rating, review}
          updatePurchase({cartItems: purc.cartItems}, purc.id)
          return purc
        })
        setShow(false)
        console.log("update success",purchase)
    })
  }
  

  const handleClick = (item, index) => {
    setShow(true)
    setItemIndex(index)
    setSelecteditem(item)
  }

  useEffect(() => {
    if(document) setPurchase(document)
  }, [document])
  
  return (
    <div>
      PurchaseDetails<br/>

      {purchase && (
        <Card className="mx-auto my-2">
          <Card.Header as="h5">{purchase.id}</Card.Header>
          <Card.Body>
            <Card.Title>Purchase date: {purchase.createdAt.toDate().toString()}</Card.Title>
            <Card.Text>
              items purchased: {purchase.cartItems.length} item(s) in this purchsae.<br/>
              Total: RM {purchase.itemsTotal} <br/>
              Delivery: {purchase.sDT.show} <br/>
            </Card.Text>
            
            <Accordion flush>
              {purchase.cartItems.map((item, index) => (
                  <Accordion.Item eventKey={index} key={index}>
                    <Accordion.Header>{item.name}</Accordion.Header>
                    <Accordion.Body>
                      IMG: {item.imgURL}<br/>
                      price: RM {item.price}<br/>
                      quantity: {item.quantity} pieces purchased<br/>
                      review: {item.isReviewed.toString()}<br/>

                      {!item.isReviewed && (
                        // <Link to={`/`}>
                          <Button variant="primary" onClick={() => handleClick(item, index)}>Go somewhere {index}</Button>
                        // </Link> 
                      )}
                    </Accordion.Body>
                  </Accordion.Item>
              ))}
              <ReviewModal show={show} showStateFunc={setShow} data={selecteditem} index={itemIndex} uploadReview={uploadReview}/>
            </Accordion>
          </Card.Body>
        </Card>
      )}
      
</div>
  )
}