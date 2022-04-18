import {createContext, useEffect, useReducer} from "react"
import {onAuthStateChanged} from "firebase/auth"
import {auth} from "../Firebase/config"

export const AuthContext = createContext()

export const authReducer = (state, action) => {
  switch(action.type){
    case "SIGNUP":
      return {...state, user: action.payload}
    case "SIGNOUT":
      return {...state, user: null}
    case "SIGNIN":
      return {...state, user: action.payload}
    case "UPDATE":
      return {...state, user: action.payload}
    case "AUTH_READY":
      return {user: action.payload, authReady: true}
    default:
      return state
  }
}

export const AuthContextProvider = ({children}) => {
  const [state, dispatch] = useReducer(authReducer, {user: null, authReady: false})
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, user => {
      dispatch({type: "AUTH_READY", payload: user})
      unsub()
    })
  }, [])

  return(
    <AuthContext.Provider value={{...state, dispatch}}>
      {children}
    </AuthContext.Provider>
  )
}