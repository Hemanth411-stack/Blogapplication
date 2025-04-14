import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/slices/authslice.js';

const Signin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.user);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(loginUser({
      email: formData.email,
      password: formData.password
    }));
    
    if (loginUser.fulfilled.match(resultAction)) {
      navigate('/Home'); 
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="w-full h-full bg-cover bg-center animate-float"
          style={{ 
            backgroundImage: "url('https://static.vecteezy.com/system/resources/thumbnails/014/468/621/small/abstract-digital-technology-background-with-concept-security-vector.jpg')",
            animation: 'float 5s infinite ease-in-out'
          }}
        ></div>
      </div>

      
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg z-10 overflow-hidden">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Welcome Back</h1>
          
          {/* Display error message if login fails */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="john@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 text-blue-600 rounded"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-gray-600">Remember me</label>
              </div>
              <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">Forgot password?</Link>
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className={`w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-blue-600 transition duration-300 shadow-md ${
                status === 'loading' ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {status === 'loading' ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/" className="text-blue-600 font-medium hover:underline">Sign up</Link>
            </p>
          </div>
        </div>
      </div>

      
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.02); }
        }
      `}</style>
    </div>
  );
};

export default Signin;