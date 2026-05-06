'use client';
import { useState } from 'react';

const NUMEROLOGY_MEANINGS = {
  1: {title:"The Leader", desc:"Strong will, independence, ambition. Natural born leader. Best numbers: those summing to 1."},
  2: {title:"The Diplomat", desc:"Harmony, cooperation, intuition. Gentle and caring. Best numbers: those summing to 2."},
  3: {title:"The Creator", desc:"Creative expression, joy, communication. Artistic and optimistic."},
  4: {title:"The Builder", desc:"Stability, hard work, discipline. Reliable and methodical."},
  5: {title:"The Adventurer", desc:"Freedom, change, versatility. Energetic and curious."},
  6: {title:"The Nurturer", desc:"Responsibility, love, harmony. Caring and protective."},
  7: {title:"The Seeker", desc:"Wisdom, introspection, spirituality. Analytical and thoughtful."},
  8: {title:"The Achiever", desc:"Power, success, abundance. Business-minded and ambitious."},
  9: {title:"The Humanitarian", desc:"Compassion, wisdom, completion. Universal love and service."}
};

function reduceToSingle(n) {
  let num = n;
  while (num > 9) { 
    num = num.toString().split('').reduce((a,b) => a + parseInt(b), 0); 
  }
  return num;
}

function calcNameNumber(name) {
  const map = {a:1,b:2,c:3,d:4,e:5,f:6,g:7,h:8,i:9,j:1,k:2,l:3,m:4,n:5,o:6,p:7,q:8,r:9,s:1,t:2,u:3,v:4,w:5,x:6,y:7,z:8};
  const vowels = 'aeiou';
  let sum = 0, soul = 0, personality = 0;
  name.toLowerCase().split('').forEach(c => {
    if (map[c]) { 
      sum += map[c]; 
      vowels.includes(c) ? soul += map[c] : personality += map[c]; 
    }
  });
  return { destiny: reduceToSingle(sum), soul: reduceToSingle(soul), personality: reduceToSingle(personality) };
}

function calcDOBNumber(d, m, y) {
  const sum = d.toString().split('').concat(m.toString().split(''), y.toString().split('')).reduce((a,b) => a + parseInt(b), 0);
  return reduceToSingle(sum);
}

