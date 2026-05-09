export const metadata = {
  title: 'About Us - VIP Number Station',
  description: 'India\'s trusted marketplace for premium VIP mobile numbers. Instant port available across all operators.',
};

export default function AboutPage() {
  return (
    <div className="page active">
      <div className="about-section">
        <h1>About VIP Number Station</h1>
        <p>
          VIP Number Station is a trusted marketplace for premium VIP mobile numbers in India.
          We connect buyers with a curated network of dealers offering exclusive, hard-to-find numbers —
          from fancy patterns and mirror numbers to numerology-matched lucky numbers.
        </p>
        <p>
          Every number in our catalogue is verified and listed with transparent pricing.
          We display both the <strong style={{ color: 'var(--gold)' }}>selling price</strong> and
          the MRP, so you always know you're getting a genuine deal.
        </p>
        <p>
          We offer <strong style={{ color: 'var(--gold)' }}>RTP (Instant Port)</strong> numbers
          that can be ported to your existing network immediately, and
          <strong style={{ color: '#FFB74D' }}> Pre-Book numbers</strong> where
          we confirm a delivery date upfront — no vague waiting periods.
        </p>

        <div className="about-grid">
          <div className="about-tile">
            <h3>⚡ Instant Port (RTP)</h3>
            <p>Ready to Port numbers transfer to your preferred network immediately. Get your dream number active within 24–48 hours of confirmation.</p>
          </div>
          <div className="about-tile">
            <h3>📅 Pre-Book Numbers</h3>
            <p>These numbers have a confirmed availability date shown on every listing. You pre-book now and receive the number on the exact date mentioned — no surprises.</p>
          </div>
          <div className="about-tile">
            <h3>🔢 Numerology Matching</h3>
            <p>Every number shows its full sum breakdown. Use our free Numerology Calculator to find a number that aligns with your destiny digit and attracts prosperity.</p>
          </div>
          <div className="about-tile">
            <h3>🤝 Dealer Network</h3>
            <p>We work with verified dealers across India. Dealers list their numbers on our platform, earn 25%+ commission per sale, and reach thousands of buyers daily.</p>
          </div>
          <div className="about-tile">
            <h3>🔒 12-Hour Hold</h3>
            <p>When you enquire on a number, it's reserved exclusively for you for 12 hours while our team processes your request — no double bookings.</p>
          </div>
          <div className="about-tile">
            <h3>💬 WhatsApp Support</h3>
            <p>All enquiries are handled personally over WhatsApp. Our team responds quickly and walks you through the entire porting process step by step.</p>
          </div>
        </div>

        <div style={{ marginTop: '40px', padding: '24px', background: 'rgba(201,168,76,0.06)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(201,168,76,0.15)', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-rajdhani)', fontSize: '11px', letterSpacing: '2px', color: 'var(--gold)', marginBottom: '8px' }}>GET IN TOUCH</div>
          <p style={{ color: 'var(--gray-3)', fontSize: '14px', marginBottom: '20px', lineHeight: 1.7 }}>
            Have questions? Looking for a specific number? Our team is available on WhatsApp — just message us and we'll help you find the perfect VIP number.
          </p>
          <a
            href="https://wa.me/919999976767?text=Hello, I want to enquire about VIP numbers"
            target="_blank" rel="noreferrer"
            className="btn-submit"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', width: 'auto', padding: '14px 28px' }}
          >
            💬 Chat on WhatsApp — +91 99999 76767
          </a>
        </div>
      </div>
    </div>
  );
}
