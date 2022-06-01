import {createContext, useEffect, useReducer} from "react"

export const ModalContext = createContext()

const initialState ={
  show: false,
  message: null
}

export const modalReducer = (state, action) => {
  switch(action.type){
    case "SHOW_MODAL":
      return {...state, show: action.payload.show, message: action.payload.message}
    case "HIDE_MODAL":
      return {...state, show: action.payload.show, message: action.payload.message}
    default:
      return state
  }
}

export const ModalContextProvider = ({children}) => {
  const [state, dispatch] = useReducer(modalReducer, {user: null, authReady: false})
  

  return(
    <ModalContext.Provider value={{...state, dispatch}}>
      {children}
    </ModalContext.Provider>
  )
}