export default function NumerologyCalculator() {
  const [report, setReport] = useState(null);

  const generateReport = () => {
    const fn = document.getElementById('numFirstName').value.trim();
    const ln = document.getElementById('numLastName').value.trim();
    const d = parseInt(document.getElementById('numDay').value);
    const m = parseInt(document.getElementById('numMonth').value);
    const y = parseInt(document.getElementById('numYear').value);

    if (!fn || !ln || !d || !m || !y) {
      alert('⚠ Please fill in name and date of birth');
      return;
    }

    const fullName = `${fn} ${ln}`;
    const nameNums = calcNameNumber(fullName);
    const dobNum = calcDOBNumber(d, m, y);
    const lifePathNum = dobNum;

    const lucky = [lifePathNum, nameNums.destiny, nameNums.soul];
    const uniqueLucky = [...new Set(lucky)];

    setReport({
      fullName,
      dob: `${d}/${m}/${y}`,
      tiles: [
        {num: lifePathNum, label: 'Life Path Number', desc: NUMEROLOGY_MEANINGS[lifePathNum]?.desc || ''},
        {num: nameNums.destiny, label: 'Destiny Number', desc: 'Based on your full name at birth'},
        {num: nameNums.soul, label: 'Soul Urge Number', desc: 'Your inner desires and motivations'},
        {num: nameNums.personality, label: 'Personality Number', desc: 'How others perceive you'},
        {num: reduceToSingle(d), label: 'Birth Day Number', desc: 'Your natural talents'},
        {num: reduceToSingle(d + m), label: 'Personal Year', desc: 'Your current life cycle'}
      ],
      uniqueLucky
    });
  };

  return (
    <div className="numerology-content">
      <div className="num-form-card">
        <div className="num-form-title">🔢 Generate Your Numerology Report</div>
        <div className="form-grid">
          <div className="form-group">
            <label>First Name *</label>
            <input type="text" id="numFirstName" placeholder="Enter first name" />
          </div>
          <div className="form-group">
            <label>Last Name *</label>
            <input type="text" id="numLastName" placeholder="Enter last name" />
          </div>
          <div className="form-group">
            <label>Gender</label>
            <select id="numGender">
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>Birth Place</label>
            <input type="text" id="numBirthPlace" placeholder="City, State" />
          </div>
        </div>
        <div className="form-grid-3" style={{ marginTop: '16px' }}>
          <div className="form-group">
            <label>Birth Day *</label>
            <input type="number" id="numDay" placeholder="DD" min="1" max="31" />
          </div>
          <div className="form-group">
            <label>Birth Month *</label>
            <input type="number" id="numMonth" placeholder="MM" min="1" max="12" />
          </div>
          <div className="form-group">
            <label>Birth Year *</label>
            <input type="number" id="numYear" placeholder="YYYY" min="1900" max="2024" />
          </div>
          <div className="form-group">
            <label>Birth Hour</label>
            <input type="number" id="numHour" placeholder="HH" min="0" max="23" />
          </div>
          <div className="form-group">
            <label>Birth Minute</label>
            <input type="number" id="numMin" placeholder="MM" min="0" max="59" />
          </div>
          <div className="form-group">
            <label>Language</label>
            <select id="numLang">
              <option>English</option>
              <option>Hindi</option>
              <option>Marathi</option>
              <option>Gujarati</option>
            </select>
          </div>
        </div>
        <div className="form-grid" style={{ marginTop: '16px' }}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" id="numEmail" placeholder="your@email.com" />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input type="tel" id="numPhone" placeholder="+91 XXXXX XXXXX" />
          </div>
        </div>
        <button className="btn-submit" onClick={generateReport} style={{ marginTop: '20px' }}>
          🔮 Generate Free Numerology Report
        </button>
        <p style={{ textAlign: 'center', fontSize: '11px', color: 'var(--gray-4)', marginTop: '12px', fontFamily: 'var(--font-rajdhani)', letterSpacing: '0.5px' }}>
          Get your detailed paid report for just ₹699 — WhatsApp us after generating
        </p>
      </div>

      {report && (
        <div className="report-card show" id="reportCard">
          <div className="report-header">
            <h2 id="reportName">Your Numerology Report for {report.fullName}</h2>
            <p id="reportSubtitle">Born on — {report.dob}</p>
          </div>

          <div className="num-grid" id="numGrid">
            {report.tiles.map((t, i) => (
              <div key={i} className="num-tile">
                <div className="num-tile-number">{t.num}</div>
                <div className="num-tile-label">{t.label}</div>
                <div className="num-tile-desc">{t.desc}</div>
              </div>
            ))}
          </div>

          <div style={{ background: 'var(--black-4)', borderRadius: 'var(--radius)', padding: '20px', marginTop: '16px' }}>
            <div style={{ fontFamily: 'var(--font-rajdhani)', fontSize: '11px', letterSpacing: '2px', color: 'var(--gold)', marginBottom: '12px' }}>YOUR LUCKY NUMBERS FOR PHONE</div>
            <div id="luckyNumbers" style={{ fontFamily: 'var(--font-rajdhani)', fontSize: '18px', fontWeight: '700', letterSpacing: '3px', color: 'var(--gold-light)' }}>
              {report.uniqueLucky.join('  ·  ')}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--gray-4)', marginTop: '8px', lineHeight: '1.6' }} id="luckyDesc">
              Look for VIP numbers whose sum total equals {report.uniqueLucky.join(', ')}. Numbers with these destiny values will be most auspicious for you.
            </div>
          </div>

          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <a id="whatsappReport" href={`https://wa.me/919999976767?text=${encodeURIComponent(`Hi! I need a detailed numerology report for ${report.fullName}, born ${report.dob}. My lucky numbers are ${report.uniqueLucky.join(', ')}. Please share VIP numbers matching these.`)}`} target="_blank" rel="noreferrer" className="btn-submit" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', width: 'auto', padding: '14px 28px' }}>
              📱 Get Detailed Report on WhatsApp (₹699)
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
