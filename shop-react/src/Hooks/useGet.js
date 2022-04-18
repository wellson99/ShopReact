import { collection, onSnapshot, where, query, getDocs, doc, getDoc } from "firebase/firestore"
import {db} from "../Firebase/config"
import { useEffect, useRef, useState } from "react"

export const useSnapshot = (collectionParam, queryParam) => {
  const [documents, setDocuments] = useState(null)
  const q = useRef(queryParam).current

  useEffect(() => {
    let collectionRef = collection(db, collectionParam)
    if(q) collectionRef = query(collectionRef, where(...q))

    const unsub = onSnapshot(collectionRef, (snapshot) => {
      let results = []
      snapshot.docs.forEach(doc => {
        results.push({...doc.data(), id: doc.id})
      });
      setDocuments(results)
    }, error => {
      console.log(error.message)
    })

    return () => unsub()
  }, [collectionParam, q])
  console.log("run")
  return {documents}
}

export const useGetDocs = (collectionParam) => {
  const [documents, setDocuments] = useState([])

  useEffect(() => {
    let collectionRef = collection(db, collectionParam)
    let results = []
    
    getDocs(collectionRef).then(snapshot => {
      snapshot.docs.forEach(doc => {
        results.push({id: doc.id, ...doc.data()})
      })
      setDocuments(results)
    }).catch(error => {
      console.log(error.message)
    })

  }, [collectionParam])
  
  return {documents}
}

export const useGetDoc = (collectionParam, id) => {
  const [document, setDocuments] = useState(null)

  useEffect(() => {
    let docRef = doc(db, collectionParam, id)
    
    getDoc(docRef).then(snapshot => {
      setDocuments({...snapshot.data(), id: snapshot.id})
    }).catch(error => {
      console.log(error.message)
    })
  }, [collectionParam, id])
  
  return {document}
}