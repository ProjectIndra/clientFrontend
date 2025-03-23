import '../css/Login.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
const MG_SERVER = process.env.REACT_APP_MG_SERVER;

function Login() {


  const handlesubmit = (e) => {
    e.preventDefault();

    axios.post(`${MG_SERVER}/login`, {
      username_or_email: e.target[0].value,
      password: e.target[1].value
    }, { withCredentials: true })  // Important: Ensures cookies are included
      .then((res) => {
        console.log("Login successful:", res.data);
        window.location.href = "/home";  // Redirect after successful login
      })
      .catch((err) => {
        console.error("Login failed:", err.response?.data?.error || "Unknown error");
        alert(err.response?.data?.error || "Login failed. Please try again.");
      });
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