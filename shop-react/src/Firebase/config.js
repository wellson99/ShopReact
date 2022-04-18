import {initializeApp} from "firebase/app"
import {getFirestore, Timestamp} from "firebase/firestore"
import {getAuth} from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyDwHbHiKhGn-f6MEhzSRZTTjr_V-8OOKzg",
  authDomain: "testing-4a8db.firebaseapp.com",
  projectId: "testing-4a8db",
  storageBucket: "testing-4a8db.appspot.com",
  messagingSenderId: "317812272994",
  appId: "1:317812272994:web:ed77dbfd5526a652e2063b"
}

initializeApp(firebaseConfig)
const db = getFirestore()
const auth = getAuth()
const timestamp = Timestamp

export {db, auth, timestamp}