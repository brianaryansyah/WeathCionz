import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { SecurityLogger } from '../utils/SecurityLogger';

export default function Login() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (login(password)) {
      SecurityLogger.logAuthEvent('SUCCESS');
      navigate('/app');
    } else {
      setError('Invalid credentials');
      SecurityLogger.logAuthEvent('FAILURE');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <div className="bg-slate-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-700">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Secure Access</h2>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="text-slate-400 text-sm font-bold mb-2 block">Password</label>
            <input 
              type="password" 
              className="w-full bg-slate-900 text-white rounded-lg px-4 py-3 border border-slate-700 focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="Enter secure password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-red-400 text-sm font-bold">{error}</p>}
          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors mt-2"
          >
            Authenticate
          </button>
        </form>
      </div>
    </div>
  );
}
