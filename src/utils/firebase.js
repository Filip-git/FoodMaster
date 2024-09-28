import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyDt93Neo4zMnYOVql77kTyR49WYCqyMFfE",
    authDomain: "foodmaster-1cbb6.firebaseapp.com",
    projectId: "foodmaster-1cbb6",
    storageBucket: "foodmaster-1cbb6.appspot.com",
    messagingSenderId: "309998506044",
    appId: "1:309998506044:web:2426c75a08d90913837339"
  };

  const app = initializeApp(firebaseConfig);
  const firestore = getFirestore(app);
  const auth = getAuth(app);
  const storage = getStorage(app);
  
  export { firestore, auth, storage };
  