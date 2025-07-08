import React from 'react';

const CropYieldLogo = () => {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Graph Bars */}
      <rect x="20" y="110" width="15" height="40" fill="#ffffff" />
      <rect x="45" y="90" width="15" height="60" fill="#ffffff" />
      <rect x="70" y="60" width="15" height="90" fill="#ffffff" />

      {/* Upward Arrow */}
      <path
        d="M85 60 L100 45"
        stroke="#ffffff"
        strokeWidth="4"
        fill="none"
      />
      <polygon points="95,35 110,45 95,55" fill="#ffffff" />

      {/* AI Chip Symbol */}
      <rect x="130" y="50" width="40" height="40" fill="none" stroke="#ffffff" strokeWidth="2" />
      <rect x="140" y="60" width="20" height="20" fill="#ffffff" />
      <line x1="130" y1="60" x2="120" y2="60" stroke="#ffffff" strokeWidth="2" />
      <line x1="130" y1="70" x2="120" y2="70" stroke="#ffffff" strokeWidth="2" />
      <line x1="130" y1="80" x2="120" y2="80" stroke="#ffffff" strokeWidth="2" />
      <line x1="170" y1="60" x2="180" y2="60" stroke="#ffffff" strokeWidth="2" />
      <line x1="170" y1="70" x2="180" y2="70" stroke="#ffffff" strokeWidth="2" />
      <line x1="170" y1="80" x2="180" y2="80" stroke="#ffffff" strokeWidth="2" />

      {/* Plant and Leaves */}
      <path
        d="M40 160 C60 140, 80 140, 100 160"
        stroke="#ffffff"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M60 150 C70 130, 90 130, 100 150"
        stroke="#ffffff"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M80 140 C90 120, 110 120, 120 140"
        stroke="#ffffff"
        strokeWidth="2"
        fill="none"
      />
    </svg>
  );
};

export default CropYieldLogo;