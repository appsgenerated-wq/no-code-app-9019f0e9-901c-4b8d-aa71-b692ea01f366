import React, { useState, useEffect } from 'react';
import Manifest from '@mnfst/sdk';
import LandingPage from './screens/LandingPage';
import DashboardPage from './screens/DashboardPage';
import config from './constants';
import { testBackendConnection } from './services/apiService';
import './index.css';

function App() {
  const [user, setUser] = useState(null);
  const [currentScreen, setCurrentScreen] = useState('landing');
  const [backendConnected, setBackendConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const manifest = new Manifest({ 
    baseURL: config.BACKEND_URL, 
    appId: config.APP_ID 
  });

  useEffect(() => {
    const initializeApp = async () => {
      console.log('🚀 [APP] Initializing application...');
      setIsLoading(true);
      
      const connectionResult = await testBackendConnection();
      setBackendConnected(connectionResult.success);

      if (connectionResult.success) {
        console.log('✅ [APP] Backend connection successful.');
        try {
          const currentUser = await manifest.from('User').me();
          setUser(currentUser);
          setCurrentScreen('dashboard');
          console.log('✅ [APP] User session found:', currentUser.email);
        } catch (error) {
          setUser(null);
          setCurrentScreen('landing');
          console.log('ℹ️ [APP] No active user session.');
        }
      } else {
        console.error('❌ [APP] Backend connection failed:', connectionResult.error);
      }
      setIsLoading(false);
    };

    initializeApp();
  }, []);

  const login = async (email, password) => {
    try {
      await manifest.login(email, password);
      const loggedInUser = await manifest.from('User').me();
      setUser(loggedInUser);
      setCurrentScreen('dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please check your credentials.');
    }
  };

  const signup = async (name, email, password) => {
    try {
        await manifest.from('User').signup({ name, email, password, role: 'customer' });
        await login(email, password);
    } catch (error) {
        console.error('Signup failed:', error);
        alert('Signup failed. The email might already be in use.');
    }
  }

  const logout = async () => {
    await manifest.logout();
    setUser(null);
    setCurrentScreen('landing');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading application...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans">
      <div className="fixed top-4 right-4 z-50 flex items-center space-x-2">
          <span className={`h-3 w-3 rounded-full ${backendConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
          <span className={`text-sm font-medium ${backendConnected ? 'text-gray-700' : 'text-red-700'}`}>
            {backendConnected ? 'Backend Connected' : 'Backend Disconnected'}
          </span>
      </div>
      {currentScreen === 'landing' ? (
        <LandingPage onLogin={login} onSignup={signup} />
      ) : (
        <DashboardPage user={user} onLogout={logout} manifest={manifest} />
      )}
    </div>
  );
}

export default App;
