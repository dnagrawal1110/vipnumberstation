import NumbersApp from './components/NumbersApp';
import { getNumbers, getCategories } from './actions';

export default async function Home() {
  const initialNumbers = await getNumbers();
  const initialCategories = await getCategories();

  return (
    <div className="page active">
      <section className="hero">
        <div className="hero-badge">✦ India's Premium VIP Number Marketplace</div>
        <h1>Find Your <span className="accent">Lucky</span><br/>VIP Mobile Number</h1>
        <p>India's most trusted marketplace for premium VIP mobile numbers. Instant port (RTP) and non-RTP options available.</p>
        <div className="hero-stats">
          <div className="hero-stat">
            <div className="hero-stat-num">50K+</div>
            <div className="hero-stat-label">Numbers</div>
          </div>
          <div className="hero-divider"></div>
          <div className="hero-stat">
            <div className="hero-stat-num">10K+</div>
            <div className="hero-stat-label">Happy Customers</div>
          </div>
          <div className="hero-divider"></div>
          <div className="hero-stat">
            <div className="hero-stat-num">RTP</div>
            <div className="hero-stat-label">Instant Available</div>
          </div>
          <div className="hero-divider"></div>
          <div className="hero-stat">
            <div className="hero-stat-num">4.9★</div>
            <div className="hero-stat-label">Rating</div>
          </div>
        </div>
      </section>

      <NumbersApp initialNumbers={initialNumbers} initialCategories={initialCategories} />
    </div>
  );
}
