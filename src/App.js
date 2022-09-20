import React,{useState} from 'react'
import Login from "./Pages/Login";
import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
import Signup from "./Pages/Signup";
import Home from "./Pages/Home";
import Navbar from "./Components/Navbar";
import Alert from './Components/Alert'
import Profile from './Pages/Profile';
import AddQuestion from './Pages/AddQuestion';
import AddAnswer from './Pages/AddAnswer';
import {UserProvider} from './Context/UserContext';
import './CSS/AppCSS.css'

function App() {

  const [customAlert, setCustomAlert] = useState(null);
  const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth")??false);

  const setAlert=(message, type)=>{
    let alertObject = {
      message: message,
      type: type
    }
    setCustomAlert(alertObject);

    setTimeout(() => {
      setCustomAlert(null)
    }, 1500);
  }

  return (
    <> 
       <UserProvider>
        <Router>

        <Navbar isAuth={isAuth} setIsAuth={setIsAuth}/>
        <Alert customAlert={customAlert}/>

        <Routes>
          <Route path="/" element={<Home isAuth={isAuth}/>}></Route>
          <Route path="/me" element={<Profile isAuth={isAuth} setIsAuth={setIsAuth} setAlert={setAlert}/>}></Route>
          <Route path="/login" element={<Login isAuth={isAuth} setIsAuth={setIsAuth} setAlert={setAlert}/>}></Route>
          <Route path="/signup" element={<Signup isAuth={isAuth} setIsAuth={setIsAuth} setAlert={setAlert}/>}></Route>
          <Route path="/addQuestion" element={<AddQuestion isAuth={isAuth} setAlert={setAlert}/>}></Route>
          <Route path="/addAnswer" element={<AddAnswer isAuth={isAuth} setAlert={setAlert}/>}></Route>
        </Routes>

        </Router>
       </UserProvider> 
    </>
  );
}

export default App;
