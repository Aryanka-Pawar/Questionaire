import React,{useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../Context/UserContext';

export default function Signup({isAuth, setAlert, setIsAuth}) {

 const [name, setName]= useState("")
 const [email, setEmail]= useState("")
 const [password, setPassword]= useState("")
 const [age, setAge]= useState("")
 const [gender, setGender]= useState("")
 const [loading, setLoading] = useState(false)
 const navigate = useNavigate()
 const {setUserData} = useUser();

 useEffect(() => {
    if(isAuth){
      navigate('/');
    }
 }, [isAuth, navigate])

 const handleName=(event) =>{
   setName(event.target.value)
 }

 const handleEmail=(event) =>{
  setEmail(event.target.value)
}

const handlePassword=(event) =>{
  setPassword(event.target.value)
}

const handleAge=(event) =>{
  setAge(event.target.value)
}

const handleGender=(event) =>{
  setGender(event.target.value)
}

const register= async()=>{
//  event.preventDefault();

 if(name.length!==0&&email.length!==0&&password.length!==0&&age.length!==0){
  setLoading(true);
  
  const registerApi="https://aatmagyan-1.herokuapp.com/auth/register";

  const jsonData={
    "userName":name,
    "userAge":age,
    "userEmail":email,
    "userPassword":password,
    "userGender": gender,
    "userImage": "https://firebasestorage.googleapis.com/v0/b/questionaire-b0b15.appspot.com/o/images%2Fuser.png?alt=media&token=b2750c51-8569-4948-bf61-ef80ac7c8de2"
  };

  const requestOptions = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(jsonData)
  };

  try{
    const authData = await fetch(registerApi, requestOptions);
    let jsonAuthData = await authData.json();
    //console.log(jsonAuthData);
    localStorage.setItem("isAuth", true);
    localStorage.setItem("userData", JSON.stringify(jsonAuthData));
    setIsAuth(true);
    setUserData(JSON.stringify(jsonAuthData));
    navigate("/");
   }catch(e){
    setAlert("Failed to create an account", "danger");
    console.log(e);
   }

   setLoading(false);
 }
}

  return(
    <div className='container'>
      <div className="row g-3 container">
        <div className="col-md-4">
          <label htmlFor="validationCustom01" className="form-label">Name</label>
          <input type="text" value={name} onChange={handleName} className="form-control" id="validationCustom01" required/>
        </div>
        <div className="col-md-4">
          <label htmlFor="validationCustom02" className="form-label">Email</label>
          <input type="text" value={email} onChange={handleEmail} className="form-control" id="validationCustom02" required/>
        </div>
        <div className="col-md-4">
          <label htmlFor="validationCustom03" className="form-label">Password</label>
          <input type="text" value={password} onChange={handlePassword} className="form-control" id="validationCustom03" required/>
        </div>
        <div className="col-md-4">
          <label htmlFor="validationCustom04" className="form-label">Age</label>
          <input type="text" value={age} onChange={handleAge} className="form-control" id="validationCustom04" required/>
        </div>
        <div className="col-md-4">
          <label htmlFor="validationCustom05" className="form-label">Select Gender</label>
          <select className="form-select"  defaultValue={gender} onChange={handleGender} id="validationCustom05" required>
            <option value={""} disabled={true}>Choose...</option>
            <option value={"Female"}>Female</option>
            <option value={"Male"}>Male</option>
            <option value={"Other"}>Other</option>
          </select>
        </div>
        <div className="col-12">
          <button className="btn btn-dark btn-sm" disabled={loading} onClick={register}>Signup</button>
        </div>
      </div>
    </div>
  )
}
