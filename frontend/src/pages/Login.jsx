import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';

const Login = ({ setUser }) => {
  const navigate = useNavigate();

  // Controlled form state
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email.trim() || !formData.password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    try {
      setLoading(true);
      setErrorMessage('');

      // Send credentials with cookies (withCredentials: true in api.js)
      const data = await loginUser(formData);

      if (data.success) {
        if (setUser && data.customer) {
          setUser(data.customer);
        }
        navigate('/home');
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Invalid credentials';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-65px)] w-full flex flex-col lg:flex-row bg-[#FAF7F2]">

      {/* LEFT PANEL: 50% Photo Panel */}
      <div className="w-full lg:w-1/2 min-h-[380px] lg:min-h-[calc(100vh-65px)] relative bg-[#EDE7DE] flex flex-col justify-between overflow-hidden">
        <img
          src="/abracart-bag.jpg"
          alt="abracart grocery delivery"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Ambient Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1F2E29]/85 via-black/25 to-black/10"></div>

        {/* Top Tag */}
        <div className="relative z-10 p-8 sm:p-12">
          <div className="inline-flex items-center gap-2 bg-[#FAF7F2]/90 backdrop-blur-md px-4 py-2 rounded-full border border-white/50 shadow-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E76F51]"></span>
            <span className="text-xs font-bold text-[#1F2E29] uppercase tracking-wider">
              Organic & Household Essentials
            </span>
          </div>
        </div>

        {/* Bottom Editorial Copy */}
        <div className="relative z-10 p-8 sm:p-12 text-white max-w-lg">
          <span className="inline-block px-3 py-1 rounded-md bg-[#FFC857] text-[#1F2E29] font-extrabold text-xs mb-3">
            abracart Daily
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold leading-tight text-white drop-shadow-sm">
            Everything your home needs, delivered with genuine care.
          </h2>
          <p className="text-sm sm:text-base text-white/90 mt-3 font-normal leading-relaxed">
            Fresh harvest, artisanal staples, and daily household care delivered straight to your kitchen counter.
          </p>

          <div className="flex flex-wrap gap-2.5 mt-6 pt-5 border-t border-white/20 text-xs text-white">
            <span className="bg-black/30 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/20">
              🌿 100% Fresh
            </span>
            <span className="bg-black/30 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/20">
              ⚡ 15-Min Delivery
            </span>
            <span className="bg-black/30 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/20">
              🛡️ Secure Authentication
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: 50% Seamless Panel (NO inner card) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-14 lg:p-20 bg-[#FAF7F2]">
        <div className="w-full max-w-md">

          {/* Header */}
          <div className="mb-8">
            <img src="/logo.png" alt="abracart" className="h-10 w-auto mb-6" />
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1F2E29] tracking-tight">
              Welcome back
            </h1>
            <p className="text-sm text-[#1F2E29]/70 mt-1.5 font-normal">
              Enter your credentials to access your account.
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-2.5">
              <svg className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <span className="font-bold block">Invalid Credentials</span>
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email Field (Clean placeholder: "Email") */}
            <div>
              <label className="block text-xs font-bold text-[#1F2E29] uppercase tracking-wider mb-2">
                Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#16806A] transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-[#EDE7DE] bg-white text-[#1F2E29] text-sm focus:border-[#16806A] focus:ring-4 focus:ring-[#16806A]/10 outline-none transition-all placeholder:text-gray-400 font-medium"
                />
              </div>
            </div>

            {/* Password Field (Clean placeholder: "Password") */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-[#1F2E29] uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#16806A] transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full pl-11 pr-11 py-3.5 rounded-xl border border-[#EDE7DE] bg-white text-[#1F2E29] text-sm focus:border-[#16806A] focus:ring-4 focus:ring-[#16806A]/10 outline-none transition-all placeholder:text-gray-400 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-[#1F2E29] transition-colors cursor-pointer"
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-xl text-white font-bold bg-[#16806A] hover:bg-[#126A57] active:scale-[0.99] transition-all duration-200 shadow-md shadow-[#16806A]/20 disabled:opacity-60 flex items-center justify-center gap-2 text-base mt-4 cursor-pointer"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Logging in...</span>
                </>
              ) : (
                <span>Log In</span>
              )}
            </button>
          </form>

          {/* Switch to Register */}
          <div className="mt-8 pt-6 border-t border-[#EDE7DE] text-center">
            <p className="text-sm text-[#1F2E29]/70">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-bold text-[#16806A] hover:text-[#126A57] hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Login;
