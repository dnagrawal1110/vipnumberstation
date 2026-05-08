'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { getNumbers, getCategories, createEnquiry } from '../actions';
import { CATEGORIES } from '../lib/categories';

const PER_PAGE = 12;
const WA_NUMBER = '919999976767';

export default function NumbersApp({ initialNumbers, initialCategories }) {
  const [numbers, setNumbers]         = useState(initialNumbers);
  const [categories, setCategories]   = useState(initialCategories);
  const [activeFilters, setActiveFilters] = useState({
    sum: '', searchType: 'anywhere', digits: '', minPrice: '', maxPrice: '',
    operator: '', rtp: '', category: '', sort: 'default'
  });
  const [displayCount, setDisplayCount] = useState(PER_PAGE);
  const [filterOpen, setFilterOpen]     = useState(false);
  const [modalData, setModalData]       = useState(null);
  const [enquiryModal, setEnquiryModal] = useState(null);
  const [enquiryForm, setEnquiryForm]   = useState({ name: '', mobile: '', email: '' });
  const [enquiryLoading, setEnquiryLoading] = useState(false);
  const [enquiryDone, setEnquiryDone]   = useState(false);
  const [searchInput, setSearchInput]   = useState('');
  const loaderRef = useRef(null);

  // Fetch on filter change
  useEffect(() => {
    async function fetchFiltered() {
      const filtered = await getNumbers(activeFilters);
      setNumbers(filtered);
      setDisplayCount(PER_PAGE);
    }
    fetchFiltered();
  }, [activeFilters]);

  // Infinite scroll observer
  useEffect(() => {
    if (!loaderRef.current) return;
    const observer = new IntersectionObserver(
      entries => { if (entries[0].isIntersecting) setDisplayCount(c => c + PER_PAGE); },
      { rootMargin: '200px' }
    );
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, []);

  const handleFilterChange = useCallback((key, value) => {
    setActiveFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const applySearch = () => {
    setActiveFilters(prev => ({ ...prev, digits: searchInput }));
    setFilterOpen(false);
  };

  const clearFilters = () => {
    setSearchInput('');
    setActiveFilters({ sum: '', searchType: 'anywhere', digits: '', minPrice: '', maxPrice: '', operator: '', rtp: '', category: '', sort: 'default' });
    setFilterOpen(false);
  };

  const formatDisplayNumber = (display, highlight) => {
    if (!highlight) return display;
    let result = display;
    highlight.split(',').map(h => h.trim()).filter(Boolean).forEach(h => {
      const regex = new RegExp(h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      result = result.replace(regex, `<span class="highlight">${h}</span>`);
    });
    return result;
  };

  const visibleNumbers = numbers.slice(0, displayCount);
  const hasMore = displayCount < numbers.length;

  const openEnquiry = (n, type) => {
    setEnquiryModal({ number: n, type });
    setEnquiryDone(false);
    setEnquiryForm({ name: '', mobile: '', email: '' });
  };

  const submitEnquiry = async () => {
    if (!enquiryForm.mobile || enquiryForm.mobile.length < 10) {
      alert('Please enter a valid mobile number');
      return;
    }
    setEnquiryLoading(true);
    try {
      await createEnquiry({
        name: enquiryForm.name,
        mobile: enquiryForm.mobile,
        email: enquiryForm.email,
        numberId: enquiryModal.number.id,
        numberRaw: enquiryModal.number.rawNumber,
        numberPrice: enquiryModal.number.price,
        enquiryType: enquiryModal.type,
        numberInterest: enquiryModal.number.displayFormat,
      });
      // Send to WhatsApp
      const msg = encodeURIComponent(
        `Hi! I'm interested in VIP Number: ${enquiryModal.number.rawNumber}\n` +
        `Price: ₹${enquiryModal.number.price.toLocaleString()}\n` +
        `Type: ${enquiryModal.type}\n` +
        `My Name: ${enquiryForm.name || 'N/A'}\n` +
        `My Mobile: ${enquiryForm.mobile}`
      );
      window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, '_blank');
      setEnquiryDone(true);
    } catch (e) {
      alert('Something went wrong. Please try again.');
    }
    setEnquiryLoading(false);
  };

  const activeFilterCount = [
    activeFilters.digits, activeFilters.sum, activeFilters.minPrice,
    activeFilters.maxPrice, activeFilters.operator, activeFilters.rtp
  ].filter(Boolean).length;

  return (
    <>
      {/* ── Mobile Search Bar ─────────────────────────────── */}
      <div className="mobile-search-bar">
        <div className="msb-inner">
          <div className="msb-search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              type="text" placeholder="Search digits, e.g. 9999 or 786"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && applySearch()}
            />
            {searchInput && <button className="msb-clear" onClick={() => { setSearchInput(''); handleFilterChange('digits', ''); }}>✕</button>}
          </div>
          <button className="msb-filter-btn" onClick={() => setFilterOpen(true)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>
            {activeFilterCount > 0 && <span className="filter-badge">{activeFilterCount}</span>}
          </button>
        </div>
      </div>

      {/* ── Category Tabs ─────────────────────────────────── */}
      <div className="cat-scroll">
        <div className="cat-tabs-inner">
          <button className={`cat-pill ${!activeFilters.category ? 'active' : ''}`} onClick={() => handleFilterChange('category', '')}>All</button>
          <button className={`cat-pill ${activeFilters.category === 'RTP' ? 'active' : ''}`} onClick={() => handleFilterChange('category', 'RTP')}>⚡ Instant</button>
          {CATEGORIES.map(cat => (
            <button key={cat} className={`cat-pill ${activeFilters.category === cat ? 'active' : ''}`} onClick={() => handleFilterChange('category', cat)}>{cat}</button>
          ))}
        </div>
      </div>

      {/* ── Toolbar ───────────────────────────────────────── */}
      <div className="numbers-toolbar-mobile">
        <span className="result-count-m"><strong>{numbers.length}</strong> numbers</span>
        <div className="sort-row">
          <button className={`sort-pill ${activeFilters.sort === 'default' ? 'active' : ''}`} onClick={() => handleFilterChange('sort', 'default')}>Default</button>
          <button className={`sort-pill ${activeFilters.sort === 'low' ? 'active' : ''}`} onClick={() => handleFilterChange('sort', 'low')}>₹ Low</button>
          <button className={`sort-pill ${activeFilters.sort === 'high' ? 'active' : ''}`} onClick={() => handleFilterChange('sort', 'high')}>₹ High</button>
        </div>
      </div>

      {/* ── Number Grid ───────────────────────────────────── */}
      <div className="numbers-grid-wrap">
        {visibleNumbers.length === 0 ? (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <h3>No numbers found</h3>
            <p>Try different search terms or clear your filters</p>
            <button className="btn-gold" onClick={clearFilters} style={{ marginTop: '16px' }}>Clear Filters</button>
          </div>
        ) : (
          <div className="numbers-grid-new">
            {visibleNumbers.map(n => {
              const isRTP    = n.type === 'RTP';
              const isLocked = n.status === 'Locked';
              return (
                <div key={n.id} className={`num-card ${isLocked ? 'locked' : ''}`} onClick={() => setModalData(n)}>
                  {/* Type badge */}
                  <div className={`nc-type-badge ${isRTP ? 'rtp' : 'nonrtp'}`}>
                    {isRTP ? '⚡ Instant' : '📅 Pre-Book'}
                  </div>

                  {/* Number display */}
                  <div className="nc-number"
                    dangerouslySetInnerHTML={{ __html: formatDisplayNumber(n.displayFormat, n.highlight) }} />

                  {/* Sum */}
                  <div className="nc-sum">Sum = {n.sumBreakdown}</div>

                  {/* Price */}
                  <div className="nc-price-row">
                    <span className="nc-mrp">₹{n.mrp.toLocaleString()}</span>
                    <span className="nc-price">₹{n.price.toLocaleString()}</span>
                    <span className="nc-off">{n.discount}% OFF</span>
                  </div>

                  {/* Actions */}
                  <div className="nc-actions" onClick={e => e.stopPropagation()}>
                    <button className="nc-btn nc-details" onClick={() => setModalData(n)}>Details</button>
                    {isLocked ? (
                      <button className="nc-btn nc-locked" disabled>🔒 Enquired</button>
                    ) : (
                      <button
                        className={`nc-btn ${isRTP ? 'nc-buy' : 'nc-prebook'}`}
                        onClick={() => openEnquiry(n, isRTP ? 'Buy Now' : 'Pre Book')}
                      >
                        {isRTP ? 'Buy Now' : 'Pre Book'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Infinite scroll loader */}
        <div ref={loaderRef} style={{ height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {hasMore && <div className="scroll-loader"><span></span><span></span><span></span></div>}
        </div>
      </div>

      {/* ── Filter Drawer (mobile) ─────────────────────────── */}
      {filterOpen && (
        <div className="filter-overlay" onClick={() => setFilterOpen(false)}>
          <div className="filter-drawer" onClick={e => e.stopPropagation()}>
            <div className="drawer-header">
              <span>Filters</span>
              <button onClick={() => setFilterOpen(false)}>✕</button>
            </div>

            <div className="drawer-body">
              {/* Search type */}
              <div className="drawer-section">
                <label>Search Type</label>
                <div className="pill-group">
                  {['anywhere','startWith','endWith','contains','notContain'].map(t => (
                    <button key={t}
                      className={`option-pill ${activeFilters.searchType === t ? 'active' : ''}`}
                      onClick={() => handleFilterChange('searchType', t)}>
                      {t === 'anywhere' ? 'Anywhere' : t === 'startWith' ? 'Starts With' : t === 'endWith' ? 'Ends With' : t === 'contains' ? 'Contains' : 'Not Contain'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sum */}
              <div className="drawer-section">
                <label>Sum Total (Numerology)</label>
                <input type="number" placeholder="1–9 or e.g. 35" value={activeFilters.sum}
                  onChange={e => handleFilterChange('sum', e.target.value)} className="drawer-input" />
              </div>

              {/* Price range */}
              <div className="drawer-section">
                <label>Price Range (₹)</label>
                <div className="price-inputs">
                  <input type="number" placeholder="Min" value={activeFilters.minPrice}
                    onChange={e => handleFilterChange('minPrice', e.target.value)} className="drawer-input" />
                  <span>–</span>
                  <input type="number" placeholder="Max" value={activeFilters.maxPrice}
                    onChange={e => handleFilterChange('maxPrice', e.target.value)} className="drawer-input" />
                </div>
              </div>

              {/* Operator */}
              <div className="drawer-section">
                <label>Operator</label>
                <div className="pill-group">
                  {['', 'Jio', 'Airtel', 'Vi', 'BSNL'].map(op => (
                    <button key={op}
                      className={`option-pill ${activeFilters.operator === op ? 'active' : ''}`}
                      onClick={() => handleFilterChange('operator', op)}>
                      {op || 'All'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Type */}
              <div className="drawer-section">
                <label>Number Type</label>
                <div className="pill-group">
                  {[['', 'All Types'], ['RTP', '⚡ Instant'], ['Non-RTP', '📅 Pre-Book']].map(([val, label]) => (
                    <button key={val}
                      className={`option-pill ${activeFilters.rtp === val ? 'active' : ''}`}
                      onClick={() => handleFilterChange('rtp', val)}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="drawer-footer">
              <button className="drawer-clear" onClick={clearFilters}>Clear All</button>
              <button className="drawer-apply btn-gold" onClick={() => setFilterOpen(false)}>Apply Filters</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Number Detail Modal ───────────────────────────── */}
      {modalData && (
        <div className="modal-overlay" onClick={e => { if (e.target.className.includes?.('modal-overlay')) setModalData(null); }}>
          <div className="modal-new">
            <button className="modal-close-new" onClick={() => setModalData(null)}>✕</button>
            <div className="modal-label">VIP NUMBER</div>
            <div className="modal-num" dangerouslySetInnerHTML={{ __html: formatDisplayNumber(modalData.displayFormat, modalData.highlight) }} />
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
                <button className="nc-btn nc-locked" style={{ width: '100%', padding: '14px' }} disabled>🔒 Number Enquired by Someone</button>
              ) : (
                <>
                  <button className={`nc-btn ${modalData.type === 'RTP' ? 'nc-buy' : 'nc-prebook'}`}
                    style={{ flex: 1, padding: '14px', fontSize: '14px' }}
                    onClick={() => { setModalData(null); openEnquiry(modalData, modalData.type === 'RTP' ? 'Buy Now' : 'Pre Book'); }}>
                    {modalData.type === 'RTP' ? '🛒 Buy Now' : '📅 Pre Book'}
                  </button>
                  <a href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Hi! Interested in ${modalData.rawNumber} (₹${modalData.price.toLocaleString()})`)}`}
                    target="_blank" rel="noreferrer"
                    className="nc-btn nc-wa" style={{ flex: 1, padding: '14px', fontSize: '14px', textAlign: 'center', textDecoration: 'none' }}>
                    💬 WhatsApp
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Enquiry / Booking Modal ──────────────────────── */}
      {enquiryModal && (
        <div className="modal-overlay" onClick={e => { if (e.target.className.includes?.('modal-overlay')) setEnquiryModal(null); }}>
          <div className="modal-new" style={{ maxWidth: '440px' }}>
            <button className="modal-close-new" onClick={() => setEnquiryModal(null)}>✕</button>

            {enquiryDone ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
                <div style={{ fontFamily: 'var(--font-rajdhani)', color: 'var(--gold)', fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>Enquiry Submitted!</div>
                <div style={{ color: 'var(--gray-4)', fontSize: '13px', lineHeight: 1.6 }}>
                  Your number <strong style={{ color: 'var(--white)' }}>{enquiryModal.number.rawNumber}</strong> is reserved for <strong style={{ color: 'var(--gold)' }}>12 hours</strong>.<br/>
                  Our team will contact you on WhatsApp shortly.
                </div>
                <button className="btn-gold" style={{ marginTop: '20px', width: '100%' }} onClick={() => setEnquiryModal(null)}>Done</button>
              </div>
            ) : (
              <>
                <div className="modal-label">{enquiryModal.type === 'Buy Now' ? '🛒 Buy Now' : '📅 Pre Book'}</div>
                <div style={{ fontFamily: 'var(--font-rajdhani)', fontSize: '24px', color: 'var(--gold)', textAlign: 'center', letterSpacing: '2px', margin: '8px 0 4px' }}>
                  {enquiryModal.number.displayFormat}
                </div>
                <div style={{ textAlign: 'center', color: 'var(--gold)', fontWeight: 700, fontSize: '18px', marginBottom: '20px' }}>
                  ₹{enquiryModal.number.price.toLocaleString()}
                  {enquiryModal.type === 'Buy Now' && (
                    <div style={{ fontSize: '11px', color: 'var(--gray-4)', fontWeight: 400, marginTop: '4px', fontFamily: 'var(--font-rajdhani)' }}>
                      Refundable booking amount: ₹99 (collected via WhatsApp)
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label className="form-label-sm">Your Name</label>
                    <input className="modal-input" type="text" placeholder="Full name"
                      value={enquiryForm.name} onChange={e => setEnquiryForm(p => ({ ...p, name: e.target.value }))} />
                  </div>
                  <div>
                    <label className="form-label-sm">Mobile Number *</label>
                    <input className="modal-input" type="tel" placeholder="10-digit mobile" maxLength={10}
                      value={enquiryForm.mobile} onChange={e => setEnquiryForm(p => ({ ...p, mobile: e.target.value }))} />
                  </div>
                  <div>
                    <label className="form-label-sm">Email (optional)</label>
                    <input className="modal-input" type="email" placeholder="your@email.com"
                      value={enquiryForm.email} onChange={e => setEnquiryForm(p => ({ ...p, email: e.target.value }))} />
                  </div>
                </div>

                <button className={`nc-btn ${enquiryModal.type === 'Buy Now' ? 'nc-buy' : 'nc-prebook'}`}
                  style={{ width: '100%', padding: '14px', fontSize: '15px', marginTop: '20px' }}
                  onClick={submitEnquiry} disabled={enquiryLoading}>
                  {enquiryLoading ? 'Submitting...' : enquiryModal.type === 'Buy Now' ? '🛒 Confirm & Proceed to WhatsApp' : '📅 Pre-Book & Notify Me'}
                </button>
                <div style={{ textAlign: 'center', color: 'var(--gray-4)', fontSize: '11px', marginTop: '10px' }}>
                  🔒 Number held for 12 hours after enquiry. No payment collected here.
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
