export default function GreenLeaf({ className = "w-6 h-6", rotate = 0 }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`pointer-events-none drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="leafGrad" x1="12" y1="52" x2="52" y2="12" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1e5422" />
          <stop offset="45%" stopColor="#3d9136" />
          <stop offset="85%" stopColor="#68b843" />
          <stop offset="100%" stopColor="#8ee055" />
        </linearGradient>
        <linearGradient id="leafHighlight" x1="20" y1="44" x2="48" y2="16" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
      </defs>
      {/* Corpo da Folha */}
      <path
        d="M10 54C10 54 14 36 26 22C38 8 54 8 54 8C54 8 54 24 40 38C26 52 10 54 10 54Z"
        fill="url(#leafGrad)"
      />
      {/* Brilho da Folha */}
      <path
        d="M16 48C18 36 28 24 40 14C34 16 26 26 20 40C18 44 16 48 16 48Z"
        fill="url(#leafHighlight)"
      />
      {/* Nervura Central */}
      <path
        d="M10 54C16 46 28 32 54 8"
        stroke="#1a4218"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Nervuras Laterais */}
      <path d="M22 41C25 38 31 39 31 39" stroke="#255a22" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M28 34C32 30 38 31 38 31" stroke="#255a22" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M35 26C39 22 45 23 45 23" stroke="#255a22" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M24 39C20 37 17 38 17 38" stroke="#255a22" strokeWidth="1" strokeLinecap="round" />
      <path d="M30 32C26 29 23 30 23 30" stroke="#255a22" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}
