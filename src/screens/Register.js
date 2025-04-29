import { Link } from "react-router-dom";
import { apiCall } from "../Api";
import { useState } from "react";

function Register() {
    const [error, setError] = useState(null);

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
                // alert(error);
                setError(error);
            }
        }
        else {
            alert('Passwords do not match');
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emeraldLight via-emeraldSemi to-primary px-4">
        <div className="flex flex-col md:flex-row max-w-6xl w-full rounded-3xl overflow-hidden shadow-lg">
          
          {/* Left - Registration Form */}
          <div className="w-full md:w-1/2 bg-pureWhite p-10 flex flex-col justify-center items-center">
            <h2 className="text-4xl font-bold text-greenDark mb-6 text-center">Register</h2>
            
            <form onSubmit={handlesubmit} className="flex flex-col space-y-4 w-full max-w-[320px]">
              <input
                type="email"
                placeholder="Email"
                className="px-4 py-3 border border-grayBorder rounded-full focus:outline-none focus:ring-2 focus:ring-greenFocus"
              />
              <input
                type="text"
                placeholder="Username"
                className="px-4 py-3 border border-grayBorder rounded-full focus:outline-none focus:ring-2 focus:ring-greenFocus"
              />
              <input
                type="password"
                placeholder="Password"
                className="px-4 py-3 border border-grayBorder rounded-full focus:outline-none focus:ring-2 focus:ring-greenFocus"
              />
              <input
                type="password"
                placeholder="Confirm Password"
                className="px-4 py-3 border border-grayBorder rounded-full focus:outline-none focus:ring-2 focus:ring-greenFocus"
              />
      
              <button
                type="submit"
                className="bg-emeraldBase text-white font-semibold py-2 rounded-full hover:bg-emeraldSemi transition"
              >
                Register
              </button>
            </form>
      
            <div className="text-errorRed text-[14px] font-normal min-h-[20px] mt-2">{error}</div>
      
            <div className="mt-6 text-sm text-grayText text-center">
              <p>
                Already registered?{' '}
                <Link to="/login" className="text-greenDark font-semibold underline">
                  Login here
                </Link>
              </p>
            </div>
          </div>
      
          {/* Right - Image (hidden on mobile) */}
          <div className="w-1/2 hidden md:flex bg-gradient-to-br from-emeraldMid via-emeraldSemi to-primary items-center justify-center relative">
            <img
              src="https://img.freepik.com/free-vector/computer-cloud-network-technology_53876-100678.jpg"
              alt="Register"
              className="h-full w-full object-cover rounded-tr-2xl rounded-br-2xl shadow-md"
            />
          </div>
        </div>
      </div>
      
    );
}

export default Register;