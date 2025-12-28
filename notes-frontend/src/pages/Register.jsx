import { useState } from "react";
import api from "../api/axios";
import { Link, Navigate } from "react-router-dom";
import bgImage from "../assets/Gemini_Generated_Image_ar75pear75pear75.png";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", { email, password });
      alert("Registered successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="login-container min-h-screen flex items-center justify-center    bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500"  style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }} >
      <div className="glass-card p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-gray-200">Join us today</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-2">
              Full Name
            </label>
            <input
              id="name"
              className="input-field w-full px-4 py-3 rounded-lg border border-gray-300 bg-white bg-opacity-20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition duration-200"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
            Sign Up
          </button>
        </form>
        <div className="text-center mt-6">
          <p className="text-gray-200">
            Already have an account?{" "}
            <Link to="/auth/login" className="text-white font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
