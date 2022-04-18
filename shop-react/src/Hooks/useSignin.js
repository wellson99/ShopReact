import {useEffect, useState} from "react"
import {auth, timestamp}  from "../Firebase/config"
import {signInWithEmailAndPassword} from "firebase/auth"
import {useAuthContext} from "./useAuthContext"
import {useFirestore} from "../Hooks/useFirestore"
import { Timestamp } from "firebase/firestore"

export const useSignin = () => {
  const [error, setError] = useState(null)
  const [actionPending, setActionPending] = useState(false)
  // const [actionCancelled, setActionCancelled] = useState(false)
  const {dispatch} = useAuthContext()
  const {updateDocument} = useFirestore("Users")
  
  const signin = async (email, password) => {
    setError(null)
    setActionPending(true)

    try{
      const res = await signInWithEmailAndPassword(auth, email, password)
      if(!res)  throw new Error("Something went wrong while signing in user")
      dispatch({type: "SIGNIN", payload: res.user})
      await updateDocument({lastSigninAt: Timestamp.now()}, res.user.uid)
      setError(null)
      setActionPending(false)
    }catch(error){
      console.log(error.message)
      setError(error.message)
      setActionPending(false)
    }
  }

  return {error, actionPending, signin}
}