export const metadata = {
  title: 'About Us - VIP Number Station',
};

export default function AboutPage() {
  return (
    <div className="page active">
      <div className="about-section">
        <h1>About VIP Number Station</h1>
        <p>VIP Number Station is India's premier marketplace for premium VIP mobile numbers. We connect buyers with sellers across all major telecom operators — Jio, Airtel, Vi, and BSNL.</p>
        <p>Whether you're looking for a lucky number based on numerology, a memorable business number, or a special pattern number, we have over 50,000+ numbers in our catalogue with new numbers added daily.</p>
        <p>We offer both <strong style={{ color: 'var(--gold)' }}>RTP (Ready to Port)</strong> numbers — which can be ported to your network instantly — and <strong style={{ color: '#FFB74D' }}>Non-RTP numbers</strong> that are in the porting process and will be ready within 90 days.</p>
        <div className="about-grid">
          <div className="about-tile">
            <h3>⚡ RTP Numbers</h3>
            <p>Ready To Port numbers can be transferred to your preferred operator immediately. No waiting — get your number in 24-48 hours after payment.</p>
          </div>
          <div className="about-tile">
            <h3>⏳ Non-RTP Numbers</h3>
            <p>These numbers are in the cooling period. Once a mobile number is ported, it requires 90 days before it can be ported again. We track the timeline for you.</p>
          </div>
          <div className="about-tile">
            <h3>🔢 Numerology Match</h3>
            <p>Every number in our catalogue shows its sum total breakdown. Use our free numerology tool to find a number that matches your destiny number.</p>
          </div>
          <div className="about-tile">
            <h3>🤝 Dealer Network</h3>
            <p>We work with 200+ dealers across India. Dealers can register their numbers on our platform and reach thousands of potential buyers daily.</p>
          </div>
        </div>
        <div style={{ marginTop: '36px', textAlign: 'center' }}>
          <a href="https://wa.me/919999976767?text=Hello, I want to enquire about VIP numbers" target="_blank" rel="noreferrer" className="btn-submit" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', width: 'auto', padding: '14px 28px' }}>
            💬 Contact Us on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
