export default function CardStack({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 520 420"
      className={className}
      role="img"
      aria-label="Three credit cards fanned out: maroon, gold, and black"
    >
      <defs>
        <linearGradient id="maroonCard" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7a1a1a" />
          <stop offset="100%" stopColor="#3a0808" />
        </linearGradient>
        <linearGradient id="goldCard" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e6b85c" />
          <stop offset="55%" stopColor="#c99632" />
          <stop offset="100%" stopColor="#8a6018" />
        </linearGradient>
        <linearGradient id="blackCard" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#262019" />
          <stop offset="100%" stopColor="#0a0805" />
        </linearGradient>
        <linearGradient id="goldChip" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f4d488" />
          <stop offset="100%" stopColor="#9c7320" />
        </linearGradient>
        <filter id="cardShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="14" stdDeviation="18" floodOpacity="0.25" />
        </filter>
      </defs>

      <g filter="url(#cardShadow)">
        {/* Back: maroon card, rotated left */}
        <g transform="translate(40 70) rotate(-14)">
          <rect width="280" height="178" rx="18" fill="url(#maroonCard)" />
          <rect x="22" y="92" width="38" height="28" rx="4" fill="url(#goldChip)" />
          <circle cx="232" cy="138" r="14" fill="#fff" opacity="0.55" />
          <circle cx="252" cy="138" r="14" fill="#fff" opacity="0.3" />
        </g>

        {/* Middle: gold card */}
        <g transform="translate(120 50) rotate(-2)">
          <rect width="280" height="178" rx="18" fill="url(#goldCard)" />
          <rect x="22" y="92" width="38" height="28" rx="4" fill="#5e4112" opacity="0.85" />
          <circle
            cx="220"
            cy="60"
            r="34"
            fill="none"
            stroke="#5e4112"
            strokeWidth="2.5"
            opacity="0.55"
          />
          <circle
            cx="220"
            cy="60"
            r="22"
            fill="none"
            stroke="#5e4112"
            strokeWidth="1.5"
            opacity="0.4"
          />
          <text
            x="22"
            y="156"
            fontFamily="serif"
            fontSize="13"
            letterSpacing="2"
            fill="#3a2808"
            opacity="0.75"
          >
            POINTER
          </text>
        </g>

        {/* Front: black card, rotated right */}
        <g transform="translate(200 110) rotate(12)">
          <rect width="280" height="178" rx="18" fill="url(#blackCard)" />
          <rect x="22" y="92" width="38" height="28" rx="4" fill="url(#goldChip)" />
          <circle cx="232" cy="138" r="14" fill="#fff" opacity="0.45" />
          <circle cx="252" cy="138" r="14" fill="#fff" opacity="0.22" />
        </g>
      </g>
    </svg>
  );
}
