import React, {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom';
import styles from '../CSS/ProfileCSS.module.css';
import { useUser } from '../Context/UserContext';
import { storage } from '../Config/FirebaseConfig';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { v4 } from 'uuid';

export default function Profile({isAuth, setAlert, setIsAuth}) {
    
    const {setUserData, userData} = useUser();
    const [name, setName]= useState(userData.userName)
    const [email, setEmail]= useState(userData.userEmail)
    const [age, setAge]= useState(userData.userAge)
    const [gender, setGender]= useState(userData.userGender)

    const [loading, setLoading] = useState(false);
    const [imageUpload, setImageUpload] = useState("");
    let profileUrl = userData.userImage;
    let prevProfileUrl = profileUrl;
    
    const navigate = useNavigate()

    useEffect(() => {
        if(!isAuth){
            navigate('/login');
        }
    }, [isAuth, navigate])

    const handleName=(event) =>{
        setName(event.target.value)
    }

    const handleEmail=(event) =>{
        setEmail(event.target.value)
    }

    const handleAge=(event) =>{
        setAge(event.target.value)
    }

    const handleGender=(event) =>{
        setGender(event.target.value)
    }

    const handleImage = (event)=>{
        setImageUpload(event.target.files[0]);
    }

    const deleteImage = async() => {
        if(imageUpload!=="" && prevProfileUrl!=="https://firebasestorage.googleapis.com/v0/b/questionaire-b0b15.appspot.com/o/images%2Fuser.png?alt=media&token=b2750c51-8569-4948-bf61-ef80ac7c8de2"){
            const imageRef = ref(storage, prevProfileUrl);
            await deleteObject(imageRef);
        }
    }

    const uploadImage = async()=> {
        if(imageUpload!==""){
          try{
            const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
            const result = await uploadBytes(imageRef, imageUpload);
            const imgUrl = await getDownloadURL(result.ref);
            profileUrl = imgUrl;
          }catch(e){
            setAlert("Failed to update", "danger");
            console.log(e);
          }
        }
    }

    const update = async()=>{
        setLoading(true);
        await uploadImage();

        const updateApi=`https://aatmagyan-1.herokuapp.com/users/updateUser/${userData._id}`;
  
        const jsonData={
            "userName": name,
            "userAge":age,
            "userEmail":email,
            "userGender": gender,
            "userImage": profileUrl
        };
    
        const requestOptions = {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(jsonData)
        };

        try{
            const authData = await fetch(updateApi, requestOptions);
            let jsonAuthData = await authData.json();
            await deleteImage();
            // console.log(jsonAuthData);
            // console.log(JSON.stringify(jsonAuthData));
            localStorage.setItem("userData", JSON.stringify(jsonAuthData));
            setUserData(JSON.stringify(jsonAuthData));
            
            setAlert("Successfully Updated", "success");
            console.log(jsonAuthData);
            
            navigate('/');
        }catch(e){
            setAlert("Failed to update", "danger");
            console.log(e);
        }
        setLoading(false);
    }

    const signUserOut = ()=>{
        try{
            localStorage.clear();
            setIsAuth(false);
            navigate('/login');
        }catch(e){
            console.log("error");
        }
    }
    
  return (
    <div className={`container-fluid ${styles.container}`}>
        <div className="row row-cols-1 row-cols-lg-2">

            <div className={`col offset-lg-0 col-lg-4 mt-4 mb-4 ${styles.box1}`}>
                <div className="card text-center container" style={{"width": "15rem"}}>
                    <img src={profileUrl} className="card-img-top rounded-circle rounded m-auto d-block mt-3" alt="..." style={{"height": "7rem", "width": "7rem"}}/>
                    <div className="card-body">
                        <p className="card-title h4 fw-semibold">{name}</p>
                        <p className='text-secondary small fw-light'>Joined in 2022</p>
                        <button className="btn btn-dark btn-sm" disabled={loading} onClick={signUserOut}>Logout</button>
                    </div>
                </div>
            </div>

            <div className={`col offset-lg-0 col-lg-7 mt-4 mb-5 ${styles.box2}`}>
                <div className="row g-3 mx-auto row-cols-lg-2">
                    <div className="col-lg-4">
                        <label htmlFor="validationCustom01" className="form-label">Name</label>
                        <input type="text" value={name} onChange={handleName} className="form-control" id="validationCustom01" required/>
                    </div>
                    <div className="col-lg-4">
                        <label htmlFor="validationCustom02" className="form-label">Email</label>
                        <input type="text" value={email} onChange={handleEmail} className="form-control" id="validationCustom02" required/>
                    </div>
                    <div className="col-lg-4">
                        <label htmlFor="validationCustom04" className="form-label">Age</label>
                        <input type="text" value={age} onChange={handleAge} className="form-control" id="validationCustom04" required/>
                    </div>
                    <div className="col-lg-4">
                        <label htmlFor="validationCustom05" className="form-label">Select Gender</label>
                        <select className="form-select"  defaultValue={gender} onChange={handleGender} id="validationCustom05" required>
                        <option value={""} disabled={true}>Choose...</option>
                        <option value={"Female"}>Female</option>
                        <option value={"Male"}>Male</option>
                        <option value={"Other"}>Other</option>
                        </select>
                    </div>
                    <div className="col-lg-8 mb-3">
                        <label htmlFor="formFileSm" className="form-label">Upload Image</label>
                        <input className="form-control form-control-sm" id="formFileSm" type="file" accept="image/*" onChange={handleImage}/>
                    </div>
                    <div className="col-12">
                        <button className="btn btn-dark btn-sm" disabled={loading} onClick={update}>Save</button>
                    </div>
                </div>
            </div>

        </div>
    </div>
  )
}
