import { useState } from 'react';
import './LandingOverlay.css';

const FlashlightSVG = ({ on }) => (
  <svg viewBox="0 0 60 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="lo-svg">
    <rect x="20" y="52" width="20" height="58" rx="7" fill="#1e1e1e" stroke="#3a3a3a" strokeWidth="1.2"/>
    <rect x="20" y="68" width="20" height="3" rx="1" fill="#2a2a2a"/>
    <rect x="20" y="76" width="20" height="3" rx="1" fill="#2a2a2a"/>
    <rect x="20" y="84" width="20" height="3" rx="1" fill="#2a2a2a"/>
    <rect x="14" y="30" width="32" height="26" rx="6" fill="#161616" stroke="#3a3a3a" strokeWidth="1.2"/>
    <circle cx="30" cy="100" r="4.5" fill={on ? '#ffd700' : '#252525'} stroke="#3a3a3a" strokeWidth="1"/>
  </svg>
);

const LandingOverlay = ({ onComplete }) => {
  const [stage, setStage] = useState('idle');

  const handleClick = () => {
    if (stage !== 'idle') return;
    setStage('on');
    setTimeout(() => setStage('spreading'), 1000);
    setTimeout(() => setStage('fading'),    1800);
    setTimeout(() => onComplete(),           1300); // Sets time until UV Glow completes, and main page shows
  };

  return (
    <div className={`lo-root lo-${stage}`} onClick={handleClick}>
      <div className="lo-dark" />
      <div className="lo-uvglow" />
      <div className="lo-center">
        <div className={`lo-torch ${stage === 'idle' ? 'lo-torch--pulse' : `lo-torch--${stage}`}`}>
          <FlashlightSVG on={stage !== 'idle'} />
        </div>
        <p className={`lo-hint ${stage !== 'idle' ? 'lo-hint--hide' : ''}`}>
          Click to turn on the light
        </p>
      </div>
    </div>
  );
};

export default LandingOverlay;
