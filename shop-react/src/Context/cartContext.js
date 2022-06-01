import { doc, getDoc } from "firebase/firestore";
import {createContext, useReducer, useEffect, useState} from "react"
import { db } from "../Firebase/config";
import { useAuthContext } from '../Hooks/useAuthContext';
import {useFirestore} from "../Hooks/useFirestore"

export const CartContext = createContext()

const initialState = {cart: null}

export const cartReducer = (state, action) => {
  switch(action.type){
    case "ADD_TO_CART":
      return {...state, cart: [...state.cart, action.payload]}
    case "DUPLICATE_ITEM":
      return {...state, cart: state.cart.map(c => c.id === action.payload.id ?{...c, quantity: c.quantity + action.payload.quantity} :c)}
    case "UPDATE_CART_ITEM":
      return {...state, cart: state.cart.map(c => c.id === action.payload.id ?{...c, quantity: c.quantity = action.payload.quantity} :c)}
    case "DELETE_FROM_CART":
      return {...state, cart: state.cart.filter(c => c.id !== action.payload)}
    case "SET_CART":
      return {cart: action.payload}
    case "CLEAR_CART":
      return {cart: []}
    default:
      return state
  }
}

export const CartContextProvider = ({children}) => {
  // const [cart, setCart] = useState([])
  // const addToCart = (product) => {
  //   setCart((prevState) => [...prevState, {...product}])
  // }
  const [firebaseCart, setFirebaseCart] = useState(null)
  const {updateDocument} = useFirestore("Users")
  const {user} = useAuthContext()
  const [state, dispatch] = useReducer(cartReducer, initialState)
  useEffect(() => {
    if(user){
      let docRef = doc(db, "Users", user.uid)
      getDoc(docRef).then(snapshot => {
        if(snapshot.exists()){
          console.log(snapshot.data().cart)
          setFirebaseCart(snapshot.data().cart)
          dispatch({type: "SET_CART", payload: snapshot.data().cart})
        }else{
          setFirebaseCart([])
          dispatch({type: "SET_CART", payload: []})
        }
      })
    }
    // console.log("run")
  }, [user])

  const addToCart = (item) => {
    if(state.cart.find(c => c.id === item.id) === undefined){
      updateDocument({cart: [...firebaseCart, item]}, user.uid)
      setFirebaseCart(prevState => [...prevState, item])
      dispatch({type: "ADD_TO_CART", payload: item}) 
    }else{
      let updatedCart = firebaseCart.map(f => f.id === item.id ?{...f, quantity: f.quantity + item.quantity} :f)
      updateDocument({cart: updatedCart}, user.uid)
      setFirebaseCart(updatedCart)
      dispatch({type: "DUPLICATE_ITEM", payload: {id: item.id, quantity: item.quantity}})
    }
  }

  const updateCartItem = (id, quantity) => {
    let updatedCart = firebaseCart.map(f => f.id === id ?{...f, quantity: f.quantity = quantity} :f)
    updateDocument({cart: updatedCart}, user.uid)
    setFirebaseCart(updatedCart)
    dispatch({type: "UPDATE_CART_ITEM", payload: {id, quantity}})
  }

  const deleteFromCart = (id) => {
    let updatedCart = firebaseCart.filter(f => f.id !== id)
    updateDocument({cart: updatedCart}, user.uid)
    setFirebaseCart(updatedCart)
    dispatch({type: "DELETE_FROM_CART", payload: id})
  }

  const clearCart = () => {
    updateDocument({cart: []}, user.uid)
    setFirebaseCart([])
    dispatch({type: "CLEAR_CART"})
  }


  return(
    <CartContext.Provider value={{...state, addToCart, updateCartItem, deleteFromCart, clearCart}}>
      {children}
    </CartContext.Provider>
  )
}