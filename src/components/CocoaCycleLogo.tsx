import React from 'react';

interface CocoaCycleLogoProps {
  variant?: 'horizontal' | 'stacked' | 'mark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  inverted?: boolean;
  className?: string;
}

export const CocoaCycleLogo: React.FC<CocoaCycleLogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  showTagline = false,
  inverted = false,
  className = '',
}) => {
  // Dimension mappings
  const markDimensions = {
    sm: { width: 32, height: 32 },
    md: { width: 42, height: 42 },
    lg: { width: 56, height: 56 },
    xl: { width: 88, height: 88 },
  }[size];

  const fontSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-4xl',
  }[size];

  const taglineSizes = {
    sm: 'text-[9px]',
    md: 'text-[11px]',
    lg: 'text-xs',
    xl: 'text-sm',
  }[size];

  // SVG Emblem Mark
  const Emblem = (
    <svg
      width={markDimensions.width}
      height={markDimensions.height}
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform group-hover:scale-105 duration-300"
      aria-label="CocoaCycle Logo Mark"
    >
      <g transform="translate(80, 80)">
        {/* Top-Right Forest Green Arrow Arc */}
        <path
          d="M -34 -38 A 54 54 0 0 1 48 14"
          stroke={inverted ? '#3E7B5C' : '#234A38'}
          strokeWidth="15"
          strokeLinecap="round"
          fill="none"
        />
        {/* Arrowhead */}
        <path
          d="M 46 14 L 54 -6 L 34 8 Z"
          fill={inverted ? '#3E7B5C' : '#234A38'}
        />

        {/* Bottom-Left Deep Cocoa Brown Arrow Arc */}
        <path
          d="M 34 38 A 54 54 0 0 1 -48 -14"
          stroke={inverted ? '#A67C52' : '#38251F'}
          strokeWidth="15"
          strokeLinecap="round"
          fill="none"
        />
        {/* Arrowhead */}
        <path
          d="M -46 -14 L -54 6 L -34 -8 Z"
          fill={inverted ? '#A67C52' : '#38251F'}
        />

        {/* Center Cocoa Pod (angled -28 deg) */}
        <g transform="rotate(-28)">
          <path
            d="M 0 -33 C 16 -24 18 19 0 33 C -18 19 -16 -24 0 -33 Z"
            fill={inverted ? '#C49A6C' : '#38251F'}
          />
          {/* Inner Pod Ridge */}
          <path
            d="M 0 -27 C 11 -19 12 15 0 27 C -12 15 -11 -19 0 -27 Z"
            fill={inverted ? '#281813' : '#241713'}
          />

          {/* Cocoa Beans rows */}
          <ellipse cx="0" cy="-16" rx="4.8" ry="3.2" fill="#FFFFFF" transform="rotate(-15 0 -16)" />
          <ellipse cx="0" cy="-8" rx="5.2" ry="3.2" fill="#FFFFFF" transform="rotate(-15 0 -8)" />
          <ellipse cx="0" cy="0" rx="5.6" ry="3.5" fill="#FFFFFF" transform="rotate(-15 0 0)" />
          <ellipse cx="0" cy="8" rx="5.2" ry="3.2" fill="#FFFFFF" transform="rotate(-15 0 8)" />
          <ellipse cx="0" cy="16" rx="4.8" ry="3.2" fill="#FFFFFF" transform="rotate(-15 0 16)" />
        </g>

        {/* Olive Green Leaf */}
        <g transform="translate(13, 9) rotate(42)">
          <path
            d="M 0 -25 C 16 -14 16 16 0 27 C -16 16 -16 -14 0 -25 Z"
            fill="#5D733A"
          />
          <path
            d="M 0 -22 L 0 24"
            stroke="#8DA85E"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </g>
      </g>
    </svg>
  );

  if (variant === 'mark') {
    return <div className={`inline-flex items-center ${className}`}>{Emblem}</div>;
  }

  if (variant === 'stacked') {
    return (
      <div className={`inline-flex flex-col items-center text-center group ${className}`}>
        {Emblem}
        <div className={`mt-2 font-extrabold tracking-tight ${fontSizes} leading-none`}>
          <span className={inverted ? 'text-[#EAE3D6]' : 'text-[#38251F]'}>Cocoa</span>
          <span className={inverted ? 'text-[#649C7D]' : 'text-[#234A38]'}>Cycle</span>
        </div>
        {showTagline && (
          <p className={`mt-1 font-medium ${taglineSizes} ${inverted ? 'text-[#D9D2C5]' : 'text-[#38251F]/90'}`}>
            Dari Limbah Kebun Menjadi Bahan Baku Bermutu.
          </p>
        )}
      </div>
    );
  }

  // Default 'horizontal'
  return (
    <div className={`inline-flex items-center gap-2.5 group ${className}`}>
      {Emblem}
      <div className="flex flex-col">
        <div className={`font-extrabold tracking-tight ${fontSizes} leading-tight`}>
          <span className={inverted ? 'text-[#EAE3D6]' : 'text-[#38251F]'}>Cocoa</span>
          <span className={inverted ? 'text-[#649C7D]' : 'text-[#234A38]'}>Cycle</span>
        </div>
        {showTagline && (
          <span className={`font-medium ${taglineSizes} ${inverted ? 'text-[#C9C2B5]' : 'text-[#38251F]/80'} leading-none mt-0.5`}>
            Dari Limbah Kebun Menjadi Bahan Baku Bermutu.
          </span>
        )}
      </div>
    </div>
  );
};
