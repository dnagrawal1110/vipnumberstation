'use client';
import { useState, useEffect } from 'react';
import {
  getDashboardStats, getNumbers, addNumber, deleteNumber, markNumberSold,
  getDealers, getEnquiries, updateEnquiryStatus,
  approveDealer, rejectDealer, addDealerByAdmin, addTeamUser, getTeamUsers,
  unlockNumber
} from '../actions';
import { calcPrices } from '../lib/pricing';
import { CATEGORIES } from '../lib/categories';

const TABS = ['dashboard', 'numbers', 'add-number', 'enquiries', 'dealers', 'team'];
const STATES = ['Maharashtra','Delhi','Gujarat','Karnataka','Tamil Nadu','Rajasthan','Uttar Pradesh','West Bengal','Punjab','Haryana','Bihar','Other'];

export default function AdminPanel() {
  const [activeTab, setActiveTab]   = useState('dashboard');
  const [stats, setStats]           = useState({ total: 0, rtp: 0, nonRtp: 0, enquiries: 0, dealers: 0, pending: 0 });
  const [numbers, setNumbers]       = useState([]);
  const [dealers, setDealers]       = useState([]);
  const [pendingDealers, setPendingDealers] = useState([]);
  const [enquiries, setEnquiries]   = useState([]);
  const [teamUsers, setTeamUsers]   = useState([]);
  const [enqFilter, setEnqFilter]   = useState('All');
  const [numFilter, setNumFilter]   = useState('');
  const [dealerTab, setDealerTab]   = useState('requests');

  // Commission calc state
  const [dealerPrice, setDealerPrice] = useState('');
  const [commission, setCommission]   = useState(25);
  const [calcResult, setCalcResult]   = useState({ price: 0, mrp: 0, discount: 15 });

  useEffect(() => {
    if (dealerPrice) {
      const dp = parseInt(dealerPrice) || 0;
      const price = Math.ceil(dp * (1 + commission / 100));
      const mrp   = Math.ceil(price / 0.85);
      setCalcResult({ price, mrp, discount: 15 });
    } else {
      setCalcResult({ price: 0, mrp: 0, discount: 15 });
    }
  }, [dealerPrice, commission]);

  // Load data on mount (proxy.js already ensures only admins reach this page)
  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    const [s, n, d, pd, e, t] = await Promise.all([
      getDashboardStats(), getNumbers(), getDealers('Active'), getDealers('Pending'),
      getEnquiries(), getTeamUsers()
    ]);
    setStats(s); setNumbers(n); setDealers(d); setPendingDealers(pd);
    setEnquiries(e); setTeamUsers(t);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this number?')) return;
    await deleteNumber(id); fetchAll();
  };

  const handleMarkSold = async (id) => {
    if (!confirm('Mark as Sold? Hidden from website.')) return;
    await markNumberSold(id); fetchAll();
  };

  const handleUnlock = async (id) => {
    await unlockNumber(id); fetchAll();
  };

  const handleAddNumber = async () => {
    const rawNumber     = document.getElementById('addRaw').value.trim();
    const displayFormat = document.getElementById('addDisplay').value.trim();
    const highlight     = document.getElementById('addHighlight').value.trim();
    const dp            = parseInt(document.getElementById('addDealerPrice').value) || 0;
    const comm          = parseInt(document.getElementById('addCommission').value) || 25;
    const operator      = document.getElementById('addOperator').value;
    const type          = document.getElementById('addType').value;
    const rtpDate       = document.getElementById('addRTPDate').value;
    const category      = document.getElementById('addCategory').value;
    const dealer        = document.getElementById('addDealer').value || 'Own';
    const dealerRef     = document.getElementById('addDealerRef').value;

    if (!rawNumber || rawNumber.length !== 10 || !displayFormat || !dp) {
      alert('⚠ Fill all required fields. Number must be 10 digits and dealer price > 0.'); return;
    }
    await addNumber({ rawNumber, displayFormat, highlight, dealerPrice: dp, commission: comm, operator, type, rtpDate, category, dealer, dealerRef });
    alert('✓ Number added!'); fetchAll(); setActiveTab('numbers');
  };

  const handleAddDealer = async () => {
    const data = {
      name:         document.getElementById('newDealerName').value.trim(),
      businessName: document.getElementById('newDealerBiz').value.trim(),
      mobile:       document.getElementById('newDealerMobile').value.trim(),
      email:        document.getElementById('newDealerEmail').value.trim(),
      password:     document.getElementById('newDealerPass').value,
      city:         document.getElementById('newDealerCity').value.trim(),
      pincode:      document.getElementById('newDealerPincode').value.trim(),
      state:        document.getElementById('newDealerState').value,
    };
    if (!data.name || !data.mobile || !data.email || !data.city) { alert('Fill required fields'); return; }
    await addDealerByAdmin(data);
    alert('✓ Dealer added & activated!'); fetchAll(); setDealerTab('active');
  };

  const handleApprove = async (id) => { await approveDealer(id); fetchAll(); };
  const handleReject  = async (id) => { await rejectDealer(id);  fetchAll(); };

  const handleAddTeamUser = async () => {
    const data = {
      name:     document.getElementById('tmName').value.trim(),
      email:    document.getElementById('tmEmail').value.trim(),
      password: document.getElementById('tmPass').value,
      role:     document.getElementById('tmRole').value,
    };
    if (!data.name || !data.email || !data.password) { alert('Fill all fields'); return; }
    await addTeamUser(data);
    alert('✓ Team member added!'); fetchAll();
  };

  const handleEnqStatus = async (id, status) => {
    const notes = (status === 'Closed' || status === 'Lost') ? prompt('Add a note (optional):') : null;
    await updateEnquiryStatus(id, status, notes);
    fetchAll();
  };

  const filteredEnqs = enqFilter === 'All' ? enquiries : enquiries.filter(e => e.status === enqFilter);
  const filteredNums = numFilter
    ? numbers.filter(n => n.rawNumber.includes(numFilter) || n.operator.toLowerCase().includes(numFilter.toLowerCase()))
    : numbers;

  return (
    <div className="admin-wrap">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <div style={{ fontFamily: 'var(--font-rajdhani)', fontSize: '10px', letterSpacing: '2px', color: 'var(--gold)', marginBottom: '2px' }}>CONTROL PANEL</div>
          <div style={{ fontFamily: 'var(--font-cormorant)', fontSize: '18px', color: 'var(--white)', fontWeight: 600 }}>VIP Station</div>
        </div>
        {TABS.map(tab => (
          <button key={tab} className={`admin-nav-btn ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
            {{
              dashboard: '📊 Dashboard', numbers: '📋 Numbers', 'add-number': '➕ Add Number',
              enquiries: `💬 Enquiries${enquiries.length > 0 ? ` (${enquiries.length})` : ''}`,
              dealers: `🤝 Dealers${stats.pending > 0 ? ` (${stats.pending})` : ''}`,
              team: '👥 Team'
            }[tab]}
          </button>
        ))}
        <div style={{ marginTop: 'auto' }}>
          <button className="admin-nav-btn" style={{ color: '#ff6b6b', width: '100%' }}
            onClick={async () => { await fetch('/api/auth/logout', { method: 'POST' }); window.location.href = '/login'; }}>
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="admin-main">

        {/* ── DASHBOARD ── */}
        {activeTab === 'dashboard' && (
          <div>
            <div className="admin-page-title">Dashboard</div>
            <div className="stat-grid">
              <div className="stat-card"><div className="stat-val">{stats.total}</div><div className="stat-label">Live Numbers</div></div>
              <div className="stat-card"><div className="stat-val" style={{ color: '#4CAF50' }}>{stats.rtp}</div><div className="stat-label">RTP (Instant)</div></div>
              <div className="stat-card"><div className="stat-val" style={{ color: '#FF9800' }}>{stats.nonRtp}</div><div className="stat-label">Non-RTP</div></div>
              <div className="stat-card"><div className="stat-val" style={{ color: 'var(--gold)' }}>{stats.enquiries}</div><div className="stat-label">Total Enquiries</div></div>
              <div className="stat-card"><div className="stat-val">{stats.dealers}</div><div className="stat-label">Active Dealers</div></div>
              <div className="stat-card"><div className="stat-val" style={{ color: '#FF9800' }}>{stats.pending}</div><div className="stat-label">Pending Requests</div></div>
            </div>
            {stats.pending > 0 && (
              <div className="alert-banner" onClick={() => { setActiveTab('dealers'); setDealerTab('requests'); }}>
                ⚠ {stats.pending} dealer request{stats.pending > 1 ? 's' : ''} waiting for approval — Click to review
              </div>
            )}
          </div>
        )}

        {/* ── NUMBERS ── */}
        {activeTab === 'numbers' && (
          <div>
            <div className="admin-page-title">Numbers ({filteredNums.length})</div>
            <input className="admin-search" type="text" placeholder="Search by number or operator..."
              value={numFilter} onChange={e => setNumFilter(e.target.value)} />
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr><th>Number</th><th>Sell Price</th><th>MRP</th><th>Dealer ₹</th><th>Comm%</th><th>Op</th><th>Type</th><th>Status</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {filteredNums.map(n => (
                    <tr key={n.id} style={{ opacity: n.status === 'Sold' ? 0.4 : 1 }}>
                      <td style={{ fontFamily: 'var(--font-rajdhani)', fontSize: '14px', letterSpacing: '1px' }}>{n.displayFormat || n.rawNumber}</td>
                      <td><strong style={{ color: 'var(--gold)' }}>₹{n.price.toLocaleString()}</strong></td>
                      <td style={{ color: 'var(--gray-4)', textDecoration: 'line-through', fontSize: '12px' }}>₹{n.mrp.toLocaleString()}</td>
                      <td style={{ fontSize: '12px', color: 'var(--gray-3)' }}>₹{(n.dealerPrice || 0).toLocaleString()}</td>
                      <td style={{ fontSize: '12px' }}>{n.commission || 25}%</td>
                      <td><span className={`op-tag op-${n.operator.toLowerCase()}`}>{n.operator}</span></td>
                      <td><span className={`rtp-mini ${n.type === 'RTP' ? 'rtp' : 'nrtp'}`}>{n.type}</span></td>
                      <td><span className={`status-dot ${n.status === 'Available' ? 'green' : n.status === 'Locked' ? 'orange' : 'red'}`}>{n.status}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                          {n.status === 'Locked' && <button className="tbl-btn tbl-warn" onClick={() => handleUnlock(n.id)}>Unlock</button>}
                          {n.status !== 'Sold' && <button className="tbl-btn tbl-info" onClick={() => handleMarkSold(n.id)}>Sold</button>}
                          <button className="tbl-btn tbl-danger" onClick={() => handleDelete(n.id)}>Del</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── ADD NUMBER ── */}
        {activeTab === 'add-number' && (
          <div>
            <div className="admin-page-title">Add Number</div>
            <div className="admin-form-card">
              <div className="form-2col">
                <div className="form-group"><label>Raw Number (10 digits) *</label><input type="text" id="addRaw" placeholder="9876543210" maxLength={10} /></div>
                <div className="form-group"><label>Display Format *</label><input type="text" id="addDisplay" placeholder="98765-43210" /></div>
                <div className="form-group"><label>Highlight Digits (comma-sep)</label><input type="text" id="addHighlight" placeholder="9876, 3210" /></div>
                <div className="form-group"><label>Operator *</label><select id="addOperator"><option>Jio</option><option>Airtel</option><option>Vi</option><option>BSNL</option></select></div>
                <div className="form-group"><label>Type *</label><select id="addType"><option value="RTP">RTP (Instant Port)</option><option value="Non-RTP">Non-RTP (Pre-Book)</option></select></div>
                <div className="form-group"><label>RTP Ready Date (if Non-RTP)</label><input type="date" id="addRTPDate" style={{ colorScheme: 'dark' }} /></div>
                <div className="form-group"><label>Category *</label><select id="addCategory">{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></div>
                <div className="form-group"><label>Dealer Name</label><input type="text" id="addDealer" placeholder="Dealer name or Own" /></div>
                <div className="form-group"><label>Dealer DB ID (optional)</label><input type="number" id="addDealerRef" placeholder="ID from dealer table" /></div>
              </div>

              <div className="commission-box">
                <div className="commission-title">💰 Price Calculator</div>
                <div className="form-2col">
                  <div className="form-group">
                    <label>Dealer Price (₹) *</label>
                    <input type="number" id="addDealerPrice" placeholder="What dealer charges us"
                      value={dealerPrice} onChange={e => setDealerPrice(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Commission % (default 25)</label>
                    <input type="number" id="addCommission" value={commission}
                      onChange={e => setCommission(parseInt(e.target.value) || 25)} />
                  </div>
                </div>
                {dealerPrice && (
                  <div className="calc-result">
                    <div className="calc-item"><span>Selling Price (shown on site)</span><strong style={{ color: 'var(--gold)' }}>₹{calcResult.price.toLocaleString()}</strong></div>
                    <div className="calc-item"><span>MRP (with {calcResult.discount}% discount shown)</span><strong style={{ color: 'var(--gray-3)', textDecoration: 'line-through' }}>₹{calcResult.mrp.toLocaleString()}</strong></div>
                    <div className="calc-item"><span>Our Margin</span><strong style={{ color: '#4CAF50' }}>₹{(calcResult.price - parseInt(dealerPrice || 0)).toLocaleString()}</strong></div>
                  </div>
                )}
              </div>

              <button className="btn-submit" style={{ marginTop: '20px' }} onClick={handleAddNumber}>➕ Add Number to Website</button>
            </div>
          </div>
        )}

        {/* ── ENQUIRIES / CRM ── */}
        {activeTab === 'enquiries' && (
          <div>
            <div className="admin-page-title">Enquiries / CRM</div>
            <div className="filter-pills-row">
              {['All','New','Contacted','Confirmed','Closed','Lost'].map(s => (
                <button key={s} className={`option-pill ${enqFilter === s ? 'active' : ''}`} onClick={() => setEnqFilter(s)}>
                  {s} ({s === 'All' ? enquiries.length : enquiries.filter(e => e.status === s).length})
                </button>
              ))}
            </div>
            <div style={{ overflowX: 'auto', marginTop: '16px' }}>
              <table className="admin-table">
                <thead>
                  <tr><th>Name</th><th>Mobile</th><th>Number</th><th>Type</th><th>Price</th><th>Status</th><th>Locked Until</th><th>Date</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {filteredEnqs.map(e => (
                    <tr key={e.id}>
                      <td>{e.name || '—'}</td>
                      <td>
                        <a href={`https://wa.me/91${e.mobile}?text=${encodeURIComponent(`Hi ${e.name || ''}, this is VIP Number Station team regarding your enquiry for ${e.numberRaw || 'a VIP number'}.`)}`}
                          target="_blank" rel="noreferrer"
                          style={{ color: 'var(--gold)', textDecoration: 'none', fontFamily: 'var(--font-rajdhani)' }}>
                          📞 {e.mobile}
                        </a>
                      </td>
                      <td style={{ fontFamily: 'var(--font-rajdhani)', letterSpacing: '1px' }}>{e.numberRaw || e.numberInterest || '—'}</td>
                      <td><span className={`rtp-mini ${e.enquiryType === 'Buy Now' ? 'rtp' : 'nrtp'}`}>{e.enquiryType || e.type || 'General'}</span></td>
                      <td>{e.numberPrice ? `₹${e.numberPrice.toLocaleString()}` : '—'}</td>
                      <td><span className={`status-dot ${e.status === 'New' ? 'orange' : e.status === 'Confirmed' ? 'green' : e.status === 'Closed' || e.status === 'Lost' ? 'red' : 'blue'}`}>{e.status}</span></td>
                      <td style={{ fontSize: '11px', color: 'var(--gray-4)' }}>
                        {e.lockedUntil ? new Date(e.lockedUntil).toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' }) : '—'}
                      </td>
                      <td style={{ fontSize: '11px', color: 'var(--gray-4)' }}>{new Date(e.createdAt).toLocaleDateString('en-IN')}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                          {e.status === 'New' && <button className="tbl-btn tbl-info" onClick={() => handleEnqStatus(e.id, 'Contacted')}>Contact</button>}
                          {e.status === 'Contacted' && <button className="tbl-btn tbl-success" onClick={() => handleEnqStatus(e.id, 'Confirmed')}>Confirm</button>}
                          {!['Closed','Lost'].includes(e.status) && <>
                            <button className="tbl-btn tbl-success" onClick={() => handleEnqStatus(e.id, 'Closed')}>Close</button>
                            <button className="tbl-btn tbl-danger" onClick={() => handleEnqStatus(e.id, 'Lost')}>Lost</button>
                          </>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── DEALERS ── */}
        {activeTab === 'dealers' && (
          <div>
            <div className="admin-page-title">Dealers</div>
            <div className="filter-pills-row" style={{ marginBottom: '20px' }}>
              <button className={`option-pill ${dealerTab === 'requests' ? 'active' : ''}`} onClick={() => setDealerTab('requests')}>
                Requests{pendingDealers.length > 0 ? ` (${pendingDealers.length})` : ''}
              </button>
              <button className={`option-pill ${dealerTab === 'active' ? 'active' : ''}`} onClick={() => setDealerTab('active')}>Active ({dealers.length})</button>
              <button className={`option-pill ${dealerTab === 'add' ? 'active' : ''}`} onClick={() => setDealerTab('add')}>+ Add Dealer</button>
            </div>

            {dealerTab === 'requests' && (
              pendingDealers.length === 0 ? (
                <div style={{ color: 'var(--gray-4)', textAlign: 'center', padding: '40px' }}>No pending dealer requests ✓</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {pendingDealers.map(d => (
                    <div key={d.id} className="dealer-card">
                      <div className="dealer-card-header">
                        <div><div className="dealer-name">{d.name}</div>{d.businessName && <div className="dealer-biz">{d.businessName}</div>}</div>
                        <span className="status-dot orange">Pending</span>
                      </div>
                      <div className="dealer-meta">
                        <span>📱 {d.mobile}</span>
                        <span>✉ {d.email || '—'}</span>
                        <span>📍 {d.city}{d.pincode ? ` - ${d.pincode}` : ''}, {d.state}</span>
                        <span>📦 {d.numbersCount}</span>
                      </div>
                      {d.message && <div className="dealer-msg">"{d.message}"</div>}
                      <div className="dealer-actions">
                        <button className="tbl-btn tbl-success" style={{ padding: '8px 20px' }} onClick={() => handleApprove(d.id)}>✓ Approve</button>
                        <button className="tbl-btn tbl-danger" style={{ padding: '8px 20px' }} onClick={() => handleReject(d.id)}>✕ Reject</button>
                        <a href={`https://wa.me/91${d.mobile}?text=${encodeURIComponent(`Hi ${d.name}, your VIP Number Station dealer application is under review.`)}`}
                          target="_blank" rel="noreferrer" className="tbl-btn tbl-info" style={{ textDecoration: 'none', padding: '8px 20px' }}>
                          💬 WhatsApp
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            {dealerTab === 'active' && (
              <div style={{ overflowX: 'auto' }}>
                <table className="admin-table">
                  <thead><tr><th>Name</th><th>Mobile</th><th>Email</th><th>City</th><th>Pincode</th><th>State</th><th>Numbers</th><th>Status</th></tr></thead>
                  <tbody>
                    {dealers.map(d => (
                      <tr key={d.id}>
                        <td><strong>{d.name}</strong>{d.businessName && <span style={{ display:'block', fontSize:'11px', color:'var(--gray-4)' }}>{d.businessName}</span>}</td>
                        <td><a href={`https://wa.me/91${d.mobile}`} target="_blank" rel="noreferrer" style={{ color: 'var(--gold)' }}>{d.mobile}</a></td>
                        <td style={{ fontSize: '12px' }}>{d.email || '—'}</td>
                        <td>{d.city}</td><td>{d.pincode || '—'}</td><td>{d.state}</td><td>{d.numbersCount}</td>
                        <td><span className="status-dot green">Active</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {dealerTab === 'add' && (
              <div className="admin-form-card">
                <div style={{ fontFamily: 'var(--font-rajdhani)', color: 'var(--gold)', letterSpacing: '1px', marginBottom: '16px' }}>ADD DEALER MANUALLY</div>
                <div className="form-2col">
                  <div className="form-group"><label>Full Name *</label><input type="text" id="newDealerName" placeholder="Dealer name" /></div>
                  <div className="form-group"><label>Business Name</label><input type="text" id="newDealerBiz" placeholder="Optional" /></div>
                  <div className="form-group"><label>Mobile *</label><input type="tel" id="newDealerMobile" placeholder="10-digit" /></div>
                  <div className="form-group"><label>Email *</label><input type="email" id="newDealerEmail" placeholder="dealer@email.com" /></div>
                  <div className="form-group"><label>Password (for login)</label><input type="password" id="newDealerPass" placeholder="Set login password" /></div>
                  <div className="form-group"><label>City *</label><input type="text" id="newDealerCity" placeholder="City" /></div>
                  <div className="form-group"><label>Pincode</label><input type="text" id="newDealerPincode" placeholder="400001" /></div>
                  <div className="form-group"><label>State</label><select id="newDealerState">{STATES.map(s => <option key={s}>{s}</option>)}</select></div>
                </div>
                <button className="btn-submit" style={{ marginTop: '20px' }} onClick={handleAddDealer}>✓ Add & Activate Dealer</button>
              </div>
            )}
          </div>
        )}

        {/* ── TEAM ── */}
        {activeTab === 'team' && (
          <div>
            <div className="admin-page-title">Team Members</div>
            <div className="admin-form-card" style={{ marginBottom: '24px' }}>
              <div style={{ fontFamily: 'var(--font-rajdhani)', color: 'var(--gold)', letterSpacing: '1px', marginBottom: '16px' }}>ADD TEAM MEMBER</div>
              <div className="form-2col">
                <div className="form-group"><label>Name *</label><input type="text" id="tmName" placeholder="Full name" /></div>
                <div className="form-group"><label>Email *</label><input type="email" id="tmEmail" placeholder="team@email.com" /></div>
                <div className="form-group"><label>Password *</label><input type="password" id="tmPass" placeholder="Set password" /></div>
                <div className="form-group"><label>Role</label>
                  <select id="tmRole"><option value="team">Team (CRM access)</option><option value="dealer">Dealer</option></select>
                </div>
              </div>
              <button className="btn-submit" style={{ marginTop: '16px' }} onClick={handleAddTeamUser}>+ Add Member</button>
            </div>
            <table className="admin-table">
              <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th></tr></thead>
              <tbody>
                {teamUsers.map(u => (
                  <tr key={u.id}>
                    <td>{u.name}</td><td>{u.email}</td>
                    <td><span className={`rtp-mini ${u.role === 'team' ? 'rtp' : 'nrtp'}`}>{u.role}</span></td>
                    <td><span className={`status-dot ${u.active ? 'green' : 'red'}`}>{u.active ? 'Active' : 'Inactive'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </main>
    </div>
  );
}
