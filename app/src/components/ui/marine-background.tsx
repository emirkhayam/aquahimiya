import React from 'react';

interface MarineBackgroundProps {
  variant?: 'waves' | 'bubbles' | 'ripples' | 'drops' | 'combined';
  opacity?: number;
  animated?: boolean;
}

export const MarineBackground: React.FC<MarineBackgroundProps> = ({
  variant = 'combined',
  opacity = 0.15,
  animated = true
}) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ opacity }}>
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Wave Pattern */}
          <pattern id="wave-pattern" x="0" y="0" width="200" height="100" patternUnits="userSpaceOnUse">
            <path
              d="M0 50 Q 50 30, 100 50 T 200 50"
              fill="none"
              stroke="url(#wave-gradient)"
              strokeWidth="2"
              opacity="0.6"
            />
            <path
              d="M0 60 Q 50 40, 100 60 T 200 60"
              fill="none"
              stroke="url(#wave-gradient)"
              strokeWidth="1.5"
              opacity="0.4"
            />
            <path
              d="M0 70 Q 50 50, 100 70 T 200 70"
              fill="none"
              stroke="url(#wave-gradient)"
              strokeWidth="1"
              opacity="0.3"
            />
          </pattern>

          {/* Bubble Pattern */}
          <pattern id="bubble-pattern" x="0" y="0" width="150" height="150" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="8" fill="url(#bubble-gradient)" opacity="0.4" />
            <circle cx="70" cy="50" r="12" fill="url(#bubble-gradient)" opacity="0.3" />
            <circle cx="120" cy="30" r="6" fill="url(#bubble-gradient)" opacity="0.5" />
            <circle cx="40" cy="90" r="10" fill="url(#bubble-gradient)" opacity="0.35" />
            <circle cx="100" cy="110" r="7" fill="url(#bubble-gradient)" opacity="0.45" />
            <circle cx="130" cy="80" r="9" fill="url(#bubble-gradient)" opacity="0.4" />
          </pattern>

          {/* Ripple Pattern */}
          <pattern id="ripple-pattern" x="0" y="0" width="300" height="300" patternUnits="userSpaceOnUse">
            <g opacity="0.3">
              <circle cx="150" cy="150" r="30" fill="none" stroke="url(#ripple-gradient)" strokeWidth="1.5" />
              <circle cx="150" cy="150" r="50" fill="none" stroke="url(#ripple-gradient)" strokeWidth="1.2" opacity="0.7" />
              <circle cx="150" cy="150" r="70" fill="none" stroke="url(#ripple-gradient)" strokeWidth="0.8" opacity="0.5" />
              <circle cx="150" cy="150" r="90" fill="none" stroke="url(#ripple-gradient)" strokeWidth="0.5" opacity="0.3" />
            </g>
            <g opacity="0.25">
              <circle cx="80" cy="80" r="20" fill="none" stroke="url(#ripple-gradient)" strokeWidth="1" />
              <circle cx="80" cy="80" r="35" fill="none" stroke="url(#ripple-gradient)" strokeWidth="0.7" opacity="0.6" />
            </g>
            <g opacity="0.2">
              <circle cx="220" cy="220" r="25" fill="none" stroke="url(#ripple-gradient)" strokeWidth="1" />
              <circle cx="220" cy="220" r="45" fill="none" stroke="url(#ripple-gradient)" strokeWidth="0.6" opacity="0.5" />
            </g>
          </pattern>

          {/* Water Drops Pattern */}
          <pattern id="drops-pattern" x="0" y="0" width="120" height="180" patternUnits="userSpaceOnUse">
            <path
              d="M30 40 Q 20 30, 20 20 Q 20 10, 30 0 Q 40 10, 40 20 Q 40 30, 30 40 Z"
              fill="url(#drop-gradient)"
              opacity="0.4"
            />
            <path
              d="M80 100 Q 73 93, 73 86 Q 73 79, 80 72 Q 87 79, 87 86 Q 87 93, 80 100 Z"
              fill="url(#drop-gradient)"
              opacity="0.35"
            />
            <path
              d="M50 140 Q 44 134, 44 128 Q 44 122, 50 116 Q 56 122, 56 128 Q 56 134, 50 140 Z"
              fill="url(#drop-gradient)"
              opacity="0.3"
            />
            <path
              d="M100 30 Q 96 26, 96 22 Q 96 18, 100 14 Q 104 18, 104 22 Q 104 26, 100 30 Z"
              fill="url(#drop-gradient)"
              opacity="0.45"
            />
          </pattern>

          {/* Gradient Definitions */}
          <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3a6a82" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#5a8ba8" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#294D61" stopOpacity="0.4" />
          </linearGradient>

          <radialGradient id="bubble-gradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#5a8ba8" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#3a6a82" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#294D61" stopOpacity="0.1" />
          </radialGradient>

          <radialGradient id="ripple-gradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3a6a82" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#294D61" stopOpacity="0.2" />
          </radialGradient>

          <linearGradient id="drop-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#5a8ba8" stopOpacity="0.7" />
            <stop offset="50%" stopColor="#3a6a82" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#294D61" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {/* Render patterns based on variant */}
        {(variant === 'waves' || variant === 'combined') && (
          <rect
            width="100%"
            height="100%"
            fill="url(#wave-pattern)"
            className={animated ? 'animate-wave-slow' : ''}
          />
        )}

        {(variant === 'bubbles' || variant === 'combined') && (
          <rect
            width="100%"
            height="100%"
            fill="url(#bubble-pattern)"
            className={animated ? 'animate-float-bubbles' : ''}
          />
        )}

        {(variant === 'ripples' || variant === 'combined') && (
          <rect
            width="100%"
            height="100%"
            fill="url(#ripple-pattern)"
            className={animated ? 'animate-pulse-ripple' : ''}
          />
        )}

        {(variant === 'drops' || variant === 'combined') && (
          <rect
            width="100%"
            height="100%"
            fill="url(#drops-pattern)"
          />
        )}
      </svg>

      {/* Additional gradient overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#3a6a82]/5 via-transparent to-[#294D61]/5" />
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#5a8ba8]/3 to-transparent" />
    </div>
  );
};

// Decorative floating elements
export const FloatingElements: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: count }).map((_, i) => {
        const size = Math.random() * 60 + 20;
        const left = Math.random() * 100;
        const delay = Math.random() * 5;
        const duration = Math.random() * 10 + 15;

        return (
          <div
            key={i}
            className="absolute rounded-full opacity-20 animate-float-up"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${left}%`,
              bottom: '-10%',
              background: `radial-gradient(circle, rgba(58, 106, 130, 0.4), rgba(41, 77, 97, 0.1))`,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
              filter: 'blur(2px)',
            }}
          />
        );
      })}
    </div>
  );
};
