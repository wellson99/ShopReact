import {useEffect, useState} from "react"
import {auth, timestamp}  from "../Firebase/config"
import {createUserWithEmailAndPassword, updateProfile} from "firebase/auth"
import {useAuthContext} from "./useAuthContext"
import {useFirestore} from "../Hooks/useFirestore"
import { Timestamp } from "firebase/firestore"

export const useSignup = () => {
  const [error, setError] = useState(null)
  const [actionPending, setActionPending] = useState(false)
  // const [actionCancelled, setActionCancelled] = useState(false)
  const {dispatch} = useAuthContext()
  const {addDocument} = useFirestore("Users")


  const signup = async (email, password, displayName) => {
    setError(null)
    setActionPending(true)

    try{
      const res = await createUserWithEmailAndPassword(auth, email, password)
      if(!res)  throw new Error("Something went wrong while signing up user")
      updateProfile(res.user, {displayName}).then(async () => {
        dispatch({type: 'SIGNUP', payload: res.user})
        let data = {lastSigninAt: Timestamp.now(), lastSignoutAt: null, cart: []}
        await addDocument(data, false)
        setError(null)
        setActionPending(false)
      })      
    }catch(error){
      // if(!actionCancelled){
        console.log(error.message)
        setError(error.message)
        setActionPending(false)
      // }
    }
  }

  // useEffect(() => {
  //   return () => setActionCancelled(true)
  // }, [])

  return {error, actionPending, signup}
}