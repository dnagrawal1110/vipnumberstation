import NumerologyCalculator from '../components/NumerologyCalculator';

export const metadata = {
  title: 'Numerology Report - VIP Number Station',
};

export default function NumerologyPage() {
  return (
    <div className="page active">
      <div className="numerology-hero">
        <div className="hero-badge">🔮 Vedic Numerology</div>
        <h1 style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: 'clamp(32px, 5vw, 60px)', color: 'var(--white)' }}>
          Discover Your <span style={{ color: 'var(--gold)' }}>Numerology</span>
        </h1>
        <p style={{ color: 'var(--gray-3)', fontSize: '15px', maxWidth: '480px', margin: '12px auto 0' }}>
          Get your complete Vedic numerology report based on your name and date of birth. Understand your destiny, soul and personality numbers.
        </p>
      </div>
      <NumerologyCalculator />
    </div>
  );
}
