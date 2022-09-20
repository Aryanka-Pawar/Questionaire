import React,{useState,useEffect} from 'react'
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

export default function QuestionTile(props) {

    const [isQuestionLiked, setIsQuestionLiked] = useState(false);
    const [questionerData, setQuestionerData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    let navigate = useNavigate();

    useEffect(() => {
       const getQuestionerData = async()=>{
        let getQuestionerApi = `https://aatmagyan-1.herokuapp.com/users/getUser/${props.questionData.userId}`;
        let userData = await fetch(getQuestionerApi);
        let jsonUserData = await userData.json();
        setQuestionerData(jsonUserData);
        setIsLoading(false);
      }
       
      getQuestionerData();
      
    }, [props.questionData])     
      

    const writeAnswer=(question) =>{
        let data = {
          state : {
            question : question
          }
        }
        navigate('/addAnswer',data )
    }

    const updateQuestionLikes=async(questionData)=>{
        setIsQuestionLiked(true)
        const updateQuestionApi=`https://aatmagyan-1.herokuapp.com/questions/updateQuestion/${questionData._id}`;
    
        const updateQuestionLike={ 
          "likes" :questionData.likes+1  
        }
        const requestOptions = {
          method: 'PUT',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(updateQuestionLike)
        };
        try{
          const updateQuestionLikeData = await fetch(updateQuestionApi, requestOptions);
          let jsonQuestionLikeData = await updateQuestionLikeData.json();
          console.log(jsonQuestionLikeData);
        }
        catch(e){
          console.log(e);
        }
    }

    function shortText(s){
        return s.length>400 ? s.substring(0, 400) + "..." : s;
    }

    if(isLoading){
      return (<div>
        
      </div>)
    }

  return (
    <div className="pb-4 shadow-sm p-3 mb-5 bg-body rounded">
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">{questionerData.userName} | {props.questionData.questionTag}</h5>
                <p className="card-text">{shortText(props.questionData.questionData)}</p>
                <button className="btn btn-dark border mx-1 btn-sm" onClick={()=>{writeAnswer(props.questionData)}}>{props.questionData.isAnswered ? "Solved" : "Solve"}</button>
                <button className="btn btn-dark border btn-sm" onClick={()=>{updateQuestionLikes(props.questionData)}} disabled={isQuestionLiked}>{isQuestionLiked ? `${props.questionData.likes+1} Liked` : `${props.questionData.likes} Like`}</button>
            </div>
            <div className="card-footer text-muted">
                {moment(props.questionData.questionTime).fromNow()}
            </div>
        </div>
    </div>
  )
}
