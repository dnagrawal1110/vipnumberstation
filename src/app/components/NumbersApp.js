'use client';

import { useState, useEffect } from 'react';
import { getNumbers, getCategories } from '../actions';
import { CATEGORIES } from '../lib/categories';

export default function NumbersApp({ initialNumbers, initialCategories }) {
  const [numbers, setNumbers] = useState(initialNumbers);
  const [categories, setCategories] = useState(initialCategories);
  const [activeFilters, setActiveFilters] = useState({
    sum: '', searchType: 'anywhere', digits: '', minPrice: '', maxPrice: '', operator: '', rtp: '', category: '', sort: 'default'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [modalData, setModalData] = useState(null);
  
  const PER_PAGE = 12;

  useEffect(() => {
    async function fetchFiltered() {
      const filtered = await getNumbers(activeFilters);
      setNumbers(filtered);
      setCurrentPage(1);
    }
    fetchFiltered();
  }, [activeFilters]);

  const handleFilterChange = (key, value) => {
    setActiveFilters(prev => ({ ...prev, [key]: value }));
  };

  const applySearch = () => {
    const searchType = document.getElementById('searchType').value;
    const digits = document.getElementById('searchDigits').value.trim();
    setActiveFilters(prev => ({ ...prev, searchType, digits }));
  };

  const applySumFilter = () => {
    const sum = document.getElementById('sumInput').value;
    setActiveFilters(prev => ({ ...prev, sum }));
  };

  const applyOtherFilters = () => {
    setActiveFilters(prev => ({
      ...prev,
      minPrice: document.getElementById('minPrice').value,
      maxPrice: document.getElementById('maxPrice').value,
      operator: document.getElementById('operatorFilter').value,
      rtp: document.getElementById('rtpFilter').value,
    }));
  };

  const clearFilters = () => {
    setActiveFilters({
      sum: '', searchType: 'anywhere', digits: '', minPrice: '', maxPrice: '', operator: '', rtp: '', category: '', sort: 'default'
    });
    document.getElementById('sumInput').value = '';
    document.getElementById('searchDigits').value = '';
    document.getElementById('minPrice').value = '';
    document.getElementById('maxPrice').value = '';
    document.getElementById('operatorFilter').value = '';
    document.getElementById('rtpFilter').value = '';
    document.getElementById('searchType').value = 'anywhere';
  };

  const total = numbers.length;
  const pages = Math.ceil(total / PER_PAGE);
  const currentNumbers = numbers.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const formatDisplayNumber = (display, highlight) => {
    if (!highlight) return display;
    const parts = highlight.split(',').map(h => h.trim()).filter(Boolean);
    let result = display;
    parts.forEach(h => {
      const regex = new RegExp(h.replace(/[.*+?^\\$\\{\\}()|[\\]\\\\]/g, '\\\\$&'), 'g');
      result = result.replace(regex, `<span class="highlight">${h}</span>`);
    });
    return result;
  };

  const openModal = (n) => setModalData(n);
  const closeModal = () => setModalData(null);

  return (
    <>
      <div style={{ maxWidth: '1280px', margin: '20px auto', padding: '0 24px' }}>
        <div className="cat-tabs">
          <div className={`cat-tab ${!activeFilters.category ? 'active' : ''}`} onClick={() => handleFilterChange('category', '')}>All Numbers</div>
          <div className={`cat-tab ${activeFilters.category === 'RTP' ? 'active' : ''}`} onClick={() => handleFilterChange('category', 'RTP')}>⚡ RTP (Instant)</div>
          {CATEGORIES.map(cat => (
            <div key={cat} className={`cat-tab ${activeFilters.category === cat ? 'active' : ''}`} onClick={() => handleFilterChange('category', cat)}>{cat}</div>
          ))}
        </div>
      </div>

      <div className="main-container">
        <aside className="sidebar">
          {/* SUM TOTAL */}
          <div className="sidebar-section">
            <div className="sidebar-title">Sum Total</div>
            <div className="search-bar">
              <input type="number" id="sumInput" placeholder="Enter 1–9 or 35-8-8" min="1" max="9" />
              <button className="btn-gold" onClick={applySumFilter}>Go</button>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--gray-4)', lineHeight: 1.5 }}>
              Enter a single digit (1-9) for destiny number, or full sum like 35-8-8
            </div>
          </div>

          {/* SEARCH */}
          <div className="sidebar-section">
            <div className="sidebar-title">Search Number</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div className="filter-row">
                <label>Search Type</label>
                <select id="searchType" defaultValue="anywhere">
                  <option value="anywhere">Anywhere</option>
                  <option value="startWith">Start With</option>
                  <option value="endWith">End With</option>
                  <option value="contains">Must Contain</option>
                  <option value="notContain">Not Contain</option>
                </select>
              </div>
              <div className="filter-row">
                <label>Digits</label>
                <input type="text" id="searchDigits" placeholder="e.g. 9999 or 786" maxLength="10" />
              </div>
              <button className="btn-gold" onClick={applySearch} style={{ width: '100%' }}>Search</button>
              <button className="btn-sm btn-sm-outline" onClick={clearFilters} style={{ width: '100%', marginTop: '2px' }}>Clear Filters</button>
            </div>
          </div>

          {/* PRICE RANGE */}
          <div className="sidebar-section">
            <div className="sidebar-title">Price Range</div>
            <div className="price-row">
              <div className="filter-row">
                <label>Min (₹)</label>
                <input type="number" id="minPrice" placeholder="0" />
              </div>
              <div className="filter-row">
                <label>Max (₹)</label>
                <input type="number" id="maxPrice" placeholder="50000" />
              </div>
            </div>
            <div className="filter-row" style={{ marginTop: '8px' }}>
              <label>Operator</label>
              <select id="operatorFilter">
                <option value="">All Operators</option>
                <option value="Jio">Jio</option>
                <option value="Airtel">Airtel</option>
                <option value="Vi">Vi</option>
                <option value="BSNL">BSNL</option>
              </select>
            </div>
            <div className="filter-row" style={{ marginTop: '8px' }}>
              <label>Type</label>
              <select id="rtpFilter">
                <option value="">RTP + Non-RTP</option>
                <option value="RTP">RTP Only (Instant)</option>
                <option value="Non-RTP">Non-RTP Only</option>
              </select>
            </div>
            <button className="btn-gold" onClick={applyOtherFilters} style={{ width: '100%', marginTop: '12px' }}>Apply Filter</button>
          </div>

          {/* CATEGORIES */}
          <div className="sidebar-section">
            <div className="sidebar-title">Category</div>
            <div>
              {categories.map((c, i) => (
                <div key={i} className={`category-item ${activeFilters.category === c.name ? 'active' : ''}`} onClick={() => handleFilterChange('category', c.name)}>
                  <input type="checkbox" checked={activeFilters.category === c.name} readOnly />
                  <span style={{ flex: 1, fontSize: '11px' }}>{c.name}</span>
                  <span className="cat-count">{c.count}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <main className="numbers-section">
          <div className="numbers-toolbar">
            <div className="toolbar-left">
              <div className="result-count">Showing <strong>{total}</strong> numbers</div>
            </div>
            <div className="toolbar-right">
              <span style={{ fontSize: '12px', color: 'var(--gray-4)', fontFamily: 'var(--font-rajdhani)' }}>Sort:</span>
              <button className={`sort-btn ${activeFilters.sort === 'default' ? 'active' : ''}`} onClick={() => handleFilterChange('sort', 'default')}>Default</button>
              <button className={`sort-btn ${activeFilters.sort === 'low' ? 'active' : ''}`} onClick={() => handleFilterChange('sort', 'low')}>₹ Low–High</button>
              <button className={`sort-btn ${activeFilters.sort === 'high' ? 'active' : ''}`} onClick={() => handleFilterChange('sort', 'high')}>₹ High–Low</button>
            </div>
          </div>

          <div className="numbers-grid">
            {currentNumbers.length === 0 ? (
              <div className="no-results" style={{ gridColumn: '1/-1' }}>
                <div className="no-results-icon">🔍</div>
                <h3>No numbers found</h3>
                <p>Try adjusting your filters or search terms</p>
                <button className="btn-gold" onClick={clearFilters} style={{ marginTop: '16px' }}>Clear Filters</button>
              </div>
            ) : (
              currentNumbers.map(n => {
                const opClass = { 'Jio': 'op-jio', 'Airtel': 'op-airtel', 'Vi': 'op-vi', 'BSNL': 'op-bsnl' }[n.operator] || 'op-jio';
                const rtpColor = n.type === 'RTP' ? 'green' : 'orange';
                const rtpText = n.type === 'RTP' ? '⚡ RTP — Instant Port Available' : `⏳ Non-RTP — Port Ready by ${n.rtpDate}`;
                
                return (
                  <div key={n.id} className="number-card" onClick={() => openModal(n)}>
                    <div className="card-top">
                      <div className="price-box">
                        {n.mrp !== n.price && <span className="price-old">₹{n.mrp.toLocaleString()}</span>}
                        <span className="price-new">₹{n.price.toLocaleString()}</span>
                        {n.discount > 0 && <span className="discount-badge badge-red">{n.discount}% OFF</span>}
                      </div>
                      <button className="wishlist-btn" onClick={(e) => { e.stopPropagation(); e.target.classList.toggle('active'); e.target.textContent = e.target.classList.contains('active') ? '♥' : '♡'; }}>♡</button>
                    </div>
                    <div className={`rtp-tag ${n.type === 'RTP' ? 'rtp' : 'non-rtp'}`}>
                      <span className={`rtp-dot ${rtpColor}`}></span>
                      {rtpText}
                    </div>
                    <div className="number-display">
                      <div className="number-formatted" dangerouslySetInnerHTML={{ __html: formatDisplayNumber(n.displayFormat, n.highlight) }}></div>
                      <div className="sum-total">Sum Total = <span>{n.sumBreakdown}</span></div>
                      <div className="card-category">{n.category}</div>
                      <span className={`operator-tag ${opClass}`}>{n.operator}</span>
                    </div>
                    <div className="card-actions">
                      <div className="card-btn card-btn-details">Details</div>
                      <a href={`https://wa.me/919999976767?text=${encodeURIComponent(`Hi! I'm interested in VIP Number: ${n.rawNumber} priced at ₹${n.price.toLocaleString()} from vipnumberstation.com`)}`} target="_blank" rel="noreferrer" className="card-btn card-btn-buy" onClick={e => e.stopPropagation()}>Enquire</a>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {pages > 1 && (
            <div className="pagination">
              {currentPage > 1 && <button className="page-btn" onClick={() => setCurrentPage(p => p - 1)}>‹</button>}
              {Array.from({ length: pages }, (_, i) => i + 1).map(i => {
                if (i === 1 || i === pages || Math.abs(i - currentPage) <= 2) {
                  return <button key={i} className={`page-btn ${i === currentPage ? 'active' : ''}`} onClick={() => setCurrentPage(i)}>{i}</button>;
                } else if (Math.abs(i - currentPage) === 3) {
                  return <span key={i} style={{ color: 'var(--gray-4)', padding: '0 4px' }}>…</span>;
                }
                return null;
              })}
              {currentPage < pages && <button className="page-btn" onClick={() => setCurrentPage(p => p + 1)}>›</button>}
            </div>
          )}
        </main>
      </div>

      {modalData && (
        <div className="modal-overlay" onClick={(e) => { if (e.target.className.includes('modal-overlay')) closeModal(); }}>
          <div className="modal">
            <button className="modal-close" onClick={closeModal}>✕</button>
            <div style={{ fontFamily: 'var(--font-rajdhani)', fontSize: '11px', letterSpacing: '2px', color: 'var(--gold)', textAlign: 'center' }}>VIP NUMBER DETAILS</div>
            <div className="modal-number" dangerouslySetInnerHTML={{ __html: formatDisplayNumber(modalData.displayFormat, modalData.highlight) }}></div>
            <div style={{ textAlign: 'center', marginBottom: '8px' }}>
              <span style={{ background: modalData.type === 'RTP' ? 'rgba(76,175,80,0.15)' : 'rgba(255,152,0,0.15)', color: modalData.type === 'RTP' ? '#4CAF50' : '#FF9800', padding: '4px 12px', borderRadius: '100px', fontSize: '12px', fontFamily: 'var(--font-rajdhani)', letterSpacing: '0.5px' }}>
                {modalData.type === 'RTP' ? '⚡ RTP — Instant Port Available' : `⏳ Non-RTP — by ${modalData.rtpDate}`}
              </span>
            </div>
            <div className="modal-price">
              <span style={{ color: 'var(--gray-4)', textDecoration: 'line-through', fontSize: '15px' }}>₹{modalData.mrp.toLocaleString()}</span>&nbsp; 
              <strong style={{ color: 'var(--gold)' }}>₹{modalData.price.toLocaleString()}</strong>
            </div>
            <div className="modal-details">
              <div className="modal-detail-item"><div className="modal-detail-label">Raw Number</div><div className="modal-detail-val">{modalData.rawNumber}</div></div>
              <div className="modal-detail-item"><div className="modal-detail-label">Sum Total</div><div className="modal-detail-val" style={{ color: 'var(--gold)' }}>{modalData.sumBreakdown} → {modalData.sum}</div></div>
              <div className="modal-detail-item"><div className="modal-detail-label">Operator</div><div className="modal-detail-val">{modalData.operator}</div></div>
              <div className="modal-detail-item"><div className="modal-detail-label">Category</div><div className="modal-detail-val" style={{ fontSize: '12px' }}>{modalData.category}</div></div>
              <div className="modal-detail-item"><div className="modal-detail-label">Discount</div><div className="modal-detail-val" style={{ color: '#FF6B6B' }}>{modalData.discount}% OFF</div></div>
              <div className="modal-detail-item"><div className="modal-detail-label">Type</div><div className="modal-detail-val">{modalData.type}</div></div>
            </div>
            <div className="modal-actions" style={{ marginTop: '16px' }}>
              <a href={`https://wa.me/919999976767?text=${encodeURIComponent(`Hi! I'm interested in VIP Number: ${modalData.rawNumber} priced at ₹${modalData.price.toLocaleString()} from vipnumberstation.com`)}`} target="_blank" rel="noreferrer" className="card-btn card-btn-buy" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', borderRadius: 'var(--radius)', fontFamily: 'var(--font-rajdhani)', fontSize: '13px', fontWeight: '700' }}>
                💬 Enquire on WhatsApp
              </a>
              <button className="card-btn card-btn-details" onClick={closeModal} style={{ borderRadius: 'var(--radius)' }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
