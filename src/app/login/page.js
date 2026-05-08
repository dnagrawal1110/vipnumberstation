'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Invalid credentials'); setLoading(false); return; }
      const roleRoutes = { admin: '/admin', dealer: '/dealer-dashboard', team: '/team', customer: '/' };
      router.push(roleRoutes[data.role] || '/');
    } catch {
      setError('Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', background: 'var(--black-1)' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontFamily: 'var(--font-rajdhani)', fontSize: '11px', letterSpacing: '3px', color: 'var(--gold)', marginBottom: '8px' }}>VIP NUMBER STATION</div>
          <h1 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '32px', color: 'var(--white)', fontWeight: 600 }}>Sign In</h1>
          <p style={{ color: 'var(--gray-4)', fontSize: '13px', marginTop: '8px' }}>Access your dashboard</p>
        </div>

        <div className="register-card" style={{ padding: '32px' }}>
          <form onSubmit={handleLogin}>
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: 'var(--gray-3)', fontFamily: 'var(--font-rajdhani)', letterSpacing: '1px' }}>EMAIL / USERNAME</label>
              <input
                type="text" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com" required
                style={{ width: '100%', background: 'var(--black-1)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 'var(--radius)', padding: '12px 14px', color: 'var(--white)', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: 'var(--gray-3)', fontFamily: 'var(--font-rajdhani)', letterSpacing: '1px' }}>PASSWORD</label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" required
                style={{ width: '100%', background: 'var(--black-1)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 'var(--radius)', padding: '12px 14px', color: 'var(--white)', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            {error && <div style={{ background: 'rgba(255,100,100,0.1)', border: '1px solid rgba(255,100,100,0.3)', borderRadius: 'var(--radius)', padding: '10px 14px', color: '#ff6b6b', fontSize: '13px', marginBottom: '16px' }}>{error}</div>}
            <button type="submit" disabled={loading} className="btn-submit" style={{ width: '100%' }}>
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>

          <div style={{ marginTop: '20px', padding: '14px', background: 'rgba(201,168,76,0.06)', borderRadius: 'var(--radius)', borderLeft: '3px solid var(--gold)' }}>
            <div style={{ fontSize: '11px', color: 'var(--gray-4)', lineHeight: 1.8 }}>
              <strong style={{ color: 'var(--gold-light)', fontFamily: 'var(--font-rajdhani)', fontSize: '12px' }}>ADMIN</strong> — username: <code style={{ color: 'var(--gold)' }}>admin</code><br/>
              <strong style={{ color: 'var(--gold-light)', fontFamily: 'var(--font-rajdhani)', fontSize: '12px' }}>TEAM / DEALER</strong> — use your registered email
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <a href="/" style={{ color: 'var(--gray-4)', fontSize: '13px', textDecoration: 'none' }}>← Back to home</a>
        </div>
      </div>
    </div>
  );
}
