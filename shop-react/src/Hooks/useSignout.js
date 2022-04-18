import {useEffect, useState} from "react"
import {auth, timestamp}  from "../Firebase/config"
import {signOut} from "firebase/auth"
import {useAuthContext} from "./useAuthContext"
import {useFirestore} from "../Hooks/useFirestore"
import { Timestamp } from "firebase/firestore"

export const useSignout = () => {
  const [error, setError] = useState(null)
  const [actionPending, setActionPending] = useState(false)
  const [actionCancelled, setActionCancelled] = useState(false)
  const {dispatch, user} = useAuthContext()
  const {updateDocument} = useFirestore("Users")

  const signout = async () => {
    setError(null)
    setActionPending(true)

    try{
      await updateDocument({lastSignoutAt: Timestamp.now()}, user.uid)
      signOut(auth).then(() => {
        dispatch({type: "SIGNOUT"})
        setError(null)
        setActionPending(false)
      })
    }catch(error){
      console.log(error.message)
      setError(error.message)
      setActionPending(false)
    }
  }

  return {error, actionPending, signout}
}