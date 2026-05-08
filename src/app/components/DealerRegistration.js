'use client';
import { useState } from 'react';
import { registerDealer } from '../actions';

const STATES = ['Maharashtra','Delhi','Gujarat','Karnataka','Tamil Nadu','Rajasthan','Uttar Pradesh','West Bengal','Punjab','Haryana','Bihar','Other'];
const WA_NUMBER = '919999976767';

export default function DealerRegistration() {
  const [loading, setLoading] = useState(false);
  const [done, setDone]       = useState(false);
  const [form, setForm]       = useState({
    name: '', businessName: '', mobile: '', email: '', password: '',
    city: '', pincode: '', state: '', numbersCount: '1-10 numbers', message: ''
  });

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async () => {
    if (!form.name || !form.mobile || !form.email || !form.city || !form.state) {
      alert('⚠ Please fill required fields (Name, Mobile, Email, City, State)'); return;
    }
    if (form.mobile.length < 10) { alert('⚠ Enter a valid 10-digit mobile number'); return; }
    if (form.password && form.password.length < 6) { alert('⚠ Password must be at least 6 characters'); return; }

    setLoading(true);
    try {
      await registerDealer(form);
      const waMsg = encodeURIComponent(
        `Hi! I want to register as a dealer on VIP Number Station.\nName: ${form.name}\nMobile: ${form.mobile}\nCity: ${form.city}, ${form.state}\nNumbers: ${form.numbersCount}`
      );
      window.open(`https://wa.me/${WA_NUMBER}?text=${waMsg}`, '_blank');
      setDone(true);
    } catch (e) {
      const msg = e?.message || '';
      if (msg.includes('Unique constraint') || msg.includes('email')) {
        alert('An account with this email already exists. Please use a different email or contact support.');
      } else {
        alert('Failed to register. Please try again.');
      }
    }
    setLoading(false);
  };

  if (done) {
    return (
      <div className="register-section">
        <div className="register-card" style={{ textAlign: 'center', padding: '48px 32px' }}>
          <div style={{ fontSize: '56px', marginBottom: '16px' }}>🎉</div>
          <h2 style={{ color: 'var(--gold)', marginBottom: '8px' }}>Application Submitted!</h2>
          <p style={{ color: 'var(--gray-3)', lineHeight: 1.7, marginBottom: '24px' }}>
            Thank you <strong style={{ color: 'var(--white)' }}>{form.name}</strong>!<br />
            Our team will review your application within <strong style={{ color: 'var(--gold)' }}>24 hours</strong> and contact you on WhatsApp.<br />
            {form.password && <span>Once approved, you can log in at <a href="/login" style={{ color: 'var(--gold)' }}>/login</a> using your email & password.</span>}
          </p>
          <a href="/" className="btn-gold" style={{ display: 'inline-block', padding: '12px 28px', textDecoration: 'none', borderRadius: 'var(--radius)' }}>← Back to Home</a>
        </div>
      </div>
    );
  }

  return (
    <div className="register-section">
      <div className="register-card">
        <h2>Register as a Dealer</h2>
        <p style={{ color: 'var(--gray-4)', marginBottom: '24px' }}>
          Fill in your details below. Our team will verify and activate your account within 24 hours.
        </p>

        <div className="form-grid">
          <div className="form-group">
            <label>Full Name *</label>
            <input type="text" placeholder="Your full name" value={form.name} onChange={e => set('name', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Business Name</label>
            <input type="text" placeholder="Optional" value={form.businessName} onChange={e => set('businessName', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Mobile Number *</label>
            <input type="tel" placeholder="10-digit mobile" maxLength={10} value={form.mobile} onChange={e => set('mobile', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Email Address *</label>
            <input type="email" placeholder="your@email.com" value={form.email} onChange={e => set('email', e.target.value)} />
          </div>
          <div className="form-group">
            <label>City *</label>
            <input type="text" placeholder="Your city" value={form.city} onChange={e => set('city', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Pincode</label>
            <input type="text" placeholder="400001" maxLength={6} value={form.pincode} onChange={e => set('pincode', e.target.value)} />
          </div>
          <div className="form-group">
            <label>State *</label>
            <select value={form.state} onChange={e => set('state', e.target.value)}>
              <option value="">Select State</option>
              {STATES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>How many numbers do you have?</label>
            <select value={form.numbersCount} onChange={e => set('numbersCount', e.target.value)}>
              <option>1-10 numbers</option>
              <option>11-50 numbers</option>
              <option>51-200 numbers</option>
              <option>200+ numbers</option>
            </select>
          </div>
          <div className="form-group form-full">
            <label>Create Password (for dealer login)</label>
            <input type="password" placeholder="Min 6 characters" value={form.password} onChange={e => set('password', e.target.value)} />
            <div style={{ fontSize: '11px', color: 'var(--gray-4)', marginTop: '4px' }}>
              Optional — set a password to log in to your dealer dashboard after approval.
            </div>
          </div>
          <div className="form-group form-full">
            <label>Message / Additional Info</label>
            <textarea rows="3" placeholder="Tell us about your inventory..." style={{ resize: 'vertical' }}
              value={form.message} onChange={e => set('message', e.target.value)} />
          </div>
        </div>

        <button className="btn-submit" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Submitting...' : '🤝 Submit Dealer Registration'}
        </button>
      </div>

      <div style={{ marginTop: '20px', background: 'var(--black-3)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 'var(--radius-lg)', padding: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', textAlign: 'center' }}>
        <div><div style={{ fontSize: '24px', marginBottom: '4px' }}>💰</div><div style={{ fontFamily: 'var(--font-rajdhani)', color: 'var(--gold)', fontSize: '13px' }}>Earn Commission</div><div style={{ fontSize: '11px', color: 'var(--gray-4)', marginTop: '4px' }}>On every sale</div></div>
        <div><div style={{ fontSize: '24px', marginBottom: '4px' }}>📈</div><div style={{ fontFamily: 'var(--font-rajdhani)', color: 'var(--gold)', fontSize: '13px' }}>Wide Reach</div><div style={{ fontSize: '11px', color: 'var(--gray-4)', marginTop: '4px' }}>1000s of buyers daily</div></div>
        <div><div style={{ fontSize: '24px', marginBottom: '4px' }}>🛡️</div><div style={{ fontFamily: 'var(--font-rajdhani)', color: 'var(--gold)', fontSize: '13px' }}>Secure Payments</div><div style={{ fontSize: '11px', color: 'var(--gray-4)', marginTop: '4px' }}>Direct to your account</div></div>
      </div>
    </div>
  );
}
