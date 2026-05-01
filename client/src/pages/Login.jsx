import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MarketingLayout from '../components/MarketingLayout';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MarketingLayout>
      <div className="w-full max-w-[480px]">
        <div className="font-mono text-[10px] uppercase tracking-micro text-slate mb-4">
          — Sign in
        </div>
        <h1 className="display-xl mb-3">
          Welcome <em className="serif-italic text-orchid">back.</em>
        </h1>
        <p className="text-base text-slate max-w-[420px] mb-10 leading-relaxed">
          Pick up where your team left off. Your tasks, your projects — open to the page you closed.
        </p>

        <hr className="eq-rule mb-8" />

        {error && (
          <div className="mb-6 px-4 py-3 bg-revops-red-tint border border-revops-red text-revops-red text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="eq-label">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="eq-input"
              placeholder="you@example.com"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="eq-label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="eq-input"
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" disabled={loading} className="eq-btn-primary mt-2 py-3 text-sm">
            {loading ? 'Signing in…' : 'Sign in →'}
          </button>
        </form>

        <p className="mt-8 text-sm text-slate">
          Don't have an account?{' '}
          <Link to="/signup" className="text-ink underline underline-offset-4 hover:text-orchid">
            Create one
          </Link>
          .
        </p>
      </div>
    </MarketingLayout>
  );
}
