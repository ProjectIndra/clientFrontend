import { apiCall } from '../Api';
import { Link } from 'react-router-dom';
import '../css/Login.css';
const MG_SERVER = process.env.REACT_APP_MG_SERVER;


function Login() {

  const handlesubmit = async (e) => {
    e.preventDefault();
    const usernameOrEmail = e.target[0].value;
    const password = e.target[1].value;
    try {
      const res = await apiCall( "post",`/login`,{username_or_email:usernameOrEmail, password:password});
      console.log("Login successful:", res.token);
      console.log(res)
      sessionStorage.setItem('token', res.token);
      window.location.href = "/home";  
    } catch (error) { 
      alert(error);
    }
  };



  return (
    <div>
      <div className="login-page">
        <div className="form">
          <div className="login">
            <div className="login-header">
              <h3>LOGIN</h3>
              <p>Please enter your credentials to login.</p>
            </div>
          </div>
          <form className="login-form" onSubmit={handlesubmit}>
            <input type="text" placeholder="username" />
            <input type="password" placeholder="password" />
            <button>login</button>
            <p className="message">Not registered? <Link to='/register'>Create an account</Link></p>
          </form>
        </div>
      </div>
    </div>
  )
}


export default Login;