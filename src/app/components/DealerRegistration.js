'use client';
import { useState } from 'react';
import { registerDealer } from '../actions';

export default function DealerRegistration() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const name = document.getElementById('dealerName').value.trim();
    const businessName = document.getElementById('dealerBiz').value.trim();
    const mobile = document.getElementById('dealerMobile').value.trim();
    const email = document.getElementById('dealerEmail').value.trim();
    const city = document.getElementById('dealerCity').value.trim();
    const state = document.getElementById('dealerState').value;
    const numbersCount = document.getElementById('dealerCount').value;
    const message = document.getElementById('dealerMsg').value.trim();

    if (!name || !mobile || !email || !city || !state) { 
      alert('⚠ Please fill required fields (Name, Mobile, Email, City, State)'); 
      return; 
    }

    setLoading(true);
    try {
      await registerDealer({ name, businessName, mobile, email, city, state, numbersCount, message });
      const waMsg = encodeURIComponent(`Hi! I want to register as a dealer on VIP Number Station.\nName: ${name}\nMobile: ${mobile}\nCity: ${city}`);
      window.open(`https://wa.me/919999976767?text=${waMsg}`, '_blank');
      alert('✓ Registration submitted! We will contact you soon.');
      
      // clear form
      document.getElementById('dealerName').value = '';
      document.getElementById('dealerBiz').value = '';
      document.getElementById('dealerMobile').value = '';
      document.getElementById('dealerEmail').value = '';
      document.getElementById('dealerCity').value = '';
      document.getElementById('dealerMsg').value = '';
    } catch (e) {
      alert('Failed to register. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="register-section">
      <div className="register-card">
        <h2>Register as a Dealer</h2>
        <p>Fill in your details below. Our team will verify and activate your dealer account within 24 hours.</p>
        <div className="form-grid">
          <div className="form-group">
            <label>Full Name *</label>
            <input type="text" id="dealerName" placeholder="Your full name" />
          </div>
          <div className="form-group">
            <label>Business Name</label>
            <input type="text" id="dealerBiz" placeholder="Optional" />
          </div>
          <div className="form-group">
            <label>Mobile Number *</label>
            <input type="tel" id="dealerMobile" placeholder="+91 XXXXX XXXXX" />
          </div>
          <div className="form-group">
            <label>Email Address *</label>
            <input type="email" id="dealerEmail" placeholder="your@email.com" />
          </div>
          <div className="form-group">
            <label>City *</label>
            <input type="text" id="dealerCity" placeholder="Your city" />
          </div>
          <div className="form-group">
            <label>State *</label>
            <select id="dealerState">
              <option value="">Select State</option>
              <option>Maharashtra</option><option>Delhi</option><option>Gujarat</option>
              <option>Karnataka</option><option>Tamil Nadu</option><option>Rajasthan</option>
              <option>Uttar Pradesh</option><option>West Bengal</option><option>Other</option>
            </select>
          </div>
          <div className="form-group form-full">
            <label>How many numbers do you have to list?</label>
            <select id="dealerCount">
              <option>1-10 numbers</option>
              <option>11-50 numbers</option>
              <option>51-200 numbers</option>
              <option>200+ numbers</option>
            </select>
          </div>
          <div className="form-group form-full">
            <label>Message / Additional Info</label>
            <textarea id="dealerMsg" rows="3" placeholder="Tell us more about your inventory..." style={{ resize: 'vertical' }}></textarea>
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
