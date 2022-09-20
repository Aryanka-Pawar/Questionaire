
import { initializeApp } from "firebase/app";
import {getStorage} from 'firebase/storage';


const firebaseConfig = {
  apiKey: "AIzaSyBjz9eIi9CKQ8tcgtLTt5ewag4j0Zhgm1U",
  authDomain: "questionaire-b0b15.firebaseapp.com",
  projectId: "questionaire-b0b15",
  storageBucket: "questionaire-b0b15.appspot.com",
  messagingSenderId: "128107855407",
  appId: "1:128107855407:web:8cf60bb9e92c153d5210da"
};


const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);