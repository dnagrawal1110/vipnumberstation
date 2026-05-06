'use client';
import { useState, useEffect } from 'react';
import { getDashboardStats, getNumbers, addNumber, deleteNumber, getDealers, getEnquiries } from '../actions';
import { CATEGORIES } from '../lib/categories';

export default function AdminPanel() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [stats, setStats] = useState({ total: 0, rtp: 0, nonRtp: 0, enquiries: 0 });
  const [numbers, setNumbers] = useState([]);
  const [dealers, setDealers] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  
  const handleLogin = () => {
    const u = document.getElementById('adminUser').value;
    const p = document.getElementById('adminPass').value;
    if (u === 'admin' && p === 'vip@2026') {
      setLoggedIn(true);
      fetchData();
    } else {
      alert('⚠ Invalid credentials. Try admin / vip@2026');
    }
  };

  const fetchData = async () => {
    setStats(await getDashboardStats());
    setNumbers(await getNumbers());
    setDealers(await getDealers());
    setEnquiries(await getEnquiries());
  };

  const handleDeleteNumber = async (id) => {
    if (!confirm('Delete this number?')) return;
    await deleteNumber(id);
    fetchData();
  };

  const handleAddNumber = async () => {
    const rawNumber = document.getElementById('addRaw').value.trim();
    const displayFormat = document.getElementById('addDisplay').value.trim();
    const highlight = document.getElementById('addHighlight').value.trim();
    const mrp = parseInt(document.getElementById('addMRP').value);
    const price = parseInt(document.getElementById('addPrice').value);
    const discount = parseInt(document.getElementById('addDiscount').value) || 0;
    const operator = document.getElementById('addOperator').value;
    const type = document.getElementById('addType').value;
    const rtpDate = document.getElementById('addRTPDate').value;
    const category = document.getElementById('addCategory').value;
    const dealer = document.getElementById('addDealer').value || 'Own';

    if (!rawNumber || rawNumber.length !== 10 || !displayFormat || !mrp || !price) {
      alert('⚠ Please fill all required fields. Number must be 10 digits.');
      return;
    }

    const sumTotal = rawNumber.split('').reduce((a,b) => a + parseInt(b), 0);
    const step2 = sumTotal.toString().split('').reduce((a,b) => a + parseInt(b), 0);
    const step3 = step2 > 9 ? step2.toString().split('').reduce((a,b) => a + parseInt(b), 0) : step2;

    await addNumber({
      rawNumber, displayFormat, highlight, mrp, price, discount, operator, type, 
      rtpDate: type === 'Non-RTP' ? rtpDate : null, 
      category, sumBreakdown: `${sumTotal}-${step2}-${step3}`, sum: step3, dealer
    });

    alert('✓ Number added successfully!');
    fetchData();
    setActiveTab('numbers');
  };

  if (!loggedIn) {
    return (
      <div id="adminLoginWrap" style={{ maxWidth: '400px', margin: '80px auto', padding: '0 24px' }}>
        <div className="register-card">
          <h2>Admin Login</h2>
          <p>Enter your credentials to access the admin panel.</p>
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label>Username</label>
            <input type="text" id="adminUser" placeholder="admin" />
          </div>
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label>Password</label>
            <input type="password" id="adminPass" placeholder="••••••••" />
          </div>
          <button className="btn-submit" onClick={handleLogin}>Login to Admin Panel</button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <div className="admin-sidebar">
        <div className="admin-logo">💎 Admin Panel</div>
        <div style={{ padding: '10px 0' }}>
          <div className={`admin-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}><span className="icon">📊</span>Dashboard</div>
          <div className={`admin-nav-item ${activeTab === 'numbers' ? 'active' : ''}`} onClick={() => setActiveTab('numbers')}><span className="icon">📱</span>Manage Numbers</div>
          <div className={`admin-nav-item ${activeTab === 'addnumber' ? 'active' : ''}`} onClick={() => setActiveTab('addnumber')}><span className="icon">➕</span>Add Number</div>
          <div className={`admin-nav-item ${activeTab === 'dealers' ? 'active' : ''}`} onClick={() => setActiveTab('dealers')}><span className="icon">🤝</span>Dealers</div>
          <div className={`admin-nav-item ${activeTab === 'enquiries' ? 'active' : ''}`} onClick={() => setActiveTab('enquiries')}><span className="icon">📩</span>Enquiries</div>
          <div className={`admin-nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}><span className="icon">⚙️</span>Settings</div>
          <div className="admin-nav-item" onClick={() => setLoggedIn(false)} style={{ marginTop: '20px' }}><span className="icon">🚪</span>Logout</div>
        </div>
      </div>

      <div className="admin-main">
        {activeTab === 'dashboard' && (
          <div className="admin-page active">
            <div className="admin-header">📊 Dashboard</div>
            <div className="admin-stats">
              <div className="stat-card"><div className="stat-card-val">{stats.total}</div><div className="stat-card-label">Total Numbers</div></div>
              <div className="stat-card"><div className="stat-card-val">{stats.rtp}</div><div className="stat-card-label">RTP Numbers</div></div>
              <div className="stat-card"><div className="stat-card-val">{stats.nonRtp}</div><div className="stat-card-label">Non-RTP Numbers</div></div>
              <div className="stat-card"><div className="stat-card-val">{stats.enquiries}</div><div className="stat-card-label">Pending Enquiries</div></div>
            </div>
            <div className="admin-table">
              <table>
                <thead><tr><th>Number</th><th>Category</th><th>Price</th><th>Type</th><th>Operator</th><th>Status</th></tr></thead>
                <tbody>
                  {numbers.slice(0, 10).map(n => (
                    <tr key={n.id}>
                      <td style={{ fontFamily: 'var(--font-rajdhani)', fontSize: '15px', letterSpacing: '1px', color: 'var(--gold)' }}>{n.displayFormat}</td>
                      <td style={{ fontSize: '11px', color: 'var(--gray-4)' }}>{n.category}</td>
                      <td>₹{n.price.toLocaleString()}</td>
                      <td><span className={`status-badge ${n.type === 'RTP' ? 'status-rtp' : 'status-non-rtp'}`}>{n.type}</span></td>
                      <td>{n.operator}</td>
                      <td><span className="status-badge status-rtp">Active</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'numbers' && (
          <div className="admin-page active">
            <div className="admin-header">📱 Manage Numbers</div>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <button className="btn-sm btn-sm-outline" onClick={() => setActiveTab('addnumber')}>+ Add New</button>
            </div>
            <div className="admin-table">
              <table>
                <thead><tr><th>Number (Display)</th><th>Raw Number</th><th>Category</th><th>MRP</th><th>Price</th><th>Type</th><th>Operator</th><th>Sum Total</th><th>Actions</th></tr></thead>
                <tbody>
                  {numbers.map(n => (
                    <tr key={n.id}>
                      <td style={{ fontFamily: 'var(--font-rajdhani)', fontSize: '15px', letterSpacing: '1px', color: 'var(--gold)' }}>{n.displayFormat}</td>
                      <td style={{ fontSize: '12px', color: 'var(--gray-4)' }}>{n.rawNumber}</td>
                      <td style={{ fontSize: '11px', maxWidth: '120px' }}>{n.category}</td>
                      <td>₹{n.mrp.toLocaleString()}</td>
                      <td style={{ color: 'var(--gold)' }}>₹{n.price.toLocaleString()}</td>
                      <td><span className={`status-badge ${n.type === 'RTP' ? 'status-rtp' : 'status-non-rtp'}`}>{n.type}</span></td>
                      <td>{n.operator}</td>
                      <td style={{ color: 'var(--gold-light)' }}>{n.sumBreakdown}</td>
                      <td>
                        <button className="btn-sm btn-sm-red" onClick={() => handleDeleteNumber(n.id)} style={{ padding: '3px 10px', fontSize: '11px' }}>Del</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'addnumber' && (
          <div className="admin-page active">
            <div className="admin-header">➕ Add New Number</div>
            <div className="add-form">
              <div className="add-form-grid-3" style={{ marginBottom: '16px' }}>
                <div className="form-field"><label>Raw Number (10 digits) *</label><input type="text" id="addRaw" placeholder="9876543210" maxLength="10" /></div>
                <div className="form-field"><label>Display Format (with spaces) *</label><input type="text" id="addDisplay" placeholder="98765 43210" /></div>
                <div className="form-field"><label>Highlighted Digits</label><input type="text" id="addHighlight" placeholder="e.g. 999 or 432" /></div>
              </div>
              <div className="add-form-grid-3" style={{ marginBottom: '16px' }}>
                <div className="form-field"><label>MRP (₹) *</label><input type="number" id="addMRP" placeholder="5000" /></div>
                <div className="form-field"><label>Selling Price (₹) *</label><input type="number" id="addPrice" placeholder="4500" /></div>
                <div className="form-field"><label>Discount %</label><input type="number" id="addDiscount" placeholder="10" min="0" max="90" /></div>
                <div className="form-field"><label>Operator *</label><select id="addOperator"><option>Jio</option><option>Airtel</option><option>Vi</option><option>BSNL</option></select></div>
                <div className="form-field"><label>Type *</label><select id="addType"><option value="RTP">RTP (Ready to Port)</option><option value="Non-RTP">Non-RTP</option></select></div>
                <div className="form-field"><label>RTP Date (if Non-RTP)</label><input type="date" id="addRTPDate" /></div>
                <div className="form-field"><label>Category *</label><select id="addCategory">{CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}</select></div>
              </div>
              <div className="form-field" style={{ marginBottom: '16px' }}><label>Dealer (optional)</label><select id="addDealer"><option value="">Own Inventory</option><option>Dealer 1</option><option>Dealer 2</option></select></div>
              <div style={{ display: 'flex', gap: '10px' }}><button className="btn-sm btn-sm-gold" onClick={handleAddNumber} style={{ padding: '11px 28px', fontSize: '14px' }}>➕ Add Number</button></div>
            </div>
          </div>
        )}

        {activeTab === 'dealers' && (
          <div className="admin-page active">
            <div className="admin-header">🤝 Dealer Management</div>
            <div className="admin-table">
              <table>
                <thead><tr><th>Name</th><th>Mobile</th><th>City</th><th>Numbers Listed</th><th>Status</th></tr></thead>
                <tbody>
                  {dealers.map(d => (
                    <tr key={d.id}><td>{d.name}</td><td>{d.mobile}</td><td>{d.city}</td><td>{d.numbersCount}</td><td><span className="status-badge status-rtp">{d.status}</span></td></tr>
                  ))}
                  {dealers.length === 0 && <tr><td colSpan="5">No dealers registered yet.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'enquiries' && (
          <div className="admin-page active">
            <div className="admin-header">📩 Enquiries</div>
            <div className="admin-table">
              <table>
                <thead><tr><th>Name</th><th>Number Interest</th><th>Phone</th><th>Actions</th></tr></thead>
                <tbody>
                  {enquiries.length === 0 && <tr><td colSpan="4">No enquiries yet.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="admin-page active">
            <div className="admin-header">⚙️ Settings</div>
            <p>Static settings panel for future implementation.</p>
          </div>
        )}
      </div>
    </div>
  );
}
