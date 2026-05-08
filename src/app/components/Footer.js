import Link from 'next/link';

export default function Footer() {
  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="logo">
              <div className="logo-icon">💎</div>
              <div>
                <div className="logo-text">VIP Number<span style={{color:'var(--gold)'}}>Station</span></div>
                <div className="logo-sub">vipnumberstation.com</div>
              </div>
            </div>
            <p>India's most trusted marketplace for premium VIP mobile numbers. 50,000+ numbers. Instant port available.</p>
            <a href="https://wa.me/919999976767" target="_blank" rel="noreferrer" style={{display:'inline-flex',alignItems:'center',gap:'6px',background:'#25D366',color:'white',padding:'8px 16px',borderRadius:'6px',textDecoration:'none',fontFamily:'var(--font-rajdhani)',fontSize:'13px',fontWeight:'600',marginTop:'14px'}}>
              💬 +91 99999 76767
            </a>
          </div>
          <div className="footer-col">
            <h4>Quick Links</h4>
            <Link href="/">VIP Numbers</Link>
            <Link href="/numerology">Numerology Report</Link>
            <Link href="/dealer">Become a Dealer</Link>
            <Link href="/about">About Us</Link>
          </div>
          <div className="footer-col">
            <h4>Categories</h4>
            <a href="#">Penta Numbers</a>
            <a href="#">Hexa Numbers</a>
            <a href="#">Mirror Numbers</a>
            <a href="#">786 Numbers</a>
            <a href="#">Fancy Numbers</a>
          </div>
          <div className="footer-col">
            <h4>Contact</h4>
            <a href="https://wa.me/919999976767">WhatsApp Enquiry</a>
            <a href="tel:+919999976767">Call Us</a>
            <a href="#">Help Center</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 VIP Number Station. All rights reserved.</span>
          <span>All Operators Supported · Instant Port Available</span>
        </div>
      </div>
    </footer>
  );
}
