import React,{useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../Context/UserContext';

export default function Login({isAuth, setIsAuth, setAlert}) {

 const [email, setEmail]= useState("")
 const [password, setPassword]= useState("")
 const [loading, setLoading] = useState(false)
 const {setUserData} = useUser();
 const navigate = useNavigate()

 useEffect(() => {
    if(isAuth){
      navigate('/');
    }
 }, [isAuth, navigate])

 const handleEmail=(event) =>{
  setEmail(event.target.value)
 }

  const handlePassword=(event) =>{
    setPassword(event.target.value)
  }

 const login = async()=>{
  //  event.preventDefault();
  
   if(email.length!==0&&password.length!==0){
    setLoading(true);
    
    const registerApi="https://aatmagyan-1.herokuapp.com/auth/login";
  
    const jsonData={
      "userEmail":email,
      "userPassword":password
    };
  
    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(jsonData)
    };
  
    try{
      const authData = await fetch(registerApi, requestOptions);
      let jsonAuthData = await authData.json();
      if(jsonAuthData==="Password is wrong"){
        setAlert("Password is wrong", "danger");
      }else if(jsonAuthData==="Please login"){
        setAlert("Please Signup", "danger");
      }else{
        localStorage.setItem("isAuth", true);
        localStorage.setItem("userData", JSON.stringify(jsonAuthData));
        setIsAuth(true);
        setUserData(JSON.stringify(jsonAuthData));
        navigate("/");
      }
     }catch(e){
      setAlert("Failed to create an account", "danger");
      console.log(e);
     }
  
     setLoading(false);
   }else{
    setAlert("Please fill all details", "danger");
   }
  }

  return (
    <>
      <div className={`container my-3`}>
        <div className="mb-3">
          <input type="email" placeholder='Enter Your Email' onChange={handleEmail} className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"/>
        </div>
        
        <div className="mb-3">
          <input type="password" placeholder='Enter Your Password' onChange={handlePassword} className="form-control" id="exampleInputPassword1"/>
        </div>
        
        <button type="submit" className="btn btn-dark btn-sm" disabled={loading} onClick={login}>Login</button>
      </div>
    </>
  )
}


