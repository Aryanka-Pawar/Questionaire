import React,{useEffect,useState} from 'react'
import { useNavigate } from 'react-router-dom';
import { useUser } from '../Context/UserContext';

export default function AddQuestion({isAuth, setAlert}) {
     
    const {userData} = useUser(); 
    const [question,setQuestion]=useState('')
    const [loading, setLoading] = useState(false)
    const [questionTag, setQuestionTag] = useState('')
    let navigate = useNavigate();
    

    useEffect(()=>{
      if(!isAuth){
          navigate('/login');
      }
    },[isAuth,navigate])

    const handleQuestion=(event)=>{
      setQuestion(event.target.value)
    }

    const handleQuestionTag=(event)=>{
      setQuestionTag(event.target.value)
    }

    const addQuestionToDb= async()=>{
      if(question.length!==0&&questionTag.length!==0){
        setLoading(true)
        const questionApi="https://aatmagyan-1.herokuapp.com/questions/addQuestion";

        const jsonData={ 
            "userId": userData._id,
           //"answerId" :0,
            "questionTag" : questionTag,
            "questionData": question,
            "likes": 0,
            "isAnswered": false
          }
        
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(jsonData)
        };
        try{
            const authData = await fetch(questionApi, requestOptions);
            let jsonAuthData = await authData.json();
            console.log(jsonAuthData);
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
    
  return (
    <div>
      <div className={`container my-3`}>
        <div className="mb-3">
          <div className='pb-4'>
            <select className="form-select"  defaultValue={questionTag} onChange={handleQuestionTag} id="validationCustom05" required>
              <option value={""} disabled={true}>Select Question Tag...</option>
              <option value={"Hindi"}>Hindi</option>
              <option value={"English"}>English</option>
              <option value={"Mathematics"}>Mathematics</option>
              <option value={"Geography"}>Geography</option>
              <option value={"Science"}>Science</option>  
            </select>
          </div>
          <div className="mt=3">
            <textarea className={`form-control bg-light text-dark`} id="myBox"placeholder='Enter Your Question' value={question} onChange={handleQuestion} rows="8"></textarea>
          </div>
        </div>
        <button className="btn btn-dark btn-sm border"disabled={loading} onClick={addQuestionToDb}>Submit</button>
      </div>
    </div>
  )
}
