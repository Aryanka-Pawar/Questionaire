import { Link} from 'react-router-dom';
import logo from '../Assets/question.png';
import { useUser } from '../Context/UserContext';
import style from '../CSS/Navbar.module.css';

export default function Navbar({isAuth}) {

  const {userData} = useUser();

    return (
        <div className='bg-dark fixed-top text-light p-3 mb-3'>
          <div className="d-flex justify-content-between px-2">
            <div className="row justify-content-start align-items-center">
              {!isAuth && <div className="col">
                <img src={logo} alt="Logo" height="35" width="35" className="d-inline-block align-text-top" style={{ "filter": "invert(100%)"}}/>
              </div>}

              {isAuth && <div className="col">
                <Link className="text-light" to="/">
                  <img src={logo} alt="Logo" height="35" width="35" className="d-inline-block align-text-top" style={{ "filter": "invert(100%)"}}/>
                </Link>
              </div>}

              {isAuth && <div className="col">
                <Link className= {`text-light ${style.hoverItem}`} to="/">Home</Link>
              </div>}

              {!isAuth && <div className="col">
                <Link className={`text-light ${style.hoverItem}`} to="/login">Login</Link>
              </div>}

              {!isAuth && <div className="col">
                <Link className={` text-light ${style.hoverItem}`} to="/signup">Signup</Link>
              </div> }
            </div>

            {isAuth && userData.userImage==="https://firebasestorage.googleapis.com/v0/b/questionaire-b0b15.appspot.com/o/images%2Fuser.png?alt=media&token=b2750c51-8569-4948-bf61-ef80ac7c8de2" 
            ? <Link to="/me">
              <div>
                <img src={userData.userImage} alt="Logo" height="35" width="35" className= {`d-inline-block align-text-top`}style={{ "filter": "invert(100%)"}}/>
              </div> 
            </Link>
            :  <div>
              <Link to="/me">
                <img src={userData.userImage} alt="Logo" height="35" width="35" className= {`d-inline-block rounded align-text-top`}/>
              </Link>
            </div>}
          </div>
      </div>
    )
}
