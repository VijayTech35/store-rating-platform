import { Link } from 'react-router-dom';

const LogoSvg = ({ size = 'default' }) => {
  const dims = { small: 28, default: 36, large: 56 };
  const d = dims[size] || dims.default;

  return (
    <svg width={d} height={d} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="logo-svg">
      <defs>
        <radialGradient id="lg-bg" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#AE7DAC" />
          <stop offset="60%" stopColor="#413B61" />
          <stop offset="100%" stopColor="#19305C" />
        </radialGradient>
        <linearGradient id="lg-ring" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F3DADF" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#AE7DAC" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#F1916D" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="lg-v-left" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#F3DADF" stopOpacity="0.8" />
        </linearGradient>
        <linearGradient id="lg-v-right" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#AE7DAC" stopOpacity="0.8" />
        </linearGradient>
        <linearGradient id="lg-star" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F3DADF" />
          <stop offset="50%" stopColor="#F1916D" />
          <stop offset="100%" stopColor="#AE7DAC" />
        </linearGradient>
        <linearGradient id="lg-wave" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.05" />
        </linearGradient>
        <filter id="lg-shadow">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#03122F" floodOpacity="0.5" />
        </filter>
        <filter id="lg-star-glow">
          <feGaussianBlur stdDeviation="0.8" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <circle cx="28" cy="28" r="27" fill="url(#lg-bg)" />
      <circle cx="28" cy="28" r="26" stroke="url(#lg-ring)" strokeWidth="1.5" fill="none" />
      <circle cx="28" cy="28" r="23" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" fill="none" />
      <path d="M 8 10 Q 28 3 48 10" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" fill="none" />
      <g filter="url(#lg-shadow)">
        <path d="M 16 20 C 16 20, 19 32, 27 38" stroke="url(#lg-v-left)" strokeWidth="7" strokeLinecap="round" fill="none" />
        <path d="M 40 20 C 40 20, 37 32, 29 38" stroke="url(#lg-v-right)" strokeWidth="7" strokeLinecap="round" fill="none" />
      </g>
      <path d="M 16 20 C 16 20, 19 32, 27 38" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M 40 20 C 40 20, 37 32, 29 38" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M 18.5 18.5 Q 20 17 21.5 18.5" stroke="url(#lg-wave)" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M 16 16 Q 18.5 14 21 16" stroke="url(#lg-wave)" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M 13.5 13.5 Q 17 11 20.5 13.5" stroke="url(#lg-wave)" strokeWidth="2" strokeLinecap="round" fill="none" />
      <circle cx="23" cy="41" r="3" fill="rgba(255,255,255,0.08)" />
      <g filter="url(#lg-star-glow)" className="logo-star">
        <polygon
          points="28,40.5 28.7,42.4 30.7,42.4 29,43.5 29.7,45.4 28,44.3 26.3,45.4 27,43.5 25.3,42.4 27.3,42.4"
          fill="url(#lg-star)"
        />
      </g>
      <circle cx="11" cy="15" r="1.2" fill="white" fillOpacity="0.15" />
      <circle cx="45" cy="15" r="1.2" fill="white" fillOpacity="0.15" />
    </svg>
  );
};

export default function Logo({ linkTo = '/', size = 'default', showText = true }) {
  const sizes = {
    small: { text: 'text-lg' },
    default: { text: 'text-xl' },
    large: { text: 'text-2xl' },
  };
  const s = sizes[size] || sizes.default;

  const logoContent = (
    <div className={`flex items-center gap-2.5 logo-wrapper ${size === 'large' ? 'logo-wrapper-large' : ''}`}>
      <LogoSvg size={size} />
      {showText && (
        <span className={`${s.text} font-extrabold bg-gradient-to-r from-lavender via-peach to-palepink bg-clip-text text-transparent tracking-tight`}>
          VibeRate
        </span>
      )}
    </div>
  );

  if (linkTo) return <Link to={linkTo} className="hover:opacity-90 transition-opacity" aria-label="VibeRate home">{logoContent}</Link>;
  return logoContent;
}
