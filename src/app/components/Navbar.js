'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => pathname === path ? 'active' : '';
  const close = () => setMenuOpen(false);

  return (
    <>
      <nav className="navbar">
        <div className="nav-inner">
          {/* Logo */}
          <Link href="/" className="logo" onClick={close}>
            <div className="logo-icon">💎</div>
            <div>
              <div className="logo-text">VIP Number<span>Station</span></div>
              <div className="logo-sub">vipnumberstation.com</div>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="nav-links">
            <Link href="/" className={isActive('/')}>VIP Numbers</Link>
            <Link href="/numerology" className={isActive('/numerology')}>Numerology</Link>
            <Link href="/about" className={isActive('/about')}>About</Link>
            <Link href="/login" className={isActive('/login')}>Login</Link>
            <a href="https://wa.me/919999976767?text=Hi, I'm interested in VIP numbers" target="_blank" rel="noreferrer" className="nav-cta">Enquire Now</a>
          </div>

          {/* Desktop WhatsApp button */}
          <a href="https://wa.me/919999976767?text=Hi, I want to know about VIP numbers" target="_blank" rel="noreferrer" className="whatsapp-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.553 4.115 1.524 5.843L.057 23.927l6.248-1.637A11.938 11.938 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.013-1.376l-.36-.213-3.714.974.99-3.614-.235-.372A9.818 9.818 0 012.182 12c0-5.424 4.394-9.818 9.818-9.818s9.818 4.394 9.818 9.818-4.394 9.818-9.818 9.818z"/>
            </svg>
            WhatsApp
          </a>

          {/* Hamburger — mobile only */}
          <button
            className={`hamburger ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
          >
            <span/><span/><span/>
          </button>
        </div>
      </nav>

      {/* Mobile slide-down menu overlay */}
      {menuOpen && (
        <div className="mobile-menu" onClick={close}>
          <div className="mobile-menu-inner" onClick={e => e.stopPropagation()}>
            <Link href="/" className={`mm-link ${isActive('/')}`} onClick={close}>🏠 VIP Numbers</Link>
            <Link href="/numerology" className={`mm-link ${isActive('/numerology')}`} onClick={close}>🔢 Numerology</Link>
            <Link href="/about" className={`mm-link ${isActive('/about')}`} onClick={close}>ℹ️ About</Link>
            <Link href="/dealer" className={`mm-link ${isActive('/dealer')}`} onClick={close}>🤝 Become a Dealer</Link>
            <Link href="/login" className={`mm-link ${isActive('/login')}`} onClick={close}>🔑 Login / Dashboard</Link>
            <a href="https://wa.me/919999976767?text=Hi, I'm interested in VIP numbers" target="_blank" rel="noreferrer" className="mm-wa" onClick={close}>
              💬 WhatsApp Enquiry
            </a>
          </div>
        </div>
      )}

      {/* Mobile bottom navigation bar */}
      <nav className="bottom-nav">
        <Link href="/" className={`bnav-item ${pathname === '/' ? 'active' : ''}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          <span>Home</span>
        </Link>
        <Link href="/numerology" className={`bnav-item ${pathname === '/numerology' ? 'active' : ''}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          <span>Numerology</span>
        </Link>
        {/* Centre WhatsApp bubble */}
        <a href="https://wa.me/919999976767?text=Hi, I'm interested in VIP numbers" target="_blank" rel="noreferrer" className="bnav-item bnav-center">
          <div className="bnav-center-btn">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.553 4.115 1.524 5.843L.057 23.927l6.248-1.637A11.938 11.938 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.013-1.376l-.36-.213-3.714.974.99-3.614-.235-.372A9.818 9.818 0 012.182 12c0-5.424 4.394-9.818 9.818-9.818s9.818 4.394 9.818 9.818-4.394 9.818-9.818 9.818z"/></svg>
          </div>
          <span>Enquire</span>
        </a>
        <Link href="/about" className={`bnav-item ${pathname === '/about' ? 'active' : ''}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span>About</span>
        </Link>
        <Link href="/login" className={`bnav-item ${pathname === '/login' ? 'active' : ''}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <span>Login</span>
        </Link>
      </nav>
    </>
  );
}
