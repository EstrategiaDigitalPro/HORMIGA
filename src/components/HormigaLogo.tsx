import React from 'react';

interface HormigaLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  onClick?: () => void;
}

export const HormigaLogo: React.FC<HormigaLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  onClick,
}) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
    xl: 'w-14 h-14',
  };

  const svgSizes = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-7 h-7',
    xl: 'w-9 h-9',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 select-none group ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* Modern badge with dynamic ant animation */}
      <div
        className={`${iconSizes[size]} rounded-xl sm:rounded-2xl bg-gradient-to-b from-[#19754C] to-[#125537] text-white flex items-center justify-center shadow-xs shrink-0 relative overflow-hidden ring-1 ring-white/20 transition-transform group-hover:scale-105 duration-200`}
        title="HORMIGA"
      >
        {/* Subtle background light sheen */}
        <div className="absolute inset-0 bg-radial from-white/15 via-transparent to-transparent pointer-events-none" />

        {/* Dynamic Modern Ant SVG */}
        <svg
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${svgSizes[size]} anim-ant-body drop-shadow-xs`}
        >
          {/* --- 6 Articulated Legs in Walking Gait --- */}
          {/* Left Front Leg (L1) */}
          <path
            d="M12 11.5L6.5 7.5L5 9"
            stroke="white"
            strokeWidth="1.35"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="anim-ant-leg-l1 opacity-90"
          />
          {/* Right Front Leg (R1) */}
          <path
            d="M16 11.5L21.5 7.5L23 9"
            stroke="white"
            strokeWidth="1.35"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="anim-ant-leg-r1 opacity-90"
          />

          {/* Left Middle Leg (L2) */}
          <path
            d="M11.5 14L5.5 14L4 16"
            stroke="white"
            strokeWidth="1.35"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="anim-ant-leg-l2 opacity-90"
          />
          {/* Right Middle Leg (R2) */}
          <path
            d="M16.5 14L22.5 14L24 16"
            stroke="white"
            strokeWidth="1.35"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="anim-ant-leg-r2 opacity-90"
          />

          {/* Left Rear Leg (L3) */}
          <path
            d="M12 16.5L7 20L5.5 22.5"
            stroke="white"
            strokeWidth="1.35"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="anim-ant-leg-l3 opacity-90"
          />
          {/* Right Rear Leg (R3) */}
          <path
            d="M16 16.5L21 20L22.5 22.5"
            stroke="white"
            strokeWidth="1.35"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="anim-ant-leg-r3 opacity-90"
          />

          {/* --- Antennae (Animated Swaying) --- */}
          <path
            d="M12.5 7.5L9.5 4.5L7 4"
            stroke="#F4A340"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="anim-ant-antenna-l"
          />
          <path
            d="M15.5 7.5L18.5 4.5L21 4"
            stroke="#F4A340"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="anim-ant-antenna-r"
          />

          {/* --- Central Petiole / Waist --- */}
          <line
            x1="14"
            y1="16.5"
            x2="14"
            y2="18.5"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* --- Abdomen / Gaster (Teardrop in Amber with pulse) --- */}
          <g className="anim-ant-gaster">
            {/* Soft shadow/accent beneath gaster */}
            <ellipse cx="14" cy="21.5" rx="3.5" ry="4.2" fill="#F4A340" />
            {/* Lighter highlight on abdomen */}
            <ellipse cx="13" cy="20.5" rx="1.5" ry="2.2" fill="#FFE2B8" opacity="0.6" />
          </g>

          {/* --- Thorax / Mesosoma (Middle segment) --- */}
          <ellipse cx="14" cy="14" rx="2.5" ry="3.2" fill="white" />

          {/* --- Head (Cranial segment) --- */}
          <circle cx="14" cy="8.5" r="2.8" fill="white" />
          {/* Tiny modern ant eyes */}
          <circle cx="12.4" cy="7.8" r="0.6" fill="#176B45" />
          <circle cx="15.6" cy="7.8" r="0.6" fill="#176B45" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className={`font-extrabold tracking-tight text-[#202522] leading-none ${textSizes[size]}`}>
            HORMIGA
          </span>
        </div>
      )}
    </div>
  );
};
