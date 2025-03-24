import { Link } from "react-router-dom";
import { api, apiCall } from "../Api";
import '../css/Register.css';
const MG_SERVER = process.env.REACT_APP_MG_SERVER;

function Register() {

    const handlesubmit = async(e) => {
        e.preventDefault();
        if (e.target[3].value === e.target[2].value) {
            const email = e.target[0].value;
            const username = e.target[1].value;
            const password = e.target[2].value;
            try {
                await apiCall("post", "/register", { email: email, username: username, password: password }).then((res) => {
                    console.log(res);
                    window.location.href = '/login';
                })
            } catch (error) {
                alert(error);
            }
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