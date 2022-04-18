import { useContext } from "react"
import { CartContext } from "../Context/cartContext"

export const useCartContext = () => {
  const context = useContext(CartContext)
  if(!context)  throw Error("useCartContext must be used inside an CartContextProvider") 

  return context
}