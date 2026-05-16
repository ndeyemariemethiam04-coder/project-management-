import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register({ name, email, password });
      toast.success('Account created!');
      navigate('/');
    } catch (error) {
      console.error('Registration failed:', error);
      const message = error.response?.data?.error || 'Registration failed. Check your connection.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main)' }}>
      <div className="glass fade-in" style={{ width: '100%', maxWidth: '400px', padding: '40px', borderRadius: '24px' }}>
        <h1 style={{ marginBottom: '8px', textAlign: 'center' }}>Create Account</h1>
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '32px' }}>Start managing your projects today</p>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Full Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ width: '100%' }}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Email</label>
            <input 
              type="email" 
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%' }}
            />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%' }}
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '12px', 
              background: 'var(--primary)', 
              color: 'white',
              fontSize: '1rem',
              marginBottom: '20px'
            }}
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>
        
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
