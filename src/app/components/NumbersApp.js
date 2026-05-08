'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { getNumbers, getCategories, createEnquiry } from '../actions';
import { CATEGORIES } from '../lib/categories';

const PER_PAGE = 18;
const WA_NUMBER = '919999976767';

export default function NumbersApp({ initialNumbers, initialCategories }) {
  const [numbers, setNumbers]       = useState(initialNumbers);
  const [categories, setCategories] = useState(initialCategories);
  const [activeFilters, setActiveFilters] = useState({
    sum: '', searchType: 'anywhere', digits: '', minPrice: '', maxPrice: '',
    operator: '', rtp: '', category: '', sort: 'default'
  });
  const [displayCount, setDisplayCount] = useState(PER_PAGE);
  const [drawerOpen, setDrawerOpen]     = useState(false);
  const [modalData, setModalData]       = useState(null);
  const [enquiryModal, setEnquiryModal] = useState(null);
  const [enquiryForm, setEnquiryForm]   = useState({ name: '', mobile: '', email: '' });
  const [enquiryLoading, setEnquiryLoading] = useState(false);
  const [enquiryDone, setEnquiryDone]   = useState(false);
  const [mobileSearch, setMobileSearch] = useState('');
  const loaderRef = useRef(null);

  useEffect(() => {
    async function fetch() {
      const filtered = await getNumbers(activeFilters);
      setNumbers(filtered);
      setDisplayCount(PER_PAGE);
    }
    fetch();
  }, [activeFilters]);

  // Infinite scroll
  useEffect(() => {
    if (!loaderRef.current) return;
    const obs = new IntersectionObserver(
      e => { if (e[0].isIntersecting) setDisplayCount(c => c + PER_PAGE); },
      { rootMargin: '300px' }
    );
    obs.observe(loaderRef.current);
    return () => obs.disconnect();
  }, []);

  const set = useCallback((k, v) => setActiveFilters(p => ({ ...p, [k]: v })), []);

  const clearAll = () => {
    setMobileSearch('');
    setActiveFilters({ sum: '', searchType: 'anywhere', digits: '', minPrice: '', maxPrice: '', operator: '', rtp: '', category: '', sort: 'default' });
    setDrawerOpen(false);
  };

  const fmtNum = (display, highlight) => {
    if (!highlight) return display;
    let r = display;
    highlight.split(',').map(h => h.trim()).filter(Boolean).forEach(h => {
      const rx = new RegExp(h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      r = r.replace(rx, `<span class="hl">${h}</span>`);
    });
    return r;
  };

  const visibleNums = numbers.slice(0, displayCount);
  const hasMore     = displayCount < numbers.length;

  const openEnquiry = (n, type) => {
    setEnquiryModal({ number: n, type });
    setEnquiryDone(false);
    setEnquiryForm({ name: '', mobile: '', email: '' });
    setModalData(null);
  };

  const submitEnquiry = async () => {
    if (!enquiryForm.mobile || enquiryForm.mobile.length < 10) {
      alert('Please enter a valid 10-digit mobile number'); return;
    }
    setEnquiryLoading(true);
    try {
      await createEnquiry({
        name: enquiryForm.name, mobile: enquiryForm.mobile, email: enquiryForm.email,
        numberId: enquiryModal.number.id, numberRaw: enquiryModal.number.rawNumber,
        numberPrice: enquiryModal.number.price, enquiryType: enquiryModal.type,
        numberInterest: enquiryModal.number.displayFormat,
      });
      const msg = encodeURIComponent(
        `Hi! Interested in VIP Number: ${enquiryModal.number.rawNumber}\n` +
        `Price: ₹${enquiryModal.number.price.toLocaleString()}\n` +
        `Type: ${enquiryModal.type}\n` +
        `Name: ${enquiryForm.name || 'N/A'} | Mobile: ${enquiryForm.mobile}`
      );
      window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, '_blank');
      setEnquiryDone(true);
    } catch { alert('Something went wrong. Please try again.'); }
    setEnquiryLoading(false);
  };

  const activeFilterCount = [activeFilters.digits, activeFilters.sum, activeFilters.minPrice, activeFilters.maxPrice, activeFilters.operator, activeFilters.rtp].filter(Boolean).length;

  // ── Sidebar filter panel (shared between desktop sidebar & mobile drawer)
  const FilterPanel = ({ inDrawer = false }) => (
    <div className={inDrawer ? 'drawer-body' : 'sidebar-inner'}>

      {/* Category */}
      <div className="fp-section">
        <div className="fp-title">Category</div>
        <div
          className={`fp-cat-item ${!activeFilters.category ? 'active' : ''}`}
          onClick={() => { set('category', ''); if (inDrawer) setDrawerOpen(false); }}
        >
          <span>All Numbers</span>
          <span className="fp-count">{numbers.length}</span>
        </div>
        <div
          className={`fp-cat-item ${activeFilters.category === 'RTP' ? 'active' : ''}`}
          onClick={() => { set('category', 'RTP'); if (inDrawer) setDrawerOpen(false); }}
        >
          <span>⚡ Instant (RTP)</span>
          <span className="fp-count">{numbers.filter(n => n.type === 'RTP').length}</span>
        </div>
        {categories.map(c => (
          <div key={c.name}
            className={`fp-cat-item ${activeFilters.category === c.name ? 'active' : ''}`}
            onClick={() => { set('category', c.name); if (inDrawer) setDrawerOpen(false); }}
          >
            <span style={{ fontSize: '11px' }}>{c.name}</span>
            <span className="fp-count">{c.count}</span>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="fp-section">
        <div className="fp-title">Search Digits</div>
        <div className="fp-row">
          <select className="fp-select" value={activeFilters.searchType} onChange={e => set('searchType', e.target.value)}>
            <option value="anywhere">Anywhere</option>
            <option value="startWith">Starts With</option>
            <option value="endWith">Ends With</option>
            <option value="contains">Must Contain</option>
            <option value="notContain">Not Contain</option>
          </select>
        </div>
        <div className="fp-row" style={{ display: 'flex', gap: '6px' }}>
          <input className="fp-input" type="text" placeholder="e.g. 9999, 786" maxLength={10}
            value={activeFilters.digits}
            onChange={e => set('digits', e.target.value)}
            onKeyDown={e => e.key === 'Enter' && inDrawer && setDrawerOpen(false)}
          />
        </div>
      </div>

      {/* Sum */}
      <div className="fp-section">
        <div className="fp-title">Sum Total</div>
        <input className="fp-input" type="number" placeholder="1–9 or e.g. 35" min="1" max="99"
          value={activeFilters.sum}
          onChange={e => set('sum', e.target.value)} />
        <div style={{ fontSize: '10px', color: 'var(--gray-4)', marginTop: '5px', lineHeight: 1.4 }}>
          Enter 1-9 for destiny number, or full sum like 35
        </div>
      </div>

      {/* Price */}
      <div className="fp-section">
        <div className="fp-title">Price Range (₹)</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
          <input className="fp-input" type="number" placeholder="Min" value={activeFilters.minPrice} onChange={e => set('minPrice', e.target.value)} />
          <input className="fp-input" type="number" placeholder="Max" value={activeFilters.maxPrice} onChange={e => set('maxPrice', e.target.value)} />
        </div>
      </div>

      {/* Operator */}
      <div className="fp-section">
        <div className="fp-title">Operator</div>
        <select className="fp-select" value={activeFilters.operator} onChange={e => set('operator', e.target.value)}>
          <option value="">All Operators</option>
          <option>Jio</option><option>Airtel</option><option>Vi</option><option>BSNL</option>
        </select>
      </div>

      {/* Type */}
      <div className="fp-section">
        <div className="fp-title">Number Type</div>
        <select className="fp-select" value={activeFilters.rtp} onChange={e => set('rtp', e.target.value)}>
          <option value="">All Types</option>
          <option value="RTP">⚡ Instant (RTP)</option>
          <option value="Non-RTP">📅 Pre-Book (Non-RTP)</option>
        </select>
      </div>

      <button className="fp-clear" onClick={clearAll}>✕ Clear All Filters</button>
    </div>
  );

  return (
    <>
      {/* ── Mobile: search bar + filter trigger ─── */}
      <div className="mobile-topbar">
        <div className="mtb-search">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            type="text" placeholder="Search digits, e.g. 9999 or 786"
            value={mobileSearch}
            onChange={e => { setMobileSearch(e.target.value); set('digits', e.target.value); }}
          />
          {mobileSearch && <button className="mtb-x" onClick={() => { setMobileSearch(''); set('digits', ''); }}>✕</button>}
        </div>
        <button className="mtb-filter" onClick={() => setDrawerOpen(true)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>
          {activeFilterCount > 0 && <span className="mtb-badge">{activeFilterCount}</span>}
        </button>
      </div>

      {/* ── Main layout: sidebar + grid ─── */}
      <div className="nums-layout">

        {/* Desktop Sidebar */}
        <aside className="nums-sidebar">
          <FilterPanel inDrawer={false} />
        </aside>

        {/* Numbers section */}
        <div className="nums-main">

          {/* Toolbar */}
          <div className="nums-toolbar">
            <div className="nums-count"><strong>{numbers.length}</strong> numbers found</div>
            <div className="nums-sort">
              <span>Sort:</span>
              {[['default','Default'],['low','₹ Low'],['high','₹ High']].map(([v,l]) => (
                <button key={v} className={`sort-pill ${activeFilters.sort === v ? 'active' : ''}`} onClick={() => set('sort', v)}>{l}</button>
              ))}
            </div>
          </div>

          {/* Category pills (horizontal scroll) */}
          <div className="cat-pill-row">
            <button className={`cat-pill ${!activeFilters.category ? 'active' : ''}`} onClick={() => set('category', '')}>All</button>
            <button className={`cat-pill ${activeFilters.category === 'RTP' ? 'active' : ''}`} onClick={() => set('category', 'RTP')}>⚡ Instant</button>
            {CATEGORIES.map(c => (
              <button key={c} className={`cat-pill ${activeFilters.category === c ? 'active' : ''}`} onClick={() => set('category', c)}>{c}</button>
            ))}
          </div>

          {/* Grid */}
          {visibleNums.length === 0 ? (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <h3>No numbers found</h3>
              <p>Try different search terms or clear your filters</p>
              <button className="btn-gold" style={{ marginTop: '16px' }} onClick={clearAll}>Clear Filters</button>
            </div>
          ) : (
            <div className="num-grid">
              {visibleNums.map(n => {
                const isRTP    = n.type === 'RTP';
                const isLocked = n.status === 'Locked';
                return (
                  <div key={n.id} className={`ncard ${isLocked ? 'ncard-locked' : ''}`} onClick={() => setModalData(n)}>

                    {/* RTP indicator strip */}
                    <div className={`ncard-strip ${isRTP ? 'strip-rtp' : 'strip-nrtp'}`}>
                      <span className={`strip-dot ${isRTP ? 'dot-green' : 'dot-orange'}`}/>
                      {isRTP ? '⚡ Instant Port' : `📅 Pre-Book · ${n.rtpDate || 'Coming Soon'}`}
                    </div>

                    {/* Number — BIG */}
                    <div className="ncard-number"
                      dangerouslySetInnerHTML={{ __html: fmtNum(n.displayFormat, n.highlight) }} />

                    {/* Sum */}
                    <div className="ncard-sum">Sum = {n.sumBreakdown}</div>

                    {/* Price — SMALL, secondary */}
                    <div className="ncard-price-row">
                      <span className="ncard-mrp">₹{n.mrp.toLocaleString()}</span>
                      <span className="ncard-price">₹{n.price.toLocaleString()}</span>
                      <span className="ncard-off">{n.discount}% OFF</span>
                    </div>

                    {/* Buttons */}
                    <div className="ncard-btns" onClick={e => e.stopPropagation()}>
                      <button className="ncard-btn ncard-details" onClick={() => setModalData(n)}>Details</button>
                      {isLocked ? (
                        <button className="ncard-btn ncard-enquired" disabled>🔒 Enquired</button>
                      ) : isRTP ? (
                        <button className="ncard-btn ncard-buy" onClick={() => openEnquiry(n, 'Buy Now')}>Buy Now</button>
                      ) : (
                        <button className="ncard-btn ncard-prebook" onClick={() => openEnquiry(n, 'Pre Book')}>Pre Book</button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Infinite scroll trigger */}
          <div ref={loaderRef} style={{ height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {hasMore && <div className="bounce-loader"><span/><span/><span/></div>}
          </div>
        </div>
      </div>

      {/* ── Mobile Filter Drawer ─── */}
      {drawerOpen && (
        <div className="drawer-overlay" onClick={() => setDrawerOpen(false)}>
          <div className="drawer-panel" onClick={e => e.stopPropagation()}>
            <div className="drawer-hdr">
              <span>Filters {activeFilterCount > 0 ? `(${activeFilterCount} active)` : ''}</span>
              <button onClick={() => setDrawerOpen(false)}>✕</button>
            </div>
            <FilterPanel inDrawer={true} />
            <div className="drawer-footer">
              <button className="drawer-done btn-gold" onClick={() => setDrawerOpen(false)}>Apply & Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Detail Modal ─── */}
      {modalData && (
        <div className="modal-overlay" onClick={e => { if (e.target.classList.contains('modal-overlay')) setModalData(null); }}>
          <div className="modal-new">
            <button className="modal-close-new" onClick={() => setModalData(null)}>✕</button>
            <div className="modal-label">VIP NUMBER</div>
            <div className="modal-num" dangerouslySetInnerHTML={{ __html: fmtNum(modalData.displayFormat, modalData.highlight) }} />
            <div className="modal-sum">Sum Total: {modalData.sumBreakdown} → <strong>{modalData.sum}</strong></div>
            <div className="modal-price-block">
              <span className="modal-mrp">₹{modalData.mrp.toLocaleString()}</span>
              <span className="modal-price">₹{modalData.price.toLocaleString()}</span>
              <span className="modal-off">{modalData.discount}% OFF</span>
            </div>
            <div className="modal-tags">
              <span className="modal-tag">{modalData.operator}</span>
              <span className={`modal-tag ${modalData.type === 'RTP' ? 'rtp' : 'nonrtp'}`}>
                {modalData.type === 'RTP' ? '⚡ Instant Port' : `📅 Ready by ${modalData.rtpDate}`}
              </span>
              <span className="modal-tag">{modalData.category}</span>
            </div>
            <div className="modal-actions-new">
              {modalData.status === 'Locked' ? (
                <button className="ncard-btn ncard-enquired" style={{ width: '100%', padding: '14px' }} disabled>🔒 Currently Enquired</button>
              ) : modalData.type === 'RTP' ? (
                <>
                  <button className="ncard-btn ncard-buy" style={{ flex: 1, padding: '14px', fontSize: '14px' }} onClick={() => openEnquiry(modalData, 'Buy Now')}>🛒 Buy Now</button>
                  <a href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Hi! Interested in ${modalData.rawNumber} (₹${modalData.price.toLocaleString()})`)}`} target="_blank" rel="noreferrer" className="ncard-btn ncard-wa" style={{ flex: 1, padding: '14px', fontSize: '14px', textAlign: 'center', textDecoration: 'none' }}>💬 WhatsApp</a>
                </>
              ) : (
                <>
                  <button className="ncard-btn ncard-prebook" style={{ flex: 1, padding: '14px', fontSize: '14px' }} onClick={() => openEnquiry(modalData, 'Pre Book')}>📅 Pre Book</button>
                  <a href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Hi! Interested in ${modalData.rawNumber} (₹${modalData.price.toLocaleString()})`)}`} target="_blank" rel="noreferrer" className="ncard-btn ncard-wa" style={{ flex: 1, padding: '14px', fontSize: '14px', textAlign: 'center', textDecoration: 'none' }}>💬 WhatsApp</a>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Enquiry Modal ─── */}
      {enquiryModal && (
        <div className="modal-overlay" onClick={e => { if (e.target.classList.contains('modal-overlay')) setEnquiryModal(null); }}>
          <div className="modal-new" style={{ maxWidth: '440px' }}>
            <button className="modal-close-new" onClick={() => setEnquiryModal(null)}>✕</button>
            {enquiryDone ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
                <div style={{ fontFamily: 'var(--font-rajdhani)', color: 'var(--gold)', fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>Enquiry Submitted!</div>
                <div style={{ color: 'var(--gray-4)', fontSize: '13px', lineHeight: 1.7 }}>
                  <strong style={{ color: 'var(--white)' }}>{enquiryModal.number.rawNumber}</strong> is reserved for <strong style={{ color: 'var(--gold)' }}>12 hours</strong>.<br/>Our team will reach you on WhatsApp shortly.
                </div>
                <button className="btn-gold" style={{ marginTop: '20px', width: '100%' }} onClick={() => setEnquiryModal(null)}>Done</button>
              </div>
            ) : (
              <>
                <div className="modal-label">{enquiryModal.type === 'Buy Now' ? '🛒 Buy Now' : '📅 Pre Book'}</div>
                <div style={{ fontFamily: 'var(--font-rajdhani)', fontSize: '26px', color: 'var(--gold)', textAlign: 'center', letterSpacing: '2px', margin: '6px 0 2px', fontWeight: 700 }}>{enquiryModal.number.displayFormat}</div>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <span style={{ color: 'var(--gold)', fontWeight: 800, fontSize: '20px', fontFamily: 'var(--font-inter)' }}>₹{enquiryModal.number.price.toLocaleString()}</span>
                  {enquiryModal.type === 'Buy Now' && <div style={{ fontSize: '11px', color: 'var(--gray-4)', marginTop: '4px' }}>Refundable booking: ₹99 (collected via WhatsApp)</div>}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div><label className="form-label-sm">Your Name</label><input className="modal-input" type="text" placeholder="Full name" value={enquiryForm.name} onChange={e => setEnquiryForm(p => ({ ...p, name: e.target.value }))} /></div>
                  <div><label className="form-label-sm">Mobile Number *</label><input className="modal-input" type="tel" placeholder="10-digit mobile" maxLength={10} value={enquiryForm.mobile} onChange={e => setEnquiryForm(p => ({ ...p, mobile: e.target.value }))} /></div>
                  <div><label className="form-label-sm">Email (optional)</label><input className="modal-input" type="email" placeholder="your@email.com" value={enquiryForm.email} onChange={e => setEnquiryForm(p => ({ ...p, email: e.target.value }))} /></div>
                </div>
                <button
                  className={enquiryModal.type === 'Buy Now' ? 'ncard-btn ncard-buy' : 'ncard-btn ncard-prebook'}
                  style={{ width: '100%', padding: '14px', fontSize: '15px', marginTop: '20px', borderRadius: 'var(--radius)' }}
                  onClick={submitEnquiry} disabled={enquiryLoading}
                >
                  {enquiryLoading ? 'Submitting...' : enquiryModal.type === 'Buy Now' ? '🛒 Confirm & WhatsApp' : '📅 Pre-Book & Notify'}
                </button>
                <div style={{ textAlign: 'center', color: 'var(--gray-4)', fontSize: '11px', marginTop: '10px' }}>🔒 Number held 12 hours after enquiry. No payment here.</div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
