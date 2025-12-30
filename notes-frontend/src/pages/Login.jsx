import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import bgImage from "../assets/bg-for-log.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const { isAuth } = useAuth();

  useEffect(() => {
    if (isAuth) {
      navigate("/notes", { replace: true });
    }
  }, [isAuth]);
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    await login(email, password);   
    navigate("/notes");             
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Login failed. Please try again.";

    console.error("Login error:", message);
    alert(message);                 
    
  }
};

  return (
    <div className="login-container min-h-screen flex items-center justify-center" style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="glass-card p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-200">Sign in to your account</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
              Email Address
            </label>
            <input
              id="email"
              className="input-field w-full px-4 py-3 rounded-lg border border-gray-300 bg-white bg-opacity-20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition duration-200"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
              Password
            </label>
            <input
              id="password"
              className="input-field w-full px-4 py-3 rounded-lg border border-gray-300 bg-white bg-opacity-20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition duration-200"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            className="login-btn w-full py-3 px-4 bg-white bg-opacity-30 hover:bg-opacity-40 text-white font-semibold rounded-lg transition duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white"
            type="submit"
          >
            Sign In
          </button>
        </form>
        <div className="text-center mt-6">
          <p className="text-gray-200">
            Don't have an account?{" "}
            <Link to="/auth/register" className="text-white font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
