import { Link } from "react-router-dom";
import '../css/Register.css';
import axios from 'axios';


function Register() {

    const handlesubmit = (e) => {
        e.preventDefault();
        
        if (e.target[1].value === e.target[2].value) {

            axios.post('http://localhost:5000/api/register', {
                username: e.target[0].value,
                password: e.target[1].value
            }).then((res) => {
                console.log(res);
                // save the token in local storage
                window.sessionStorage.setItem("username", e.target[0].value);
                localStorage.setItem('token', res.data.token);
                window.location.href = '/home';
            }).catch((err) => {
                alert(err.response.data);
            });

        }
        else {
            alert('Passwords do not match');
        }
    }

    return (
        <div>
            <div class="registration-page">
                <div class="form">
                    <div class="registration">
                        <div class="registration-header">
                            <h3>REGISTER</h3>
                            <p>Create your account by entering a username and password.</p>
                        </div>
                    </div>
                    <form class="registration-form" onSubmit={handlesubmit}>
                        <input type="text" placeholder="username" />
                        <input type="password" placeholder="password" />
                        <input type="password" placeholder="confirm password" />
                        <button type="submit">register</button>
                        <p class="message">Already registered? <Link to='/'>Login here</Link></p>
                    </form>
                </div>
            </div>

        </div>
    );
}

export default Register;