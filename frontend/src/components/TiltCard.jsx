import { useRef, useCallback } from 'react';

export default function TiltCard({ children, className = '' }) {
  const ref = useRef(null);
  const glowRef = useRef(null);
  const raf = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      const card = ref.current;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const dx = (x - cx) / cx;
      const dy = (y - cy) / cy;
      const inner = card.querySelector('.tilt-card-inner');
      if (inner) inner.style.transform = `rotateX(${-dy * 6}deg) rotateY(${dx * 6}deg)`;
      const glow = card.querySelector('.tilt-card-glow');
      if (glow) {
        glow.style.setProperty('--mx', `${(x / rect.width) * 100}%`);
        glow.style.setProperty('--my', `${(y / rect.height) * 100}%`);
      }
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (raf.current) cancelAnimationFrame(raf.current);
    const inner = ref.current?.querySelector('.tilt-card-inner');
    if (inner) inner.style.transform = 'rotateX(0deg) rotateY(0deg)';
  }, []);

  return (
    <div ref={ref} className={`tilt-card ${className}`} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      {children}
    </div>
  );
}