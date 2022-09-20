import React,{useEffect, useState} from 'react';
import { useNavigate, useLocation} from 'react-router-dom';
import { useUser } from '../Context/UserContext';

export default function AddAnswer({isAuth, setAlert}) {
     
     const {userData} = useUser(); 
     const [answer, setAnswer] = useState('')
     const [answererData , setAnswererData] = useState(null)
     const [answerApi, setAnswerApi] = useState('')
     const [loading, setLoading] = useState(false)
     const [isLiked, setIsLiked] = useState(false)

    let navigate = useNavigate();
    let location = useLocation();
    
    //console.log(location.state.question);
    
    useEffect(()=>{
        if(!isAuth){
            navigate('/login');
        }
        const getUserData = async(userId)=>{
          let getUserApi = `https://aatmagyan-1.herokuapp.com/users/getUser/${userId}`;
          let userData = await fetch(getUserApi);
          let jsonUserData = await userData.json();
          setAnswererData(jsonUserData);
        }

        if(location.state.question.isAnswered){
          const getAnswer = async()=>{
            let getAnswerApi = `https://aatmagyan-1.herokuapp.com/answers/getAnswer/${location.state.question.answerId}`;
            let answerData = await fetch(getAnswerApi);
            let jsonAnswerData = await answerData.json();
            setAnswerApi(jsonAnswerData);
            await getUserData(jsonAnswerData.userId)
          }
          getAnswer()
        }
    },[isAuth, navigate, location , answerApi])


    const handleAnswer=(event) =>{
      setAnswer(event.target.value);
    }
    
    const updateLikes=async()=>{
      setIsLiked(true)
      const updateApi=`https://aatmagyan-1.herokuapp.com/answers/updateAnswer/${answerApi._id}`;

      const updateLike={ 
        "likes" :answerApi.likes+1  
      }
      const requestOptions = {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(updateLike)
      };
      try{
        const updateLikeData = await fetch(updateApi, requestOptions);
        let jsonLikeData = await updateLikeData.json();
        console.log(jsonLikeData);
      }
      catch(e){
        console.log(e);
        
      }
    }

    const submitAnswer= async()=>{
      if(answer.length!==0){
        setLoading(true)
        const answerApi="https://aatmagyan-1.herokuapp.com/answers/addAnswer";

        const jsonData={ 
            "userId": userData._id,
            "questionId":location.state.question._id,
            "likes": 0,
            "answerData": answer
          }
        
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(jsonData)
        };
        try{
            const authData = await fetch(answerApi, requestOptions);
            let jsonAuthData = await authData.json();
            console.log(jsonAuthData._id);
            const questionApi=`https://aatmagyan-1.herokuapp.com/questions/updateQuestion/${location.state.question._id}`;

            const jsonData2={ 
                "answerId" :jsonAuthData._id,
                "isAnswered":true,
              }
            
            const requestOptions2 = {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(jsonData2)
            };
            const questionData = await fetch(questionApi, requestOptions2);
            let jsonAuthData2 = await questionData.json();
            console.log(jsonAuthData2);
            navigate('/');
        }
        catch(e){
          console.log(e) 
        }
        setLoading(false)
      }else{
        setAlert("Please fill all details", "danger");
      }
    }
        
  if((location.state.question.isAnswered && answererData===null)){
    return ( <div className='text-center'>
        <div className="spinner-border" role="status">
          <span className="sr-only"></span>
        </div>
      </div>
    )
  }

  return (
    <div className='container'>
      <div className='shadow-sm p-3 mb-5 bg-body rounded'>
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">{location.state.question.questionTag}</h5>
            <p className="card-text">{location.state.question.questionData}</p>
          </div>
        </div>
      </div>

     {!location.state.question.isAnswered && <div>
        <div className="mt=3">
          <textarea className={`form-control bg-light text-dark`} id="myBox"placeholder='Enter Your Answer' value={answer} onChange={handleAnswer} rows="8"></textarea>
        </div>
        <button className="btn btn-dark btn-sm my-3" disabled={loading} onClick={submitAnswer}>Submit</button>
      </div>}

      {location.state.question.isAnswered && <div className='shadow-sm p-3 mb-5 bg-body rounded'>
         <div className="card">
            <h5 className="card-header">{answererData.userName}</h5>
            <div className="card-body">
              <h5 className="card-title">Answer</h5>
              <p className="card-text">{answerApi.answerData}</p>
              <button onClick={updateLikes} disabled={isLiked} className="btn btn-dark btn-sm">{isLiked ? `${answerApi.likes+1} Liked` : `${answerApi.likes} Like`}</button>
            </div>
          </div>
        </div>}
    </div>
  )
}
