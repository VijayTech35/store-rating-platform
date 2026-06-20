import { Link } from 'react-router-dom';

const LogoSvg = ({ size = 'default' }) => {
  const dims = { small: 28, default: 36, large: 56 };
  const d = dims[size] || dims.default;

  return (
    <svg width={d} height={d} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="logo-svg">
      <defs>
        <linearGradient id="lg-base" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="50%" stopColor="#5B21B6" />
          <stop offset="100%" stopColor="#6D28D9" />
        </linearGradient>
        <linearGradient id="lg-shine" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity="0.1" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="lg-ribbon-l" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#E0E7FF" stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id="lg-ribbon-r" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#EDE9FE" stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id="lg-star" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="40%" stopColor="#FDE047" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
        <filter id="lg-shadow">
          <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor="#1E3A5F" floodOpacity="0.35" />
        </filter>
        <filter id="lg-star-glow">
          <feGaussianBlur stdDeviation="1.2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="lg-inner-light">
          <feComponentTransfer in="SourceAlpha"><feFuncA type="table" tableValues="1 0" /></feComponentTransfer>
          <feGaussianBlur stdDeviation="1.5" />
          <feOffset dx="-1" dy="-1" result="offsetblur" />
          <feFlood floodColor="white" floodOpacity="0.15" />
          <feComposite in2="offsetblur" operator="in" />
          <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <rect x="2" y="2" width="52" height="52" rx="13" fill="url(#lg-base)" />
      <rect x="2" y="2" width="52" height="52" rx="13" fill="url(#lg-shine)" />
      <rect x="2" y="2" width="52" height="52" rx="13" stroke="#A78BFA" strokeOpacity="0.3" strokeWidth="0.5" fill="none" />
      <rect x="3" y="3" width="50" height="50" rx="12" stroke="white" strokeOpacity="0.08" strokeWidth="0.5" fill="none" />
      <path d="M 3 3 Q 28 10 53 3" stroke="white" strokeWidth="0.5" strokeOpacity="0.08" fill="none" />
      <g filter="url(#lg-shadow)">
        <path d="M 12 18 C 8 30, 20 37, 27 38.5" stroke="url(#lg-ribbon-l)" strokeWidth="7" strokeLinecap="round" fill="none" />
        <path d="M 44 18 C 48 30, 36 37, 29 38.5" stroke="url(#lg-ribbon-r)" strokeWidth="7" strokeLinecap="round" fill="none" />
      </g>
      <g filter="url(#lg-inner-light)">
        <path d="M 12 18 C 8 30, 20 37, 27 38.5" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.35" />
        <path d="M 44 18 C 48 30, 36 37, 29 38.5" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.35" />
      </g>
      <circle cx="28" cy="38" r="3" fill="white" fillOpacity="0.15" />
      <g filter="url(#lg-star-glow)" className="logo-star">
        <polygon
          points="28,32 29.18,35.14 32.5,35.38 29.9,37.56 30.7,40.82 28,38.86 25.3,40.82 26.1,37.56 23.5,35.38 26.82,35.14"
          fill="url(#lg-star)"
        />
      </g>
      <circle cx="12" cy="13" r="1.2" fill="white" fillOpacity="0.12" />
      <circle cx="44" cy="13" r="1.2" fill="white" fillOpacity="0.12" />
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
        <span className={`${s.text} font-extrabold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent tracking-tight`}>
          VibeRate
        </span>
      )}
    </div>
  );

  if (linkTo) return <Link to={linkTo} className="hover:opacity-90 transition-opacity" aria-label="VibeRate home">{logoContent}</Link>;
  return logoContent;
}
