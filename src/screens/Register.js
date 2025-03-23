import { Link } from "react-router-dom";
import '../css/Register.css';
import axios from 'axios';
const MG_SERVER = process.env.REACT_APP_MG_SERVER;

function Register() {

    const handlesubmit = (e) => {
        e.preventDefault();
        if (e.target[3].value === e.target[2].value) {
            axios.post(`${MG_SERVER}/register`, {
                email: e.target[0].value,
                username: e.target[1].value,
                password: e.target[2].value
            }).then((res) => {
                console.log(res);
                // save the token in local storage
                window.sessionStorage.setItem("username", e.target[1].value);
                localStorage.setItem('token', res.data.token);
                window.location.href = '/login';
            }).catch((err) => {
                console.log(err.response);
            });
        }
        else {
            alert('Passwords do not match');
        }
    }

    return (
        <div>
            <div className="registration-page">
                <div className="form">
                    <div className="registration">
                        <div className="registration-header">
                            <h3>REGISTER</h3>
                            <p>Create your account by entering a username and password.</p>
                        </div>
                    </div>
                    <form className="registration-form" onSubmit={handlesubmit}>
                        <input type="email" placeholder="email" />
                        <input type="text" placeholder="username" />
                        <input type="password" placeholder="password" />
                        <input type="password" placeholder="confirm password" />
                        <button type="submit">register</button>
                        <p className="message">Already registered? <Link to='/login'>Login here</Link></p>
                    </form>
                </div>
            </div>

        </div>
    );
}

export default Register;