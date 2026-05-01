import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MarketingLayout from '../components/MarketingLayout';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('MEMBER');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signup(name, email, password, role);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MarketingLayout>
      <div className="w-full max-w-[480px]">
        <div className="font-mono text-[10px] uppercase tracking-micro text-slate mb-4">
          — Create your account
        </div>
        <h1 className="display-xl mb-3">
          Start <em className="serif-italic text-orchid">today.</em>
        </h1>
        <p className="text-base text-slate max-w-[420px] mb-10 leading-relaxed">
          Two minutes from sign-up to your first task. Bring your team along when you're ready.
        </p>

        <hr className="eq-rule mb-8" />

        {error && (
          <div className="mb-6 px-4 py-3 bg-revops-red-tint border border-revops-red text-revops-red text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="eq-label">Full name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="eq-input"
              placeholder="Jane Doe"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="eq-label">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="eq-input"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="eq-label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="eq-input"
              placeholder="At least 6 characters"
              minLength={6}
              required
            />
          </div>

          <div>
            <label className="eq-label">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="eq-input"
            >
              <option value="MEMBER">Member</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <button type="submit" disabled={loading} className="eq-btn-primary mt-2 py-3 text-sm">
            {loading ? 'Creating account…' : 'Create account →'}
          </button>
        </form>

        <p className="mt-8 text-sm text-slate">
          Already have an account?{' '}
          <Link to="/login" className="text-ink underline underline-offset-4 hover:text-orchid">
            Sign in
          </Link>
          .
        </p>
      </div>
    </MarketingLayout>
  );
}
