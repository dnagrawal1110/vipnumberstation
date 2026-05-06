import DealerRegistration from '../components/DealerRegistration';

export const metadata = {
  title: 'Dealer Registration - VIP Number Station',
};

export default function DealerPage() {
  return (
    <div className="page active">
      <div style={{ background: 'linear-gradient(160deg,#0D0D0D 0%,#1A0D00 50%,#0D0D0D 100%)', padding: '50px 24px', textAlign: 'center' }}>
        <div className="hero-badge">🤝 Partner With Us</div>
        <h1 style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '48px', color: 'var(--white)', marginBottom: '12px' }}>
          Dealer <span style={{ color: 'var(--gold)' }}>Registration</span>
        </h1>
        <p style={{ color: 'var(--gray-3)', maxWidth: '480px', margin: '0 auto' }}>
          List your VIP numbers on India's fastest growing marketplace. Reach thousands of buyers every day.
        </p>
      </div>
      <DealerRegistration />
    </div>
  );
}
