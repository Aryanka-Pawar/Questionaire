import React,{useState,useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../CSS/HomeCSS.module.css';
import QuestionTile from './QuestionTile';


export default function Home({isAuth}) {
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
 
  let navigate = useNavigate();

  useEffect(() => {
    if(!isAuth){
      navigate('/login');
    }
    const getQuestions = async()=>{
        let questionsApi = `https://aatmagyan-1.herokuapp.com/questions/getQuestions`;
        let questionsData = await fetch(questionsApi);
        let jsonQuestionsData = await questionsData.json();
        setQuestions(jsonQuestionsData);
        setIsLoading(false)
    }

    getQuestions()
    
  }, [isAuth, navigate])

  if(isLoading){
    return ( <div className='text-center'>
        <div className="spinner-border" role="status">
          <span className="sr-only"></span>
        </div>
      </div>
    )
  }
  
  return (
    <div className='container'>
      <div className={`${styles.fab}`}><Link type="button" to="/addQuestion" className="btn btn-dark btn-sm shadow p-3 mb-5 rounded">Add Question</Link></div>
      {questions.length===0 && <div className="h2">Questions are not Available</div>}
      {questions.length!==0 && <div className="row row-cols-1">
        {questions.map((e)=>{
          return <div key={e._id}><QuestionTile questionData={e} ></QuestionTile></div>
        })}
      </div>}
    </div>
  ) 
}
