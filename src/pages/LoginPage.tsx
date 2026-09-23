import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Home, Building } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export default function LoginPage() {
  const navigate = useNavigate();
  const { signIn, demoLogin } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    role: 'tenant',
  });

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { error: authError } = await signIn(formData.email, formData.password);
      if (authError) throw authError;
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = (role: 'tenant' | 'landlord') => {
    demoLogin(role);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7F8FA] to-[#E4E7EC] flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-[#E4E7EC] overflow-hidden">
        <div className="p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-[#3157FF]/10 rounded-2xl flex items-center justify-center mb-4 text-[#3157FF]">
              <Shield size={32} />
            </div>
            <h2 className="text-2xl font-bold text-[#111827]">Welcome to RentProof</h2>
            <p className="text-[#667085] mt-2 text-center text-sm">
              The verified digital condition passport for your rental.
            </p>
          </div>

          <div className="flex bg-[#F7F8FA] p-1 rounded-xl mb-8">
            <button
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${isLogin ? 'bg-white text-[#111827] shadow-sm' : 'text-[#667085] hover:text-[#111827]'}`}
              onClick={() => setIsLogin(true)}
            >
              Sign In
            </button>
            <button
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${!isLogin ? 'bg-white text-[#111827] shadow-sm' : 'text-[#667085] hover:text-[#111827]'}`}
              onClick={() => setIsLogin(false)}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <Input
                label="Full Name"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            )}
            <Input
              label="Email Address"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <Input
              label="Password"
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-[#111827] mb-1">I am a...</label>
                <select
                  className="w-full px-4 py-2 border border-[#E4E7EC] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3157FF]/20 focus:border-[#3157FF]"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="tenant">Tenant</option>
                  <option value="landlord">Landlord</option>
                </select>
              </div>
            )}

            {error && <p className="text-sm text-[#F04438]">{error}</p>}

            <Button type="submit" variant="primary" className="w-full mt-2" loading={loading}>
              {isLogin ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          <div className="my-8 flex items-center gap-4 text-[#667085] text-sm">
            <div className="flex-1 h-px bg-[#E4E7EC]" />
            <span>or try a demo</span>
            <div className="flex-1 h-px bg-[#E4E7EC]" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleDemo('tenant')}
              className="flex flex-col items-center justify-center gap-1 py-4 border border-[#E4E7EC] rounded-xl hover:bg-[#EFF4FF] hover:border-[#3157FF] transition-all text-sm font-medium text-[#111827]"
            >
              <Home size={22} className="text-[#3157FF]" />
              <span>Tenant Demo</span>
              <span className="text-[10px] text-[#667085]">Aarav Sharma</span>
            </button>
            <button
              onClick={() => handleDemo('landlord')}
              className="flex flex-col items-center justify-center gap-1 py-4 border border-[#E4E7EC] rounded-xl hover:bg-[#101828]/5 hover:border-[#101828] transition-all text-sm font-medium text-[#111827]"
            >
              <Building size={22} className="text-[#101828]" />
              <span>Landlord Demo</span>
              <span className="text-[10px] text-[#667085]">Rahul Mehta</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
