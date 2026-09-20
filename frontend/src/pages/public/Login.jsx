import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Waves, Lock, Mail, AlertCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/common/Button';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Mocking the auth call. In reality, this posts to /api/auth/login
      await login({ email, password });
      
      // Simulate role-based routing (Normally extracted from the JWT)
      if (email.includes('admin')) {
        navigate('/admin/overview');
      } else {
        navigate('/authority/overview');
      }
    } catch (err) {
      setError('Invalid credentials or system unreachable.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 min-h-[calc(100vh-16rem)]">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden">
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-600/20 p-3 rounded-full">
              <Waves className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-center text-slate-100 mb-2">Secure Portal</h2>
          <p className="text-center text-slate-400 text-sm mb-8">
            Authorized access for NDRF and System Administrators only.
          </p>

          {error && (
            <div className="mb-6 p-3 bg-rose-900/20 border border-rose-900/50 rounded flex items-start gap-2 text-rose-500 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Official Email</label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
                  placeholder="name@gov.in"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              variant="primary" 
              className="w-full py-2.5 mt-2"
              disabled={isLoading}
            >
              {isLoading ? 'Authenticating...' : 'Sign In'}
            </Button>
          </form>
        </div>
        
        <div className="bg-slate-950 px-8 py-4 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-500">
            Unauthorized access to this system is strictly prohibited and logged.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;