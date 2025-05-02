import { apiCall } from '../Api';
import { Link } from 'react-router-dom';
import { useState } from 'react';


function Login() {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlesubmit = async (e) => {
    e.preventDefault();
    const usernameOrEmail = e.target[0].value;
    const password = e.target[1].value;
    try {
      setIsLoading(true)
      const res = await apiCall("post", `/login`, { username_or_email: usernameOrEmail, password: password });
      setIsLoading(false);
      console.log("Login successful:", res.token);
      console.log(res)
      sessionStorage.setItem('token', res.token);
      window.location.href = "/home";
    } catch (error) {
      setIsLoading(false);
      // alert(error);
      setError(error);
    }
  };



  return (
    <>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emeraldLight via-emeraldSemi to-primary px-4">
        <div className="flex flex-col md:flex-row max-w-6xl w-full rounded-3xl overflow-hidden shadow-lg">

          {/* Left - Login Form */}
          <div className="relative w-full md:w-1/2 bg-pureWhite p-10 flex flex-col justify-center items-center">
          {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
          <div className="w-10 h-10 border-4 border-lime-400 border-t-lime-200 rounded-full animate-spin"></div>
        </div>
      )}
            <h2 className="text-4xl font-bold text-greenDark mb-6 text-center">Login</h2>
            <form onSubmit={handlesubmit} className="flex flex-col space-y-4 w-full max-w-[320px]">
              <input
                type="text"
                placeholder="Username / email"
                className="px-4 py-3 border border-grayBorder rounded-full focus:outline-none focus:ring-2 focus:ring-greenFocus"
              />
              <input
                type="password"
                placeholder="Password"
                className="px-4 py-3 border border-grayBorder rounded-full focus:outline-none focus:ring-2 focus:ring-greenFocus"
              />

              <button
                type="submit"
                className="bg-emeraldBase text-pureWhite font-semibold py-2 rounded-full hover:bg-emeraldSemi transition"
              >
                Submit
              </button>
            </form>
            <div className="text-errorRed text-[14px] font-normal min-h-[20px] mt-2">{error}</div>
            <div className="mt-6 text-sm text-grayText text-center">
              <p>
                <span className="font-semibold">Terms & Conditions</span>
              </p>
              <p className="mt-1">
                Don’t have an account?{' '}
                <Link to="/register" className="text-greenDark font-semibold underline">
                  Register
                </Link>
              </p>
            </div>
          </div>

          {/* Right - Cloud Image */}
          <div className="w-1/2 hidden md:flex bg-gradient-to-br from-emeraldMid via-emeraldSemi to-primary items-center justify-center relative">
            <img
              src="https://img.freepik.com/free-vector/computer-cloud-network-technology_53876-100678.jpg"
              alt="Cloud Login"
              className="h-full w-full object-cover rounded-tr-2xl rounded-br-2xl shadow-md"
            />
          </div>
        </div>
      </div>
    </>
  )
}


export default Login;