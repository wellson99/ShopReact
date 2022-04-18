import {useState} from "react"
import {db, timestamp} from "../Firebase/config"
import {collection, addDoc, setDoc, doc, updateDoc, deleteDoc} from "firebase/firestore"

export const useFirestore = (collectionParam) => {
  const [error, setError] = useState(null)
  const [actionPending, setActionPending] = useState(false)
  // const [actionCancelled, setActionCancelled] = useState(false)
  const collectionRef = collection(db, collectionParam)

  const addDocument = async (data, autoID) => {
    setError(null)
    setActionPending(true)

    try{
      if(autoID){
        await addDoc(collectionRef, {...data, createdAt: timestamp.now()})
      }else{
        const docRef = doc(db, collectionParam, data.uid)
        await setDoc(docRef, {...data, createdAt: timestamp.now()})
      }
      setError(null)
      setActionPending(false)
    }catch(error){
      console.log(error.message)
      setError(error.message)
      setActionPending(false)
    }
  }

  const deleteDocument = async (id) => {
    setError(null)
    setActionPending(true)

    try{
      const docRef = doc(db, collectionParam, id)
      await deleteDoc(docRef)
      setError(null)
      setActionPending(false)
    }catch(error){
      console.log(error.message)
      setError(error.message)
      setActionPending(false)
    }
  }

  const updateDocument = async (data, id) => {
    setError(null)
    setActionPending(true)

    try{
      const docRef = doc(db, collectionParam, id)
      await updateDoc(docRef, {...data})
      setError(null)
      setActionPending(false)
    }catch(error){
      console.log(error.message)
      setError(error.message)
      setActionPending(false)
    }
  }

  return {addDocument, deleteDocument, updateDocument, error, actionPending}
}