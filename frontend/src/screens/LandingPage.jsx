import React, { useState } from 'react';
import config from '../constants';

const LandingPage = ({ onLogin, onSignup }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAuthAction = (event) => {
    event.preventDefault();
    if (isLogin) {
      onLogin(email, password);
    } else {
      onSignup(name, email, password);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">FlavorFleet</h1>
          <a 
            href={`${config.BACKEND_URL}/admin`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-gray-600 hover:text-blue-500 transition"
          >
            Admin Panel
          </a>
        </nav>
      </header>
      <main className="flex-grow flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center lg:text-left flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              Discover & Order
            </h2>
            <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
              Your favorite local restaurants, delivered right to your door. Experience the best food in your city with just a few clicks.
            </p>
          </div>
          <div className="lg:w-1/2 w-full max-w-md">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex border-b mb-6">
                <button onClick={() => setIsLogin(true)} className={`flex-1 py-2 text-center font-semibold ${isLogin ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>Login</button>
                <button onClick={() => setIsLogin(false)} className={`flex-1 py-2 text-center font-semibold ${!isLogin ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>Sign Up</button>
              </div>
              <form onSubmit={handleAuthAction} className="space-y-6">
                {!isLogin && (
                  <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                )}
                <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300">
                  {isLogin ? 'Login to Your Account' : 'Create Account'}
                </button>
                 <button type="button" onClick={() => onLogin('customer@manifest.build', 'password')} className="mt-4 w-full bg-gray-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-700 transition duration-300">
                  Try Customer Demo
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
